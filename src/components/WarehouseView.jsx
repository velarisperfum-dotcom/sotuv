import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, ArrowDownRight, Truck, CheckCircle2, Clock, AlertTriangle, 
  Search, Filter, Plus, Edit2, Trash2, ArrowRight, User, Phone, 
  CreditCard, Check, Sparkles, Building2, PackageCheck, Layers, Eye,
  Scan
} from 'lucide-react';
import { MEASURE_UNITS } from '../data/initialData';
import { useLang } from '../context/LanguageContext';
import BarcodeScannerModal from './BarcodeScannerModal';

export default function WarehouseView({ 
  products = [], 
  stockTransfers = [], 
  orders = [],
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onReceiveTransfer,
  onDispatchOrder
}) {
  const { t, lang } = useLang();
  const safeProducts = Array.isArray(products) ? products : [];
  const safeTransfers = Array.isArray(stockTransfers) ? stockTransfers : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Active View Tab: 'receive_transfers' | 'dispatch_orders' | 'inventory'
  const [activeTab, setActiveTab] = useState('receive_transfers');

  // Search & Filter for Inventory
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  // Form states for adding/editing product
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formUnit, setFormUnit] = useState('dona');
  const [formCostPrice, setFormCostPrice] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('10');
  const [formMinStock, setFormMinStock] = useState('3');
  const [formBarcode, setFormBarcode] = useState('');

  // Hardware Barcode Scanner Gun (Pistalet) Ref & Feedback State
  const barcodeInputRef = useRef(null);
  const [scanFeedback, setScanFeedback] = useState(false);

  // BARCODE SCANNER PISTOL LISTENER:
  // Faqat shtrix-kod joyiga yozilishi va boshqa inputlarni ifloslantirmasligini ta'minlaydi!
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

      // Skaner pistoletlari kod oxirida 'Enter' yuboradi
      if (e.key === 'Enter') {
        if (isScannerSequence || buffer.length >= 3) {
          e.preventDefault();
          e.stopPropagation();

          const scannedCode = buffer.trim();
          if (scannedCode.length >= 3) {
            if (showAddModal) {
              // Tovar qo'shish/tahrirlash oynasi ochiq bo'lsa:
              // Shtrix-kod FAQAT formBarcode ga tushadi, boshqa inputlarga yozilmaydi!
              setFormBarcode(scannedCode);
              if (barcodeInputRef.current) {
                barcodeInputRef.current.value = scannedCode;
                barcodeInputRef.current.focus();
              }
              setScanFeedback(true);
              setTimeout(() => setScanFeedback(false), 2500);
            } else {
              // Sklad asosiy sahifasida: tovar qidiruviga yo'naltiriladi
              setSearchTerm(scannedCode);
              setActiveTab('inventory');
            }
          }
          buffer = '';
          isScannerSequence = false;
          initialTarget = null;
          return;
        }
      }

      // Modifikator tugmalarni (Shift, Alt, Ctrl, Meta) hisobga olmaymiz
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Skaner pistoleti belgilarni juda tez yuboradi (odatda 5ms - 45ms oralig'ida)
      if (diff <= 45) {
        isScannerSequence = true;
        buffer += e.key;

        // Agar foydalanuvchi shtrix-koddan boshqa ixtiyoriy inputda (nomi, narxi, qoldiq) turgan bo'lsa:
        if (showAddModal && e.target && e.target !== barcodeInputRef.current) {
          // Bu belgi o'sha inputga yozilishini darhol bloklaymiz!
          e.preventDefault();
          e.stopPropagation();

          // Skaner boshlangan paytdagi ilk 1-belgi o'tib ketgan bo'lsa, uni ham inputdan o'chirib, tozalaymiz
          if (initialTarget && initialTarget === e.target && 'value' in initialTarget) {
            initialTarget.value = initialTargetValue;
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
            if (nativeSetter) {
              nativeSetter.call(initialTarget, initialTargetValue);
            }
            initialTarget.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      } else {
        // Oddiy inson tomonidan klaviaturada sekin terish (> 45ms)
        buffer = e.key;
        isScannerSequence = false;
        initialTarget = e.target;
        initialTargetValue = e.target && 'value' in e.target ? e.target.value : '';
      }

      clearTimeout(finishTimeout);
      finishTimeout = setTimeout(() => {
        if (isScannerSequence && buffer.length >= 3) {
          const scannedCode = buffer.trim();
          if (showAddModal) {
            setFormBarcode(scannedCode);
            if (barcodeInputRef.current) {
              barcodeInputRef.current.value = scannedCode;
              barcodeInputRef.current.focus();
            }
            setScanFeedback(true);
            setTimeout(() => setScanFeedback(false), 2500);
          } else {
            setSearchTerm(scannedCode);
            setActiveTab('inventory');
          }
        }
        buffer = '';
        isScannerSequence = false;
        initialTarget = null;
      }, 90);
    };

    // Capture fazasida hodisani ushlaymiz (inputlarga yetib bormasdan oldin bloklash uchun)
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      clearTimeout(finishTimeout);
    };
  }, [showAddModal]);

  const formatMoney = (val) => Number(val || 0).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ') + " " + t('currency');

  // Pending transfers waiting for warehousekeeper
  const pendingTransfers = safeTransfers.filter(t => t.status === 'pending_warehouse');
  const receivedTransfers = safeTransfers.filter(t => t.status === 'received');

  // Orders waiting for dispatch (Buxgalter tasdiqlagan zakazlar!)
  const readyToDispatchOrders = safeOrders.filter(o => o.status === 'approved_accounting');
  const dispatchedOrders = safeOrders.filter(o => o.status === 'dispatched_warehouse');

  // Low stock products
  const lowStockProducts = safeProducts.filter(p => (p.stock || 0) <= (p.minStock || 3));

  // Categories
  const categories = ['all', ...new Set(safeProducts.map(p => p.category).filter(Boolean))];

  // Filtered Products
  const filteredProducts = safeProducts.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.barcode || '').includes(searchTerm);
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesLow = !onlyLowStock || (p.stock || 0) <= (p.minStock || 3);
    return matchesSearch && matchesCat && matchesLow;
  });

  // Handle Save Product
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: formName.trim(),
        category: formCategory.trim() || (lang === 'ru' ? 'Общий' : 'Umumiy'),
        unit: formUnit,
        costPrice: Number(formCostPrice) || 0,
        price: Number(formPrice),
        stock: Number(formStock) || 0,
        minStock: Number(formMinStock) || 3,
        barcode: formBarcode.trim()
      });
      setEditingProduct(null);
    } else {
      onAddProduct({
        id: `prd-${Date.now()}`,
        name: formName.trim(),
        category: formCategory.trim() || (lang === 'ru' ? 'Общий' : 'Umumiy'),
        unit: formUnit,
        costPrice: Number(formCostPrice) || 0,
        price: Number(formPrice),
        stock: Number(formStock) || 0,
        minStock: Number(formMinStock) || 3,
        barcode: formBarcode.trim() || `${Math.floor(1000000000 + Math.random() * 9000000000)}`
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormCategory('');
    setFormUnit('dona');
    setFormCostPrice('');
    setFormPrice('');
    setFormStock('10');
    setFormMinStock('3');
    setFormBarcode('');
    setEditingProduct(null);
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setFormName(p.name || '');
    setFormCategory(p.category || '');
    setFormUnit(p.unit || 'dona');
    setFormCostPrice(p.costPrice || '');
    setFormPrice(p.price || '');
    setFormStock(p.stock || '0');
    setFormMinStock(p.minStock || '3');
    setFormBarcode(p.barcode || '');
    setShowAddModal(true);
  };

  return (
    <div className="cabinet-container">
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
            {t('warehouseCabinet')}
          </h2>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
            {lang === 'ru' 
              ? 'Приемка товаров, выдача подтвержденных бухгалтером заказов и контроль остатков'
              : 'Kirim tovarlarni qabul qilish, buxgalter tasdiqlagan zakazlarni berish va qoldiq nazorati'}
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Plus size={15} /> {t('addProductBtn')}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="cabinet-kpi-grid">
        <div 
          onClick={() => setActiveTab('receive_transfers')}
          className="kpi-card-box"
          style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            padding: '16px', 
            border: activeTab === 'receive_transfers' ? '2px solid #16a34a' : '1px solid #e2e8f0', 
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
              {lang === 'ru' ? 'Ожидаемые приходы' : 'Kutilayotgan Kirimlar'}
            </span>
            <ArrowDownRight size={18} style={{ color: '#16a34a' }} />
          </div>
          <div className="kpi-amount-text" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
            {pendingTransfers.length} <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{lang === 'ru' ? 'партий' : 'ta partiya'}</span>
          </div>
          <div className="kpi-sub-text" style={{ fontSize: '11px', color: '#64748b' }}>
            {lang === 'ru' ? 'Всего:' : 'Jami:'} {pendingTransfers.reduce((acc, t) => acc + Number(t.quantity || 0), 0)} {lang === 'ru' ? 'шт.' : 'dona kutilmoqda'}
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('dispatch_orders')}
          className="kpi-card-box"
          style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            padding: '16px', 
            border: activeTab === 'dispatch_orders' ? '2px solid #2563eb' : '1px solid #e2e8f0', 
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
              {lang === 'ru' ? 'Готовые к отгрузке' : 'Otgruzkaga Tayyor Zakazlar'}
            </span>
            <Truck size={18} style={{ color: '#2563eb' }} />
          </div>
          <div className="kpi-amount-text" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
            {readyToDispatchOrders.length} <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{lang === 'ru' ? 'заказов' : 'ta buyurtma'}</span>
          </div>
          <div className="kpi-sub-text" style={{ fontSize: '11px', color: '#64748b' }}>
            {lang === 'ru' ? 'Оплата подтверждена' : 'Buxgalter tasdiqlagan, berish kerak'}
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('inventory')}
          className="kpi-card-box"
          style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            padding: '16px', 
            border: activeTab === 'inventory' ? '2px solid #2563eb' : '1px solid #e2e8f0', 
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
              {lang === 'ru' ? 'Складские остатки' : 'Sklad Zaxirasi'}
            </span>
            <Box size={18} style={{ color: '#475569' }} />
          </div>
          <div className="kpi-amount-text" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
            {safeProducts.reduce((acc, p) => acc + Number(p.stock || 0), 0)} <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{lang === 'ru' ? 'шт.' : 'dona'} ({safeProducts.length} {lang === 'ru' ? 'наим.' : 'xil'})</span>
          </div>
          <div className="kpi-sub-text" style={{ fontSize: '11px', color: lowStockProducts.length > 0 ? '#dc2626' : '#64748b', fontWeight: lowStockProducts.length > 0 ? 700 : 400 }}>
            {lowStockProducts.length > 0 
              ? (lang === 'ru' ? `Мало на складе: ${lowStockProducts.length} позиций` : `${lowStockProducts.length} ta tovar kam qolgan`) 
              : (lang === 'ru' ? 'Остатки в норме' : "Zaxira me'yorda")}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="cabinet-tabs-scroll">
        <button
          onClick={() => setActiveTab('receive_transfers')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'receive_transfers' ? '2px solid #16a34a' : '2px solid transparent',
            color: activeTab === 'receive_transfers' ? '#16a34a' : '#64748b',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <ArrowDownRight size={16} /> 1. {t('tabWarehouseTransfers')} ({pendingTransfers.length})
        </button>

        <button
          onClick={() => setActiveTab('dispatch_orders')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'dispatch_orders' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'dispatch_orders' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <Truck size={16} /> 2. {t('tabWarehouseOrders')} ({readyToDispatchOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'inventory' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'inventory' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <Box size={16} /> 3. {t('tabWarehouseStock')} ({safeProducts.length})
        </button>
      </div>

      {/* TAB 1: KUTILAYOTGAN KIRIMLAR (DIREKTORDAN) */}
      {activeTab === 'receive_transfers' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
              {lang === 'ru' ? 'Партии товаров, отправленные Директором' : 'Direktor Yuborgan Kirim Partiyalari'}
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              {lang === 'ru'
                ? 'При поступлении товара пересчитайте его и нажмите «Принять товар». Он автоматически добавится в остатки склада'
                : 'Tovarlar kelganda sanab olib "Qabul Qildim" tugmasini bosing, ular avtomatik sklad balansiga qo\'shiladi'}
            </p>
          </div>

          {pendingTransfers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8', fontSize: '13px' }}>
              {t('emptyList')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingTransfers.map(trf => (
                <div key={trf.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>
                        {trf.transferNumber || trf.id}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{trf.createdAt}</span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                      {trf.productName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {t('categoryLabel')}: <strong>{trf.category}</strong> | {t('supplier')}: <strong>{trf.supplier}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%', borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{t('quantity')}:</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#16a34a' }}>
                        +{trf.quantity} {trf.unit}
                      </div>
                    </div>

                    <button
                      onClick={() => onReceiveTransfer(trf.id)}
                      style={{
                        background: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '11px 20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
                        flex: '1 1 180px'
                      }}
                    >
                      <Check size={16} /> {t('receiveStockBtn')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OTGRUZKA / SOTUVCHIGA BERISH */}
      {activeTab === 'dispatch_orders' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
              {t('pendingDispatchOrders')}
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              {t('pendingDispatchDesc')}
            </p>
          </div>

          {readyToDispatchOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8', fontSize: '13px' }}>
              {t('emptyList')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {readyToDispatchOrders.map(order => (
                <div key={order.id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '6px' }}>
                          {order.orderNumber || order.id}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{order.createdAt}</span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                        {lang === 'ru' ? 'Клиент' : 'Mijoz'}: {order.customerName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {lang === 'ru' ? 'Продавец' : 'Sotuvchi'}: <strong>{order.sellerName}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{t('total')}:</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                        {formatMoney(order.totalAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Tovarlar ro'yxati */}
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                      {lang === 'ru' ? 'Товары к выдаче:' : 'Javondan olinadigan tovarlar:'}
                    </div>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '3px 0', borderBottom: idx < order.items.length - 1 ? '1px dashed #f1f5f9' : 'none' }}>
                        <span style={{ color: '#0f172a', fontWeight: 600 }}>• {item.name}</span>
                        <strong style={{ color: '#2563eb' }}>× {item.quantity} {item.unit || 'dona'}</strong>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => onDispatchOrder(order.id)}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '11px 22px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                        width: '100%'
                      }}
                    >
                      <PackageCheck size={16} /> {t('dispatchStockBtn')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SKLAD QOLDIQLARI */}
      {activeTab === 'inventory' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
          
          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px', flex: 1, minWidth: '220px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={t('barcodeScannerTitle')}
              >
                <Scan size={16} />
              </button>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'all' ? t('all') : c}</option>
              ))}
            </select>

            <button
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              style={{
                background: onlyLowStock ? '#fee2e2' : '#f8fafc',
                color: onlyLowStock ? '#dc2626' : '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '9px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t('lowStock')} ({lowStockProducts.length})
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="desktop-table-view">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '12px 14px' }}>{t('colProduct')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colCategory')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colBarcode')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colCostPrice')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colSellingPrice')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colStock')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colCondition')}</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                        {t('emptyList')}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => {
                      const isLow = (p.stock || 0) <= (p.minStock || 3);
                      const isOut = (p.stock || 0) <= 0;

                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{p.name}</td>
                          <td style={{ padding: '12px 14px', color: '#64748b' }}>{p.category}</td>
                          <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#475569', fontSize: '11px' }}>{p.barcode || '—'}</td>
                          <td style={{ padding: '12px 14px', color: '#64748b' }}>{formatMoney(p.costPrice)}</td>
                          <td style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 700 }}>{formatMoney(p.price)}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: isOut ? '#dc2626' : isLow ? '#d97706' : '#16a34a' }}>
                            {p.stock || 0} {p.unit || 'dona'}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: isOut ? '#fee2e2' : isLow ? '#fef3c7' : '#dcfce7',
                              color: isOut ? '#dc2626' : isLow ? '#b45309' : '#15803d'
                            }}>
                              {isOut ? t('outOfStock') : isLow ? t('lowStock') : t('inStock')}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                onClick={() => openEdit(p)}
                                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#475569' }}
                                title={t('edit')}
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`${p.name} - ${t('delete')}?`)) {
                                    onDeleteProduct(p.id);
                                  }
                                }}
                                style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#dc2626' }}
                                title={t('delete')}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-card-view">
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
                {t('emptyList')}
              </div>
            ) : (
              filteredProducts.map(p => {
                const isLow = (p.stock || 0) <= (p.minStock || 3);
                const isOut = (p.stock || 0) <= 0;

                return (
                  <div key={p.id} className="mobile-record-card">
                    <div className="mobile-record-header">
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{p.category}</div>
                      </div>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: isOut ? '#fee2e2' : isLow ? '#fef3c7' : '#dcfce7',
                        color: isOut ? '#dc2626' : isLow ? '#b45309' : '#15803d'
                      }}>
                        {isOut ? t('outOfStock') : isLow ? t('lowStock') : t('inStock')}
                      </span>
                    </div>

                    <div className="mobile-record-grid">
                      <div>
                        <span className="mobile-record-label">{t('colStock')}: </span>
                        <span style={{ fontWeight: 800, color: isOut ? '#dc2626' : isLow ? '#d97706' : '#16a34a' }}>
                          {p.stock || 0} {p.unit || 'dona'}
                        </span>
                      </div>
                      <div>
                        <span className="mobile-record-label">{t('colSellingPrice')}: </span>
                        <span className="mobile-record-val" style={{ color: '#2563eb' }}>{formatMoney(p.price)}</span>
                      </div>
                      <div>
                        <span className="mobile-record-label">{t('colCostPrice')}: </span>
                        <span className="mobile-record-val">{formatMoney(p.costPrice)}</span>
                      </div>
                      <div>
                        <span className="mobile-record-label">{t('colBarcode')}: </span>
                        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#475569' }}>{p.barcode || '—'}</span>
                      </div>
                    </div>

                    <div className="mobile-record-actions">
                      <button
                        onClick={() => openEdit(p)}
                        style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      >
                        <Edit2 size={13} /> {t('edit')}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`${p.name} - ${t('delete')}?`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, color: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} /> {t('delete')}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* MODAL: TOVAR QO'SHISH / TAHRIRLASH */}
      {showAddModal && (
        <div className="app-modal-overlay">
          <div className="app-modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                {editingProduct ? (lang === 'ru' ? 'Редактирование товара' : 'Tovarni Tahrirlash') : t('productModalTitle')}
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {t('productNameLabel')} *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={lang === 'ru' ? 'Название товара' : 'Tovar nomi'}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('categoryLabel')}
                  </label>
                  <input 
                    type="text" 
                    placeholder={lang === 'ru' ? 'Категория' : 'Kategoriya'}
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('unitLabel')}
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#ffffff' }}
                  >
                    {MEASURE_UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('costPrice')} ({t('currency')})
                  </label>
                  <input 
                    type="number" 
                    placeholder="150000"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('sellingPrice')} ({t('currency')}) *
                  </label>
                  <input 
                    type="number" 
                    required
                    placeholder="250000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('initialStockLabel')}
                  </label>
                  <input 
                    type="number" 
                    placeholder="10"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('minStockLabel')}
                  </label>
                  <input 
                    type="number" 
                    placeholder="3"
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* SHTRIX-KOD MAYDONI (FAQAT SKANER PISTOLET UCHUN HIMOYALANGAN) */}
              <div style={{
                background: scanFeedback ? '#f0fdf4' : '#f8fafc',
                border: scanFeedback ? '2px solid #22c55e' : '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '12px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: scanFeedback ? '#15803d' : '#334155', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <Scan size={15} style={{ color: scanFeedback ? '#16a34a' : '#2563eb' }} />
                    {t('barcodeLabel')}
                  </label>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: scanFeedback ? '#dcfce7' : '#e0e7ff',
                    color: scanFeedback ? '#16a34a' : '#4338ca',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {scanFeedback 
                      ? '✅ ' + (lang === 'ru' ? 'Сканировано!' : 'Skanerlandi!') 
                      : '🔫 ' + (lang === 'ru' ? 'Только для сканера' : 'Faqat skaner joyi')}
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  <input 
                    ref={barcodeInputRef}
                    type="text" 
                    placeholder={lang === 'ru' ? 'Штрих-код (пистолет сканирует только сюда)' : 'Shtrix-kod (pistolet faqat shu yerga yozadi)'}
                    value={formBarcode}
                    onChange={(e) => setFormBarcode(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '10px 32px 10px 12px', 
                      borderRadius: '8px', 
                      border: scanFeedback ? '1px solid #22c55e' : '1px solid #cbd5e1', 
                      fontSize: '14px', 
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#0f172a',
                      background: '#ffffff',
                      boxSizing: 'border-box' 
                    }}
                  />
                  {formBarcode && (
                    <button
                      type="button"
                      onClick={() => setFormBarcode('')}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '6px',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#64748b',
                        cursor: 'pointer'
                      }}
                      title={lang === 'ru' ? 'Очистить штрих-код' : 'Shtrix-kodni tozalash'}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🔒</span>
                  <span>
                    {lang === 'ru' 
                      ? 'Пистолет-сканер записывает штрих-код ТОЛЬКО сюда, другие поля защищены.' 
                      : 'Skaner-pistolet bosilganda shtrix-kod FAQAT shu joyga yoziladi, boshqa maydonlar himoyalangan.'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Camera Scanner Modal */}
      <BarcodeScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onDetected={(code) => {
          setSearchTerm(code);
          setActiveTab('inventory');
        }}
      />

    </div>
  );
}
