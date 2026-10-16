import React from 'react';
import { ShoppingCart, Smartphone, Package, Calculator, Crown } from 'lucide-react';

export default function MobileNav({ 
  currentView, 
  onChangeView, 
  lowStockCount = 0, 
  pendingOrdersCount = 0,
  pendingTransfersCount = 0,
  readyToDispatchCount = 0
}) {
  return (
    <nav className="mobile-bottom-nav">
      {/* 1. SOTUVCHI (APK) */}
      <button 
        className={`mobile-nav-btn ${currentView === 'seller_mobile' ? 'active' : ''}`}
        onClick={() => onChangeView('seller_mobile')}
      >
        <Smartphone size={20} />
        <span>Sotuvchi</span>
      </button>

      {/* 2. DIREKTOR */}
      <button 
        className={`mobile-nav-btn ${currentView === 'director' ? 'active' : ''}`}
        onClick={() => onChangeView('director')}
      >
        <Crown size={20} />
        <span>Direktor</span>
      </button>

      {/* 3. BUXGALTER */}
      <button 
        className={`mobile-nav-btn ${currentView === 'accounting' ? 'active' : ''}`}
        onClick={() => onChangeView('accounting')}
      >
        <Calculator size={20} />
        <span>Buxgalter</span>
        {pendingOrdersCount > 0 && (
          <span className="mobile-badge" style={{ background: '#ef4444' }}>{pendingOrdersCount}</span>
        )}
      </button>

      {/* 4. SKLAD */}
      <button 
        className={`mobile-nav-btn ${currentView === 'warehouse' ? 'active' : ''}`}
        onClick={() => onChangeView('warehouse')}
      >
        <Package size={20} />
        <span>Sklad</span>
        {(pendingTransfersCount > 0 || readyToDispatchCount > 0) && (
          <span className="mobile-badge" style={{ background: '#3b82f6' }}>
            {pendingTransfersCount + readyToDispatchCount}
          </span>
        )}
      </button>

      {/* 5. KASSA POS */}
      <button 
        className={`mobile-nav-btn ${currentView === 'pos' ? 'active' : ''}`}
        onClick={() => onChangeView('pos')}
      >
        <ShoppingCart size={20} />
        <span>Kassa POS</span>
      </button>
    </nav>
  );
}
