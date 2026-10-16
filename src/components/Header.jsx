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
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.02)'
    }}>
      {/* Left: Active Role & System Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: `${roleInfo.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getRoleIcon(currentRole)}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              {roleInfo.name}
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: roleInfo.color,
              background: `${roleInfo.color}15`,
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {roleInfo.badge}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {t('user')}: <strong>{currentUser?.name || t('user')}</strong> ({currentUser?.position || t('user')})
          </div>
        </div>
      </div>

      {/* Right: Theme Toggle, Language Toggle, Quick Balances, APK button & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Auto Brightness & Theme Toggle */}
        <ThemeToggleButton />

        {/* Language Switcher */}
        <LanguageToggle />

        {/* Balances (Faqat Direktor va Buxgalter uchun) */}
        {(currentRole === 'director' || currentRole === 'accountant') && (
          <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
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
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '7px 12px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
          title={t('installApp')}
        >
          <Smartphone size={14} style={{ color: '#2563eb' }} /> {t('mobileApp')}
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            borderRadius: '10px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
          title={t('logout')}
        >
          <LogOut size={14} /> {t('logout')}
        </button>
      </div>
    </header>
  );
}
