import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, Box, Award, 
  ArrowUpRight, ArrowDownRight, CreditCard, Building2, 
  Clock, Eye, UserCheck, BarChart3, Layers, Plus, 
  Send, CheckCircle2, AlertTriangle, Truck, Check, X,
  Users, UserPlus, Edit2, Trash2, Shield, Phone, Key
} from 'lucide-react';
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
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onViewReceipt
}) {
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

  const safeSales = Array.isArray(sales) ? sales : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeStaff = Array.isArray(staff) ? staff : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeTransfers = Array.isArray(stockTransfers) ? stockTransfers : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

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

  // 4. To'lov turlari
  const paymentStats = {
    cash: safeSales.filter(s => s?.paymentMethod === 'Naqd' || s?.paymentMethod === 'cash').reduce((a, s) => a + Number(s?.total || 0), 0),
    card: safeSales.filter(s => s?.paymentMethod === 'Karta' || s?.paymentMethod === 'card').reduce((a, s) => a + Number(s?.total || 0), 0),
    bank: safeSales.filter(s => s?.paymentMethod === 'Bank perech' || s?.paymentMethod === 'bank').reduce((a, s) => a + Number(s?.total || 0), 0),
    debt: safeSales.filter(s => s?.paymentMethod === 'Qarz' || s?.paymentMethod === 'debt').reduce((a, s) => a + Number(s?.total || 0), 0),
    salary: safeSales.filter(s => s?.paymentMethod === 'salary_deduction').reduce((a, s) => a + Number(s?.total || 0), 0)
  };

  // Submit transfer
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
      price: Number(transferSellingPrice) || (Number(transferCostPrice) * 1.3),
      supplier: transferSupplier.trim() || 'Yetkazib beruvchi',
      notes: transferNotes.trim() || 'Direktor tomonidan yuborilgan kirim',
      createdAt: new Date().toLocaleString('uz-UZ'),
      createdBy: 'Direktor',
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

    // Role mapping
    let mappedRole = 'seller_mobile';
    if (staffRole.toLowerCase().includes('direktor')) mappedRole = 'director';
    else if (staffRole.toLowerCase().includes('buxgalter')) mappedRole = 'accountant';
    else if (staffRole.toLowerCase().includes('sklad')) mappedRole = 'warehouse';

    if (editingStaff) {
      onUpdateStaff({
        ...editingStaff,
        name: staffName.trim(),
        role: staffRole,
        phone: staffPhone.trim(),
        username: staffUsername.trim().toLowerCase(),
        password: staffPassword.trim(),
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
        status: 'Faol',
        systemRole: mappedRole
      });
    }

    setShowStaffModal(false);
    resetStaffForm();
  };

  const resetStaffForm = () => {
    setStaffName('');
    setStaffRole('Sotuvchi');
    setStaffPhone('+998 ');
    setStaffUsername('');
    setStaffPassword('1234');
    setStaffSalary('');
    setEditingStaff(null);
  };

  const openEditStaff = (st) => {
    setEditingStaff(st);
    setStaffName(st.name || '');
    setStaffRole(st.role || 'Sotuvchi');
    setStaffPhone(st.phone || '+998 ');
    setStaffUsername(st.username || '');
    setStaffPassword(st.password || '1234');
    setStaffSalary(st.baseSalary || '');
    setShowStaffModal(true);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px', fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            Direktor Boshqaruv Markazi
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Sklad zaxirasi, tovar kirimlari, sotuvlar tahlili va xodimlar boshqaruvi
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { resetStaffForm(); setShowStaffModal(true); }}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <UserPlus size={16} /> Yangi Xodim Qo'shish
          </button>

          <button
            onClick={() => setShowTransferModal(true)}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} /> Skladga Tovar Yuborish (Kirim)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '12px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'overview' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <BarChart3 size={17} /> Asosiy Ko'rsatkichlar
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          style={{
            padding: '12px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'transfers' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'transfers' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Truck size={17} /> Skladga Kirimlar ({safeTransfers.length})
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          style={{
            padding: '12px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'staff' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'staff' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={17} /> Xodimlar & Tizimga Kirish ({safeStaff.length})
        </button>
      </div>

      {/* TAB 1: ASOSIY KO'RSATKICHLAR */}
      {activeTab === 'overview' && (
        <div>
          {/* Top 3 KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            
            {/* 1. Skladda Qancha Tovar Bor */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Skladdagi Jami Tovar</span>
                <Box size={20} style={{ color: '#2563eb' }} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
                {totalStockCount} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>dona</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Tannarx qiymati:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatMoney(warehouseCost)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                <span style={{ color: '#64748b' }}>Sotuv qiymati:</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>{formatMoney(warehouseRetail)}</span>
              </div>
            </div>

            {/* 2. Qancha Tovar Kirim Bo'ldi */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Kirim Bo'lgan Tovarlar</span>
                <Truck size={20} style={{ color: '#16a34a' }} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
                +{totalTransferredQuantity} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>dona</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Kirim summasi:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatMoney(totalTransferredCost)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                <span style={{ color: '#64748b' }}>Partiyalar soni:</span>
                <span style={{ fontWeight: 700, color: '#2563eb' }}>{totalTransfersCount} ta</span>
              </div>
            </div>

            {/* 3. Savdo & Sof Foyda */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Jami Sotuv & Tushum</span>
                <TrendingUp size={20} style={{ color: '#7c3aed' }} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
                {formatMoney(totalRevenue)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Sof foyda:</span>
                <span style={{ fontWeight: 700, color: netProfit >= 0 ? '#16a34a' : '#dc2626' }}>{formatMoney(netProfit)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                <span style={{ color: '#64748b' }}>Chiqimlar:</span>
                <span style={{ fontWeight: 700, color: '#dc2626' }}>-{formatMoney(totalExpenses + totalStaffSalaries)}</span>
              </div>
            </div>
          </div>

          {/* Nimadan Qancha Sotildi & To'lovlar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            
            {/* Top Sotilgan Tovarlar */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Nimadan Qancha Sotildi</div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Sotilgan dona bo'yicha</span>
              </div>

              {topProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', color: '#94a3b8', fontSize: '13px' }}>
                  Hozircha sotuvlar amalga oshirilmagan
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {topProducts.slice(0, 6).map((prod, idx) => (
                    <div key={idx} style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{idx + 1}. {prod.name}</span>
                        <span style={{ fontWeight: 800, color: '#2563eb' }}>{prod.quantity} {prod.unit} ({formatMoney(prod.revenue)})</span>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (prod.quantity / (topProducts[0]?.quantity || 1)) * 100)}%`, height: '100%', background: '#2563eb' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* To'lov turlari oqimi */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                To'lov Turlari Bo'yicha Tushumlar
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#475569' }}>Naqd pul tushumi:</span>
                  <strong style={{ color: '#16a34a' }}>{formatMoney(paymentStats.cash)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#475569' }}>Plastik karta:</span>
                  <strong style={{ color: '#2563eb' }}>{formatMoney(paymentStats.card)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#475569' }}>Bank perechisleniye:</span>
                  <strong style={{ color: '#7c3aed' }}>{formatMoney(paymentStats.bank)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#475569' }}>Qarzga (Nasiyaga) berilgan:</span>
                  <strong style={{ color: '#d97706' }}>{formatMoney(paymentStats.debt)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#475569' }}>Xodim maoshidan ushlangan:</span>
                  <strong style={{ color: '#db2777' }}>{formatMoney(paymentStats.salary)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SKLADGA KIRIMLAR (PEREXODLAR) */}
      {activeTab === 'transfers' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Skladga Jo'natilgan Tovar Partiyalari (Perexodlar)</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Direktor yuborgan tovarlarni skladchi sanab oladi va sklad balansiga kiritadi</p>
            </div>

            <button
              onClick={() => setShowTransferModal(true)}
              style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} /> Yangi Partiya Yuborish
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>Hujjat №</th>
                  <th style={{ padding: '12px 14px' }}>Tovar Nomi</th>
                  <th style={{ padding: '12px 14px' }}>Miqdor</th>
                  <th style={{ padding: '12px 14px' }}>Tannarx</th>
                  <th style={{ padding: '12px 14px' }}>Sotish Narxi</th>
                  <th style={{ padding: '12px 14px' }}>Yetkazib beruvchi</th>
                  <th style={{ padding: '12px 14px' }}>Sana</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Holat</th>
                </tr>
              </thead>
              <tbody>
                {safeTransfers.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                      Hozircha skladga kirimlar jo'natilmagan
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
                          {trf.status === 'received' ? "Qabul qilindi" : "Skladchi qabuli kutilmoqda"}
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

      {/* TAB 3: XODIMLAR VA FOYDALANUVCHILAR BOSHQARUVI */}
      {activeTab === 'staff' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Xodimlar va Tizimga Kirish Huquqlari</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Direktor bu yerdan yangi xodimlarni kiritadi, login va parollarini belgilaydi</p>
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
              <UserPlus size={16} /> Yangi Xodim Qo'shish
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>F.I.Sh</th>
                  <th style={{ padding: '12px 14px' }}>Lavozimi</th>
                  <th style={{ padding: '12px 14px' }}>Telefon</th>
                  <th style={{ padding: '12px 14px' }}>Tizim Logini</th>
                  <th style={{ padding: '12px 14px' }}>Oylik Maoshi</th>
                  <th style={{ padding: '12px 14px' }}>Holat</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amal</th>
                </tr>
              </thead>
              <tbody>
                {safeStaff.map(st => (
                  <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{st.name}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: st.role.toLowerCase().includes('direktor') ? '#fef3c7' :
                                    st.role.toLowerCase().includes('buxgalter') ? '#dcfce7' :
                                    st.role.toLowerCase().includes('sklad') ? '#e0f2fe' : '#ede9fe',
                        color: st.role.toLowerCase().includes('direktor') ? '#b45309' :
                               st.role.toLowerCase().includes('buxgalter') ? '#15803d' :
                               st.role.toLowerCase().includes('sklad') ? '#0369a1' : '#6d28d9'
                      }}>
                        {st.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{st.phone || '—'}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#2563eb', fontWeight: 700 }}>
                      {st.username || st.name.toLowerCase().replace(/\s+/g, '')}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 600 }}>{formatMoney(st.baseSalary)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                        Faol
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => openEditStaff(st)}
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#475569' }}
                          title="Tahrirlash"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Haqiqatan ham "${st.name}" xodimini o'chirmoqchimisiz?`)) {
                              onDeleteStaff(st.id);
                            }
                          }}
                          style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#dc2626' }}
                          title="O'chirish"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: YANGI XODIM QO'SHISH / TAHRIRLASH */}
      {showStaffModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', maxWidth: '440px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} style={{ color: '#2563eb' }} />
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                  {editingStaff ? "Xodim Ma'lumotlarini Tahrirlash" : "Yangi Xodim Qo'shish"}
                </h3>
              </div>
              <button onClick={() => setShowStaffModal(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveStaff} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Ism va Familiya *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Masalan: Anvar Karimov"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Lavozimi / Roli *</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#ffffff' }}
                >
                  <option value="Sotuvchi">Sotuvchi (Mobil APK / Agent)</option>
                  <option value="Sklad Mudiri">Sklad Mudiri (Ombor)</option>
                  <option value="Bosh Buxgalter">Bosh Buxgalter (Moliya)</option>
                  <option value="Direktor">Direktor (Boshqaruv)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Telefon raqami</label>
                <input 
                  type="text" 
                  placeholder="+998 90 123 45 67"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Tizim Logini *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="login"
                    value={staffUsername}
                    onChange={(e) => setStaffUsername(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Paroli *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="1234"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Oylik Maoshi (so'm)</label>
                <input 
                  type="number" 
                  placeholder="4000000"
                  value={staffSalary}
                  onChange={(e) => setStaffSalary(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DIREKTOR SKLADGA TOVAR YUBORISH */}
      {showTransferModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', maxWidth: '460px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box size={18} style={{ color: '#2563eb' }} />
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Skladga Tovar Kirim (Perexod) Yuborish</h3>
              </div>
              <button onClick={() => setShowTransferModal(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSendTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Tovar Nomi *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Tovar nomi"
                  value={transferProductName}
                  onChange={(e) => setTransferProductName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Toifa</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Kiyim"
                    value={transferCategory}
                    onChange={(e) => setTransferCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Miqdor & Birlik *</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input 
                      type="number" 
                      required
                      placeholder="20"
                      value={transferQuantity}
                      onChange={(e) => setTransferQuantity(e.target.value)}
                      style={{ flex: 1, padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                    <select
                      value={transferUnit}
                      onChange={(e) => setTransferUnit(e.target.value)}
                      style={{ padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#ffffff' }}
                    >
                      {MEASURE_UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Tannarxi (so'm)</label>
                  <input 
                    type="number" 
                    placeholder="200000"
                    value={transferCostPrice}
                    onChange={(e) => setTransferCostPrice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Sotish Narxi (so'm)</label>
                  <input 
                    type="number" 
                    placeholder="300000"
                    value={transferSellingPrice}
                    onChange={(e) => setTransferSellingPrice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Yetkazib Beruvchi</label>
                <input 
                  type="text" 
                  placeholder="Yetkazib beruvchi kompaniya"
                  value={transferSupplier}
                  onChange={(e) => setTransferSupplier(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Skladga Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
