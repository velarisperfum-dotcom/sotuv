import React from 'react';
import { 
  Bell, ShoppingCart, User, Crown, Calculator, 
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

  const currentRoleInfo = roleNames[currentRole] || roleNames.director;
  const RoleIcon = currentRoleInfo.icon;

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  return (
    <header className="top-header">
      {/* Current Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Store size={20} color="var(--primary)" />
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>BLIZZ POS & ERP</span>
        </div>
        <span style={{ color: 'var(--border-light)' }}>|</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>Kassa Naqd:</span>
          <strong style={{ color: 'var(--success)' }}>{formatMoney(balances.cash)}</strong>
        </div>
      </div>

      {/* Right actions & Role Badge */}
      <div className="header-actions">
        {/* Quick POS action button */}
        {currentView !== 'pos' && (
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => onChangeView('pos')}
          >
            <ShoppingCart size={15} /> Kassa ochish (POS)
          </button>
        )}

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
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
            {isServerConnected ? 'PostgreSQL Ulangan' : 'Lokal Rejim'}
          </span>
        </div>

        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <button 
            className="btn btn-sm btn-secondary"
            style={{ borderColor: 'rgba(244,63,94,0.3)', color: '#fb7185' }}
            onClick={() => onChangeView('warehouse')}
            title={`${lowStockCount} ta mahsulot zaxirasi kam qoldi`}
          >
            <Bell size={14} /> Sklad: {lowStockCount} ta kam
          </button>
        )}

        {/* Current Active Role Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-light)',
          padding: '6px 14px',
          borderRadius: '999px'
        }}>
          <RoleIcon size={16} color={currentRoleInfo.color} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: currentRoleInfo.color }}>
              {currentRoleInfo.label}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>
              {currentUser?.name || 'Tizim foydalanuvchisi'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
