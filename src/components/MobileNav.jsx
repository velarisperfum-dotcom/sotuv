import React from 'react';
import { ShoppingCart, BarChart3, Package, Calculator, Crown } from 'lucide-react';

export default function MobileNav({ 
  currentView, 
  onChangeView, 
  lowStockCount, 
  pendingDebtsCount,
  cartCount 
}) {
  return (
    <nav className="mobile-bottom-nav">
      <button 
        className={`mobile-nav-btn ${currentView === 'pos' ? 'active' : ''}`}
        onClick={() => onChangeView('pos')}
      >
        <ShoppingCart size={20} />
        <span>Kassa POS</span>
        {cartCount > 0 && <span className="mobile-badge" style={{ background: 'var(--primary)' }}>{cartCount}</span>}
      </button>

      <button 
        className={`mobile-nav-btn ${currentView === 'director' ? 'active' : ''}`}
        onClick={() => onChangeView('director')}
      >
        <Crown size={20} />
        <span>Direktor</span>
      </button>

      <button 
        className={`mobile-nav-btn ${currentView === 'warehouse' ? 'active' : ''}`}
        onClick={() => onChangeView('warehouse')}
      >
        <Package size={20} />
        <span>Sklad</span>
        {lowStockCount > 0 && <span className="mobile-badge">{lowStockCount}</span>}
      </button>

      <button 
        className={`mobile-nav-btn ${currentView === 'accounting' ? 'active' : ''}`}
        onClick={() => onChangeView('accounting')}
      >
        <Calculator size={20} />
        <span>Moliya</span>
        {pendingDebtsCount > 0 && <span className="mobile-badge" style={{ background: 'var(--gold)' }}>{pendingDebtsCount}</span>}
      </button>
    </nav>
  );
}
