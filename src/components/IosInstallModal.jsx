import React, { useState } from 'react';
import { 
  X, Smartphone, Apple, Share, PlusSquare, 
  Check, ArrowRight, ShieldCheck, Download
} from 'lucide-react';

export default function IosInstallModal({ isOpen, onClose }) {
  const [deviceTab, setDeviceTab] = useState('ios'); // 'ios' | 'android'

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '460px',
        width: '100%',
        padding: '26px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Smartphone size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                Telefonga Ilovani O'rnatish
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                Xodimlar uchun to'liq ekranli mobil ilova
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Device Switcher (iPhone vs Android) */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '12px', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => setDeviceTab('ios')}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              background: deviceTab === 'ios' ? '#ffffff' : 'transparent',
              color: deviceTab === 'ios' ? '#0f172a' : '#64748b',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: deviceTab === 'ios' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <Apple size={16} /> iPhone (iOS Safari)
          </button>

          <button
            type="button"
            onClick={() => setDeviceTab('android')}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              background: deviceTab === 'android' ? '#ffffff' : 'transparent',
              color: deviceTab === 'android' ? '#0f172a' : '#64748b',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: deviceTab === 'android' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <Smartphone size={16} /> Android (Chrome)
          </button>
        </div>

        {/* Tab 1: iPhone (iOS Safari) Steps */}
        {deviceTab === 'ios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'flex-start' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                1
              </div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                Saytni <strong>Safari</strong> brauzerida oching va ekranning pastki markazidagi <strong>Ulashish (Share)</strong> tugmasini bosing:
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px', marginLeft: '6px', fontWeight: 700, fontSize: '11px', color: '#2563eb' }}>
                  <Share size={12} /> Ulashish belgisi
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'flex-start' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                2
              </div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                Ochilgan menyuni pastga surib, <strong>"Bosh ekranga qo'shish"</strong> (На экран «Домой» / Add to Home Screen) qatorini tanlang:
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px', marginLeft: '6px', fontWeight: 700, fontSize: '11px', color: '#0f172a' }}>
                  <PlusSquare size={12} /> Bosh ekranga qo'shish
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'flex-start' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                3
              </div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                Yuqori o'ng burchakdagi <strong>"Qo'shish" (Добавить / Add)</strong> tugmasini bosing. Ilova iPhone ish stolida alohida ilova sifatida paydo bo'ladi!
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Android (Chrome) Steps */}
        {deviceTab === 'android' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'flex-start' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#16a34a', color: '#fff', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                1
              </div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                Saytni <strong>Google Chrome</strong> brauzerida oching.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'flex-start' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#16a34a', color: '#fff', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                2
              </div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                Yuqori o'ng burchakdagi <strong>uch nuqta (⋮)</strong> menyusini bosing va <strong>"Ilovani o'rnatish"</strong> (Установить приложение) tugmasini bosing.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'flex-start' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#16a34a', color: '#fff', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                3
              </div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                Ilova APK kabi o'rnatiladi va to'liq ekranda brauzersiz ishlaydi!
              </div>
            </div>
          </div>
        )}

        {/* Benefits notice */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '10px 14px', fontSize: '12px', color: '#166534', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} style={{ flexShrink: 0 }} />
          <span>Ilovadan foydalanganda ma'lumotlar avtomatik sinxronlanadi va batareya tejaladi.</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Tushunarli
        </button>
      </div>
    </div>
  );
}
