import React from 'react';
import { 
  Crown, Calculator, Package, ShoppingCart, 
  BarChart3, Clock, Users, Sparkles, Building2, Layers
} from 'lucide-react';

export default function Sidebar({ 
  currentRole, 
  onChangeRole, 
  currentView, 
  onChangeView, 
  lowStockCount,
  pendingDebtsCount 
}) {
  const roles = [
    { id: 'director', name: 'Direktor', icon: Crown, desc: 'Barcha stat & hisoblar' },
    { id: 'accountant', name: 'Buxgalter', icon: Calculator, desc: 'Moliya & Oyliklar' },
    { id: 'warehouse', name: 'Sklad', icon: Package, desc: 'Tovar & Ombor' },
    { id: 'cashier', name: 'Sotuvchi', icon: ShoppingCart, desc: 'POS Kassa' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand-section">
        <div className="brand-logo">
          <Sparkles size={24} color="#fff" />
        </div>
        <div className="brand-info">
          <h1>BLIZZ PARFUM</h1>
          <span>Savdo & ERP Tizimi</span>
        </div>
      </div>

      {/* Role Switcher Box (Rasmda keltirilgan 4 ta asosiy rol) */}
      <div className="role-box">
        <div className="role-box-label">
          <span>Faol Rol (Foydalanuvchi)</span>
          <span style={{ color: 'var(--primary)', fontWeight: 800 }}>4 Rol</span>
        </div>
        <div className="role-chips">
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                className={`role-chip ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onChangeRole(r.id);
                  if (r.id === 'director') onChangeView('director');
                  if (r.id === 'accountant') onChangeView('accounting');
                  if (r.id === 'warehouse') onChangeView('warehouse');
                  if (r.id === 'cashier') onChangeView('pos');
                }}
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

        <button 
          className={`nav-item ${currentView === 'pos' ? 'active' : ''}`}
          onClick={() => onChangeView('pos')}
        >
          <ShoppingCart size={18} />
          <span>Sotuvchi (Kassa POS)</span>
        </button>

        <button 
          className={`nav-item ${currentView === 'sellers' ? 'active' : ''}`}
          onClick={() => onChangeView('sellers')}
        >
          <Users size={18} />
          <span>Sotuvchilar (Jamoa & KPI)</span>
        </button>

        <button 
          className={`nav-item ${currentView === 'director' ? 'active' : ''}`}
          onClick={() => onChangeView('director')}
        >
          <BarChart3 size={18} />
          <span>Direktor Kabineti</span>
        </button>

        <button 
          className={`nav-item ${currentView === 'warehouse' ? 'active' : ''}`}
          onClick={() => onChangeView('warehouse')}
        >
          <Package size={18} />
          <span>Sklad & Tovarlar</span>
          {lowStockCount > 0 && (
            <span className="nav-badge" title={`${lowStockCount} ta atir kam qolgan`}>
              {lowStockCount}
            </span>
          )}
        </button>

        <button 
          className={`nav-item ${currentView === 'accounting' ? 'active' : ''}`}
          onClick={() => onChangeView('accounting')}
        >
          <Calculator size={18} />
          <span>Buxgalteriya & Moliya</span>
          {pendingDebtsCount > 0 && (
            <span className="nav-badge" style={{ background: 'rgba(245,158,11,0.2)', color: 'var(--gold)' }}>
              {pendingDebtsCount}
            </span>
          )}
        </button>
      </nav>

      {/* Bottom Store Info */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Building2 size={15} color="var(--text-sub)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Toshkent Markaziy Filial</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)' }}>
          Kassa holati: <span style={{ color: 'var(--success)', fontWeight: 600 }}>Ochiq ●</span>
        </div>
      </div>
    </aside>
  );
}
