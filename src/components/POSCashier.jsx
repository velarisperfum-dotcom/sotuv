import React, { useState } from 'react';
import { 
  Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, 
  Banknote, Building2, Clock, Check, Sparkles, User, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function POSCashier({ 
  products, 
  onCompleteSale, 
  currentUser 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hammasi');
  const [cart, setCart] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  
  // Checkout modal states
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Naqd'); // 'Naqd', 'Karta', 'Bank perech', 'Qarz', 'Aralash'
  
  // Debt / Customer inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [debtDueDate, setDebtDueDate] = useState('');
  const [debtInitialPaid, setDebtInitialPaid] = useState('');
  
  // Split payment amounts
  const [splitCash, setSplitCash] = useState('');
  const [splitCard, setSplitCard] = useState('');
  const [splitBank, setSplitBank] = useState('');
  const [splitDebt, setSplitDebt] = useState('');

  // Selected volume per product: { [productId]: '10 ml' | '20 ml' | '30 ml' | '50 ml' }
  const [selectedVolumes, setSelectedVolumes] = useState({});

  const categories = ['Hammasi', 'Erkaklar', 'Ayollar', 'Unisex'];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'Hammasi' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.barcode && p.barcode.includes(searchTerm));
    return matchesCat && matchesSearch;
  });

  // Cart operations with Volume selection (10ml, 20ml, 30ml, 50ml)
  const addToCart = (product, customVol = null) => {
    if (product.stock <= 0) {
      alert("Kechirasiz, ushbu atir skladida qolmagan!");
      return;
    }
    const chosenVol = customVol || selectedVolumes[product.id] || '10 ml';
    const chosenPrice = (product.prices && product.prices[chosenVol]) || product.price;
    const cartKey = `${product.id}-${chosenVol}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartKey === cartKey);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Omborda faqat ${product.stock} dona mavjud!`);
          return prev;
        }
        return prev.map(item => item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        ...product, 
        cartKey,
        name: `${product.name} (${chosenVol})`,
        baseName: product.name,
        volume: chosenVol,
        price: chosenPrice,
        costPrice: Math.round(chosenPrice * 0.72),
        quantity: 1 
      }];
    });
  };

  const updateQuantity = (cartKey, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartKey === cartKey) {
        const product = products.find(p => p.id === item.id);
        const newQty = item.quantity + delta;
        if (product && newQty > product.stock) {
          alert(`Omborda faqat ${product.stock} dona bor!`);
          return item;
        }
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (cartKey) => {
    setCart(prev => prev.filter(item => item.cartKey !== cartKey));
  };

  const clearCart = () => setCart([]);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  // Handle finalize sale
  const handleCheckoutSubmit = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'Qarz' && (!customerName || !customerPhone)) {
      alert("Nasiya / Qarz uchun mijoz ismi va telefon raqami kiritilishi shart!");
      return;
    }

    const saleRecord = {
      id: `SL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString('uz-UZ', { 
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
      }),
      cashierName: currentUser?.name || 'Sotuvchi',
      items: cart.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price, costPrice: i.costPrice })),
      total: finalTotal,
      subtotal,
      discount: discountAmount,
      paymentMethod,
      customer: customerName || null,
      customerPhone: customerPhone || null,
      debtDetails: paymentMethod === 'Qarz' ? {
        totalAmount: finalTotal,
        paidAmount: Number(debtInitialPaid) || 0,
        remainingAmount: finalTotal - (Number(debtInitialPaid) || 0),
        dueDate: debtDueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
      } : null,
      paymentBreakdown: paymentMethod === 'Aralash' ? {
        cash: Number(splitCash) || 0,
        card: Number(splitCard) || 0,
        bank: Number(splitBank) || 0,
        debt: Number(splitDebt) || 0
      } : {
        cash: paymentMethod === 'Naqd' ? finalTotal : 0,
        card: paymentMethod === 'Karta' ? finalTotal : 0,
        bank: paymentMethod === 'Bank perech' ? finalTotal : 0,
        debt: paymentMethod === 'Qarz' ? (finalTotal - (Number(debtInitialPaid) || 0)) : 0
      }
    };

    // Confetti effect
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    onCompleteSale(saleRecord);
    setShowCheckout(false);
    clearCart();
    setCustomerName('');
    setCustomerPhone('');
    setDebtDueDate('');
    setDebtInitialPaid('');
  };

  return (
    <div className="pos-container">
      {/* Left: Products & Filter */}
      <div className="pos-products">
        {/* Search & Barcode Scan */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="header-search" style={{ width: '100%' }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text"
              placeholder="Atir nomi, brend yoki shtrix-kodni skanerlang / qidiring..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Categories Chips */}
        <div className="pos-filters">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`pos-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className="products-catalog-grid">
          {filteredProducts.map(product => {
            const inCartItem = cart.find(i => i.id === product.id);
            const currentVol = selectedVolumes[product.id] || '10 ml';
            const currentPrice = (product.prices && product.prices[currentVol]) || product.price;
            const inCartItems = cart.filter(i => i.id === product.id);
            const totalInCart = inCartItems.reduce((acc, i) => acc + i.quantity, 0);

            return (
              <div 
                key={product.id}
                className="perfume-card"
                onClick={() => addToCart(product, currentVol)}
              >
                <div className="perfume-img-wrap">
                  <img src={product.image} alt={product.name} className="perfume-img" />
                  <span className={`stock-tag ${isLowStock ? 'low' : ''}`}>
                    {product.stock > 0 ? `${product.stock} dona` : 'Tugagan'}
                  </span>
                  {totalInCart > 0 && (
                    <div style={{
                      position: 'absolute', bottom: '8px', right: '8px',
                      background: 'var(--primary)', color: '#fff',
                      borderRadius: '999px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800
                    }}>
                      Savatda: {totalInCart}
                    </div>
                  )}
                </div>

                <div className="perfume-brand">{product.brand}</div>
                <div className="perfume-name">{product.name}</div>
                <div className="perfume-meta">
                  <span style={{ color: 'var(--gold)' }}>{product.category}</span>
                  <span>•</span>
                  <span>{product.concentration || 'Parfum'}</span>
                </div>

                {/* 10ml, 20ml, 30ml, 50ml hajmlar tanlash tugmalari */}
                <div 
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', margin: '6px 0 8px' }} 
                  onClick={(e) => e.stopPropagation()}
                >
                  {['10 ml', '20 ml', '30 ml', '50 ml'].map(vol => {
                    const isVolActive = currentVol === vol;
                    return (
                      <button
                        key={vol}
                        type="button"
                        style={{
                          padding: '4px 2px',
                          borderRadius: '6px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          textAlign: 'center',
                          border: isVolActive ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                          background: isVolActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                          color: isVolActive ? '#fff' : 'var(--text-muted)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onClick={() => setSelectedVolumes(prev => ({ ...prev, [product.id]: vol }))}
                        title={`${vol} narxi: ${formatMoney(product.prices?.[vol] || product.price)}`}
                      >
                        {vol}
                      </button>
                    );
                  })}
                </div>

                <div className="perfume-price">
                  {formatMoney(currentPrice)}
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-sub)', fontWeight: 500, marginLeft: '4px' }}>
                    ({currentVol})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Cart & Quick Checkout */}
      <div className="pos-cart">
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Savatcha</h3>
          </div>
          {cart.length > 0 && (
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={clearCart}
              style={{ color: 'var(--danger)', borderColor: 'rgba(244,63,94,0.3)' }}
            >
              <Trash2 size={14} /> Tozalash
            </button>
          )}
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-sub)' }}>
              <ShoppingCart size={44} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontWeight: 600 }}>Savatcha bo'sh</p>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Hajmni tanlab mahsulot ustiga bosing</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartKey} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{item.volume}</span> • {formatMoney(item.price)}
                  </div>
                </div>

                <div className="cart-qty-ctrl">
                  <button className="cart-qty-btn" onClick={() => updateQuantity(item.cartKey, -1)}>
                    <Minus size={12} />
                  </button>
                  <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                    {item.quantity}
                  </span>
                  <button className="cart-qty-btn" onClick={() => updateQuantity(item.cartKey, 1)}>
                    <Plus size={12} />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.cartKey)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Oraliq summa:</span>
              <span>{formatMoney(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Chegirma (%):</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 5, 10, 15].map(p => (
                  <button 
                    key={p} 
                    className={`btn btn-sm ${discountPercent === p ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    onClick={() => setDiscountPercent(p)}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>

            <div className="cart-total-row">
              <span className="cart-total-label">Jami to'lov:</span>
              <span className="cart-total-sum">{formatMoney(finalTotal)}</span>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 800 }}
              onClick={() => setShowCheckout(true)}
            >
              To'lovni qabul qilish <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal with exact payment options from notebook */}
      {showCheckout && (
        <div className="modal-backdrop" onClick={() => setShowCheckout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>To'lovni amalga oshirish</h3>
              <button className="cart-qty-btn" onClick={() => setShowCheckout(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>To'lanishi kerak:</span>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: '4px' }}>
                  {formatMoney(finalTotal)}
                </div>
              </div>

              {/* Oplata turlari (rasmdagidek) */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ marginBottom: '10px' }}>Oplata turlari (To'lov usuli):</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <button 
                    className={`btn ${paymentMethod === 'Naqd' ? 'btn-success' : 'btn-secondary'}`}
                    style={{ padding: '14px', justifyContent: 'flex-start' }}
                    onClick={() => setPaymentMethod('Naqd')}
                  >
                    <Banknote size={20} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700 }}>Naqd pul</div>
                      <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Kassa orqali</div>
                    </div>
                  </button>

                  <button 
                    className={`btn ${paymentMethod === 'Karta' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '14px', justifyContent: 'flex-start' }}
                    onClick={() => setPaymentMethod('Karta')}
                  >
                    <CreditCard size={20} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700 }}>Karta (Terminal)</div>
                      <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Uzcard / Humo / Visa</div>
                    </div>
                  </button>

                  <button 
                    className={`btn ${paymentMethod === 'Bank perech' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '14px', justifyContent: 'flex-start', background: paymentMethod === 'Bank perech' ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : undefined }}
                    onClick={() => setPaymentMethod('Bank perech')}
                  >
                    <Building2 size={20} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700 }}>Bank perech</div>
                      <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Perechisleniye / Hisob</div>
                    </div>
                  </button>

                  <button 
                    className={`btn ${paymentMethod === 'Qarz' ? 'btn-gold' : 'btn-secondary'}`}
                    style={{ padding: '14px', justifyContent: 'flex-start' }}
                    onClick={() => setPaymentMethod('Qarz')}
                  >
                    <Clock size={20} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700 }}>Qarz (Nasiya)</div>
                      <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Qarz daftariga yozish</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Conditional forms based on payment method */}
              {paymentMethod === 'Qarz' && (
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} /> Nasiya / Qarz tafsilotlari
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mijoz to'liq ismi *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Masalan: Dilshod Ergashev" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefon raqami *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="+998 90 123 45 67" 
                      value={customerPhone} 
                      onChange={(e) => setCustomerPhone(e.target.value)} 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Boshlang'ich to'lov (so'm)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="0" 
                        value={debtInitialPaid} 
                        onChange={(e) => setDebtInitialPaid(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Qaytarish muddati</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={debtDueDate} 
                        onChange={(e) => setDebtDueDate(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Bank perech' && (
                <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--info)', marginBottom: '8px' }}>
                    Bank o'tkazmasi (Perechisleniye)
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    To'lov tashkilotning bank hisob raqamiga o'tkaziladi. Shartnoma yoki hisob-faktura asosida.
                  </p>
                  <div className="form-group" style={{ marginTop: '10px' }}>
                    <label className="form-label">Kompaniya yoki Mijoz nomi</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="MCHJ yoki F.I.Sh" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)} 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCheckout(false)}>
                Bekor qilish
              </button>
              <button className="btn btn-primary" onClick={handleCheckoutSubmit}>
                <Check size={18} /> To'lovni tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
