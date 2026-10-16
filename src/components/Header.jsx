import React from 'react';
import { 
  LogOut, Smartphone, User, Shield, 
  ArrowLeftRight, CheckCircle2, Building2,
  Box, Wallet, TrendingUp
} from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import ThemeToggleButton from './ThemeToggleButton';
import { useLang } from '../context/LanguageContext';

export default function Header({ 
  currentUser, 
  currentRole,
  onLogout,
  onOpenPwaModal,
  balances
}) {
  const { t, lang } = useLang();
  const formatMoney = (val) => Number(val || 0).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ') + " " + t('currency');

  const getRoleIcon = (role) => {
    switch (role) {
      case 'director': return <TrendingUp size={19} color="#2563eb" />;
      case 'accountant': return <Wallet size={19} color="#059669" />;
      case 'warehouse': return <Box size={19} color="#0284c7" />;
      case 'seller_mobile': return <Smartphone size={19} color="#4f46e5" />;
      default: return <User size={19} color="#64748b" />;
    }
  };

  const roleLabels = {
    director: { name: t('directorCabinet'), badge: t('roleDirectorBadge'), color: '#2563eb' },
    accountant: { name: t('accountingCabinet'), badge: t('roleAccountantBadge'), color: '#059669' },
    warehouse: { name: t('warehouseCabinet'), badge: t('roleWarehouseBadge'), color: '#0284c7' },
    seller_mobile: { name: t('sellerCabinet'), badge: t('roleSellerBadge'), color: '#4f46e5' },
  };

  const roleInfo = roleLabels[currentRole] || roleLabels.director;

  return (
    <header className="main-app-header">
      <div className="main-app-header-inner">
        {/* Left: Active Role & System Name */}
        <div className="header-role-left">
          <div className="header-role-icon-box" style={{ background: `${roleInfo.color}15` }}>
            {getRoleIcon(currentRole)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="header-role-title">
                {roleInfo.name}
              </span>
              <span className="header-role-badge" style={{
                color: roleInfo.color,
                background: `${roleInfo.color}15`,
              }}>
                {roleInfo.badge}
              </span>
            </div>
            <div className="header-user-subtitle">
              {t('user')}: <strong>{currentUser?.name || t('user')}</strong> ({currentUser?.position || t('user')})
            </div>
          </div>
        </div>

        {/* Right: Theme Toggle, Language Toggle, Quick Balances, APK button & Logout */}
        <div className="header-actions-right">
          {/* Auto Brightness & Theme Toggle */}
          <ThemeToggleButton />

          {/* Language Switcher */}
          <LanguageToggle compact={true} />

          {/* Balances (Faqat Desktopda ko'rinadi) */}
          {(currentRole === 'director' || currentRole === 'accountant') && (
            <div className="header-balances-widget">
              <div>
                <span style={{ color: '#64748b' }}>{t('cash')}: </span>
                <strong style={{ color: '#16a34a' }}>{formatMoney(balances?.cash || 0)}</strong>
              </div>
              <div style={{ color: '#cbd5e1' }}>|</div>
              <div>
                <span style={{ color: '#64748b' }}>{t('bank')}: </span>
                <strong style={{ color: '#2563eb' }}>{formatMoney(balances?.bank || 0)}</strong>
              </div>
            </div>
          )}

          {/* Mobile App Button */}
          <button
            onClick={onOpenPwaModal}
            className="header-pwa-btn"
            title={t('installApp')}
          >
            <Smartphone size={14} style={{ color: '#2563eb' }} />
            <span className="header-btn-text">{t('mobileApp')}</span>
          </button>

          {/* Logout Button (ALWAYS VISIBLE & PROMINENT ON MOBILE) */}
          <button
            onClick={onLogout}
            className="header-logout-btn"
            title={t('logout')}
          >
            <LogOut size={14} />
            <span className="header-logout-text">{t('logout')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
