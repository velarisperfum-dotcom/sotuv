import React from 'react';
import { 
  Sun, Moon, Sparkles, Eye, Volume2, VolumeX, 
  Maximize, Minimize, Camera, Check, X, Sliders, Shield
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';

export default function ThemeControlModal({ isOpen, onClose }) {
  const { t, lang } = useLang();
  const {
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
  } = useTheme();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '16px',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div style={{
        background: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
        color: resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        margin: 'auto',
        padding: '26px',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)',
        border: `1px solid ${resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
        maxHeight: 'calc(100dvh - 32px)',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sun size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{t('themeControlTitle')}</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                {t('themeControlDesc')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 1. Theme Mode Selection (3 pills) */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' }}>
            {lang === 'ru' ? 'Режим темы' : 'Mavzu rejimi'}:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {/* Light */}
            <button
              onClick={() => setThemeMode('light')}
              style={{
                background: themeMode === 'light' ? '#2563eb' : (resolvedTheme === 'dark' ? '#0f172a' : '#f8fafc'),
                color: themeMode === 'light' ? '#ffffff' : (resolvedTheme === 'dark' ? '#f8fafc' : '#334155'),
                border: `1px solid ${themeMode === 'light' ? '#2563eb' : (resolvedTheme === 'dark' ? '#334155' : '#cbd5e1')}`,
                borderRadius: '14px',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px',
                transition: 'all 0.15s ease'
              }}
            >
              <Sun size={18} />
              <span>{t('themeLight')}</span>
            </button>

            {/* Dark */}
            <button
              onClick={() => setThemeMode('dark')}
              style={{
                background: themeMode === 'dark' ? '#2563eb' : (resolvedTheme === 'dark' ? '#0f172a' : '#f8fafc'),
                color: themeMode === 'dark' ? '#ffffff' : (resolvedTheme === 'dark' ? '#f8fafc' : '#334155'),
                border: `1px solid ${themeMode === 'dark' ? '#2563eb' : (resolvedTheme === 'dark' ? '#334155' : '#cbd5e1')}`,
                borderRadius: '14px',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px',
                transition: 'all 0.15s ease'
              }}
            >
              <Moon size={18} />
              <span>{t('themeDark')}</span>
            </button>

            {/* Auto (Sensor) */}
            <button
              onClick={() => setThemeMode('auto')}
              style={{
                background: themeMode === 'auto' ? '#d97706' : (resolvedTheme === 'dark' ? '#0f172a' : '#f8fafc'),
                color: themeMode === 'auto' ? '#ffffff' : (resolvedTheme === 'dark' ? '#f8fafc' : '#334155'),
                border: `1px solid ${themeMode === 'auto' ? '#d97706' : (resolvedTheme === 'dark' ? '#334155' : '#cbd5e1')}`,
                borderRadius: '14px',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px',
                transition: 'all 0.15s ease'
              }}
            >
              <Sparkles size={18} />
              <span>{t('themeAuto')}</span>
            </button>
          </div>
        </div>

        {/* 2. Ambient Room Light Sensor via Camera */}
        <div style={{
          background: resolvedTheme === 'dark' ? '#0f172a' : '#f8fafc',
          border: `1px solid ${resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800 }}>
              {t('measureRoomLight')}
            </span>
            <button
              onClick={measureRoomBrightnessWithCamera}
              disabled={isSensing}
              style={{
                background: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isSensing ? 0.7 : 1
              }}
            >
              <Camera size={14} />
              {isSensing ? t('measuringRoom') : (lang === 'ru' ? 'Замерить' : 'O\'lchash')}
            </button>
          </div>

          <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
            {t('cameraSensorNote')}
          </p>

          {roomLuminance !== null && (
            <div style={{
              background: roomLuminance < 35 ? '#312e81' : '#fef3c7',
              color: roomLuminance < 35 ? '#e0e7ff' : '#92400e',
              padding: '8px 12px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Check size={16} />
              {t('roomLightMeasured')} <strong>{roomLuminance}%</strong> — {roomLuminance < 35 ? t('roomLightDark') : t('roomLightBright')}
            </div>
          )}
        </div>

        {/* 3. Screen Brightness Slider */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>
              {t('screenBrightness')}:
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#2563eb' }}>
              {brightness}%
            </span>
          </div>

          <input
            type="range"
            min="70"
            max="130"
            step="5"
            value={brightness}
            onChange={(e) => setBrightness(e.target.value)}
            style={{
              width: '100%',
              accentColor: '#2563eb',
              cursor: 'pointer'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '8px' }}>
            {[80, 100, 120].map(val => (
              <button
                key={val}
                onClick={() => setBrightness(val)}
                style={{
                  flex: 1,
                  background: brightness === val ? '#eff6ff' : (resolvedTheme === 'dark' ? '#0f172a' : '#f8fafc'),
                  color: brightness === val ? '#2563eb' : (resolvedTheme === 'dark' ? '#cbd5e1' : '#64748b'),
                  border: `1px solid ${brightness === val ? '#93c5fd' : (resolvedTheme === 'dark' ? '#334155' : '#e2e8f0')}`,
                  borderRadius: '8px',
                  padding: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {val}% {val === 100 ? (lang === 'ru' ? '(Норма)' : '(Standart)') : ''}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Eye Care (Tungi Ko'zni Asrash) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 14px',
          background: resolvedTheme === 'dark' ? '#0f172a' : '#f8fafc',
          borderRadius: '14px',
          border: `1px solid ${resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Eye size={18} color="#d97706" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{t('eyeCareMode')}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{t('eyeCareDesc')}</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={eyeCare}
            onChange={(e) => setEyeCare(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#d97706' }}
          />
        </div>

        {/* 5. Sound Effects (Tovushlar) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 14px',
          background: resolvedTheme === 'dark' ? '#0f172a' : '#f8fafc',
          borderRadius: '14px',
          border: `1px solid ${resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {soundEnabled ? <Volume2 size={18} color="#10b981" /> : <VolumeX size={18} color="#94a3b8" />}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{t('soundEffects')}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{t('soundEffectsDesc')}</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => {
              setSoundEnabled(e.target.checked);
              if (e.target.checked) playSound('success');
            }}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }}
          />
        </div>

        {/* 6. Fullscreen & Close buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={toggleFullscreen}
            style={{
              flex: 1,
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            {t('fullscreenMode')}
          </button>

          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
