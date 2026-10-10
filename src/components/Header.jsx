import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, Crown, Calculator, 
  Package, ChevronDown, Check, Sparkles, Store, LogOut
} from 'lucide-react';
import { STORE_MODES } from '../data/initialData';

export default function Header({ 
  currentRole, 
  currentUser, 
  balances,
  isServerConnected,
  storeMode = 'universal',
  onSelectStoreMode,
  currentStoreSession,
  onOpenAuth
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeStore = STORE_MODES.find(m => m.id === storeMode) || STORE_MODES[0];
  const displayBrandName = currentStoreSession?.storeName || activeStore.brandName;

  const roleNames = {
    director: { label: 'Direktor', color: 'var(--gold)', icon: Crown },
    accountant: { label: 'Buxgalter', color: 'var(--primary)', icon: Calculator },
    warehouse: { label: 'Sklad Mudiri', color: 'var(--info)', icon: Package },
    cashier: { label: 'Sotuvchi (Kassir)', color: 'var(--success)', icon: ShoppingCart },
  };

  const currentRoleInfo = roleNames[currentRole] || roleNames.cashier;
  const RoleIcon = currentRoleInfo.icon;

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="top-header">
      {/* Brand & Store Mode Switcher */}
      <div className="header-brand-wrap" ref={dropdownRef} style={{ position: 'relative' }}>
        <button 
          className="store-mode-trigger-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          title="Do'kon yo'nalishini (Atir, Kiyim, Oziq-ovqat, Elektronika) almashtirish"
        >
          <span className="store-mode-emoji">{activeStore.emoji}</span>
          <div className="store-mode-info">
            <div className="store-mode-title-row">
              <span className="store-mode-brand">{displayBrandName}</span>
              <span className="store-mode-tag" style={{ color: activeStore.color, borderColor: `${activeStore.color}40` }}>
                {activeStore.shortName}
              </span>
            </div>
            <span className="store-mode-sub">{activeStore.subTitle}</span>
          </div>
          <ChevronDown size={15} color="var(--text-sub)" style={{ marginLeft: '4px', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {/* Store Mode Dropdown Menu */}
        {dropdownOpen && (
          <div className="store-mode-dropdown">
            <div className="store-dropdown-header">
              <Sparkles size={14} color="var(--primary)" />
              <span>DO'KON YO'NALISHINI TANLANG:</span>
            </div>
            <div className="store-dropdown-list">
              {STORE_MODES.map(mode => {
                const isSelected = mode.id === storeMode;
                return (
                  <div
                    key={mode.id}
                    className={`store-dropdown-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      if (onSelectStoreMode) onSelectStoreMode(mode.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <span className="dropdown-emoji">{mode.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div className="dropdown-item-title">
                        <strong>{mode.brandName}</strong>
                        <span className="dropdown-short-tag" style={{ color: mode.color }}>
                          {mode.shortName}
                        </span>
                      </div>
                      <span className="dropdown-item-desc">{mode.subTitle}</span>
                    </div>
                    {isSelected && <Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
            <div className="store-dropdown-footer">
              Tizim tanlangan soha tovarlari, kassa va omboriga bir zumda to'liq moslashadi.
            </div>
          </div>
        )}

        <span style={{ color: 'var(--border-light)', margin: '0 4px' }}>|</span>
        
        {/* Kassa Balance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>Kassa Naqd:</span>
          <strong style={{ color: 'var(--success)' }}>{formatMoney(balances?.cash || 0)}</strong>
        </div>
      </div>

      {/* Right actions: DB Status & Active User Role */}
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

        {/* Switch / New Store Auth Button */}
        {onOpenAuth && (
          <button 
            type="button"
            className="header-store-switch-btn"
            onClick={onOpenAuth}
            title="Do'kon hisobini ko'rish yoki yangi do'kon ochish"
          >
            <Store size={15} color="var(--primary)" />
            <span>Do'konlar</span>
          </button>
        )}
      </div>
    </header>
  );
}
