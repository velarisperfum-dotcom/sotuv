import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, Box, Award, 
  ArrowUpRight, ArrowDownRight, CreditCard, Building2, 
  Clock, Eye, EyeOff, UserCheck, BarChart3, Layers, Plus, 
  Send, CheckCircle2, AlertTriangle, Truck, Check, X,
  Users, UserPlus, Edit2, Trash2, Shield, Phone, Key,
  Copy, ShieldCheck, Lock
} from 'lucide-react';
import { MEASURE_UNITS } from '../data/initialData';
import { useLang } from '../context/LanguageContext';

export default function DirectorDashboard({ 
  sales = [], 
  products = [], 
  staff = [], 
  balances = {}, 
  debts = [], 
  expenses = [],
  stockTransfers = [],
  orders = [],
  onCreateTransfer,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onViewReceipt
}) {
  const { t, lang } = useLang();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'transfers' | 'staff'

  // Transfer modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferProductName, setTransferProductName] = useState('');
  const [transferCategory, setTransferCategory] = useState('');
  const [transferQuantity, setTransferQuantity] = useState('20');
  const [transferUnit, setTransferUnit] = useState('dona');
  const [transferCostPrice, setTransferCostPrice] = useState('');
  const [transferSellingPrice, setTransferSellingPrice] = useState('');
  const [transferSupplier, setTransferSupplier] = useState('');
  const [transferNotes, setTransferNotes] = useState('');

  // Staff modal
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Sotuvchi');
  const [staffPhone, setStaffPhone] = useState('+998 ');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('1234');
  const [staffSalary, setStaffSalary] = useState('');

  // Password visibility state map: { [staffId]: boolean }
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, id) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const safeSales = Array.isArray(sales) ? sales : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeStaff = Array.isArray(staff) ? staff : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeTransfers = Array.isArray(stockTransfers) ? stockTransfers : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const formatMoney = (val) => Number(val || 0).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ') + " " + t('currency');

  // Calculations
  const totalRevenue = safeSales.reduce((acc, s) => acc + Number(s?.total || 0), 0);
  
  const totalCostOfGoodsSold = safeSales.reduce((acc, s) => {
    const saleCost = s?.items?.reduce((itemAcc, item) => {
      const prod = safeProducts.find(p => p?.id === item?.id);
      const cost = item?.costPrice || (prod ? prod.costPrice : 0) || 0;
      return itemAcc + (Number(cost) * Number(item?.quantity || 1));
    }, 0) || 0;
    return acc + saleCost;
  }, 0);

  const totalExpenses = safeExpenses.reduce((acc, e) => acc + Number(e?.amount || 0), 0);
  const totalStaffSalaries = safeStaff.reduce((acc, s) => acc + Number(s?.paidThisMonth || 0), 0);
  const netProfit = totalRevenue - totalCostOfGoodsSold - totalExpenses - totalStaffSalaries;

  // 1. Skladda qancha tovar bor
  const totalStockCount = safeProducts.reduce((acc, p) => acc + Number(p?.stock || 0), 0);
  const warehouseCost = safeProducts.reduce((acc, p) => acc + (Number(p?.costPrice || 0) * Number(p?.stock || 0)), 0);
  const warehouseRetail = safeProducts.reduce((acc, p) => acc + (Number(p?.price || 0) * Number(p?.stock || 0)), 0);

  // 2. Qancha tovar kirim bo'ldi
  const totalTransfersCount = safeTransfers.length;
  const totalTransferredQuantity = safeTransfers.reduce((acc, t) => acc + Number(t.quantity || 0), 0);
  const totalTransferredCost = safeTransfers.reduce((acc, t) => acc + (Number(t.costPrice || 0) * Number(t.quantity || 0)), 0);

  // 3. Nimadan qancha sotildi
  const productSalesMap = {};
  safeSales.forEach(sale => {
    sale?.items?.forEach(item => {
      if (!item?.name) return;
      if (!productSalesMap[item.name]) {
        productSalesMap[item.name] = { name: item.name, quantity: 0, revenue: 0, unit: item.unit || 'dona' };
      }
      productSalesMap[item.name].quantity += Number(item.quantity || 1);
      productSalesMap[item.name].revenue += Number(item.quantity || 1) * Number(item.price || 0);
    });
  });

  safeOrders.filter(o => o.status === 'dispatched_warehouse').forEach(o => {
    o.items?.forEach(item => {
      if (!item?.name) return;
      if (!productSalesMap[item.name]) {
        productSalesMap[item.name] = { name: item.name, quantity: 0, revenue: 0, unit: item.unit || 'dona' };
      }
      if (!safeSales.some(s => s.id === o.id)) {
        productSalesMap[item.name].quantity += Number(item.quantity || 1);
        productSalesMap[item.name].revenue += Number(item.total || 0);
      }
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.quantity - a.quantity);

  // 4. To'lov turlari bo'yicha tushum
  const allCompletedSales = [...safeSales];
  safeOrders.filter(o => o.status === 'dispatched_warehouse').forEach(o => {
    if (!allCompletedSales.some(s => s.id === o.id)) {
      allCompletedSales.push({
        paymentMethod: o.paymentMethod,
        total: o.totalAmount
      });
    }
  });

  const paymentStats = {
    cash: allCompletedSales.filter(s => s?.paymentMethod === 'Naqd' || s?.paymentMethod === 'cash').reduce((a, s) => a + Number(s?.total || 0), 0),
    card: allCompletedSales.filter(s => s?.paymentMethod === 'Karta' || s?.paymentMethod === 'card').reduce((a, s) => a + Number(s?.total || 0), 0),
    bank: allCompletedSales.filter(s => s?.paymentMethod === 'Bank perech' || s?.paymentMethod === 'bank').reduce((a, s) => a + Number(s?.total || 0), 0),
    debt: allCompletedSales.filter(s => s?.paymentMethod === 'Qarz' || s?.paymentMethod === 'debt').reduce((a, s) => a + Number(s?.total || 0), 0),
    salary: allCompletedSales.filter(s => s?.paymentMethod === 'salary_deduction').reduce((a, s) => a + Number(s?.total || 0), 0)
  };

  // 5. Tovar turlari (kategoriyalar) bo'yicha tushum
  const categorySalesMap = {};
  safeSales.forEach(sale => {
    sale?.items?.forEach(item => {
      const prod = safeProducts.find(p => p.id === item.id || p.name === item.name);
      const cat = prod?.category || item.category || (lang === 'ru' ? 'Общий' : 'Umumiy');
      if (!categorySalesMap[cat]) {
        categorySalesMap[cat] = { category: cat, quantity: 0, revenue: 0 };
      }
      categorySalesMap[cat].quantity += Number(item.quantity || 1);
      categorySalesMap[cat].revenue += Number(item.total || (Number(item.price || 0) * Number(item.quantity || 1)));
    });
  });

  safeOrders.filter(o => o.status === 'dispatched_warehouse').forEach(o => {
    if (!safeSales.some(s => s.id === o.id)) {
      o.items?.forEach(item => {
        const prod = safeProducts.find(p => p.id === item.id || p.name === item.name);
        const cat = prod?.category || item.category || (lang === 'ru' ? 'Общий' : 'Umumiy');
        if (!categorySalesMap[cat]) {
          categorySalesMap[cat] = { category: cat, quantity: 0, revenue: 0 };
        }
        categorySalesMap[cat].quantity += Number(item.quantity || 1);
        categorySalesMap[cat].revenue += Number(item.total || (Number(item.price || 0) * Number(item.quantity || 1)));
      });
    }
  });

  // If no sales yet, extract categories with available stock count
  if (Object.keys(categorySalesMap).length === 0) {
    safeProducts.forEach(p => {
      const cat = p.category || (lang === 'ru' ? 'Общий' : 'Umumiy');
      if (!categorySalesMap[cat]) {
        categorySalesMap[cat] = { category: cat, quantity: 0, revenue: 0, stockCount: 0 };
      }
      categorySalesMap[cat].stockCount = (categorySalesMap[cat].stockCount || 0) + Number(p.stock || 0);
    });
  }

  const categoryStats = Object.values(categorySalesMap).sort((a, b) => b.revenue - a.revenue);

  // Submit transfer
  const handleSendTransfer = (e) => {
    e.preventDefault();
    if (!transferProductName.trim() || !transferQuantity) return;

    const newTrf = {
      id: `trf-${Date.now()}`,
      transferNumber: `KRM-${Math.floor(10000 + Math.random() * 90000)}`,
      productName: transferProductName.trim(),
      category: transferCategory.trim() || (lang === 'ru' ? 'Общий' : 'Umumiy'),
      quantity: Number(transferQuantity),
      unit: transferUnit,
      costPrice: Number(transferCostPrice) || 0,
      price: Number(transferSellingPrice) || (Number(transferCostPrice) * 1.3),
      supplier: transferSupplier.trim() || (lang === 'ru' ? 'Поставщик' : 'Yetkazib beruvchi'),
      notes: transferNotes.trim() || (lang === 'ru' ? 'Партия от Директора' : 'Direktor tomonidan yuborilgan kirim'),
      createdAt: new Date().toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ'),
      createdBy: lang === 'ru' ? 'Директор' : 'Direktor',
      status: 'pending_warehouse'
    };

    onCreateTransfer(newTrf);
    setShowTransferModal(false);
    setTransferProductName('');
    setTransferCategory('');
    setTransferCostPrice('');
    setTransferSellingPrice('');
    setTransferSupplier('');
    setTransferNotes('');
  };

  // Staff Submit
  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!staffName.trim() || !staffUsername.trim()) return;

    let mappedRole = 'seller_mobile';
    const roleLower = staffRole.toLowerCase();
    if (roleLower.includes('direktor') || roleLower.includes('директор')) mappedRole = 'director';
    else if (roleLower.includes('buxgalter') || roleLower.includes('бухгалтер')) mappedRole = 'accountant';
    else if (roleLower.includes('sklad') || roleLower.includes('склад')) mappedRole = 'warehouse';

    if (editingStaff) {
      onUpdateStaff({
        ...editingStaff,
        name: staffName.trim(),
        role: staffRole,
        phone: staffPhone.trim(),
        username: staffUsername.trim().toLowerCase(),
        password: staffPassword.trim() || '1234',
        baseSalary: Number(staffSalary) || 0,
        systemRole: mappedRole
      });
    } else {
      onAddStaff({
        id: `emp-${Date.now()}`,
        name: staffName.trim(),
        role: staffRole,
        phone: staffPhone.trim(),
        username: staffUsername.trim().toLowerCase(),
        password: staffPassword.trim() || '1234',
        baseSalary: Number(staffSalary) || 0,
        paidThisMonth: 0,
        status: t('active'),
        systemRole: mappedRole
      });
    }

    setShowStaffModal(false);
    resetStaffForm();
  };

  const resetStaffForm = () => {
    setStaffName('');
    setStaffRole(lang === 'ru' ? 'Продавец' : 'Sotuvchi');
    setStaffPhone('+998 ');
    setStaffUsername('');
    setStaffPassword('1234');
    setStaffSalary('');
    setEditingStaff(null);
  };

  const openEditStaff = (st) => {
    setEditingStaff(st);
    setStaffName(st.name || '');
    setStaffRole(st.role || (lang === 'ru' ? 'Продавец' : 'Sotuvchi'));
    setStaffPhone(st.phone || '+998 ');
    setStaffUsername(st.username || '');
    setStaffPassword(st.password || '1234');
    setStaffSalary(st.baseSalary || '');
    setShowStaffModal(true);
  };

  return (
    <div className="cabinet-container">
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
            {t('directorCabinet')}
          </h2>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
            {lang === 'ru' 
              ? 'Складские остатки, приходы товаров, аналитика продаж и управление персоналом'
              : 'Sklad zaxirasi, tovar kirimlari, sotuvlar tahlili va xodimlar boshqaruvi'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => { resetStaffForm(); setShowStaffModal(true); }}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <UserPlus size={15} /> {t('addStaffBtn')}
          </button>

          <button
            onClick={() => setShowTransferModal(true)}
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
            <Plus size={15} /> {t('sendNewTransferBtn')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="cabinet-tabs-scroll">
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'overview' ? '#2563eb' : '#64748b',
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
          <BarChart3 size={16} /> {t('tabOverview')}
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'transfers' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'transfers' ? '#2563eb' : '#64748b',
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
          <Truck size={16} /> {t('tabTransfers')}
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'staff' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'staff' ? '#2563eb' : '#64748b',
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
          <Key size={16} /> {t('tabStaff')}
        </button>
      </div>

      {/* TAB 1: ASOSIY KO'RSATKICHLAR */}
      {activeTab === 'overview' && (
        <div>
          {/* 4 Asosiy Metrik Kartalar */}
          <div className="cabinet-kpi-grid">
            
            {/* Metrik 1: Skladda Qancha Tovar Bor */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{t('metricWarehouseStock')}</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box size={18} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                {totalStockCount.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>{lang === 'ru' ? 'шт.' : 'dona'}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                <div>{t('metricWarehouseCost')}: <strong style={{ color: '#0f172a' }}>{formatMoney(warehouseCost)}</strong></div>
                <div>{t('metricWarehouseRetail')}: <strong style={{ color: '#2563eb' }}>{formatMoney(warehouseRetail)}</strong></div>
              </div>
            </div>

            {/* Metrik 2: Qancha Tovar Kirim Bo'ldi */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{t('metricTransfers')}</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={18} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                {totalTransfersCount} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>{lang === 'ru' ? 'партий' : 'partiya'}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                <div>{t('metricTransfersQuantity')}: <strong style={{ color: '#16a34a' }}>+{totalTransferredQuantity.toLocaleString()}</strong></div>
                <div>{t('metricTransfersCost')}: <strong style={{ color: '#0f172a' }}>{formatMoney(totalTransferredCost)}</strong></div>
              </div>
            </div>

            {/* Metrik 3: Eng Ko'p Sotilgan Tovarlar */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{t('metricTopProducts')}</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={18} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                {topProducts.length} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>{lang === 'ru' ? 'наименований' : 'xil mahsulot'}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                {topProducts[0] ? (
                  <span>№1: <strong style={{ color: '#0f172a' }}>{topProducts[0].name}</strong> ({topProducts[0].quantity} {topProducts[0].unit})</span>
                ) : (
                  <span>{t('emptyList')}</span>
                )}
              </div>
            </div>

            {/* Metrik 4: Kassa & Bank Balansi */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{t('metricFinancialSummary')}</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={18} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                {formatMoney((balances?.cash || 0) + (balances?.bank || 0) + (balances?.card || 0))}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                <div>{t('cash')}: <strong style={{ color: '#16a34a' }}>{formatMoney(balances?.cash || 0)}</strong></div>
                <div>{t('bank')}: <strong style={{ color: '#2563eb' }}>{formatMoney(balances?.bank || 0)}</strong></div>
              </div>
            </div>
          </div>

          {/* Sotilgan Mahsulotlar, Tovar turlari & To'lov Usullari */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            
            {/* 1. Tovar turlari (kategoriyalar) bo'yicha tushum */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                  {lang === 'ru' ? 'Выручка по категориям товаров' : 'Tovar turlari bo\'yicha tushum'}
                </h3>
              </div>
              
              {categoryStats.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
                  {t('emptyList')}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {categoryStats.map((cat, idx) => (
                    <div key={idx} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#e0e7ff', color: '#4338ca', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {idx + 1}
                          </span>
                          <strong style={{ fontSize: '13px', color: '#1e293b' }}>{cat.category}</strong>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#16a34a' }}>
                          {formatMoney(cat.revenue)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                        <span>{lang === 'ru' ? 'Продано:' : 'Sotilgan:'} <strong>{cat.quantity} ta</strong></span>
                        {cat.stockCount !== undefined && <span>{lang === 'ru' ? 'На складе:' : 'Skladda:'} {cat.stockCount} ta</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. To'lov turlari bo'yicha tushum */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                  {lang === 'ru' ? 'Поступления по способам оплаты' : 'To\'lov turlari bo\'yicha tushum'}
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>{t('paymentCash')} (Naqd):</span>
                  <strong style={{ color: '#16a34a', fontSize: '14px' }}>{formatMoney(paymentStats.cash)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>{t('paymentCard')} (Terminal/Click):</span>
                  <strong style={{ color: '#2563eb', fontSize: '14px' }}>{formatMoney(paymentStats.card)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>{t('paymentBank')} (Perechisleniye):</span>
                  <strong style={{ color: '#7c3aed', fontSize: '14px' }}>{formatMoney(paymentStats.bank)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>{t('paymentDebt')} (Nasiya/Qarz):</span>
                  <strong style={{ color: '#d97706', fontSize: '14px' }}>{formatMoney(paymentStats.debt)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>{t('paymentSalary')} (Oylikdan ushlash):</span>
                  <strong style={{ color: '#db2777', fontSize: '14px' }}>{formatMoney(paymentStats.salary)}</strong>
                </div>
              </div>
            </div>

            {/* 3. Nimadan qancha sotildi jadvali */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                  {lang === 'ru' ? 'Товары, списанные со склада (Продажи)' : 'Sklad hisobidan yechilgan tovarlar (Sotuvlar)'}
                </h3>
              </div>
              
              {topProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
                  {t('emptyList')}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {topProducts.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1, paddingRight: '10px' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#e2e8f0', color: '#475569', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {idx + 1}
                        </span>
                        <strong style={{ color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</strong>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontWeight: 800, color: '#16a34a' }}>{p.quantity} {p.unit}</span>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>{formatMoney(p.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: SKLADGA KIRIMLAR (PEREXODLAR) */}
      {activeTab === 'transfers' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{t('inboundTransfersTitle')}</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{t('inboundTransfersDesc')}</p>
            </div>

            <button
              onClick={() => setShowTransferModal(true)}
              style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} /> {t('sendNewTransferBtn')}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>{t('docNumber')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('productName')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('quantity')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('costPrice')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('sellingPrice')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('supplier')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('date')}</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {safeTransfers.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                      {t('emptyList')}
                    </td>
                  </tr>
                ) : (
                  safeTransfers.map(trf => (
                    <tr key={trf.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#2563eb' }}>{trf.transferNumber || trf.id}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{trf.productName}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#16a34a' }}>+{trf.quantity} {trf.unit}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{formatMoney(trf.costPrice)}</td>
                      <td style={{ padding: '12px 14px', color: '#0f172a' }}>{formatMoney(trf.price)}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{trf.supplier}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{trf.createdAt}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: trf.status === 'received' ? '#dcfce7' : '#fef3c7',
                          color: trf.status === 'received' ? '#15803d' : '#b45309'
                        }}>
                          {trf.status === 'received' ? t('transferReceived') : t('transferPending')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: XODIMLAR VA FOYDALANUVCHILAR BOSHQARUVI (LOGIN & PAROLLAR NAZORATI) */}
      {activeTab === 'staff' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
          
          {/* Recovery and Visibility Info Banner */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                {t('staffCredentialsBannerTitle')}
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                {t('staffCredentialsBannerDesc')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{t('staffManagementTitle')}</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{t('staffManagementDesc')}</p>
            </div>

            <button
              onClick={() => { resetStaffForm(); setShowStaffModal(true); }}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <UserPlus size={16} /> {t('addStaffBtn')}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>{t('colFullName')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('colRole')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('colPhone')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('colUsername')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('colPassword')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('colSalary')}</th>
                  <th style={{ padding: '12px 14px' }}>{t('status')}</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {safeStaff.map(st => {
                  const isVisible = !!visiblePasswords[st.id];
                  const passwordText = st.password || '123';
                  const isCopied = copiedId === st.id;

                  return (
                    <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{st.name}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: st.role?.toLowerCase().includes('direktor') || st.role?.toLowerCase().includes('директор') ? '#fef3c7' :
                                      st.role?.toLowerCase().includes('buxgalter') || st.role?.toLowerCase().includes('бухгалтер') ? '#dcfce7' :
                                      st.role?.toLowerCase().includes('sklad') || st.role?.toLowerCase().includes('склад') ? '#e0f2fe' : '#ede9fe',
                          color: st.role?.toLowerCase().includes('direktor') || st.role?.toLowerCase().includes('директор') ? '#b45309' :
                                 st.role?.toLowerCase().includes('buxgalter') || st.role?.toLowerCase().includes('бухгалтер') ? '#15803d' :
                                 st.role?.toLowerCase().includes('sklad') || st.role?.toLowerCase().includes('склад') ? '#0369a1' : '#6d28d9'
                        }}>
                          {st.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{st.phone || '—'}</td>
                      
                      {/* Tizim Logini */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          background: '#eff6ff',
                          color: '#2563eb',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '12px'
                        }}>
                          {st.username || st.name.toLowerCase().replace(/\s+/g, '')}
                        </span>
                      </td>

                      {/* Tizim Paroli (Show / Hide & Copy) */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: isVisible ? '#0f172a' : '#94a3b8',
                            fontSize: '12px',
                            minWidth: '55px'
                          }}>
                            {isVisible ? passwordText : '••••••'}
                          </span>

                          {/* Eye Toggle */}
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(st.id)}
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px', display: 'flex' }}
                            title={isVisible ? t('hidePassword') : t('showPassword')}
                          >
                            {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>

                          {/* Copy Button */}
                          <button
                            type="button"
                            onClick={() => copyToClipboard(passwordText, st.id)}
                            style={{ background: 'none', border: 'none', color: isCopied ? '#16a34a' : '#64748b', cursor: 'pointer', padding: '2px', display: 'flex' }}
                            title={isCopied ? t('copied') : t('copyPassword')}
                          >
                            {isCopied ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 600 }}>{formatMoney(st.baseSalary)}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                          {t('active')}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => openEditStaff(st)}
                            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#475569' }}
                            title={t('edit')}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`${st.name} - ${t('delete')}?`)) {
                                onDeleteStaff(st.id);
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: YANGI XODIM QO'SHISH / TAHRIRLASH */}
      {showStaffModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15,23,42,0.65)', 
          backdropFilter: 'blur(4px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 9999, 
          padding: '16px',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '20px', 
            maxWidth: '460px', 
            width: '100%', 
            padding: '22px', 
            boxShadow: '0 20px 35px -10px rgba(0,0,0,0.25)',
            margin: 'auto',
            maxHeight: 'calc(100dvh - 32px)',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} style={{ color: '#2563eb' }} />
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                  {editingStaff ? t('staffModalEditTitle') : t('staffModalAddTitle')}
                </h3>
              </div>
              <button onClick={() => setShowStaffModal(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveStaff} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {t('fullNameLabel')} *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={lang === 'ru' ? 'Иван Иванов' : 'Anvar Karimov'}
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('roleLabel')} *
                  </label>
                  <select 
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="Sotuvchi">{t('staffRoleSeller')}</option>
                    <option value="Buxgalter">{t('staffRoleAccountant')}</option>
                    <option value="Skladchi">{t('staffRoleWarehouse')}</option>
                    <option value="Direktor">{t('staffRoleDirector')}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('phoneLabel')}
                  </label>
                  <input 
                    type="text" 
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Login & Parol Belgilash */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={14} /> {lang === 'ru' ? 'Данные учетной записи для входа' : 'Tizimga kirish hisob ma\'lumotlari'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                      {t('systemUsernameLabel')} *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder={lang === 'ru' ? 'ivan' : 'anvar'}
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                      {t('systemPasswordLabel')} *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {t('baseSalaryLabel')}
                </label>
                <input 
                  type="number" 
                  placeholder={lang === 'ru' ? '4000000' : '4000000'}
                  value={staffSalary}
                  onChange={(e) => setStaffSalary(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '9px 14px', fontSize: '13px', cursor: 'pointer', color: '#475569' }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {editingStaff ? t('save') : t('addStaffBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DIREKTORDAN SKLADGA KIRIM PARTIYASI YUBORISH (PEREXOD) */}
      {showTransferModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15,23,42,0.65)', 
          backdropFilter: 'blur(4px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 9999, 
          padding: '16px',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '20px', 
            maxWidth: '480px', 
            width: '100%', 
            padding: '22px', 
            boxShadow: '0 20px 35px -10px rgba(0,0,0,0.25)',
            margin: 'auto',
            maxHeight: 'calc(100dvh - 32px)',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} style={{ color: '#2563eb' }} />
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                  {lang === 'ru' ? 'Отправка прихода на склад (Переход)' : 'Skladga Tovar Kirimini Yuborish (Perexod)'}
                </h3>
              </div>
              <button onClick={() => setShowTransferModal(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSendTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {t('productNameLabel')} *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={lang === 'ru' ? 'Название товара' : 'Masalan: Klassik Ko\'ylak'}
                  value={transferProductName}
                  onChange={(e) => setTransferProductName(e.target.value)}
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
                    value={transferCategory}
                    onChange={(e) => setTransferCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('supplier')}
                  </label>
                  <input 
                    type="text" 
                    placeholder={lang === 'ru' ? 'Поставщик / Фабрика' : 'Yetkazib beruvchi'}
                    value={transferSupplier}
                    onChange={(e) => setTransferSupplier(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('quantity')} *
                  </label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={transferQuantity}
                    onChange={(e) => setTransferQuantity(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('unitLabel')}
                  </label>
                  <select 
                    value={transferUnit}
                    onChange={(e) => setTransferUnit(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                  >
                    {MEASURE_UNITS.map(u => (
                      <option key={u.id} value={u.id}>{u.label}</option>
                    ))}
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
                    value={transferCostPrice}
                    onChange={(e) => setTransferCostPrice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {t('sellingPrice')} ({t('currency')})
                  </label>
                  <input 
                    type="number" 
                    placeholder="220000"
                    value={transferSellingPrice}
                    onChange={(e) => setTransferSellingPrice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '9px 14px', fontSize: '13px', cursor: 'pointer', color: '#475569' }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('sendNewTransferBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
