import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Plus, Minus, Trash2, Send, CheckCircle2, 
  Clock, AlertCircle, Smartphone, User, Phone, DollarSign, 
  CreditCard, Building2, UserCheck, ChevronRight, Sparkles,
  ArrowRight, ShieldCheck, Box, RefreshCw, X, FileText, Check,
  Banknote, Scan
} from 'lucide-react';
import { PAYMENT_METHODS } from '../data/initialData';
import LanguageToggle from './LanguageToggle';
import ThemeToggleButton from './ThemeToggleButton';
import BarcodeScannerModal from './BarcodeScannerModal';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function SellerMobileView({ 
  products = [], 
  orders = [], 
  staff = [], 
  customers = [],
  onCreateOrder,
  onOpenReceipt,
  onOpenInstallModal,
  storeMode = 'universal'
}) {
  const { t, lang } = useLang();
  const { playSound } = useTheme();
  const [showScanner, setShowScanner] = useState(false);
  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeStaff = Array.isArray(staff) ? staff.filter(s => s?.role && s.role.toLowerCase().includes('sotuvchi')) : [];
  
  // Active seller state
  const [selectedSeller, setSelectedSeller] = useState(() => {
    return safeStaff[0] || { id: 'emp-4', name: 'Jasur Qodirov', phone: '+998 99 888 77 66' };
  });

  // Mobile Active Tab: 'catalog' | 'cart' | 'my_orders' | 'stats'
  const [activeTab, setActiveTab] = useState('catalog');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hammasi');

  // Cart State
  const [cartItems, setCartItems] = useState([]);

  // Customer & Payment Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // cash, card, debt, bank, salary_deduction
  const [paymentDetails, setPaymentDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const formatMoney = (val) => Number(val || 0).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ') + " " + t('currency');

  // Categories
  const categories = ['all', ...new Set(safeProducts.map(p => p.category).filter(Boolean))];

  // Filtered Products
  const filteredProducts = safeProducts.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.barcode || '').includes(searchTerm);
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Cart operations
  const addToCart = (product) => {
    if ((product.stock || 0) <= 0) {
      alert("Bu tovardan skladda hozircha qolmagan!");
      return;
    }
    playSound('success');
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= (product.stock || 0)) {
          alert(`Skladda jami ${product.stock} dona mavjud!`);
          return prev;
        }
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price || 0,
        costPrice: product.costPrice || 0,
        stock: product.stock || 0,
        unit: product.unit || 'dona',
        image: product.image,
        quantity: 1,
        total: product.price || 0
      }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.stock) {
            alert(`Skladda ortiq tovar yo'q! Maksimal: ${item.stock} dona`);
            return item;
          }
          return { ...item, quantity: newQty, total: newQty * item.price };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  // BARCODE SCANNER PISTOL LISTENER (SOTUVCHI UCHUN):
  // Skaner pistoletidan kelgan shtrix-kodni inputlarni buzmasdan to'g'ridan-to'g'ri savatga qo'shadi!
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = 0;
    let initialTarget = null;
    let initialTargetValue = '';
    let isScannerSequence = false;
    let finishTimeout = null;

    const onKeyDown = (e) => {
      const now = Date.now();
      const diff = now - lastKeyTime;
      lastKeyTime = now;

      if (e.key === 'Enter') {
        if (isScannerSequence || buffer.length >= 3) {
          e.preventDefault();
          e.stopPropagation();

          const scannedCode = buffer.trim();
          if (scannedCode.length >= 3) {
            const matched = safeProducts.find(p => (p.barcode || '').trim() === scannedCode);
            if (matched) {
              addToCart(matched);
            } else {
              setSearchTerm(scannedCode);
            }
          }
          buffer = '';
          isScannerSequence = false;
          initialTarget = null;
          return;
        }
      }

      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Skaner pistoleti tezligi (<= 45ms)
      if (diff <= 45) {
        isScannerSequence = true;
        buffer += e.key;

        // Agar foydalanuvchi mijoz ismi, telefon yoki qidiruv inputida turgan bo'lsa:
        if (e.target && ('value' in e.target)) {
          e.preventDefault();
          e.stopPropagation();

          // Birinchi harf o'tib ketgan bo'lsa uni tozalaymiz
          if (initialTarget && initialTarget === e.target) {
            initialTarget.value = initialTargetValue;
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
            if (nativeSetter) {
              nativeSetter.call(initialTarget, initialTargetValue);
            }
            initialTarget.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      } else {
        buffer = e.key;
        isScannerSequence = false;
        initialTarget = e.target;
        initialTargetValue = e.target && 'value' in e.target ? e.target.value : '';
      }

      clearTimeout(finishTimeout);
      finishTimeout = setTimeout(() => {
        if (isScannerSequence && buffer.length >= 3) {
          const scannedCode = buffer.trim();
          const matched = safeProducts.find(p => (p.barcode || '').trim() === scannedCode);
          if (matched) {
            addToCart(matched);
          } else {
            setSearchTerm(scannedCode);
          }
        }
        buffer = '';
        isScannerSequence = false;
        initialTarget = null;
      }, 90);
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      clearTimeout(finishTimeout);
    };
  }, [safeProducts]);

  const cartTotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Submit Order (Zayavka) to Accounting
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Savat bo'sh! Iltimos, mahsulot tanlang.");
      return;
    }
    if (!customerName.trim()) {
      alert("Iltimos, mijoz ismini kiriting!");
      return;
    }

    setIsSubmitting(true);

    const newOrder = {
      id: `ZAY-${Date.now().toString().slice(-4)}`,
      orderNumber: `ZY-${Math.floor(1000 + Math.random() * 9000)}`,
      sellerId: selectedSeller.id || 'emp-seller',
      sellerName: selectedSeller.name || 'Sotuvchi',
      sellerPhone: selectedSeller.phone || '',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      paymentMethod: paymentMethod, // cash, card, debt, bank, salary_deduction
      paymentDetails: paymentDetails.trim() || getDefaultPaymentDetail(paymentMethod),
      totalAmount: cartTotal,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        costPrice: item.costPrice,
        quantity: item.quantity,
        unit: item.unit,
        total: item.total
      })),
      status: 'pending_accounting', // 1-bosqich: Buxgalter tekshiruviga yuboriladi!
      createdAt: new Date().toLocaleString('uz-UZ'),
      timestamp: Date.now()
    };

    setTimeout(() => {
      onCreateOrder(newOrder);
      setSuccessOrder(newOrder);
      setCartItems([]);
      setCustomerName('');
      setCustomerPhone('+998 ');
      setPaymentDetails('');
      setIsSubmitting(false);
      setActiveTab('my_orders');
    }, 400);
  };

  const getDefaultPaymentDetail = (method) => {
    switch (method) {
      case 'cash': return "Kassa orqali naqd qabul qilinadi";
      case 'card': return "Plastik karta (Terminal / Click)";
      case 'debt': return "Mijozga nasiya / qarzga berilmoqda";
      case 'bank': return "Bank orqali to'lov topshirig'i (Perechisleniye)";
      case 'salary_deduction': return "Xodimning oylik maoshidan ushlab qolinadi";
      default: return "";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_accounting':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
            <Clock size={13} /> Buxgalter tekshiruvida
          </span>
        );
      case 'approved_accounting':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
            <Box size={13} /> Buxgalter tasdiqladi (Sklad yig'moqda)
          </span>
        );
      case 'dispatched_warehouse':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
            <CheckCircle2 size={13} /> Skladchi berdi (Yetkazildi)
          </span>
        );
      case 'rejected_accounting':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
            <AlertCircle size={13} /> Buxgalter rad etdi
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  // Filter orders created by this seller
  const myOrders = safeOrders.filter(o => !selectedSeller.id || o.sellerId === selectedSeller.id || o.sellerName === selectedSeller.name);
  const myCompletedSales = myOrders.filter(o => o.status === 'dispatched_warehouse');
  const myTotalRevenue = myCompletedSales.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const myBonus = Math.round(myTotalRevenue * 0.02); // 2% sotuvchi bonusi

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh', paddingBottom: '90px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
      
      {/* Top Mobile Header (APK Style) */}
      <div style={{ background: '#1e293b', color: '#ffffff', padding: '18px 20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', boxShadow: '0 4px 15px rgba(15, 23, 42, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={22} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', opacity: 0.8, fontWeight: 700 }}>{t('sellerMobileTitle')}</div>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>{selectedSeller.name}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <ThemeToggleButton />
            <LanguageToggle compact={true} />
            <button 
              onClick={() => onOpenInstallModal ? onOpenInstallModal() : setShowPwaModal(true)}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff', borderRadius: '10px', padding: '6px 8px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <Smartphone size={13} /> {t('mobileApp')}
            </button>
          </div>
        </div>

        {/* Seller Switcher & Status Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <User size={15} style={{ opacity: 0.8 }} />
            <select 
              value={selectedSeller.id}
              onChange={(e) => {
                const found = safeStaff.find(s => s.id === e.target.value);
                if (found) setSelectedSeller(found);
              }}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '13px', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
            >
              {safeStaff.map(s => (
                <option key={s.id} value={s.id} style={{ color: '#0f172a' }}>{s.name} ({s.role})</option>
              ))}
            </select>
          </div>
          <div style={{ fontSize: '12px', background: '#10b981', color: '#ffffff', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
            Online ●
          </div>
        </div>
      </div>

      {/* Navigation Tabs (APK UI) */}
      <div style={{ display: 'flex', background: '#ffffff', margin: '14px 16px', padding: '4px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <button
          onClick={() => setActiveTab('catalog')}
          style={{ flex: 1, padding: '10px 8px', borderRadius: '12px', border: 'none', background: activeTab === 'catalog' ? '#4f46e5' : 'transparent', color: activeTab === 'catalog' ? '#ffffff' : '#64748b', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <ShoppingBag size={16} /> {t('tabCatalog')}
        </button>

        <button
          onClick={() => setActiveTab('cart')}
          style={{ flex: 1, padding: '10px 8px', borderRadius: '12px', border: 'none', background: activeTab === 'cart' ? '#4f46e5' : 'transparent', color: activeTab === 'cart' ? '#ffffff' : '#64748b', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}
        >
          <Box size={16} /> {t('tabCart')}
          {cartItemCount > 0 && (
            <span style={{ position: 'absolute', top: '4px', right: '8px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartItemCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('my_orders')}
          style={{ flex: 1, padding: '10px 8px', borderRadius: '12px', border: 'none', background: activeTab === 'my_orders' ? '#4f46e5' : 'transparent', color: activeTab === 'my_orders' ? '#ffffff' : '#64748b', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}
        >
          <Clock size={16} /> {t('tabMyOrders')}
          {myOrders.filter(o => o.status === 'pending_accounting').length > 0 && (
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
          )}
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          style={{ flex: 1, padding: '10px 8px', borderRadius: '12px', border: 'none', background: activeTab === 'stats' ? '#4f46e5' : 'transparent', color: activeTab === 'stats' ? '#ffffff' : '#64748b', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <Sparkles size={16} /> {t('tabStats')}
        </button>
      </div>

      {/* TAB 1: CATALOG (Mahsulotlar va Sklad Qoldig'i) */}
      {activeTab === 'catalog' && (
        <div style={{ padding: '0 16px' }}>
          {/* Search Bar with Camera Barcode Scanner */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '14px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 700
              }}
              title={t('barcodeScannerTitle')}
            >
              <Scan size={18} />
            </button>
          </div>

          {/* Categories Pill Slider */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '12px', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? '#4f46e5' : '#e2e8f0',
                  background: selectedCategory === cat ? '#4f46e5' : '#ffffff',
                  color: selectedCategory === cat ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {cat === 'all' ? t('all') : cat}
              </button>
            ))}
          </div>

          {/* Product Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <Box size={40} style={{ color: '#94a3b8', margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 6px', color: '#334155' }}>Mahsulot topilmadi</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Qidiruv so'zini o'zgartirib ko'ring yoki skladchiga murojaat qiling</p>
              </div>
            ) : (
              filteredProducts.map(p => {
                const inCart = cartItems.find(i => i.id === p.id);
                const isOutOfStock = (p.stock || 0) <= 0;

                return (
                  <div 
                    key={p.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '14px',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      opacity: isOutOfStock ? 0.6 : 1,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Product Image */}
                    <div style={{ width: '52px', height: '52px', borderRadius: '10px', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Box size={22} style={{ color: '#94a3b8' }} />
                      )}
                    </div>

                    {/* Product Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{p.category || 'Umumiy'}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#4f46e5' }}>
                          {formatMoney(p.price)}
                        </span>
                        <span style={{ fontSize: '10px', background: isOutOfStock ? '#fee2e2' : '#f1f5f9', color: isOutOfStock ? '#ef4444' : '#475569', padding: '2px 5px', borderRadius: '6px', fontWeight: 600 }}>
                          Skladda: <strong>{p.stock || 0} {p.unit || 'dona'}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart Actions */}
                    <div style={{ flexShrink: 0 }}>
                      {inCart ? (
                        <div style={{ display: 'flex', alignItems: 'center', background: '#ede9fe', borderRadius: '10px', padding: '3px' }}>
                          <button
                            onClick={() => updateQuantity(p.id, -1)}
                            style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: '#ffffff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ width: '26px', textAlign: 'center', fontSize: '13px', fontWeight: 800, color: '#4f46e5' }}>
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(p.id, 1)}
                            style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: '#ffffff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled={isOutOfStock}
                          onClick={() => addToCart(p)}
                          style={{
                            background: isOutOfStock ? '#cbd5e1' : '#4f46e5',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px 14px',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap',
                            boxShadow: isOutOfStock ? 'none' : '0 2px 6px rgba(79, 70, 229, 0.25)'
                          }}
                        >
                          <Plus size={14} /> {t('addBtn') || "Qo'shish"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CART & ZAYAVKA RASMIYLASHTIRISH */}
      {activeTab === 'cart' && (
        <div style={{ padding: '0 16px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: '#ffffff', borderRadius: '20px', border: '1px dashed #cbd5e1', marginTop: '10px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <ShoppingBag size={28} style={{ color: '#4f46e5' }} />
              </div>
              <h3 style={{ margin: '0 0 6px', color: '#0f172a' }}>Savatchangiz bo'sh</h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>Katalogdan mahsulotlarni tanlab savatga qo'shing</p>
              <button
                onClick={() => setActiveTab('catalog')}
                style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '10px 20px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                Katalogga o'tish
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Selected Items */}
              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Tanlangan tovarlar ({cartItems.length})</span>
                  <button 
                    type="button" 
                    onClick={() => setCartItems([])} 
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Tozalash
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{formatMoney(item.price)} × {item.quantity} {item.unit}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#4f46e5' }}>{formatMoney(item.total)}</div>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px' }}>
                          <button type="button" onClick={() => updateQuantity(item.id, -1)} style={{ width: '24px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer' }}>-</button>
                          <span style={{ width: '20px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, 1)} style={{ width: '24px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer' }}>+</button>
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '2px dashed #e2e8f0' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#475569' }}>Jami Zayavka Summasi:</span>
                  <span style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>{formatMoney(cartTotal)}</span>
                </div>
              </div>

              {/* Customer Information */}
              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} style={{ color: '#4f46e5' }} /> {lang === 'ru' ? 'Данные Клиента' : "Mijoz Ma'lumotlari"}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      {t('customerNameLabel')} *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder={lang === 'ru' ? 'Иван Иванов' : 'Dilshod Ergashev'}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      {t('customerPhoneLabel')}
                    </label>
                    <input 
                      type="text" 
                      placeholder="+998 90 123 45 67"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD SELECTION */}
              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={16} style={{ color: '#4f46e5' }} /> {t('selectPaymentMethod')} *
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                  {lang === 'ru' ? 'Бухгалтер проверит оплату и передаст заказ на склад' : 'Buxgalter to\'lov turiga qarab tekshiradi va tasdiqlaydi'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  {PAYMENT_METHODS.map(method => {
                    const isSelected = paymentMethod === method.id;
                    const methodName = method.id === 'cash' ? t('paymentCash') :
                                       method.id === 'card' ? t('paymentCard') :
                                       method.id === 'debt' ? t('paymentDebt') :
                                       method.id === 'bank' ? t('paymentBank') : t('paymentSalary');
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        style={{
                          padding: '10px 10px',
                          borderRadius: '12px',
                          border: isSelected ? `2px solid ${method.color}` : '1px solid #e2e8f0',
                          background: isSelected ? `${method.color}15` : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${method.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {method.id === 'cash' && <Banknote size={15} color={method.color} />}
                          {method.id === 'card' && <CreditCard size={15} color={method.color} />}
                          {method.id === 'debt' && <Clock size={15} color={method.color} />}
                          {method.id === 'bank' && <Building2 size={15} color={method.color} />}
                          {method.id === 'salary_deduction' && <UserCheck size={15} color={method.color} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? method.color : '#1e293b' }}>
                            {methodName}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                    {t('paymentNotesLabel')}
                  </label>
                  <input 
                    type="text" 
                    placeholder={
                      paymentMethod === 'bank' ? (lang === 'ru' ? "Например: Платежное поручение №1498" : "Masalan: To'lov topshirig'i №1498") :
                      paymentMethod === 'debt' ? (lang === 'ru' ? "Например: Срок оплаты 15 дней" : "Masalan: Qarz muddati 15 kun") :
                      paymentMethod === 'salary_deduction' ? (lang === 'ru' ? "Например: Удержание из зарплаты продавца" : "Masalan: Sotuvchi maoshidan chegirish") :
                      (lang === 'ru' ? "Примечание или номер чека (необязательно)" : "Izoh yoki chek raqami (ixtiyoriy)")
                    }
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px',
                  fontSize: '15px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.4)',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={18} />
                {isSubmitting ? (lang === 'ru' ? 'Отправка...' : 'Yuborilmoqda...') : t('submitOrderToAccountant')}
              </button>

            </form>
          )}
        </div>
      )}

      {/* TAB 3: ZAYAVKALAR TARIXI VA STATUSI */}
      {activeTab === 'my_orders' && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Mening Zayavkalarim</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Buxgalter va Skladchidagi jonli holat</p>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              style={{ background: '#ede9fe', color: '#4f46e5', border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              + Yangi Zayavka
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <Clock size={36} style={{ color: '#94a3b8', margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 6px', color: '#334155' }}>Zayavkalar yo'q</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Hozircha birorta ham zakaz yuborilmagan</p>
              </div>
            ) : (
              myOrders.map(order => (
                <div 
                  key={order.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '14px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#4f46e5' }}>{order.orderNumber || order.id}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{order.customerName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{order.createdAt}</div>
                    </div>
                    <div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Items list */}
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '8px 10px', marginBottom: '10px' }}>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#334155', padding: '2px 0' }}>
                        <span>{item.name} × {item.quantity}</span>
                        <span style={{ fontWeight: 600 }}>{formatMoney(item.total)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Payment Details & Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>To'lov turi:</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                        {order.paymentMethod === 'cash' && 'Naqd pul'}
                        {order.paymentMethod === 'card' && 'Karta (Uzcard/Humo)'}
                        {order.paymentMethod === 'debt' && 'Qarzga (Nasiya)'}
                        {order.paymentMethod === 'bank' && 'Bank o\'tkazmasi'}
                        {order.paymentMethod === 'salary_deduction' && 'Xodim maoshidan'}
                      </div>
                      {order.paymentDetails && (
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>{order.paymentDetails}</div>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Jami Summa:</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{formatMoney(order.totalAmount)}</div>
                    </div>
                  </div>

                  {/* Workflow steps info & Receipt button */}
                  <div style={{ marginTop: '10px', background: '#f1f5f9', padding: '8px 10px', borderRadius: '8px', fontSize: '11px', color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ flex: 1, minWidth: '180px' }}>
                      {order.status === 'pending_accounting' && "Buxgalter to'lovni tekshirmoqda..."}
                      {order.status === 'approved_accounting' && "Buxgalter tasdiqladi! Skladchi tovarlarni berishi kutilmoqda..."}
                      {order.status === 'dispatched_warehouse' && "Skladchi tovarlarni berdi va skladdan yechildi"}
                      {order.status === 'rejected_accounting' && `Rad etildi: ${order.rejectionReason || "To'lov tasdiqlanmadi"}`}
                    </span>
                    {onOpenReceipt && (
                      <button
                        onClick={() => onOpenReceipt(order)}
                        style={{
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          padding: '5px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={12} /> {lang === 'ru' ? 'Чек' : 'Chek'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SOTUVCHI STATISTIKASI */}
      {activeTab === 'stats' && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#0f172a' }}>Xodimning Shaxsiy Natijasi</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>Yetkazilgan Savdo</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>{formatMoney(myTotalRevenue)}</div>
              </div>

              <div style={{ background: '#ede9fe', padding: '12px', borderRadius: '14px', border: '1px solid #ddd6fe' }}>
                <div style={{ fontSize: '11px', color: '#5b21b6', fontWeight: 600 }}>Mening Bonusim (2%)</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#6d28d9', marginTop: '4px' }}>{formatMoney(myBonus)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Jami yuborilgan zayavkalar:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{myOrders.length} ta</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Yakunlangan (otgruzka bo'lgan):</span>
              <span style={{ fontWeight: 700, color: '#15803d' }}>{myCompletedSales.length} ta</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Buxgalter tekshiruvida:</span>
              <span style={{ fontWeight: 700, color: '#b45309' }}>
                {myOrders.filter(o => o.status === 'pending_accounting').length} ta
              </span>
            </div>
          </div>

          {/* Quick PWA Installation Card */}
          <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)', color: '#ffffff', borderRadius: '18px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '4px' }}>Telefonda ilova qilib ishlatish</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>APK kabi o'rnatib, qulay buyurtma bering</div>
            </div>
            <button
              onClick={() => setShowPwaModal(true)}
              style={{ background: '#ffffff', color: '#1e1b4b', border: 'none', borderRadius: '12px', padding: '8px 14px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
            >
              Qo'llanma
            </button>
          </div>
        </div>
      )}

      {/* MODAL: PWA / APK O'RNATISH QO'LLANMASI */}
      {showPwaModal && (
        <div className="app-modal-overlay">
          <div className="app-modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={22} style={{ color: '#4f46e5' }} />
                <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>Telefonga APK qilib o'rnatish</h3>
              </div>
              <button onClick={() => setShowPwaModal(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              Ushbu dasturni alohida APK fayl yuklab o'tirmasdan, to'g'ridan-to'g'ri telefoningizga o'rnatib olishingiz mumkin. Barcha ma'lumotlar server bilan sinxron saqlanadi!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
                <span style={{ fontSize: '12px', color: '#334155' }}>Telefoningiz brauzerida (Chrome yoki Safari) ushbu saytni oching.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</span>
                <span style={{ fontSize: '12px', color: '#334155' }}>Brauzer menyusidan <strong>"Bosh ekranga qo'shish" (Добавить на главный экран)</strong> tugmasini bosing.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</span>
                <span style={{ fontSize: '12px', color: '#334155' }}>Ilova telefoningiz ish stolida APK ilova kabi to'liq ekranda ochiladi!</span>
              </div>
            </div>

            <button
              onClick={() => setShowPwaModal(false)}
              style={{ width: '100%', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Tushundim
            </button>
          </div>
        </div>
      )}

      {/* MODAL: SUCCESS ORDER POPUP */}
      {successOrder && (
        <div className="app-modal-overlay">
          <div className="app-modal-box" style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <CheckCircle2 size={36} style={{ color: '#16a34a' }} />
            </div>
            <h3 style={{ margin: '0 0 6px', color: '#0f172a' }}>Zayavka Yuborildi!</h3>
            <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#64748b' }}>
              Zayavka muvaffaqiyatli qabul qilindi va <strong>Buxgalterga</strong> tekshirish uchun yuborildi.
            </p>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', marginBottom: '16px', fontSize: '12px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>Buyurtma:</strong> {successOrder.orderNumber}</div>
              <div><strong>Mijoz:</strong> {successOrder.customerName}</div>
              <div><strong>To'lov:</strong> {successOrder.paymentMethod}</div>
              <div><strong>Summa:</strong> {formatMoney(successOrder.totalAmount)}</div>
            </div>

            <button
              onClick={() => setSuccessOrder(null)}
              style={{ width: '100%', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Rahmat
            </button>
          </div>
        </div>
      )}

      {/* Barcode Camera Scanner Modal */}
      <BarcodeScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onDetected={(code) => {
          setSearchTerm(code);
          setActiveTab('catalog');
        }}
      />

    </div>
  );
}
