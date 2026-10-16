import React from 'react';
import { 
  ShoppingCart, Crown, Calculator, 
  Package, Settings, Store, Sparkles, 
  Smartphone, Bell, CheckCircle2, UserCheck
} from 'lucide-react';
import { getIndustryById } from '../data/industriesData';

export default function Header({ 
  currentRole, 
  currentUser, 
  currentView,
  onChangeView,
  balances,
  isServerConnected,
  pendingOrdersCount = 0,
  pendingTransfersCount = 0,
  readyToDispatchCount = 0,
  storeMode = 'universal',
  currentStoreSession,
  onOpenSettings,
  onOpenAuth,
  onOpenPwaModal
}) {
  const activeIndustry = getIndustryById(currentStoreSession?.industryId || storeMode);
  const displayBrandName = currentStoreSession?.storeName || activeIndustry.brandName;
  const storeLogo = currentStoreSession?.logo;

  const roleNames = {
    director: { label: 'Direktor', color: '#f59e0b', icon: Crown, view: 'director' },
    accountant: { label: 'Buxgalter', color: '#10b981', icon: Calculator, view: 'accounting' },
    warehouse: { label: 'Sklad Mudiri', color: '#6366f1', icon: Package, view: 'warehouse' },
    seller_mobile: { label: 'Sotuvchi (APK)', color: '#ec4899', icon: Smartphone, view: 'seller_mobile' },
    cashier: { label: 'Kassa POS', color: '#3b82f6', icon: ShoppingCart, view: 'pos' },
  };

  const currentRoleInfo = roleNames[currentRole] || roleNames.director;
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
                {activeIndustry.shortName} ERP Pro
              </span>
            </div>
            <span className="store-mode-sub">{activeIndustry.subTitle}</span>
          </div>
        </div>

        <span style={{ color: 'var(--border-light)', margin: '0 4px' }}>|</span>
        
        {/* Quick Balances Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div>
            <span>Kassa: </span>
            <strong style={{ color: 'var(--success)' }}>{formatMoney(balances?.cash || 0)}</strong>
          </div>
          <div>
            <span>Bank: </span>
            <strong style={{ color: '#8b5cf6' }}>{formatMoney(balances?.bank || 0)}</strong>
          </div>
        </div>
      </div>

      {/* Right actions: Role Quick Switch, PWA Install & Settings */}
      <div className="header-actions">
        {/* Quick View Switcher Bar */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '3px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <button
            onClick={() => onChangeView('director')}
            style={{
              padding: '6px 10px',
              borderRadius: '9px',
              border: 'none',
              background: currentView === 'director' ? '#f59e0b' : 'transparent',
              color: currentView === 'director' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            👑 Direktor
          </button>

          <button
            onClick={() => onChangeView('accounting')}
            style={{
              padding: '6px 10px',
              borderRadius: '9px',
              border: 'none',
              background: currentView === 'accounting' ? '#10b981' : 'transparent',
              color: currentView === 'accounting' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              position: 'relative'
            }}
          >
            📊 Buxgalter
            {pendingOrdersCount > 0 && (
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} />
            )}
          </button>

          <button
            onClick={() => onChangeView('warehouse')}
            style={{
              padding: '6px 10px',
              borderRadius: '9px',
              border: 'none',
              background: currentView === 'warehouse' ? '#6366f1' : 'transparent',
              color: currentView === 'warehouse' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            📦 Sklad
            {(pendingTransfersCount > 0 || readyToDispatchCount > 0) && (
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }} />
            )}
          </button>

          <button
            onClick={() => onChangeView('seller_mobile')}
            style={{
              padding: '6px 10px',
              borderRadius: '9px',
              border: 'none',
              background: currentView === 'seller_mobile' ? '#ec4899' : 'transparent',
              color: currentView === 'seller_mobile' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            📱 Sotuvchi (APK)
          </button>
        </div>

        {/* APK / PWA Install Button */}
        <button
          onClick={onOpenPwaModal}
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '7px 12px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
          title="Telefonga APK sifatida o'rnatish qo'llanmasi"
        >
          <Smartphone size={14} /> APK O'rnatish
        </button>

        {/* Settings Button */}
        <button 
          className="header-icon-btn" 
          onClick={onOpenSettings}
          title="Do'kon Sozlamalari"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
