import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Check, AlertCircle, Scan, Flashlight } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function BarcodeScannerModal({ isOpen, onClose, onDetected }) {
  const { t, lang } = useLang();
  const { playSound, resolvedTheme } = useTheme();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [scannedCode, setScannedCode] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScannedCode(null);
      setCameraError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(lang === 'ru' ? 'Камера недоступна в этом браузере' : 'Ushbu brauzerda kamera qo\'llab-quvvatlanmaydi');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true;
        await videoRef.current.play();
        setCameraActive(true);
        startScanningLoop();
      }
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraError(lang === 'ru' ? 'Не удалось запустить камеру (проверьте разрешения)' : 'Kamerani yoqish imkoni bo\'lmadi (ruxsatlarni tekshiring)');
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startScanningLoop = () => {
    // Check if BarcodeDetector API exists
    const hasBarcodeDetector = 'BarcodeDetector' in window;
    let detector = null;
    if (hasBarcodeDetector) {
      try {
        detector = new window.BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'qr_code', 'upc_a', 'upc_e']
        });
      } catch {
        detector = null;
      }
    }

    const scan = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(scan);
        return;
      }

      if (detector) {
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes && barcodes.length > 0) {
            const code = barcodes[0].rawValue;
            handleFoundBarcode(code);
            return;
          }
        } catch {
          // Continues loop
        }
      }

      animationFrameRef.current = requestAnimationFrame(scan);
    };

    animationFrameRef.current = requestAnimationFrame(scan);
  };

  const handleFoundBarcode = (code) => {
    if (!code) return;
    setScannedCode(code);
    playSound('beep');
    stopCamera();
    setTimeout(() => {
      onDetected(code);
      onClose();
    }, 400);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleFoundBarcode(manualCode.trim());
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      padding: '16px',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div style={{
        background: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
        borderRadius: '24px',
        maxWidth: '440px',
        width: '100%',
        margin: 'auto',
        maxHeight: 'calc(100dvh - 32px)',
        overflowY: 'auto',
        padding: '24px',
        border: `1px solid ${resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
        color: resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scan size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{t('barcodeScannerTitle')}</h3>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>{t('barcodeScannerDesc')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Camera Viewport */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          background: '#000000',
          borderRadius: '18px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {/* Target Scan Frame */}
          {cameraActive && !scannedCode && (
            <div style={{
              position: 'absolute',
              width: '200px',
              height: '120px',
              border: '2px solid #22c55e',
              borderRadius: '12px',
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '100%',
                height: '2px',
                background: '#ef4444',
                boxShadow: '0 0 8px #ef4444'
              }} />
            </div>
          )}

          {/* Success overlay */}
          {scannedCode && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(22, 163, 74, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              padding: '20px',
              textAlign: 'center'
            }}>
              <Check size={40} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '15px', fontWeight: 800 }}>{t('barcodeScanSuccess')}</div>
              <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px', letterSpacing: '1px' }}>{scannedCode}</div>
            </div>
          )}

          {/* Camera Error / No camera */}
          {cameraError && (
            <div style={{ padding: '20px', color: '#ffffff', textAlign: 'center' }}>
              <AlertCircle size={32} style={{ color: '#f59e0b', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '13px' }}>{cameraError}</div>
            </div>
          )}
        </div>

        {/* Manual Barcode Input Fallback */}
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder={lang === 'ru' ? 'Или введите штрих-код вручную...' : 'Yoki shtrix-kodni qo\'lda yozing...'}
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '12px',
              border: `1px solid ${resolvedTheme === 'dark' ? '#334155' : '#cbd5e1'}`,
              background: resolvedTheme === 'dark' ? '#0f172a' : '#ffffff',
              color: resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a',
              fontSize: '13px'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {t('save')}
          </button>
        </form>
      </div>
    </div>
  );
}
