import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, Printer, Share2, ArrowLeft, ShieldCheck, 
  Sparkles, Building2, Phone, Calendar, Clock, CreditCard
} from 'lucide-react';
import QRCode from 'qrcode';

export default function CustomerReceiptView({ sale, onGoHome }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  const receiptUrl = window.location.href;
  const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(receiptUrl)}`;

  useEffect(() => {
    QRCode.toDataURL(receiptUrl, {
      width: 140,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    })
    .then(url => setQrDataUrl(url))
    .catch(() => setQrDataUrl(fallbackQrUrl));
  }, [receiptUrl, fallbackQrUrl]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareTelegram = () => {
    const text = `🧾 *BLIZZ PARFUM CHEKI № ${sale.id}*\n📅 Sana: ${sale.date}\n💰 Jami: ${Number(sale.total).toLocaleString()} so'm\n💳 To'lov: ${sale.paymentMethod}\n🔗 Elektron chek: ${receiptUrl}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(receiptUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="customer-receipt-screen">
      {/* Top Floating Bar for customer */}
      <div className="receipt-screen-bar">
        <button className="btn btn-sm btn-secondary" onClick={onGoHome}>
          <ArrowLeft size={16} /> Bosh sahifaga o'tish
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-sm btn-primary" onClick={handlePrint}>
            <Printer size={15} /> Chop etish
          </button>
          <button 
            className="btn btn-sm" 
            style={{ background: '#229ED9', color: '#fff', border: 'none' }}
            onClick={handleShareTelegram}
          >
            <Share2 size={15} /> Ulashish
          </button>
        </div>
      </div>

      {/* Verified Online Ribbon */}
      <div className="receipt-verified-banner">
        <ShieldCheck size={20} color="#10b981" />
        <div>
          <strong>RASMIY TASDIQLANGAN ELEKTRON CHEK</strong>
          <p>Ushbu xarid BLIZZ PARFUM savdo bazasida muvaffaqiyatli ro'yxatdan o'tgan</p>
        </div>
      </div>

      {/* Realistic Luxury Thermal Receipt Container */}
      <div id="printable-receipt" className="receipt-paper">
        {/* Top Decorative Zag Edge */}
        <div className="receipt-paper-edge" />

        {/* Brand Header */}
        <div className="receipt-brand-header">
          <div className="receipt-brand-title">
            ✦ BLIZZ PARFUM ✦
          </div>
          <div className="receipt-brand-sub">
            Lyuks Selektiv Atirlar Butigi
          </div>
          <div className="receipt-brand-contact">
            Toshkent sh., Amir Temur shox ko'chasi 45<br />
            Tel: +998 71 200 88 99 | @blizzparfum
          </div>
        </div>

        {/* Receipt Meta */}
        <div className="receipt-meta-grid">
          <div className="receipt-meta-row">
            <span>Chek raqami:</span>
            <strong>#{sale.id}</strong>
          </div>
          <div className="receipt-meta-row">
            <span>Sana va vaqt:</span>
            <span>{sale.date || new Date().toLocaleString('uz-UZ')}</span>
          </div>
          <div className="receipt-meta-row">
            <span>Kassir:</span>
            <span>{sale.cashierName || 'Sotuvchi-kassir'}</span>
          </div>
          <div className="receipt-meta-row">
            <span>To'lov usuli:</span>
            <strong style={{ 
              color: sale.paymentMethod === 'Naqd' ? '#059669' : sale.paymentMethod === 'Karta' ? '#4f46e5' : '#d97706' 
            }}>
              {sale.paymentMethod || 'Karta'}
            </strong>
          </div>
          {sale.customer && (
            <div className="receipt-meta-row">
              <span>Mijoz:</span>
              <span>{sale.customer} {sale.customerPhone ? `(${sale.customerPhone})` : ''}</span>
            </div>
          )}
        </div>

        {/* Table Header */}
        <div className="receipt-table-head">
          <span>Mahsulot & Hajm</span>
          <span>Summa</span>
        </div>

        {/* Items List */}
        <div className="receipt-items-list">
          {sale.items && sale.items.length > 0 ? (
            sale.items.map((item, idx) => (
              <div key={idx} className="receipt-item-row">
                <div className="receipt-item-name">
                  {idx + 1}. {item.name} {item.volume ? `(${item.volume})` : ''}
                </div>
                <div className="receipt-item-detail">
                  <span>{item.quantity} dona × {formatMoney(item.price)}</span>
                  <strong>{formatMoney(item.quantity * item.price)}</strong>
                </div>
              </div>
            ))
          ) : (
            <div className="receipt-item-row">
              <div className="receipt-item-name">Selektiv parfyumeriya</div>
              <div className="receipt-item-detail">
                <span>1 dona</span>
                <strong>{formatMoney(sale.total)}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Discount if present */}
        {sale.discount > 0 && (
          <div className="receipt-discount-row">
            <span>Chegirma:</span>
            <span>-{formatMoney(sale.discount)}</span>
          </div>
        )}

        {/* Total Row */}
        <div className="receipt-total-block">
          <span className="receipt-total-label">JAMI TO'LANDI:</span>
          <span className="receipt-total-value">{formatMoney(sale.total)}</span>
        </div>

        {/* Payment Breakdown if any */}
        {sale.paymentBreakdown && (
          <div className="receipt-breakdown-box">
            {sale.paymentBreakdown.cash > 0 && <div>• Naqd: {formatMoney(sale.paymentBreakdown.cash)}</div>}
            {sale.paymentBreakdown.card > 0 && <div>• Karta: {formatMoney(sale.paymentBreakdown.card)}</div>}
            {sale.paymentBreakdown.bank > 0 && <div>• Bank perech: {formatMoney(sale.paymentBreakdown.bank)}</div>}
            {sale.paymentBreakdown.debt > 0 && <div>• Qarz: {formatMoney(sale.paymentBreakdown.debt)}</div>}
          </div>
        )}

        {/* Official QR Code Box */}
        <div className="receipt-qr-box">
          <div className="receipt-qr-title">
            📱 RASMIY ELEKTRON CHEK VERIFIKATSIYASI
          </div>
          <img 
            src={qrDataUrl || fallbackQrUrl} 
            alt="Chek QR kodi" 
            className="receipt-qr-image"
          />
          <div className="receipt-qr-hint">
            Ushbu chek haqiqiy va tasdiqlangan
          </div>
        </div>

        {/* Barcode line */}
        <div className="receipt-barcode-wrap">
          <div className="receipt-barcode-font">
            ||| | |||| || ||||| ||| || ||||
          </div>
          <div className="receipt-barcode-num">
            {sale.id}-BLIZZ-ORIGINAL
          </div>
        </div>

        {/* Thank You Note */}
        <div className="receipt-footer-note">
          <p><strong>Xaridingiz uchun tashakkur!</strong></p>
          <p>Xushbo'y iforlar sizga a'lo kayfiyat baxsh etsin ✨</p>
          <small>BLIZZ PARFUM — Asl frantsuz va arab atirlari uyi</small>
        </div>
      </div>

      {/* Bottom Button to go back to shop */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={onGoHome}
          style={{ padding: '12px 24px', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Savdo Tizimiga O'tish
        </button>
      </div>
    </div>
  );
}
