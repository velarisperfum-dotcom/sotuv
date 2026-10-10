import React from 'react';
import { 
  ShoppingCart, Crown, Calculator, 
  Package, Settings, Store, Sparkles
} from 'lucide-react';
import { getIndustryById } from '../data/industriesData';

export default function Header({ 
  currentRole, 
  currentUser, 
  balances,
  isServerConnected,
  storeMode = 'universal',
  currentStoreSession,
  onOpenSettings,
  onOpenAuth
}) {
  const activeIndustry = getIndustryById(currentStoreSession?.industryId || storeMode);
  const displayBrandName = currentStoreSession?.storeName || activeIndustry.brandName;
  const storeLogo = currentStoreSession?.logo;

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
      {/* Brand & Store Profile Card */}
      <div className="header-brand-wrap">
        <div 
          className="header-store-brand-card" 
          onClick={onOpenSettings} 
          style={{ cursor: 'pointer' }} 
          title="Do'kon sozlamalari va logotipni o'zgartirish"
        >
          <div className="header-store-logo-box" style={{ borderColor: `${activeIndustry.color}60` }}>
            {storeLogo ? (
              <img src={storeLogo} alt="Logo" className="header-store-img-logo" />
            ) : (
              <span style={{ fontSize: '1.4rem' }}>{activeIndustry.emoji}</span>
            )}
          </div>
          <div className="store-mode-info">
            <div className="store-mode-title-row">
              <span className="store-mode-brand">{displayBrandName}</span>
              <span 
                className="store-mode-tag" 
                style={{ 
                  color: activeIndustry.color, 
                  borderColor: `${activeIndustry.color}40`,
                  background: `${activeIndustry.color}15`
                }}
              >
                {activeIndustry.shortName} ERP
              </span>
            </div>
            <span className="store-mode-sub">{activeIndustry.subTitle}</span>
          </div>
        </div>

        <span style={{ color: 'var(--border-light)', margin: '0 4px' }}>|</span>
        
        {/* Kassa Balance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>Kassa Naqd:</span>
          <strong style={{ color: 'var(--success)' }}>{formatMoney(balances?.cash || 0)}</strong>
        </div>
      </div>

      {/* Right actions: DB Status, Role & Settings */}
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
            {isServerConnected ? 'PostgreSQL Ulangan' : 'Lokal Rejim'}
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

        {/* Store Settings Button (Logo upload, store name, new client onboarding) */}
        {onOpenSettings && (
          <button 
            type="button"
            className="header-store-switch-btn"
            onClick={onOpenSettings}
            title="Do'kon sozlamalari, logotip yuklash va yangi do'kon o'rnatish"
            style={{ borderColor: `${activeIndustry.color}50` }}
          >
            <Settings size={15} color={activeIndustry.color} />
            <span>Do'kon Sozlamalari</span>
          </button>
        )}
      </div>
    </header>
  );
}
