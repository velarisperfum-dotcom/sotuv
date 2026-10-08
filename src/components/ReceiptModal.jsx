import React from 'react';
import { Printer, X, CheckCircle, Sparkles } from 'lucide-react';

export default function ReceiptModal({ sale, onClose }) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Savdo muvaffaqiyatli!</h3>
          </div>
          <button className="cart-qty-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body" style={{ background: '#090d16', padding: '16px' }}>
          {/* Thermal receipt styled paper */}
          <div 
            id="printable-receipt"
            style={{
              background: '#ffffff',
              color: '#111827',
              borderRadius: '8px',
              padding: '24px 20px',
              fontFamily: "'Courier New', Courier, monospace",
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              position: 'relative'
            }}
          >
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #9ca3af', paddingBottom: '14px', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '1px', margin: 0, color: '#000' }}>BLIZZ PARFUM</h2>
              <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: '4px 0 0' }}>Lyuks Parfyumeriya & Atirlar Do'koni</p>
              <p style={{ fontSize: '0.72rem', color: '#6b7280', margin: '2px 0 0' }}>Toshkent sh., Amir Temur shox ko'chasi 45</p>
              <p style={{ fontSize: '0.72rem', color: '#6b7280', margin: '2px 0 0' }}>Tel: +998 71 200 88 99</p>
            </div>

            <div style={{ fontSize: '0.75rem', lineHeight: '1.5', borderBottom: '1px dashed #9ca3af', paddingBottom: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Chek №:</span>
                <strong>{sale.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sana / Vaqt:</span>
                <span>{sale.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Kassir:</span>
                <span>{sale.cashierName || 'Sotuvchi'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>To'lov usuli:</span>
                <strong style={{ color: '#000' }}>{sale.paymentMethod}</strong>
              </div>
              {sale.customer && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                  <span>Mijoz:</span>
                  <span>{sale.customer}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div style={{ borderBottom: '1px dashed #9ca3af', paddingBottom: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px', marginBottom: '6px' }}>
                <span>MAHSULOT</span>
                <span>SUMMA</span>
              </div>
              {sale.items?.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '6px', fontSize: '0.78rem' }}>
                  <div style={{ fontWeight: 600, color: '#000' }}>{item.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '0.72rem' }}>
                    <span>{item.quantity} x {Number(item.price).toLocaleString()}</span>
                    <span style={{ fontWeight: 600, color: '#000' }}>{(item.quantity * item.price).toLocaleString()} so'm</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800 }}>JAMI TO'LOV:</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#000' }}>{formatMoney(sale.total)}</span>
            </div>

            {sale.paymentBreakdown && (
              <div style={{ fontSize: '0.72rem', color: '#4b5563', borderTop: '1px solid #f3f4f6', paddingTop: '6px', marginBottom: '10px' }}>
                {sale.paymentBreakdown.cash > 0 && <div>Naqd: {formatMoney(sale.paymentBreakdown.cash)}</div>}
                {sale.paymentBreakdown.card > 0 && <div>Karta: {formatMoney(sale.paymentBreakdown.card)}</div>}
                {sale.paymentBreakdown.bank > 0 && <div>Bank perechisleniye: {formatMoney(sale.paymentBreakdown.bank)}</div>}
                {sale.paymentBreakdown.debt > 0 && <div>Qarz (Nasiya): {formatMoney(sale.paymentBreakdown.debt)}</div>}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.7rem', color: '#6b7280' }}>
              <p style={{ margin: 0 }}>Xaridingiz uchun tashakkur!</p>
              <p style={{ margin: '2px 0 0' }}>Xushbo'y iforlar sizni tark etmasin ✨</p>
              <div style={{ margin: '12px auto 0', letterSpacing: '4px', fontSize: '1.1rem', fontWeight: 800 }}>
                |||| || | |||| ||| ||| ||
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Yopish
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Chekni chop etish
          </button>
        </div>
      </div>
    </div>
  );
}
