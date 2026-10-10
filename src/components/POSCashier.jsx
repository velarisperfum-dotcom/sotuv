import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, 
  Banknote, Check, User, ArrowRight,
  Barcode, Layers, Smartphone, Package,
  UserPlus, X, AlertCircle, Sparkles, Scale,
  Upload, Image
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRODUCT_TYPES, MEASURE_UNITS, INITIAL_CUSTOMERS } from '../data/initialData';
import { getIndustryById } from '../data/industriesData';

function playBeepSound(freq = 680) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {}
}

function playSuccessChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
    });
  } catch {}
}

export default function POSCashier({ 
  products, 
  onCompleteSale, 
  currentUser,
  onAddProduct,
  customers = INITIAL_CUSTOMERS,
  storeMode = 'universal',
  onSelectStoreMode
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(storeMode === 'universal' ? 'all' : storeMode);
  const [selectedCategory, setSelectedCategory] = useState('Hammasi');
  const [cart, setCart] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmountCustom, setDiscountAmountCustom] = useState(0);
  const [mobilePosTab, setMobilePosTab] = useState('catalog'); // 'catalog' | 'cart'

  // Variant selector modal state
  const [variantModalProduct, setVariantModalProduct] = useState(null);

  // Selected volume per perfume product (10ml, 20ml, 30ml, 50ml)
  const [selectedVolumes, setSelectedVolumes] = useState({});

  // Weight / Scale modal for Grocery kg products
  const [weightModalProduct, setWeightModalProduct] = useState(null);
  const [customWeightKg, setCustomWeightKg] = useState('1.0');

  // Quick Add Product Modal state
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickProdName, setQuickProdName] = useState('');
  const [quickProdType, setQuickProdType] = useState(storeMode === 'universal' ? 'clothing' : storeMode);
  const [quickProdCategory, setQuickProdCategory] = useState('');
  const [quickProdPrice, setQuickProdPrice] = useState('');
  const [quickProdCostPrice, setQuickProdCostPrice] = useState('');
  const [quickProdStock, setQuickProdStock] = useState('10');
  const [quickProdBarcode, setQuickProdBarcode] = useState('');
  const [quickProdUnit, setQuickProdUnit] = useState('dona');
  const [quickProdImage, setQuickProdImage] = useState('');

  // Rasm faylini qurilmadan yuklash
  const handleQuickImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Rasm hajmi 5MB dan oshmasligi kerak!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setQuickProdImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Checkout modal states
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Naqd'); // 'Naqd', 'Karta', 'Click/Payme', 'Qarz', 'Aralash'
  
  // Customer & CRM
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [useBonusPoints, setUseBonusPoints] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [debtDueDate, setDebtDueDate] = useState('');
  const [debtInitialPaid, setDebtInitialPaid] = useState('');
  
  // Split payment amounts
  const [splitCash, setSplitCash] = useState('');
  const [splitCard, setSplitCard] = useState('');
  const [splitBank, setSplitBank] = useState('');
  const [splitDebt, setSplitDebt] = useState('');

  const barcodeInputRef = useRef(null);

  const activeStoreConfig = getIndustryById(storeMode);

  // Sync selectedType when storeMode prop changes
  useEffect(() => {
    if (storeMode && storeMode !== 'universal') {
      setSelectedType(storeMode);
      setSelectedCategory('Hammasi');
    } else {
      setSelectedType('all');
      setSelectedCategory('Hammasi');
    }
  }, [storeMode]);

  // Helper: Tovar turini aniqlash
  const getProductType = (p) => {
    if (p.productType) return p.productType;
    if (p.prices && (p.prices['10 ml'] || p.volume)) return 'perfume';
    return 'general';
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'clothing': return { label: 'Kiyim', emoji: '👕', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.15)' };
      case 'perfume': return { label: 'Parfyum', emoji: '💎', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
      case 'electronics': return { label: 'Gadjet', emoji: '📱', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' };
      case 'grocery': return { label: 'Oziq-ovqat', emoji: '🛒', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' };
      case 'pharmacy': return { label: 'Dorixona', emoji: '💊', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' };
      case 'autoparts': return { label: 'Avto', emoji: '🚗', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
      case 'building': return { label: 'Qurilish', emoji: '🧱', color: '#d97706', bg: 'rgba(217, 119, 6, 0.15)' };
      case 'shoes': return { label: 'Poyabzal', emoji: '👟', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.15)' };
      default: return { label: 'Tovar', emoji: '📦', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)' };
    }
  };

  // Dinamik kategoriyalar (Do'kon sohasiga xos)
  const dynamicCategories = ['Hammasi', ...Array.from(new Set([
    ...(activeStoreConfig?.categories?.filter(c => c !== 'Hammasi') || []),
    ...products.map(p => p.category).filter(Boolean)
  ]))];

  // Filtrlangan tovarlar
  const filteredProducts = products.filter(p => {
    const pType = getProductType(p);
    const matchesType = selectedType === 'all' || pType === selectedType;
    const matchesCategory = selectedCategory === 'Hammasi' || p.category === selectedCategory;
    
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesType && matchesCategory;

    const matchesSearch = 
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.brand && p.brand.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.barcode && p.barcode.includes(term)) ||
      (p.notes && p.notes.toLowerCase().includes(term));

    return matchesType && matchesCategory && matchesSearch;
  });

  // Shtrix-kod skaner orqali tezkor qo'shish
  const handleBarcodeSubmit = (e) => {
    if (e.key === 'Enter') {
      const term = searchTerm.trim();
      if (!term) return;
      const found = products.find(p => p.barcode === term || (p.barcode && p.barcode.toLowerCase() === term.toLowerCase()));
      if (found) {
        handleProductClick(found);
        setSearchTerm('');
      }
    }
  };

  // Tovar bosilganda: Sohasiga qarab o'ta qulay harakat
  const handleProductClick = (product, explicitVariant = null) => {
    if (product.stock <= 0) {
      alert("Kechirasiz, ushbu tovardan skladda qolmagan!");
      return;
    }

    // Agar variant to'g'ridan-to'g'ri berilgan bo'lsa
    if (explicitVariant) {
      addSingleToCart(product, explicitVariant);
      return;
    }

    // 1. Agar tovar kg bo'yicha tortiladigan bo'lsa (oziq-ovqat / meva-sabzavot)
    if (product.unit === 'kg') {
      setWeightModalProduct(product);
      setCustomWeightKg('1.0');
      return;
    }

    // 2. Agar parfyumeriya bo'lsa va tanlangan hajmi bo'lsa
    if (product.prices && Object.keys(product.prices).length > 0) {
      const chosenVol = selectedVolumes[product.id] || '10 ml';
      const chosenPrice = product.prices[chosenVol] || product.price;
      addSingleToCart(product, {
        variantName: chosenVol,
        price: chosenPrice,
        costPrice: Math.round(chosenPrice * 0.72)
      });
      return;
    }

    // 3. Agar tovar kiyim yoki elektronika bo'lib, uning variants[] massivi bo'lsa
    if (product.variants && product.variants.length > 0) {
      setVariantModalProduct(product);
      return;
    }

    // 4. Oddiy tovar: darhol savatga
    addSingleToCart(product, {
      variantName: product.unit ? `1 ${product.unit}` : '',
      price: product.price,
      costPrice: product.costPrice || Math.round(product.price * 0.7)
    });
  };

  // Savatga yakka tovar / tanlangan variantni qo'shish
  const addSingleToCart = (product, variantOption, qty = 1) => {
    playBeepSound();
    const cartKey = `${product.id}-${variantOption.variantName || 'default'}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartKey === cartKey);
      if (existing) {
        if (existing.quantity + qty > product.stock) {
          alert(`Omborda faqat ${product.stock} dona mavjud!`);
          return prev;
        }
        return prev.map(item => item.cartKey === cartKey ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, {
        id: product.id,
        cartKey,
        name: variantOption.variantName ? `${product.name} (${variantOption.variantName})` : product.name,
        baseName: product.name,
        brand: product.brand,
        variantName: variantOption.variantName || '',
        price: variantOption.price || product.price,
        costPrice: variantOption.costPrice || product.costPrice || Math.round((variantOption.price || product.price) * 0.7),
        unit: product.unit || 'dona',
        productType: getProductType(product),
        image: product.image,
        quantity: qty
      }];
    });

    if (variantModalProduct) setVariantModalProduct(null);
    if (weightModalProduct) setWeightModalProduct(null);
  };

  const updateQuantity = (cartKey, delta) => {
    playBeepSound(delta > 0 ? 720 : 540);
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
  
  let discountAmount = Math.round((subtotal * discountPercent) / 100);
  if (discountAmountCustom > 0) {
    discountAmount = Math.min(subtotal, discountAmountCustom);
  }

  let bonusDiscount = 0;
  if (useBonusPoints && selectedCustomer && selectedCustomer.bonusBalance > 0) {
    bonusDiscount = Math.min(selectedCustomer.bonusBalance, subtotal - discountAmount);
  }

  const finalTotal = Math.max(0, subtotal - discountAmount - bonusDiscount);
  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  // Handle Checkout Submit
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
      storeMode: storeMode,
      storeBrand: activeStoreConfig.brandName,
      items: cart.map(i => ({ 
        id: i.id, 
        name: i.name, 
        variant: i.variantName, 
        quantity: i.quantity, 
        price: i.price, 
        costPrice: i.costPrice,
        productType: i.productType,
        unit: i.unit
      })),
      total: finalTotal,
      subtotal,
      discount: discountAmount + bonusDiscount,
      bonusUsed: bonusDiscount,
      paymentMethod,
      customer: selectedCustomer ? selectedCustomer.name : (customerName || null),
      customerPhone: selectedCustomer ? selectedCustomer.phone : (customerPhone || null),
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
        bank: paymentMethod === 'Click/Payme' ? finalTotal : 0,
        debt: paymentMethod === 'Qarz' ? (finalTotal - (Number(debtInitialPaid) || 0)) : 0
      }
    };

    playSuccessChime();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    onCompleteSale(saleRecord);
    setShowCheckout(false);
    clearCart();
    setSelectedCustomer(null);
    setUseBonusPoints(false);
    setCustomerName('');
    setCustomerPhone('');
    setDebtDueDate('');
    setDebtInitialPaid('');
    setDiscountPercent(0);
    setDiscountAmountCustom(0);
  };

  // Quick Add Product Handler
  const handleSaveQuickProduct = (e) => {
    e.preventDefault();
    if (!quickProdName || !quickProdPrice) {
      alert("Iltimos, mahsulot nomi va sotish narxini kiriting!");
      return;
    }

    const newProd = {
      id: `prd-quick-${Date.now()}`,
      name: quickProdName,
      brand: activeStoreConfig.brandName,
      category: quickProdCategory || 'Boshqa tovarlar',
      productType: quickProdType,
      unit: quickProdUnit || 'dona',
      price: Number(quickProdPrice),
      costPrice: Number(quickProdCostPrice) || Math.round(Number(quickProdPrice) * 0.7),
      stock: Number(quickProdStock) || 10,
      minStock: 2,
      barcode: quickProdBarcode || Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      image: quickProdImage || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
      notes: `${activeStoreConfig.shortName} do'konidan qo'shilgan tovar`
    };

    if (onAddProduct) {
      onAddProduct(newProd);
    }
    setShowQuickAddModal(false);
    addSingleToCart(newProd, { variantName: '', price: newProd.price, costPrice: newProd.costPrice });
  };

  return (
    <div className="pos-page-wrapper">
      {/* Mobile-only toggle tab */}
      <div className="mobile-only-tab-row">
        <button 
          className={`pos-filter-btn ${mobilePosTab === 'catalog' ? 'active' : ''}`}
          style={{ flex: 1, padding: '10px', textAlign: 'center', fontWeight: 700 }}
          onClick={() => setMobilePosTab('catalog')}
        >
          🛍 Katalog ({filteredProducts.length})
        </button>
        <button 
          className={`pos-filter-btn ${mobilePosTab === 'cart' ? 'active' : ''}`}
          style={{ flex: 1, padding: '10px', textAlign: 'center', fontWeight: 700 }}
          onClick={() => setMobilePosTab('cart')}
        >
          🛒 Savatcha ({cart.length})
        </button>
      </div>

      <div className="pos-container">
        {/* Left: Products & BILLZ Filters */}
        <div className={`pos-products ${mobilePosTab === 'cart' ? 'pos-mobile-hidden' : ''}`}>
          
          {/* STORE DEDICATED POS HEADER */}
          <div className="billz-industry-nav" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
              <span style={{ fontSize: '1.3rem' }}>{activeStoreConfig.emoji}</span>
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{activeStoreConfig.name}</strong>
                <span style={{ marginLeft: '8px', fontSize: '0.72rem', color: activeStoreConfig.color, fontWeight: 700, padding: '2px 8px', background: `${activeStoreConfig.color}20`, borderRadius: '12px' }}>
                  Kassa POS
                </span>
              </div>
            </div>

            {/* Quick Add Product Button */}
            <button 
              className="btn btn-sm btn-primary billz-quick-add-btn"
              onClick={() => {
                setQuickProdName('');
                setQuickProdPrice('');
                setQuickProdCostPrice('');
                setQuickProdStock('10');
                setQuickProdImage('');
                setQuickProdBarcode(Math.floor(100000000000 + Math.random() * 900000000000).toString());
                setQuickProdType(activeStoreConfig.specialType || 'general');
                setShowQuickAddModal(true);
              }}
              title="Kassadan chiqmasdan tezkor tovar qo'shish"
            >
              <Plus size={15} /> <span>+ Yangi Tovar</span>
            </button>
          </div>

          {/* Sticky Search & Dynamic Sub-Categories */}
          <div className="pos-sticky-header">
            {/* Search Input Row with Barcode Scanner Indicator */}
            <div className="pos-search-input-wrap">
              <Search size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
              <input 
                ref={barcodeInputRef}
                type="text"
                placeholder={`${activeStoreConfig.shortName} nomi, brendi yoki shtrix-kod skanerlang (Enter)...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleBarcodeSubmit}
                autoFocus
              />
              <div className="barcode-indicator" title="Shtrix-kod skaneri ulangan va faol">
                <Barcode size={16} />
                <span>Skaner</span>
              </div>
              {searchTerm && (
                <button 
                  type="button" 
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  title="Tozalash"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dynamic Sub-Category Pills for this specific store industry */}
            <div className="pos-categories-row">
              {dynamicCategories.map(cat => {
                const count = cat === 'Hammasi'
                  ? filteredProducts.length
                  : products.filter(p => (selectedType === 'all' || getProductType(p) === selectedType) && p.category === cat).length;
                const isActive = selectedCategory === cat;

                return (
                  <button 
                    key={cat}
                    type="button"
                    className={`pos-category-pill ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span className="pill-label">{cat}</span>
                    <span className="pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-catalog-grid">
            {filteredProducts.length === 0 ? (
              <div className="empty-catalog-box">
                <Package size={44} style={{ opacity: 0.3, marginBottom: '10px' }} />
                <h4>Ushbu sohada tovar topilmadi</h4>
                <p>Qidiruv so'zini o'zgartiring yoki yangi tovar qo'shing</p>
                <button 
                  className="btn btn-sm btn-primary" 
                  style={{ marginTop: '12px' }}
                  onClick={() => setShowQuickAddModal(true)}
                >
                  <Plus size={14} /> Yangi tovar qo'shish
                </button>
              </div>
            ) : (
              filteredProducts.map(product => {
                const pType = getProductType(product);
                const badge = getTypeBadge(pType);
                const inCartItems = cart.filter(i => i.id === product.id);
                const totalInCart = inCartItems.reduce((acc, i) => acc + i.quantity, 0);
                const isLowStock = product.stock <= (product.minStock || 3);
                
                // Perfume volume logic
                const isPerfume = pType === 'perfume' && product.prices && Object.keys(product.prices).length > 0;
                const currentVol = selectedVolumes[product.id] || '10 ml';
                const currentPrice = isPerfume ? (product.prices[currentVol] || product.price) : product.price;

                return (
                  <div 
                    key={product.id}
                    className="billz-product-card"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="card-thumb-wrap">
                      <img src={product.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80'} alt={product.name} className="card-thumb-img" />
                      
                      {/* Product Type Tag */}
                      <span className="product-type-badge" style={{ color: badge.color, background: badge.bg }}>
                        <span>{badge.emoji}</span> {badge.label}
                      </span>

                      {/* Stock Tag */}
                      <span className={`stock-tag ${isLowStock ? 'low' : ''}`}>
                        {product.stock > 0 ? `${product.stock} ${product.unit || 'dona'}` : 'Tugagan'}
                      </span>

                      {totalInCart > 0 && (
                        <div className="in-cart-counter">
                          ✓ {totalInCart}
                        </div>
                      )}
                    </div>

                    <div className="card-body">
                      <div className="card-brand">{product.brand || 'Universal'}</div>
                      <div className="card-title" title={product.name}>{product.name}</div>
                      
                      <div className="card-meta-row">
                        <span className="card-category">{product.category || 'Tovarlar'}</span>
                        {product.barcode && (
                          <span className="card-barcode" title={product.barcode}>
                            #{product.barcode.slice(-4)}
                          </span>
                        )}
                      </div>

                      {/* 1. AGAR PARFYUM BO'LSA: KARTADA TEZKOR 10ml, 20ml, 30ml, 50ml TANLASH TUGMALARI */}
                      {isPerfume && (
                        <div 
                          className="perfume-vol-pills-row"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {['10 ml', '20 ml', '30 ml', '50 ml'].map(vol => {
                            const isVolActive = currentVol === vol;
                            return (
                              <button
                                key={vol}
                                type="button"
                                className={`vol-mini-btn ${isVolActive ? 'active' : ''}`}
                                onClick={() => setSelectedVolumes(prev => ({ ...prev, [product.id]: vol }))}
                              >
                                {vol}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 2. AGAR KIYIM BO'LSA VA VARIANTLARI BO'LSA */}
                      {pType === 'clothing' && product.variants && product.variants.length > 0 && (
                        <div className="clothing-variants-hint">
                          {product.variants.slice(0, 3).map(v => (
                            <span key={v.id} className="size-badge-pill">{v.size || v.name}</span>
                          ))}
                          {product.variants.length > 3 && <span className="size-badge-more">+{product.variants.length - 3}</span>}
                        </div>
                      )}

                      {/* 3. AGAR ELEKTRONIKA BO'LSA: KAFOLAT NISHOI */}
                      {pType === 'electronics' && product.warranty && (
                        <div className="tech-warranty-pill">
                          🛡️ Kafolat: {product.warranty}
                        </div>
                      )}

                      {/* 4. AGAR OZIQ-OVQAT (KG) BO'LSA: VAZN NISHOI */}
                      {pType === 'grocery' && product.unit === 'kg' && (
                        <div className="grocery-weight-pill">
                          <Scale size={11} /> 1 kg narxi
                        </div>
                      )}

                      {/* 5. AGAR DORIXONA BO'LSA: MUDDAT VA DOZA */}
                      {product.expiryDate && (
                        <div style={{ fontSize: '0.68rem', color: '#f472b6', fontWeight: 700, margin: '3px 0' }}>
                          📅 {product.expiryDate} {product.dosage ? `• ${product.dosage}` : ''}
                        </div>
                      )}

                      {/* Price Row */}
                      <div className="card-price-row">
                        <div>
                          <div className="card-price">{formatMoney(currentPrice)}</div>
                          {isPerfume && (
                            <span className="card-variant-hint">
                              ({currentVol})
                            </span>
                          )}
                        </div>

                        <button 
                          className="card-quick-add-btn" 
                          title="Savatga qo'shish"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: BILLZ POS Cart & Checkout */}
        <div className={`pos-cart ${mobilePosTab === 'catalog' ? 'pos-mobile-hidden' : ''}`}>
          
          {/* Cart Header */}
          <div className="cart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Kassa Savati</h3>
              <span className="cart-count-pill">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
            </div>

            {cart.length > 0 && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={clearCart}
                style={{ color: 'var(--danger)', borderColor: 'rgba(244,63,94,0.3)', padding: '4px 8px' }}
                title="Savatni tozalash"
              >
                <Trash2 size={13} /> Tozalash
              </button>
            )}
          </div>

          {/* CRM / Customer Bar in Cart */}
          <div className="cart-customer-selector">
            {selectedCustomer ? (
              <div className="selected-customer-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="customer-avatar">
                    <User size={14} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                      {selectedCustomer.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {selectedCustomer.phone} • Keshbek: <strong style={{ color: 'var(--gold)' }}>{formatMoney(selectedCustomer.bonusBalance)}</strong>
                    </div>
                  </div>
                </div>

                <button 
                  className="customer-remove-btn" 
                  onClick={() => { setSelectedCustomer(null); setUseBonusPoints(false); }}
                  title="Mijozni olib tashlash"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="customer-search-row">
                <User size={15} color="var(--text-sub)" />
                <input 
                  type="text" 
                  placeholder="Mijozni qidirish (CRM / Telefon)..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                {customerSearch && (
                  <div className="customer-dropdown-results">
                    {customers
                      .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch))
                      .map(c => (
                        <div 
                          key={c.id} 
                          className="customer-dropdown-item"
                          onClick={() => {
                            setSelectedCustomer(c);
                            setCustomerSearch('');
                          }}
                        >
                          <div>
                            <strong>{c.name}</strong>
                            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-sub)' }}>{c.phone}</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700 }}>
                            {formatMoney(c.bonusBalance)}
                          </span>
                        </div>
                      ))}
                    <div 
                      className="customer-dropdown-item add-new"
                      onClick={() => {
                        setSelectedCustomer({
                          id: `c-${Date.now()}`,
                          name: customerSearch,
                          phone: '+998 ',
                          bonusBalance: 0
                        });
                        setCustomerSearch('');
                      }}
                    >
                      <UserPlus size={14} /> Yangi mijoz sifatida tanlash
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bonus check toggle */}
            {selectedCustomer && selectedCustomer.bonusBalance > 0 && (
              <label className="bonus-toggle-label">
                <input 
                  type="checkbox" 
                  checked={useBonusPoints} 
                  onChange={(e) => setUseBonusPoints(e.target.checked)} 
                />
                <span>Mavjud bonusdan foydalanish ({formatMoney(selectedCustomer.bonusBalance)})</span>
              </label>
            )}
          </div>

          {/* Cart Items List */}
          <div className="cart-items-list">
            {cart.length === 0 ? (
              <div className="empty-cart-view">
                <ShoppingCart size={44} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ fontWeight: 700, color: 'var(--text-main)' }}>Kassa savati bo'sh</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                  {activeStoreConfig.shortName} tovarlarini tanlang yoki shtrix-kodni skaner qiling
                </p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.cartKey} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">
                      {formatMoney(item.price)} <span style={{ color: 'var(--text-sub)', fontSize: '0.75rem' }}>/ {item.unit || 'dona'}</span>
                    </div>
                  </div>

                  <div className="cart-qty-ctrl">
                    <button className="cart-qty-btn" onClick={() => updateQuantity(item.cartKey, -1)}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontWeight: 800, minWidth: '22px', textAlign: 'center', fontSize: '0.88rem' }}>
                      {item.quantity}
                    </span>
                    <button className="cart-qty-btn" onClick={() => updateQuantity(item.cartKey, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '70px' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fff' }}>
                      {formatMoney(item.price * item.quantity)}
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.cartKey)}
                    className="cart-item-del-btn"
                    title="O'chirish"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary & Checkout Bar */}
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-subtotal-row">
                <span>Oraliq summa:</span>
                <span>{formatMoney(subtotal)}</span>
              </div>

              {/* Discount pills */}
              <div className="cart-discount-controls">
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Chegirma:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 5, 10, 15].map(p => (
                    <button 
                      key={p} 
                      className={`btn btn-sm ${discountPercent === p && discountAmountCustom === 0 ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '3px 7px', fontSize: '0.74rem' }}
                      onClick={() => { setDiscountPercent(p); setDiscountAmountCustom(0); }}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>

              {discountAmount > 0 && (
                <div className="cart-discount-result-row">
                  <span>Chegirma summasi:</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 700 }}>-{formatMoney(discountAmount)}</span>
                </div>
              )}

              {bonusDiscount > 0 && (
                <div className="cart-discount-result-row">
                  <span>Keshbek bonusi:</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 700 }}>-{formatMoney(bonusDiscount)}</span>
                </div>
              )}

              <div className="cart-total-row">
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)', display: 'block' }}>Jami to'lov</span>
                  <span className="cart-total-num">{formatMoney(finalTotal)}</span>
                </div>

                <button 
                  className="btn btn-primary btn-checkout-trigger"
                  onClick={() => setShowCheckout(true)}
                >
                  <span>To'lovga o'tish</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weight Modal for Supermarket (kg tovarlar uchun) */}
      {weightModalProduct && (
        <div className="modal-backdrop" onClick={() => setWeightModalProduct(null)}>
          <div className="modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>⚖️ Tarozi & Og'irlik (kg)</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{weightModalProduct.name}</p>
              </div>
              <button className="modal-close" onClick={() => setWeightModalProduct(null)}>✕</button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1 kg narxi:</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>
                  {formatMoney(weightModalProduct.price)}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Og'irlikni kiriting (kg):</label>
                <input 
                  type="number" 
                  step="0.05"
                  className="form-input" 
                  style={{ fontSize: '1.2rem', textAlign: 'center', fontWeight: 800 }}
                  value={customWeightKg}
                  onChange={(e) => setCustomWeightKg(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Quick weight shortcuts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '16px' }}>
                {['0.5', '1.0', '1.5', '2.0'].map(kgVal => (
                  <button
                    key={kgVal}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setCustomWeightKg(kgVal)}
                  >
                    {kgVal} kg
                  </button>
                ))}
              </div>

              <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Jami summa: </span>
                <strong style={{ fontSize: '1.1rem', color: '#fff' }}>
                  {formatMoney(Math.round(weightModalProduct.price * (Number(customWeightKg) || 0)))}
                </strong>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setWeightModalProduct(null)}>
                  Bekor qilish
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ flex: 2 }}
                  onClick={() => {
                    const weightVal = Number(customWeightKg) || 1;
                    addSingleToCart(weightModalProduct, {
                      variantName: `${weightVal} kg`,
                      price: Math.round(weightModalProduct.price * weightVal),
                      costPrice: Math.round((weightModalProduct.costPrice || weightModalProduct.price * 0.7) * weightVal)
                    }, 1);
                  }}
                >
                  Savatga Qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BILLZ Variant Selector Modal (Kiyim razmer/ranglari va Elektronika variantlari) */}
      {variantModalProduct && (
        <div className="modal-backdrop" onClick={() => setVariantModalProduct(null)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Variantni tanlang</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {variantModalProduct.name} ({variantModalProduct.brand})
                </p>
              </div>
              <button className="modal-close" onClick={() => setVariantModalProduct(null)}>✕</button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <img 
                  src={variantModalProduct.image} 
                  alt="" 
                  style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} 
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{variantModalProduct.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                    Toifa: {variantModalProduct.category} • Omborda: {variantModalProduct.stock} {variantModalProduct.unit || 'dona'}
                  </div>
                </div>
              </div>

              {/* 1. Agar Tovarda variants[] massivi bo'lsa (Kiyim yoki Elektronika) */}
              {variantModalProduct.variants && variantModalProduct.variants.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Mavjud o'lcham va variantlar:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                    {variantModalProduct.variants.map(v => (
                      <button
                        key={v.id}
                        type="button"
                        className="variant-pick-card"
                        onClick={() => addSingleToCart(variantModalProduct, {
                          variantName: v.name,
                          price: v.price || variantModalProduct.price,
                          costPrice: v.costPrice || variantModalProduct.costPrice
                        })}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>{v.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, marginTop: '4px' }}>
                          {formatMoney(v.price || variantModalProduct.price)}
                        </div>
                        {v.stock && (
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-sub)', marginTop: '2px' }}>
                            {v.stock} dona qoldi
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Product Modal */}
      {showQuickAddModal && (
        <div className="modal-backdrop" onClick={() => setShowQuickAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>⚡ Tezkor Yangi Tovar Qo'shish</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {activeStoreConfig.shortName} do'koniga darhol mahsulot qo'shish
                </p>
              </div>
              <button className="modal-close" onClick={() => setShowQuickAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveQuickProduct} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Tovar Turi:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {PRODUCT_TYPES.filter(t => t.id !== 'all').map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className={`btn btn-sm ${quickProdType === t.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.74rem', padding: '6px' }}
                      onClick={() => {
                        setQuickProdType(t.id);
                        if (t.id === 'clothing') setQuickProdCategory('Kiyim-kechak');
                        if (t.id === 'electronics') setQuickProdCategory('Elektronika');
                        if (t.id === 'grocery') setQuickProdCategory('Oziq-ovqat');
                        if (t.id === 'perfume') setQuickProdCategory('Parfyumeriya');
                      }}
                    >
                      {t.emoji} {t.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="form-label">Tovar Nomi *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Masalan: Zara Kofta, iPhone 15, Cola 1.5L..." 
                  value={quickProdName} 
                  onChange={(e) => setQuickProdName(e.target.value)} 
                  required 
                  autoFocus 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="form-label">Sotish Narxi (so'm) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="250000" 
                    value={quickProdPrice} 
                    onChange={(e) => setQuickProdPrice(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Tannarxi (so'm)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="180000" 
                    value={quickProdCostPrice} 
                    onChange={(e) => setQuickProdCostPrice(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="form-label">Ombordagi Soni</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={quickProdStock} 
                    onChange={(e) => setQuickProdStock(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="form-label">O'lchov Birligi</label>
                  <select 
                    className="form-input"
                    value={quickProdUnit}
                    onChange={(e) => setQuickProdUnit(e.target.value)}
                  >
                    {MEASURE_UNITS.map(u => (
                      <option key={u.id} value={u.id}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label className="form-label">Shtrix-kod (EAN-13)</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={quickProdBarcode} 
                    onChange={(e) => setQuickProdBarcode(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuickProdBarcode(Math.floor(100000000000 + Math.random() * 900000000000).toString())}
                  >
                    🎲 Yangilash
                  </button>
                </div>
              </div>

              {/* Quick Add Image from device */}
              <div style={{ marginBottom: '18px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Image size={14} color="var(--primary)" />
                  <span>Tovar Rasmi (Qurilmadan yuklash):</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px dashed var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {quickProdImage ? (
                      <img src={quickProdImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={20} color="var(--text-sub)" />
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label className="btn btn-sm btn-secondary" style={{ cursor: 'pointer', padding: '5px 10px', fontSize: '0.78rem' }}>
                      <Upload size={13} /> <span>📁 Qurilmadan tanlash</span>
                      <input type="file" accept="image/*" onChange={handleQuickImageFile} style={{ display: 'none' }} />
                    </label>
                    {quickProdImage && (
                      <button 
                        type="button" 
                        className="btn btn-sm btn-secondary" 
                        style={{ color: 'var(--danger)', padding: '5px 8px' }} 
                        onClick={() => setQuickProdImage('')}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowQuickAddModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary">
                  Saqlash va Savatga solish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BILLZ Checkout & Payment Modal */}
      {showCheckout && (
        <div className="modal-backdrop" onClick={() => setShowCheckout(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>To'lovni Qabul Qilish</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Do'kon: <strong>{activeStoreConfig.brandName}</strong> • Jami: <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>{formatMoney(finalTotal)}</strong>
                </p>
              </div>
              <button className="modal-close" onClick={() => setShowCheckout(false)}>✕</button>
            </div>

            <div style={{ padding: '20px' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>To'lov Usulini Tanlang:</label>
              <div className="checkout-methods-grid">
                {[
                  { id: 'Naqd', label: 'Naqd Pul', icon: Banknote, color: 'var(--success)' },
                  { id: 'Karta', label: 'Plastik Karta', icon: CreditCard, color: 'var(--primary)' },
                  { id: 'Click/Payme', label: 'Click / Payme', icon: Smartphone, color: 'var(--info)' },
                  { id: 'Qarz', label: 'Qarz (Nasiya)', icon: Package, color: 'var(--gold)' },
                  { id: 'Aralash', label: 'Aralash To\'lov', icon: Layers, color: '#a855f7' }
                ].map(m => {
                  const Icon = m.icon;
                  const isActive = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      className={`payment-method-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(m.id)}
                    >
                      <Icon size={20} color={isActive ? '#fff' : m.color} />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Debt Details */}
              {paymentMethod === 'Qarz' && (
                <div className="debt-details-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px' }}>
                    <AlertCircle size={16} /> Nasiya Daftari Ma'lumotlari
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label className="form-label">Mijoz Ismi *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Dilshod Ergashev" 
                        value={customerName || (selectedCustomer ? selectedCustomer.name : '')} 
                        onChange={(e) => setCustomerName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="form-label">Telefon Raqami *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="+998 90 123 45 67" 
                        value={customerPhone || (selectedCustomer ? selectedCustomer.phone : '')} 
                        onChange={(e) => setCustomerPhone(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">Boshlang'ich to'lov (so'm)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="0" 
                        value={debtInitialPaid} 
                        onChange={(e) => setDebtInitialPaid(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="form-label">Qaytarish muddati</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={debtDueDate} 
                        onChange={(e) => setDebtDueDate(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Split Payment */}
              {paymentMethod === 'Aralash' && (
                <div className="debt-details-box">
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                    Har bir to'lov turi bo'yicha summani kiriting:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">Naqd pul:</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="0" 
                        value={splitCash} 
                        onChange={(e) => setSplitCash(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="form-label">Karta (Terminal):</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="0" 
                        value={splitCard} 
                        onChange={(e) => setSplitCard(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="form-label">Click / Payme:</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="0" 
                        value={splitBank} 
                        onChange={(e) => setSplitBank(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="form-label">Qarz (Nasiya):</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="0" 
                        value={splitDebt} 
                        onChange={(e) => setSplitDebt(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }} 
                  onClick={() => setShowCheckout(false)}
                >
                  Bekor qilish
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ flex: 2, padding: '12px', fontSize: '0.95rem' }} 
                  onClick={handleCheckoutSubmit}
                >
                  <Check size={18} /> Chek chiqarish va Sotuvni yakunlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
