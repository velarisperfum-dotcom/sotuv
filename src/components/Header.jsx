import React from 'react';
import { 
  Bell, ShoppingCart, Users, Crown, Calculator, 
  Package, Store, DollarSign, CreditCard
} from 'lucide-react';

export default function Header({ 
  currentRole, 
  currentUser, 
  currentView, 
  onChangeView, 
  balances,
  lowStockCount,
  pendingDebtsCount,
  isServerConnected 
}) {
  const roleNames = {
    director: { label: 'Direktor', color: 'var(--gold)', icon: Crown },
    accountant: { label: 'Buxgalter', color: 'var(--primary)', icon: Calculator },
    warehouse: { label: 'Sklad Mudiri', color: 'var(--info)', icon: Package },
    cashier: { label: 'Sotuvchi (Kassir)', color: 'var(--success)', icon: ShoppingCart },
  };

  const currentRoleInfo = roleNames[currentRole] || roleNames.cashier;
  const RoleIcon = currentRoleInfo.icon;

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  return (
    <header className="top-header">
      {/* Brand & Kassa Balance */}
      <div className="header-brand-wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Store size={20} color="var(--primary)" />
          <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#fff', letterSpacing: '-0.3px' }}>
            BLIZZ PARFUM
          </span>
        </div>
        <span style={{ color: 'var(--border-light)' }}>|</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Kassa:</span>
          <strong style={{ color: 'var(--success)' }}>{formatMoney(balances.cash)}</strong>
        </div>
      </div>

      {/* Main Navigation Tabs - Visible Everywhere */}
      <nav className="header-nav-tabs">
        <button 
          className={`header-tab-btn ${currentView === 'pos' ? 'active' : ''}`}
          onClick={() => onChangeView('pos')}
          title="Atirlar sotish va kassa (POS)"
        >
          <ShoppingCart size={15} />
          <span>Sotuvchi (POS Kassa)</span>
        </button>

        <button 
          className={`header-tab-btn ${currentView === 'sellers' ? 'active' : ''}`}
          onClick={() => onChangeView('sellers')}
          title="Sotuvchilar ro'yxati va KPI ko'rsatkichlari"
        >
          <Users size={15} />
          <span>Sotuvchilar (KPI)</span>
        </button>

        <button 
          className={`header-tab-btn ${currentView === 'director' ? 'active' : ''}`}
          onClick={() => onChangeView('director')}
          title="Direktor boshqaruv paneli"
        >
          <Crown size={15} />
          <span>Direktor</span>
        </button>

        <button 
          className={`header-tab-btn ${currentView === 'warehouse' ? 'active' : ''}`}
          onClick={() => onChangeView('warehouse')}
          title="Sklad va qoldiq tovarlar"
        >
          <Package size={15} />
          <span>Sklad</span>
          {lowStockCount > 0 && <span className="tab-pill-badge">{lowStockCount}</span>}
        </button>

        <button 
          className={`header-tab-btn ${currentView === 'accounting' ? 'active' : ''}`}
          onClick={() => onChangeView('accounting')}
          title="Buxgalteriya va qarzlar daftari"
        >
          <Calculator size={15} />
          <span>Moliya</span>
          {pendingDebtsCount > 0 && <span className="tab-pill-badge warning">{pendingDebtsCount}</span>}
        </button>
      </nav>

      {/* Right actions & Role Badge */}
      <div className="header-actions">
        {/* Server / DB Status */}
        <div 
          className="header-badge" 
          style={{
            background: isServerConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            borderColor: isServerConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
            color: isServerConnected ? 'var(--success)' : 'var(--gold)'
          }}
          title={isServerConnected ? 'Railway PostgreSQL bazasiga muvaffaqiyatli ulangan' : 'Mahalliy xotira rejimida (Offline)'}
        >
          <div 
            className="pulse-dot" 
            style={{ 
              background: isServerConnected ? 'var(--success)' : 'var(--gold)',
              boxShadow: isServerConnected ? '0 0 8px var(--success)' : '0 0 8px var(--gold)'
            }} 
          />
          <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>
            {isServerConnected ? 'PostgreSQL' : 'Lokal'}
          </span>
        </div>

        {/* Current Active Role Badge */}
        <div className="header-role-badge">
          <RoleIcon size={15} color={currentRoleInfo.color} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: currentRoleInfo.color, lineHeight: 1.1 }}>
              {currentRoleInfo.label}
            </span>
            <span style={{ fontSize: '0.66rem', color: 'var(--text-sub)', lineHeight: 1.1 }}>
              {currentUser?.name || 'Tizim foydalanuvchisi'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
