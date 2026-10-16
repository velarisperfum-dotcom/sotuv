import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Mode: 'light' | 'dark' | 'auto'
  const [themeMode, setThemeModeState] = useState(() => {
    return localStorage.getItem('savdo_theme_mode') || 'auto';
  });

  // Screen Brightness: 70 - 130 (%)
  const [brightness, setBrightnessState] = useState(() => {
    return Number(localStorage.getItem('savdo_brightness') || 100);
  });

  // Eye Care (warm sepia / blue-light reduction)
  const [eyeCare, setEyeCareState] = useState(() => {
    return localStorage.getItem('savdo_eyecare') === 'true';
  });

  // Sound effects enabled
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem('savdo_sound');
    return saved === null ? true : saved === 'true';
  });

  // Measured room luminance (0 to 100)
  const [roomLuminance, setRoomLuminance] = useState(null);
  const [isSensing, setIsSensing] = useState(false);
  const [sensorStatus, setSensorStatus] = useState('');

  // Resolved actual theme applied ('light' | 'dark')
  const [resolvedTheme, setResolvedTheme] = useState('light');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Audio synthesizer via Web Audio API (smooth modern chime)
  const playSound = useCallback((type = 'success') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'success') {
        // Double modern chime (E5 -> G#5)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc1.frequency.exponentialRampToValueAtTime(830.61, ctx.currentTime + 0.12); // G#5

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.5, ctx.currentTime + 0.1); // E6

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime + 0.1);
        osc1.stop(ctx.currentTime + 0.35);
        osc2.stop(ctx.currentTime + 0.35);
      } else if (type === 'beep') {
        // Barcode scanner crisp beep (B5)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'click') {
        // Subtle micro tick
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch {
      // Audio not permitted or unavailable
    }
  }, [soundEnabled]);

  // Measure ambient room brightness using camera snapshot
  const measureRoomBrightnessWithCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setSensorStatus('no_camera');
      return null;
    }

    setIsSensing(true);
    setSensorStatus('sensing');

    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 128 },
          height: { ideal: 128 }
        }
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      await video.play();

      // Wait 150ms for camera auto-exposure to stabilize
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, 64, 64);

      // Stop camera stream immediately (privacy & battery conservation)
      stream.getTracks().forEach(track => track.stop());
      stream = null;

      const imgData = ctx.getImageData(0, 0, 64, 64);
      const data = imgData.data;
      let totalLuminance = 0;
      const pixelCount = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Standard Rec. 601 luma calculation
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuminance += luma;
      }

      const avgLuma = Math.round(totalLuminance / pixelCount);
      // Normalized to 0 - 100 percentage
      const normalizedPct = Math.round((avgLuma / 255) * 100);

      setRoomLuminance(normalizedPct);
      setIsSensing(false);

      // Threshold: if room is dark (< 35% luma), use dark theme; else light theme
      const targetTheme = normalizedPct < 35 ? 'dark' : 'light';
      setResolvedTheme(targetTheme);
      setSensorStatus(`measured_${targetTheme}`);
      playSound('click');

      return { avgLuma, normalizedPct, targetTheme };
    } catch (err) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsSensing(false);
      setSensorStatus('denied');
      console.warn('Camera sensor unavailable or permission denied:', err);
      // Fallback to time of day
      const hour = new Date().getHours();
      const fallback = (hour >= 19 || hour < 7) ? 'dark' : 'light';
      setResolvedTheme(fallback);
      return null;
    }
  }, [playSound]);

  // Determine theme whenever mode changes
  useEffect(() => {
    if (themeMode === 'light') {
      setResolvedTheme('light');
    } else if (themeMode === 'dark') {
      setResolvedTheme('dark');
    } else if (themeMode === 'auto') {
      // If we don't have measured room luminance yet, check system or time
      const hour = new Date().getHours();
      const isNight = hour >= 19 || hour < 7;
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme((isNight || systemPrefersDark) ? 'dark' : 'light');
    }
  }, [themeMode]);

  // Apply attributes and root styles to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);

    const rootEl = document.getElementById('root') || document.body;
    if (rootEl) {
      const brightVal = brightness / 100;
      const sepiaVal = eyeCare ? '22%' : '0%';
      const contrastVal = eyeCare ? '104%' : '100%';
      rootEl.style.filter = `brightness(${brightVal}) contrast(${contrastVal}) sepia(${sepiaVal})`;
      rootEl.style.transition = 'filter 0.25s ease, background-color 0.25s ease, color 0.25s ease';
    }
  }, [resolvedTheme, brightness, eyeCare]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
        playSound('click');
      }).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
          playSound('click');
        }).catch(() => {});
      }
    }
  }, [playSound]);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const setThemeMode = (mode) => {
    setThemeModeState(mode);
    localStorage.setItem('savdo_theme_mode', mode);
    playSound('click');
    if (mode === 'auto') {
      measureRoomBrightnessWithCamera();
    }
  };

  const setBrightness = (val) => {
    const num = Math.min(130, Math.max(70, Number(val)));
    setBrightnessState(num);
    localStorage.setItem('savdo_brightness', String(num));
  };

  const setEyeCare = (val) => {
    setEyeCareState(val);
    localStorage.setItem('savdo_eyecare', String(val));
    playSound('click');
  };

  const setSoundEnabled = (val) => {
    setSoundEnabledState(val);
    localStorage.setItem('savdo_sound', String(val));
  };

  return (
    <ThemeContext.Provider value={{
      themeMode,
      setThemeMode,
      resolvedTheme,
      brightness,
      setBrightness,
      eyeCare,
      setEyeCare,
      soundEnabled,
      setSoundEnabled,
      roomLuminance,
      isSensing,
      sensorStatus,
      measureRoomBrightnessWithCamera,
      isFullscreen,
      toggleFullscreen,
      playSound
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
