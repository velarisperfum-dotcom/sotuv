import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, ShoppingBag, Box, Award, 
  ArrowUpRight, ArrowDownRight, CreditCard, Banknote, Building2, 
  Clock, Eye, Sparkles, UserCheck, BarChart3, Layers, Plus, 
  Send, CheckCircle2, AlertTriangle, Truck, Check, X
} from 'lucide-react';
import { getIndustryById } from '../data/industriesData';
import { MEASURE_UNITS } from '../data/initialData';

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
  storeMode = 'universal',
  onViewReceipt,
  onChangeView
}) {
  const currentIndustry = getIndustryById(storeMode);
  const [filterPeriod, setFilterPeriod] = useState('all'); // 'all', 'month'
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Transfer form state
  const [transferProductName, setTransferProductName] = useState('');
  const [transferCategory, setTransferCategory] = useState('');
  const [transferQuantity, setTransferQuantity] = useState('20');
  const [transferUnit, setTransferUnit] = useState('dona');
  const [transferCostPrice, setTransferCostPrice] = useState('');
  const [transferSellingPrice, setTransferSellingPrice] = useState('');
  const [transferSupplier, setTransferSupplier] = useState('');
  const [transferNotes, setTransferNotes] = useState('');

  const safeSales = Array.isArray(sales) ? sales : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeStaff = Array.isArray(staff) ? staff : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeTransfers = Array.isArray(stockTransfers) ? stockTransfers : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  // Filter sales based on chosen period
  const filteredSales = safeSales.filter(s => {
    if (!s) return false;
    if (filterPeriod === 'all') return true;
    if (filterPeriod === 'month') {
      const currentMonth = new Date().toISOString().slice(0, 7);
      return s.date && String(s.date).startsWith(currentMonth);
    }
    return true;
  });

  // Calculations based on filtered sales
  const totalRevenue = filteredSales.reduce((acc, s) => acc + Number(s?.total || 0), 0);
  
  // Cost of goods sold (COGS)
  const totalCostOfGoodsSold = filteredSales.reduce((acc, s) => {
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

  // 1. SKLADDA QANCHA TOVAR BOR (MIJOZNING ENG ASOSIY SAVOLI)
  const totalStockCount = safeProducts.reduce((acc, p) => acc + Number(p?.stock || 0), 0);
  const warehouseCost = safeProducts.reduce((acc, p) => acc + (Number(p?.costPrice || 0) * Number(p?.stock || 0)), 0);
  const warehouseRetail = safeProducts.reduce((acc, p) => acc + (Number(p?.price || 0) * Number(p?.stock || 0)), 0);
  const lowStockCount = safeProducts.filter(p => (p.stock || 0) <= (p.minStock || 3)).length;

  // 2. QANCHA TOVAR KIRIM BO'LDI (KIRIMLAR HISOBOTI)
  const totalTransfersCount = safeTransfers.length;
  const totalTransferredQuantity = safeTransfers.reduce((acc, t) => acc + Number(t.quantity || 0), 0);
  const totalTransferredCost = safeTransfers.reduce((acc, t) => acc + (Number(t.costPrice || 0) * Number(t.quantity || 0)), 0);

  // 3. NIMADAN QANCHA SOTILDI (TOP TOVARLAR SOTUVI)
  const productSalesMap = {};
  filteredSales.forEach(sale => {
    sale?.items?.forEach(item => {
      if (!item?.name) return;
      if (!productSalesMap[item.name]) {
        productSalesMap[item.name] = { name: item.name, quantity: 0, revenue: 0, unit: item.unit || 'dona' };
      }
      productSalesMap[item.name].quantity += Number(item.quantity || 1);
      productSalesMap[item.name].revenue += Number(item.quantity || 1) * Number(item.price || 0);
    });
  });

  // Also include orders that were dispatched
  safeOrders.filter(o => o.status === 'dispatched_warehouse').forEach(o => {
    o.items?.forEach(item => {
      if (!item?.name) return;
      if (!productSalesMap[item.name]) {
        productSalesMap[item.name] = { name: item.name, quantity: 0, revenue: 0, unit: item.unit || 'dona' };
      }
      // avoid double count if already in sales
      if (!filteredSales.some(s => s.id === o.id)) {
        productSalesMap[item.name].quantity += Number(item.quantity || 1);
        productSalesMap[item.name].revenue += Number(item.total || 0);
      }
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.quantity - a.quantity);

  // 4. TO'LOV TURLARI TAHLILI
  const paymentStats = {
    cash: filteredSales.filter(s => s?.paymentMethod === 'Naqd' || s?.paymentMethod === 'cash').reduce((a, s) => a + Number(s?.total || 0), 0),
    card: filteredSales.filter(s => s?.paymentMethod === 'Karta' || s?.paymentMethod === 'card').reduce((a, s) => a + Number(s?.total || 0), 0),
    bank: filteredSales.filter(s => s?.paymentMethod === 'Bank perech' || s?.paymentMethod === 'bank').reduce((a, s) => a + Number(s?.total || 0), 0),
    debt: filteredSales.filter(s => s?.paymentMethod === 'Qarz' || s?.paymentMethod === 'debt').reduce((a, s) => a + Number(s?.total || 0), 0),
    salary: filteredSales.filter(s => s?.paymentMethod === 'salary_deduction').reduce((a, s) => a + Number(s?.total || 0), 0)
  };

  // Submit new transfer from Director to Warehouse
  const handleSendTransfer = (e) => {
    e.preventDefault();
    if (!transferProductName.trim() || !transferQuantity) return;

    const newTrf = {
      id: `trf-${Date.now()}`,
      transferNumber: `KRM-${Math.floor(10000 + Math.random() * 90000)}`,
      productName: transferProductName.trim(),
      category: transferCategory.trim() || 'Umumiy',
      quantity: Number(transferQuantity),
      unit: transferUnit,
      costPrice: Number(transferCostPrice) || 0,
      price: Number(transferSellingPrice) || Number(transferCostPrice) * 1.3,
      supplier: transferSupplier.trim() || 'Import/Zavod',
      notes: transferNotes.trim() || 'Direktor tomonidan skladga partiya yuborildi',
      createdAt: new Date().toLocaleString('uz-UZ'),
      createdBy: 'Direktor (Sardor Alimov)',
      status: 'pending_warehouse' // Skladchi qabul qilishi kutilmoqda!
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

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Top Banner & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            👑
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Direktor Boshqaruv Paneli (Bosh Nazorat)</h2>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
              Sklad qoldig'i, tovar kirimlari (perexodlar), sotuvlar reytingi va moliyaviy oqim
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowTransferModal(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Plus size={16} /> Skladga Tovar Kirim (Perexod) Berish 📦
          </button>
        </div>
      </div>

      {/* 3 ASOSIY MIJOZ TALABI (KPI KARTALAR) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* 1. SKLADDA QANCHA TOVAR BOR */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#4338ca' }}>1. Skladda Qancha Tovar Bor</span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
                {totalStockCount} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>dona</span>
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b' }}>Sklad Tannarxi:</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatMoney(warehouseCost)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
            <span style={{ color: '#64748b' }}>Sotuv Qiymati:</span>
            <span style={{ fontWeight: 800, color: '#16a34a' }}>{formatMoney(warehouseRetail)}</span>
          </div>
        </div>

        {/* 2. QANCHA TOVAR KIRIM BO'LDI */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>2. Qancha Tovar Kirim Bo'ldi</span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
                +{totalTransferredQuantity} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>dona</span>
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b' }}>Kirim Summasi:</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatMoney(totalTransferredCost)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
            <span style={{ color: '#64748b' }}>Partiyalar soni:</span>
            <span style={{ fontWeight: 700, color: '#059669' }}>{totalTransfersCount} ta jo'natma</span>
          </div>
        </div>

        {/* 3. UMUMIY TUSHUM VA SOF FOYDA */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>Jami Savdo & Sof Foyda</span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
                {formatMoney(totalRevenue)}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b' }}>Sof Foyda (Margin):</span>
            <span style={{ fontWeight: 800, color: netProfit >= 0 ? '#16a34a' : '#dc2626' }}>{formatMoney(netProfit)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
            <span style={{ color: '#64748b' }}>Chiqim & Oyliklar:</span>
            <span style={{ fontWeight: 700, color: '#dc2626' }}>-{formatMoney(totalExpenses + totalStaffSalaries)}</span>
          </div>
        </div>
      </div>

      {/* 2-USTUN: NIMADAN QANCHA SOTILDI VA KIRIMLAR MONITORI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* NIMADAN QANCHA SOTILDI */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: '#f59e0b' }} />
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Nimadan Qancha Sotildi (Top Tovar Reytingi)</h3>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Dona va tushum bo'yicha</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '13px' }}>
                Hozircha sotilgan tovarlar mavjud emas
              </div>
            ) : (
              topProducts.slice(0, 7).map((prod, idx) => (
                <div key={idx} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: idx === 0 ? '#fef3c7' : '#e2e8f0', color: idx === 0 ? '#b45309' : '#475569', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>{prod.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#4f46e5' }}>{prod.quantity} {prod.unit}</span>
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>({formatMoney(prod.revenue)})</span>
                    </div>
                  </div>
                  {/* Progress visual bar */}
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (prod.quantity / (topProducts[0]?.quantity || 1)) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)', borderRadius: '4px' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SKLADGA PEREHODLAR (KIRIMLAR) MONITORI */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} style={{ color: '#10b981' }} />
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Skladga Perexodlar & Skladchi Qabuli</h3>
            </div>
            <button
              onClick={() => setShowTransferModal(true)}
              style={{ background: '#f0fdf4', color: '#16a34a', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              + Yangi Kirim
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {safeTransfers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '13px' }}>
                Hozircha kirimlar yuborilmagan
              </div>
            ) : (
              safeTransfers.slice(0, 6).map(t => {
                const isPending = t.status === 'pending_warehouse';
                return (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '12px', fontSize: '13px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{t.productName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        +{t.quantity} {t.unit} | Yetkazib beruvchi: {t.supplier} | {t.createdAt}
                      </div>
                    </div>
                    <div>
                      <span style={{ 
                        background: isPending ? '#fef3c7' : '#dcfce7', 
                        color: isPending ? '#b45309' : '#15803d', 
                        padding: '4px 10px', 
                        borderRadius: '8px', 
                        fontSize: '11px', 
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {isPending ? "⏳ Skladchi qabuli kutilmoqda" : "✅ Skladchi qabul qildi"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* TO'LOV TURLARI KESIMIDA MOLIYAVIY OQIM */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#0f172a' }}>To'lov Turlari Bo'yicha Tushumlar Analitikasi</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>💵 Naqd Pul Tushumi</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>{formatMoney(paymentStats.cash)}</div>
          </div>

          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '14px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: 600 }}>💳 Plastik Karta Tushumi</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>{formatMoney(paymentStats.card)}</div>
          </div>

          <div style={{ background: '#f5f3ff', padding: '14px', borderRadius: '14px', border: '1px solid #ddd6fe' }}>
            <div style={{ fontSize: '12px', color: '#5b21b6', fontWeight: 600 }}>🏦 Bank Perechisleniye</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#6d28d9', marginTop: '4px' }}>{formatMoney(paymentStats.bank)}</div>
          </div>

          <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '14px', border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>📝 Qarzga (Nasiya) Berilgan</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>{formatMoney(paymentStats.debt)}</div>
          </div>

          <div style={{ background: '#fdf2f8', padding: '14px', borderRadius: '14px', border: '1px solid #fbcfe8' }}>
            <div style={{ fontSize: '12px', color: '#9d174d', fontWeight: 600 }}>💼 Oylikdan Ushlangan</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#be185d', marginTop: '4px' }}>{formatMoney(paymentStats.salary)}</div>
          </div>
        </div>
      </div>

      {/* MODAL: DIREKTOR SKLADGA TOVAR PEREHODINI YUBORISH */}
      {showTransferModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box size={22} style={{ color: '#10b981' }} />
                <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>Skladga Tovar Kirim (Perexod) Yuborish</h3>
              </div>
              <button onClick={() => setShowTransferModal(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
              Direktor partiyani yuboradi. Tovar skladchining <strong>"Kutilayotgan kirimlar"</strong> bo'limiga tushadi va u "Qabul qildim" deb tasdiqlaganda sklad balansiga kiritiladi.
            </p>

            <form onSubmit={handleSendTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Tovar Nomi *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Masalan: Zara Slim Fit Klassik Ko'ylak"
                  value={transferProductName}
                  onChange={(e) => setTransferProductName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Toifa / Kategoriya</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Ko'ylaklar"
                    value={transferCategory}
                    onChange={(e) => setTransferCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Miqdori va Birligi *</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input 
                      type="number" 
                      required
                      placeholder="20"
                      value={transferQuantity}
                      onChange={(e) => setTransferQuantity(e.target.value)}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                    <select
                      value={transferUnit}
                      onChange={(e) => setTransferUnit(e.target.value)}
                      style={{ padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}
                    >
                      {MEASURE_UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Sotib Olish Narxi (Tannarx)</label>
                  <input 
                    type="number" 
                    placeholder="200000"
                    value={transferCostPrice}
                    onChange={(e) => setTransferCostPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Sotish Narxi (Do'konda)</label>
                  <input 
                    type="number" 
                    placeholder="320000"
                    value={transferSellingPrice}
                    onChange={(e) => setTransferSellingPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Yetkazib Beruvchi (Postavshik)</label>
                <input 
                  type="text" 
                  placeholder="Masalan: Turkiya Tekstil MCHJ"
                  value={transferSupplier}
                  onChange={(e) => setTransferSupplier(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Izoh / Jo'natma hujjati raqami</label>
                <input 
                  type="text" 
                  placeholder="Kirim partiyasi bo'yicha qo'shimcha ma'lumot"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#10b981', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Skladga Yuborish 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
