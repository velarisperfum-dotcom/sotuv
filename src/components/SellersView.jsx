import React, { useState } from 'react';
import { 
  Users, UserPlus, ShoppingBag, Award, DollarSign, 
  TrendingUp, Clock, CheckCircle2, Phone, ArrowRight, ShieldCheck
} from 'lucide-react';

export default function SellersView({ 
  staff, 
  sales, 
  onAddStaff, 
  onOpenPOS 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSellerName, setNewSellerName] = useState('');
  const [newSellerPhone, setNewSellerPhone] = useState('');
  const [newSellerRole, setNewSellerRole] = useState('Sotuvchi-Kassir');
  const [newSellerSalary, setNewSellerSalary] = useState('3500000');
  const [newSellerBonus, setNewSellerBonus] = useState('2');

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  // Filter sellers
  const sellers = staff.filter(s => s.role.includes('Sotuvchi') || s.role.includes('Kassir') || s.role.includes('Menejer'));

  // Calculate seller stats
  const sellerStats = sellers.map(seller => {
    const sellerSales = sales.filter(s => s.cashierName === seller.name);
    const totalSalesAmount = sellerSales.reduce((acc, s) => acc + (s.total || 0), 0);
    const totalChecksCount = sellerSales.length;
    const bonusRate = seller.bonusRate || 2;
    const calculatedBonus = Math.round((totalSalesAmount * bonusRate) / 100);

    return {
      ...seller,
      salesCount: totalChecksCount,
      totalSales: totalSalesAmount,
      calculatedBonus,
      recentSales: sellerSales.slice(0, 5)
    };
  });

  const totalSellersSales = sellerStats.reduce((acc, s) => acc + s.totalSales, 0);
  const totalSellersBonuses = sellerStats.reduce((acc, s) => acc + s.calculatedBonus, 0);

  const handleSaveSeller = (e) => {
    e.preventDefault();
    if (!newSellerName) return;

    onAddStaff({
      id: `emp-${Date.now()}`,
      name: newSellerName,
      phone: newSellerPhone || '+998 90 000 00 00',
      role: newSellerRole,
      baseSalary: Number(newSellerSalary) || 3500000,
      bonusRate: Number(newSellerBonus) || 2,
      paidThisMonth: 0,
      status: 'Kutilmoqda'
    });

    setShowAddModal(false);
    setNewSellerName('');
    setNewSellerPhone('');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🛍️</span>
            <h2>Sotuvchilar Bo'limi (Kassa & Xodimlar)</h2>
          </div>
          <p>Sotuvchi xodimlar faoliyati, shaxsiy savdo ko'rsatkichlari va 2% bonus hisobi</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onOpenPOS}>
            <ShoppingBag size={18} /> Kassaga o'tish (POS)
          </button>
          <button className="btn btn-secondary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={18} /> Yangi sotuvchi qo'shish
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card cyan">
          <div className="stat-header">
            <span className="stat-title">Faol Sotuvchilar</span>
            <div className="stat-icon"><Users size={20} color="var(--info)" /></div>
          </div>
          <div className="stat-value">{sellers.length} nafar</div>
          <div className="stat-desc">Smena ochiq va xizmat ko'rsatmoqda</div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-header">
            <span className="stat-title">Sotuvchilar Jami Tushumi</span>
            <div className="stat-icon"><TrendingUp size={20} color="var(--success)" /></div>
          </div>
          <div className="stat-value">{formatMoney(totalSellersSales)}</div>
          <div className="stat-desc">Barcha sotilgan mahsulotlar summasi</div>
        </div>

        <div className="stat-card amber">
          <div className="stat-header">
            <span className="stat-title">Hisoblangan Savdo Bonusi</span>
            <div className="stat-icon"><Award size={20} color="var(--gold)" /></div>
          </div>
          <div className="stat-value">{formatMoney(totalSellersBonuses)}</div>
          <div className="stat-desc">Savdo aylanmasidan 2% rag'batlantirish</div>
        </div>
      </div>

      {/* Sellers List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        {sellerStats.map(seller => (
          <div 
            key={seller.id} 
            className="glass-panel" 
            style={{ 
              margin: 0, 
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid var(--border-light)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top seller card banner */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '46px', height: '46px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.1rem', color: '#fff'
                }}>
                  {seller.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>{seller.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span className="badge badge-card">{seller.role}</span>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>● Smenada</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Cheklar soni</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>{seller.salesCount} ta</div>
              </div>
            </div>

            {/* Seller Contact & Salary Info */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', marginBottom: '14px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-sub)' }}>Telefon:</span>
                <span style={{ fontWeight: 600 }}>{seller.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-sub)' }}>Asosiy maoshi:</span>
                <span style={{ fontWeight: 600 }}>{formatMoney(seller.baseSalary)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-sub)' }}>Savdo bonusi ({seller.bonusRate}%):</span>
                <strong style={{ color: 'var(--gold)' }}>+{formatMoney(seller.calculatedBonus)}</strong>
              </div>
            </div>

            {/* Sales Volume Progress */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-sub)' }}>Umumiy sotuv hajmi:</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                    {formatMoney(seller.totalSales)}
                  </div>
                </div>

                <button 
                  className="btn btn-sm btn-primary"
                  onClick={onOpenPOS}
                >
                  Kassa urish <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Seller Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Yangi Sotuvchi Qo'shish</h3>
              <button className="cart-qty-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveSeller}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">F.I.Sh (Ismi va Familiyasi) *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Masalan: Jasur Qodirov" 
                    value={newSellerName} 
                    onChange={(e) => setNewSellerName(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telefon raqami</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="+998 90 123 45 67" 
                    value={newSellerPhone} 
                    onChange={(e) => setNewSellerPhone(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lavozimi</label>
                  <select 
                    className="form-control"
                    value={newSellerRole}
                    onChange={(e) => setNewSellerRole(e.target.value)}
                  >
                    <option value="Katta Sotuvchi-Konsultant">Katta Sotuvchi-Konsultant</option>
                    <option value="Sotuvchi-Kassir">Sotuvchi-Kassir</option>
                    <option value="Sotuv Menejeri">Sotuv Menejeri</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Asosiy oyligi (so'm)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={newSellerSalary} 
                      onChange={(e) => setNewSellerSalary(e.target.value)} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Savdo bonusi (%)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={newSellerBonus} 
                      onChange={(e) => setNewSellerBonus(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
