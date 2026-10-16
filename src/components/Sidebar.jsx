import React from 'react';
import { 
  Crown, Calculator, Package, ShoppingCart, 
  BarChart3, Users, Building2, Smartphone, ShieldCheck, 
  Truck, Clock, Layers
} from 'lucide-react';
import { getIndustryById } from '../data/industriesData';

export default function Sidebar({ 
  currentRole, 
  onChangeRole, 
  currentView, 
  onChangeView, 
  lowStockCount = 0,
  pendingTransfersCount = 0,
  pendingOrdersCount = 0,
  readyToDispatchCount = 0,
  storeMode = 'universal',
  currentStoreSession = null,
  onOpenPwaModal
}) {
  const activeStore = getIndustryById(currentStoreSession?.industryId || storeMode);
  const displayBrandName = currentStoreSession?.storeName || activeStore.brandName;
  const storeLogo = currentStoreSession?.logo;

  const roles = [
    { id: 'director', name: 'Direktor', icon: Crown, view: 'director' },
    { id: 'accountant', name: 'Buxgalter', icon: Calculator, view: 'accounting' },
    { id: 'warehouse', name: 'Sklad', icon: Package, view: 'warehouse' },
    { id: 'seller_mobile', name: 'Sotuvchi (APK)', icon: Smartphone, view: 'seller_mobile' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand-section">
        <div className="brand-logo" style={{ background: activeStore.color, overflow: 'hidden' }}>
          {storeLogo ? (
            <img src={storeLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '1.4rem' }}>{activeStore.emoji}</span>
          )}
        </div>
        <div className="brand-info">
          <h1>{displayBrandName}</h1>
          <span style={{ color: activeStore.color, fontWeight: 700 }}>{activeStore.shortName} ERP Pro</span>
        </div>
      </div>

      {/* Role Switcher Box (4 ta asosiy mustaqil rol) */}
      <div className="role-box">
        <div className="role-box-label">
          <span>Faol Rol & Profil</span>
          <span style={{ color: 'var(--primary)', fontWeight: 800 }}>4 Profil</span>
        </div>
        <div className="role-chips" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = currentView === r.view;
            return (
              <button
                key={r.id}
                className={`role-chip ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onChangeRole(r.id);
                  onChangeView(r.view);
                }}
                style={{ padding: '8px 10px', fontSize: '12px' }}
              >
                <Icon size={14} color={isActive ? '#fff' : 'var(--text-sub)'} />
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="nav-menu">
        <div className="nav-label">Asosiy Bo'limlar</div>

        {/* 1. DIREKTOR */}
        <button 
          className={`nav-item ${currentView === 'director' ? 'active' : ''}`}
          onClick={() => { onChangeRole('director'); onChangeView('director'); }}
        >
          <Crown size={18} style={{ color: '#f59e0b' }} />
          <span>1. Direktor Boshqaruvi</span>
        </button>

        {/* 2. BUXGALTER */}
        <button 
          className={`nav-item ${currentView === 'accounting' ? 'active' : ''}`}
          onClick={() => { onChangeRole('accountant'); onChangeView('accounting'); }}
        >
          <Calculator size={18} style={{ color: '#10b981' }} />
          <span>2. Buxgalteriya & To'lov</span>
          {pendingOrdersCount > 0 && (
            <span className="nav-badge" style={{ background: '#ef4444' }} title={`${pendingOrdersCount} ta yangi zayavka tekshiruvda`}>
              {pendingOrdersCount}
            </span>
          )}
        </button>

        {/* 3. SKLAD */}
        <button 
          className={`nav-item ${currentView === 'warehouse' ? 'active' : ''}`}
          onClick={() => { onChangeRole('warehouse'); onChangeView('warehouse'); }}
        >
          <Package size={18} style={{ color: '#6366f1' }} />
          <span>3. Sklad & Logistika</span>
          {(pendingTransfersCount > 0 || readyToDispatchCount > 0) && (
            <span className="nav-badge" style={{ background: '#3b82f6' }} title="Kirim va otgruzkalar kutilmoqda">
              {pendingTransfersCount + readyToDispatchCount}
            </span>
          )}
        </button>

        {/* 4. SOTUVCHI MOBIL (APK) */}
        <button 
          className={`nav-item ${currentView === 'seller_mobile' ? 'active' : ''}`}
          onClick={() => { onChangeRole('seller_mobile'); onChangeView('seller_mobile'); }}
          style={{ background: currentView === 'seller_mobile' ? 'var(--primary-glow)' : 'transparent' }}
        >
          <Smartphone size={18} style={{ color: '#ec4899' }} />
          <span>4. Sotuvchi (Mobil APK)</span>
          <span style={{ fontSize: '10px', background: '#ec4899', color: '#fff', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>
            APK
          </span>
        </button>

        <div className="nav-label" style={{ marginTop: '16px' }}>Qo'shimcha Modullar</div>

        {/* 5. KASSA POS */}
        <button 
          className={`nav-item ${currentView === 'pos' ? 'active' : ''}`}
          onClick={() => { onChangeRole('cashier'); onChangeView('pos'); }}
        >
          <ShoppingCart size={18} />
          <span>Tezkor Kassa (POS)</span>
        </button>

        {/* 6. JAMOALAR */}
        <button 
          className={`nav-item ${currentView === 'sellers' ? 'active' : ''}`}
          onClick={() => onChangeView('sellers')}
        >
          <Users size={18} />
          <span>Xodimlar & Sotuvchilar</span>
        </button>
      </nav>

      {/* APK Banner */}
      <div style={{ margin: '14px', padding: '14px', borderRadius: '16px', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Smartphone size={16} />
          <span style={{ fontSize: '12px', fontWeight: 800 }}>Telefonga APK O'rnatish</span>
        </div>
        <p style={{ margin: '0 0 10px', fontSize: '11px', opacity: 0.8, lineHeight: '1.4' }}>
          Sotuvchilar telefoniga ilovani bitta tugma bilan APK kabi o'rnating
        </p>
        <button
          onClick={onOpenPwaModal}
          style={{ width: '100%', padding: '8px', borderRadius: '10px', border: 'none', background: '#ffffff', color: '#1e1b4b', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
        >
          Ilovani yuklash (APK)
        </button>
      </div>
    </aside>
  );
}
