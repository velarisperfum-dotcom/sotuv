import React, { useEffect, useState } from 'react';
import { Printer, X, CheckCircle, Share2, Download, Copy, ExternalLink, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

export default function ReceiptModal({ sale, onClose }) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sale) {
      // Haqiqiy skanerlanuvchi QR kod: telefon kamerasi bilan ochilganda raqamli chekni tekshiradi
      const receiptUrl = `https://sotuv-three.vercel.app/?receipt=${sale.id}&total=${sale.total}&date=${encodeURIComponent(sale.date)}`;
      QRCode.toDataURL(receiptUrl, {
        width: 180,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
    }
  }, [sale]);

  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareTelegram = () => {
    const text = `🧾 *BLIZZ PARFUM CHEKI № ${sale.id}*\n📅 Sana: ${sale.date}\n👤 Kassir: ${sale.cashierName || 'Sotuvchi'}\n💰 Jami: ${Number(sale.total).toLocaleString()} so'm\n💳 To'lov: ${sale.paymentMethod}\n🔗 Elektron chek: https://sotuv-three.vercel.app/?receipt=${sale.id}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://sotuv-three.vercel.app')}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    const link = `https://sotuv-three.vercel.app/?receipt=${sale.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '440px', background: 'transparent', border: 'none', boxShadow: 'none' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating actions above receipt */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 800, fontSize: '0.95rem' }}>
            <CheckCircle size={18} />
            <span>Savdo muvaffaqiyatli yakunlandi!</span>
          </div>
          <button 
            className="cart-qty-btn" 
            onClick={onClose} 
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Real Thermal Paper Container */}
        <div 
          id="printable-receipt"
          style={{
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: '16px',
            padding: '28px 24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            position: 'relative',
            fontFamily: "'Courier New', Courier, monospace",
            overflow: 'hidden'
          }}
        >
          {/* Top Decorative Zag Edge */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '6px',
            background: 'repeating-linear-gradient(45deg, #e2e8f0, #e2e8f0 10px, transparent 10px, transparent 20px)'
          }} />

          {/* Store Brand & Info */}
          <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '1px', color: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>✦</span> BLIZZ PARFUM <span>✦</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '3px' }}>
              Lyuks Selektiv Atirlar Butigi
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
              Toshkent sh., Amir Temur shox ko'chasi 45
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Tel: +998 71 200 88 99 | @blizzparfum
            </div>
          </div>

          {/* Metadata */}
          <div style={{ fontSize: '0.76rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '12px', marginBottom: '14px', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Chek raqami:</span>
              <strong style={{ color: '#000', letterSpacing: '0.5px' }}>#{sale.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Sana & Vaqt:</span>
              <span>{sale.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Kassir:</span>
              <span>{sale.cashierName || 'Sotuvchi-kassir'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>To'lov turi:</span>
              <strong style={{ 
                color: sale.paymentMethod === 'Naqd' ? '#059669' : sale.paymentMethod === 'Karta' ? '#4f46e5' : '#d97706',
                fontWeight: 800 
              }}>
                {sale.paymentMethod}
              </strong>
            </div>
            {sale.customer && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Mijoz:</span>
                <span style={{ fontWeight: 600 }}>{sale.customer} {sale.customerPhone ? `(${sale.customerPhone})` : ''}</span>
              </div>
            )}
          </div>

          {/* Items Header */}
          <div style={{ borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase' }}>
            <span>Nomi & Hajmi</span>
            <span>Summa</span>
          </div>

          {/* Items List */}
          <div style={{ borderBottom: '2px dashed #cbd5e1', paddingBottom: '14px', marginBottom: '14px' }}>
            {sale.items?.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '8px', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 800, color: '#090d16', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{idx + 1}. {item.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem', color: '#475569', marginTop: '2px' }}>
                  <span>{item.quantity} dona × {Number(item.price).toLocaleString()} so'm</span>
                  <strong style={{ color: '#000', fontSize: '0.78rem' }}>
                    {(item.quantity * item.price).toLocaleString()} so'm
                  </strong>
                </div>
              </div>
            ))}
          </div>

          {/* Discount if any */}
          {sale.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#dc2626', marginBottom: '6px' }}>
              <span>Chegirma:</span>
              <span>-{formatMoney(sale.discount)}</span>
            </div>
          )}

          {/* Grand Total */}
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '8px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', 
            marginBottom: '14px' 
          }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.5px' }}>JAMI:</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#090d16' }}>
              {formatMoney(sale.total)}
            </span>
          </div>

          {/* Payment Breakdown if mixed or debt */}
          {sale.paymentBreakdown && (
            <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '14px', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
              {sale.paymentBreakdown.cash > 0 && <div>• Naqd to'landi: {formatMoney(sale.paymentBreakdown.cash)}</div>}
              {sale.paymentBreakdown.card > 0 && <div>• Karta to'landi: {formatMoney(sale.paymentBreakdown.card)}</div>}
              {sale.paymentBreakdown.bank > 0 && <div>• Bank o'tkazmasi: {formatMoney(sale.paymentBreakdown.bank)}</div>}
              {sale.paymentBreakdown.debt > 0 && <div style={{ color: '#d97706', fontWeight: 700 }}>• Qarzga yozildi: {formatMoney(sale.paymentBreakdown.debt)}</div>}
            </div>
          )}

          {/* Real Scanable QR Code */}
          <div style={{ textAlign: 'center', padding: '8px 0', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              📱 Haqiqiy QR-KOD (Tekshirish uchun)
            </div>
            {qrCodeDataUrl ? (
              <img 
                src={qrCodeDataUrl} 
                alt="QR Code" 
                style={{ width: '130px', height: '130px', display: 'block', margin: '0 auto', borderRadius: '6px', border: '1px solid #e2e8f0' }} 
              />
            ) : (
              <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                QR kod yuklanmoqda...
              </div>
            )}
            <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '6px' }}>
              Telefon kamerasini tuting: elektron chek va mahsulot sertifikatini ko'rish
            </div>
          </div>

          {/* Barcode line simulation */}
          <div style={{ textAlign: 'center', margin: '12px 0 6px' }}>
            <div style={{ fontFamily: 'monospace', letterSpacing: '5px', fontSize: '1.2rem', fontWeight: 900, color: '#1e293b' }}>
              ||| | |||| || ||||| ||| || ||||
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '2px', marginTop: '2px' }}>
              {sale.id}-BLIZZ-UZ
            </div>
          </div>

          {/* Footer message */}
          <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b', borderTop: '1px dashed #cbd5e1', paddingTop: '10px', marginTop: '10px' }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Xaridingiz uchun tashakkur!</p>
            <p style={{ margin: '2px 0 0' }}>Xushbo'y iforlar sizga quvonch ulashsin ✨</p>
            <p style={{ margin: '3px 0 0', fontSize: '0.62rem', color: '#94a3b8' }}>Tovar xarid qilingan kundan boshlab almashtirilmaydi</p>
          </div>
        </div>

        {/* Action Buttons Below Receipt */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px' }}>
          <button 
            className="btn btn-primary" 
            style={{ padding: '12px', fontSize: '0.88rem', fontWeight: 800 }}
            onClick={handlePrint}
          >
            <Printer size={16} /> Chop etish
          </button>

          <button 
            className="btn btn-secondary" 
            style={{ padding: '12px', fontSize: '0.88rem', background: '#229ED9', color: '#fff', borderColor: 'transparent' }}
            onClick={handleShareTelegram}
          >
            <Share2 size={16} /> Telegramga
          </button>
        </div>

        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', marginTop: '8px', padding: '10px', fontSize: '0.8rem' }}
          onClick={handleCopyLink}
        >
          <Copy size={14} /> {copied ? 'Nusxalandi! ✓' : 'Elektron chek havolasini nusxalash'}
        </button>
      </div>
    </div>
  );
}
