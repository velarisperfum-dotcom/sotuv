import React, { useState } from 'react';
import { 
  DollarSign, CreditCard, Building2, Clock, Users, Plus, 
  ArrowDownCircle, ArrowUpCircle, CheckCircle2, AlertCircle, 
  FileText, Check, X, ShieldCheck, UserCheck, AlertTriangle, 
  BadgePercent, ArrowRight, Wallet, History, Eye
} from 'lucide-react';
import { PAYMENT_METHODS } from '../data/initialData';
import { useLang } from '../context/LanguageContext';

export default function AccountingView({ 
  balances = { cash: 0, card: 0, bank: 0 }, 
  debts = [], 
  staff = [], 
  expenses = [], 
  orders = [],
  sales = [],
  onApproveOrder,
  onRejectOrder,
  onPayDebt, 
  onAddDebt, 
  onPaySalary, 
  onAddExpense 
}) {
  const { t, lang } = useLang();
  const safeBalances = balances || { cash: 0, card: 0, bank: 0 };
  const safeDebts = Array.isArray(debts) ? debts : [];
  const safeStaff = Array.isArray(staff) ? staff : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Active Tab: 'orders_approval' | 'balances' | 'debts' | 'salaries' | 'expenses'
  const [activeTab, setActiveTab] = useState('orders_approval');
  
  // Reject order modal
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Pay debt modal
  const [showPayDebtModal, setShowPayDebtModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Naqd');

  // New expense modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Ijara');
  const [expenseSource, setExpenseSource] = useState('Naqd');

  // Pay salary modal
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [salaryAmount, setSalaryAmount] = useState('');
  const [salarySource, setSalarySource] = useState('Bank perech');

  const formatMoney = (val) => Number(val || 0).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ') + " " + t('currency');

  // Orders Filter
  const pendingOrders = safeOrders.filter(o => o.status === 'pending_accounting');
  const approvedOrders = safeOrders.filter(o => o.status === 'approved_accounting' || o.status === 'dispatched_warehouse');
  const rejectedOrders = safeOrders.filter(o => o.status === 'rejected_accounting');

  const totalDebtsRemaining = safeDebts.reduce((acc, d) => acc + (d.remainingAmount || 0), 0);
  const totalSalaries = safeStaff.reduce((acc, s) => acc + (s.baseSalary || 0), 0);
  const totalPaidSalaries = safeStaff.reduce((acc, s) => acc + (s.paidThisMonth || 0), 0);
  const totalExpenses = safeExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

  // Total Liquid Assets
  const totalLiquid = (safeBalances.cash || 0) + (safeBalances.card || 0) + (safeBalances.bank || 0);

  const handleConfirmPayDebt = (e) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) return;
    onPayDebt(selectedDebt.id, Number(payAmount), payMethod);
    setShowPayDebtModal(false);
    setSelectedDebt(null);
  };

  const handleConfirmExpense = (e) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;
    onAddExpense({
      id: `exp-${Date.now()}`,
      title: expenseTitle,
      amount: Number(expenseAmount),
      category: expenseCategory,
      source: expenseSource,
      date: new Date().toISOString().split('T')[0]
    });
    setShowExpenseModal(false);
    setExpenseTitle('');
    setExpenseAmount('');
  };

  const handleConfirmSalary = (e) => {
    e.preventDefault();
    if (!salaryAmount || Number(salaryAmount) <= 0) return;
    onPaySalary(selectedStaff.id, Number(salaryAmount), salarySource);
    setShowSalaryModal(false);
    setSelectedStaff(null);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectingOrder) return;
    onRejectOrder(rejectingOrder.id, rejectReason || "To'lov tasdiqlanmadi");
    setRejectingOrder(null);
    setRejectReason('');
  };

  return (
    <div className="cabinet-container">
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Wallet size={22} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{t('accountingCabinet')}</h2>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              {t('accountingNoticeDesc')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowExpenseModal(true)}
            style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> {t('newExpenseBtn')}
          </button>
        </div>
      </div>

      {/* Main KPI Balances Cards */}
      <div className="cabinet-kpi-grid">
        {/* Naqd Kassa */}
        <div className="kpi-card-box" style={{ background: '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>{t('cash')} ({lang === 'ru' ? 'Наличные' : 'Naqd pul'})</span>
            <DollarSign size={18} />
          </div>
          <div className="kpi-amount-text" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{formatMoney(safeBalances.cash)}</div>
          <div className="kpi-sub-text" style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
            {lang === 'ru' ? 'Наличная касса и выручка' : 'Naqd savdo va tushumlar'}
          </div>
        </div>

        {/* Plastik Karta */}
        <div className="kpi-card-box" style={{ background: '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3b82f6', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>{t('card')} (Terminal)</span>
            <CreditCard size={18} />
          </div>
          <div className="kpi-amount-text" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{formatMoney(safeBalances.card)}</div>
          <div className="kpi-sub-text" style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
            {lang === 'ru' ? 'Банковские карты, Click, Payme' : 'Karta va Click/Payme'}
          </div>
        </div>

        {/* Bank Perechisleniye */}
        <div className="kpi-card-box" style={{ background: '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b5cf6', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>{t('bank')} ({lang === 'ru' ? 'Расчетный счет' : 'Hisob raqam'})</span>
            <Building2 size={18} />
          </div>
          <div className="kpi-amount-text" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{formatMoney(safeBalances.bank)}</div>
          <div className="kpi-sub-text" style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
            {lang === 'ru' ? 'Платежное поручение (Перечисление)' : 'Bank to\'lov topshirig\'i (Perech)'}
          </div>
        </div>

        {/* Nasiyalar / Qarzlar */}
        <div className="kpi-card-box" style={{ background: '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>{t('debt')} ({lang === 'ru' ? 'Дебиторка' : 'Nasiya'})</span>
            <Clock size={18} />
          </div>
          <div className="kpi-amount-text" style={{ fontSize: '20px', fontWeight: 800, color: '#b45309' }}>{formatMoney(totalDebtsRemaining)}</div>
          <div className="kpi-sub-text" style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
            {lang === 'ru' ? 'Неоплаченные долги клиентов' : 'Mijozlarning to\'lanmagan qarzi'}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="cabinet-tabs-scroll">
        <button
          onClick={() => setActiveTab('orders_approval')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'orders_approval' ? '3px solid #4f46e5' : '3px solid transparent',
            color: activeTab === 'orders_approval' ? '#4f46e5' : '#64748b',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <ShieldCheck size={16} /> {t('tabOrderApproval')}
          {pendingOrders.length > 0 && (
            <span style={{ background: '#ef4444', color: '#ffffff', borderRadius: '10px', padding: '2px 7px', fontSize: '10px', fontWeight: 800 }}>
              {pendingOrders.length} {lang === 'ru' ? 'новых' : 'yangi'}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('debts')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'debts' ? '3px solid #f59e0b' : '3px solid transparent',
            color: activeTab === 'debts' ? '#f59e0b' : '#64748b',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <Clock size={16} /> {t('tabDebts')} ({safeDebts.length})
        </button>

        <button
          onClick={() => setActiveTab('salaries')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'salaries' ? '3px solid #10b981' : '3px solid transparent',
            color: activeTab === 'salaries' ? '#10b981' : '#64748b',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <Users size={16} /> {t('tabSalaries')} ({safeStaff.length})
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'expenses' ? '3px solid #64748b' : '3px solid transparent',
            color: activeTab === 'expenses' ? '#0f172a' : '#64748b',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <FileText size={16} /> {t('tabExpenses')}
        </button>
      </div>

      {/* TAB 1: ZAYAVKALAR VA APLATA NAZORATI */}
      {activeTab === 'orders_approval' && (
        <div>
          {/* Info Banner */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={20} />
            </div>
            <div style={{ fontSize: '13px', color: '#1e293b', lineHeight: '1.4' }}>
              <strong>{t('accountingNoticeTitle')}</strong> {t('accountingNoticeDesc')}
            </div>
          </div>

          {/* Kutilayotgan Zayavkalar */}
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                {t('pendingOrdersTitle')} ({pendingOrders.length})
              </h3>
            </div>

            {pendingOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 4px', color: '#1e293b' }}>{t('allOrdersApproved')}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  {lang === 'ru' ? 'Когда продавцы отправят новую заявку, она появится здесь' : 'Sotuvchilar yangi zayavka yuborganida shu yerda paydo bo\'ladi'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {pendingOrders.map(order => (
                  <div 
                    key={order.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #fed7aa',
                      borderRadius: '18px',
                      padding: '18px',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.06)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#c2410c', background: '#ffedd5', padding: '2px 10px', borderRadius: '8px' }}>
                            {order.orderNumber || order.id}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{order.createdAt}</span>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                          {lang === 'ru' ? 'Клиент:' : 'Mijoz:'} {order.customerName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {lang === 'ru' ? 'Тел:' : 'Tel:'} <strong>{order.customerPhone || (lang === 'ru' ? 'Не указан' : 'Kiritilmagan')}</strong> | {lang === 'ru' ? 'Продавец:' : 'Sotuvchi:'} <strong>{order.sellerName}</strong>
                        </div>
                      </div>

                      {/* To'lov turi badge & Summa */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{t('paymentMethodLabel')}</div>
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          padding: '4px 12px', 
                          borderRadius: '8px', 
                          fontWeight: 700, 
                          fontSize: '12px',
                          marginTop: '2px',
                          background: order.paymentMethod === 'bank' ? '#f5f3ff' : order.paymentMethod === 'debt' ? '#fffbeb' : order.paymentMethod === 'card' ? '#eff6ff' : '#f0fdf4',
                          color: order.paymentMethod === 'bank' ? '#7c3aed' : order.paymentMethod === 'debt' ? '#b45309' : order.paymentMethod === 'card' ? '#1d4ed8' : '#15803d'
                        }}>
                          {order.paymentMethod === 'cash' && t('paymentCash')}
                          {order.paymentMethod === 'card' && t('paymentCard')}
                          {order.paymentMethod === 'debt' && t('paymentDebt')}
                          {order.paymentMethod === 'bank' && t('paymentBank')}
                          {order.paymentMethod === 'salary_deduction' && t('paymentSalary')}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                          {formatMoney(order.totalAmount)}
                        </div>
                      </div>
                    </div>

                    {/* Tovarlar va To'lov Izohi */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '14px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                          {lang === 'ru' ? 'Товары в заказе:' : 'Mahsulotlar:'}
                        </div>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '12px', color: '#1e293b' }}>
                            • {item.name} × {item.quantity} ({formatMoney(item.total)})
                          </div>
                        ))}
                      </div>

                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                          {lang === 'ru' ? 'Детали оплаты / Документ:' : 'To\'lov Tafsiloti / Hujjat:'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600 }}>
                          {order.paymentDetails || (lang === 'ru' ? 'Без комментария' : 'Izoh kiritilmagan')}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                          {order.paymentMethod === 'debt' && (lang === 'ru' ? 'Автоматически вносится в книгу долгов' : 'Qarz daftarga avtomatik kiritiladi')}
                          {order.paymentMethod === 'bank' && (lang === 'ru' ? 'Зачисляется на расчетный счет компании' : 'Bank hisobiga tushum sifatida yoziladi')}
                          {order.paymentMethod === 'salary_deduction' && (lang === 'ru' ? `Удерживается из зарплаты продавца (${order.sellerName})` : `Sotuvchi (${order.sellerName}) maoshidan chegiriladi`)}
                        </div>
                      </div>
                    </div>

                    {/* Tasdiqlash / Rad etish tugmalari */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => { setRejectingOrder(order); setRejectReason(''); }}
                        style={{
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '11px 18px',
                          fontSize: '13px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          flex: '1 1 120px'
                        }}
                      >
                        <X size={16} /> {t('rejectOrderBtn')}
                      </button>

                      <button
                        onClick={() => onApproveOrder(order.id)}
                        style={{
                          background: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '11px 22px',
                          fontSize: '13px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
                          flex: '1 1 140px'
                        }}
                      >
                        <Check size={16} /> {t('approveOrderBtn')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tasdiqlangan Zayavkalar Tarixi */}
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#0f172a' }}>
              {t('approvedOrdersHistory')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {approvedOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px' }}>
                  {lang === 'ru' ? 'Пока нет подтвержденных заказов' : 'Hozircha tasdiqlangan zakazlar yo\'q'}
                </div>
              ) : (
                approvedOrders.map(order => (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '12px', fontSize: '13px' }}>
                    <div>
                      <span style={{ fontWeight: 800, color: '#2563eb' }}>{order.orderNumber || order.id}</span>
                      <span style={{ marginLeft: '10px', color: '#0f172a', fontWeight: 600 }}>{order.customerName}</span>
                      <span style={{ marginLeft: '10px', color: '#64748b' }}>({order.paymentMethod?.toUpperCase()})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>{formatMoney(order.totalAmount)}</span>
                      <span style={{ background: order.status === 'dispatched_warehouse' ? '#dcfce7' : '#eff6ff', color: order.status === 'dispatched_warehouse' ? '#15803d' : '#1d4ed8', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                        {order.status === 'dispatched_warehouse' ? t('warehouseDispatched') : t('warehousePacking')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QARZLAR (NASIYA) DAFTARI */}
      {activeTab === 'debts' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{t('tabDebts')}</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                {lang === 'ru' ? 'Учет долгов клиентов и история их погашения' : 'Qarzga sotilgan tovarlar va ularning so\'ndirilishi'}
              </p>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="desktop-table-view">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ru' ? 'Клиент' : 'Mijoz'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ru' ? 'Телефон' : 'Telefon'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ru' ? 'Общий Долг' : 'Umumiy Qarz'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ru' ? 'Остаток Долга' : 'Qolgan Summa'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ru' ? 'Срок' : 'Muddat'}</th>
                    <th style={{ padding: '12px 14px' }}>{t('status')}</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {safeDebts.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                        {lang === 'ru' ? 'На данный момент задолженностей нет' : 'Hozirda qarzdorliklar mavjud emas'}
                      </td>
                    </tr>
                  ) : (
                    safeDebts.map(debt => (
                      <tr key={debt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{debt.customerName}</td>
                        <td style={{ padding: '12px 14px', color: '#64748b' }}>{debt.customerPhone || '—'}</td>
                        <td style={{ padding: '12px 14px', color: '#64748b' }}>{formatMoney(debt.totalDebt)}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#dc2626' }}>{formatMoney(debt.remainingAmount)}</td>
                        <td style={{ padding: '12px 14px', color: '#64748b' }}>{debt.dueDate || debt.date || '—'}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: debt.remainingAmount === 0 ? '#dcfce7' : '#fee2e2', color: debt.remainingAmount === 0 ? '#15803d' : '#b91c1c', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                            {debt.remainingAmount === 0 ? (lang === 'ru' ? 'Полностью погашен' : "To'liq so'ndirilgan") : (lang === 'ru' ? 'Не оплачен' : "To'lanmagan")}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          {debt.remainingAmount > 0 && (
                            <button
                              onClick={() => {
                                setSelectedDebt(debt);
                                setPayAmount(debt.remainingAmount);
                                setShowPayDebtModal(true);
                              }}
                              style={{ background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              {t('payDebtBtn')}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-card-view">
            {safeDebts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                {lang === 'ru' ? 'На данный момент задолженностей нет' : 'Hozirda qarzdorliklar mavjud emas'}
              </div>
            ) : (
              safeDebts.map(debt => (
                <div key={debt.id} className="mobile-record-card">
                  <div className="mobile-record-header">
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{debt.customerName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{debt.customerPhone || '—'}</div>
                    </div>
                    <span style={{
                      background: debt.remainingAmount === 0 ? '#dcfce7' : '#fee2e2',
                      color: debt.remainingAmount === 0 ? '#15803d' : '#b91c1c',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {debt.remainingAmount === 0 ? (lang === 'ru' ? 'Погашен' : "So'ndirilgan") : (lang === 'ru' ? 'Не оплачен' : "Qarzdor")}
                    </span>
                  </div>

                  <div className="mobile-record-grid">
                    <div>
                      <span className="mobile-record-label">{lang === 'ru' ? 'Общий долг:' : 'Umumiy qarz:'}</span>
                      <span className="mobile-record-val">{formatMoney(debt.totalDebt)}</span>
                    </div>
                    <div>
                      <span className="mobile-record-label">{lang === 'ru' ? 'Остаток:' : 'Qolgan summa:'}</span>
                      <span style={{ fontWeight: 800, color: '#dc2626' }}>{formatMoney(debt.remainingAmount)}</span>
                    </div>
                    <div>
                      <span className="mobile-record-label">{lang === 'ru' ? 'Срок:' : 'Muddat:'}</span>
                      <span className="mobile-record-val">{debt.dueDate || debt.date || '—'}</span>
                    </div>
                  </div>

                  {debt.remainingAmount > 0 && (
                    <div className="mobile-record-actions">
                      <button
                        onClick={() => {
                          setSelectedDebt(debt);
                          setPayAmount(debt.remainingAmount);
                          setShowPayDebtModal(true);
                        }}
                        style={{
                          background: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '10px 16px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          width: '100%',
                          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        {t('payDebtBtn')}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: OYLIK MAOSHLAR VA OYLIKDAN CHEGIRISH */}
      {activeTab === 'salaries' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{t('tabSalaries')}</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                {lang === 'ru' ? 'Выплата заработной платы и учет удержаний из продаж' : 'Oylik to\'lash va savdodan "Oyligidan oldi" bo\'lgan summalarni nazorat qilish'}
              </p>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="desktop-table-view">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ru' ? 'Сотрудник' : 'Xodim'}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colRole')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colSalary')}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ru' ? 'Выплачено' : "To'langan Summa"}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ru' ? 'Остаток к выплате' : "Qoldiq To'lov"}</th>
                    <th style={{ padding: '12px 14px' }}>{t('status')}</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {safeStaff.map(st => {
                    const remaining = Math.max(0, (st.baseSalary || 0) - (st.paidThisMonth || 0));
                    return (
                      <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{st.name}</td>
                        <td style={{ padding: '12px 14px', color: '#64748b' }}>{st.role}</td>
                        <td style={{ padding: '12px 14px', color: '#64748b' }}>{formatMoney(st.baseSalary)}</td>
                        <td style={{ padding: '12px 14px', color: '#10b981', fontWeight: 700 }}>{formatMoney(st.paidThisMonth)}</td>
                        <td style={{ padding: '12px 14px', color: remaining > 0 ? '#b45309' : '#64748b', fontWeight: 700 }}>
                          {formatMoney(remaining)}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: remaining === 0 ? '#dcfce7' : '#fef3c7', color: remaining === 0 ? '#15803d' : '#b45309', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                            {remaining === 0 ? (lang === 'ru' ? 'Выплачено полностью' : "To'liq to'langan") : (lang === 'ru' ? 'К выплате' : "To'lanishi kerak")}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          {remaining > 0 && (
                            <button
                              onClick={() => {
                                setSelectedStaff(st);
                                setSalaryAmount(remaining);
                                setShowSalaryModal(true);
                              }}
                              style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              {t('paySalaryBtn')}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-card-view">
            {safeStaff.map(st => {
              const remaining = Math.max(0, (st.baseSalary || 0) - (st.paidThisMonth || 0));
              return (
                <div key={st.id} className="mobile-record-card">
                  <div className="mobile-record-header">
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{st.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{st.role}</div>
                    </div>
                    <span style={{
                      background: remaining === 0 ? '#dcfce7' : '#fef3c7',
                      color: remaining === 0 ? '#15803d' : '#b45309',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {remaining === 0 ? (lang === 'ru' ? 'Выплачено' : "To'langan") : (lang === 'ru' ? 'К выплате' : "To'lanishi kerak")}
                    </span>
                  </div>

                  <div className="mobile-record-grid">
                    <div>
                      <span className="mobile-record-label">{t('colSalary')}: </span>
                      <span className="mobile-record-val">{formatMoney(st.baseSalary)}</span>
                    </div>
                    <div>
                      <span className="mobile-record-label">{lang === 'ru' ? 'Выплачено:' : "To'landi:"} </span>
                      <span style={{ fontWeight: 800, color: '#10b981' }}>{formatMoney(st.paidThisMonth)}</span>
                    </div>
                    <div>
                      <span className="mobile-record-label">{lang === 'ru' ? 'Остаток:' : 'Qoldiq:'} </span>
                      <span style={{ fontWeight: 800, color: remaining > 0 ? '#b45309' : '#64748b' }}>{formatMoney(remaining)}</span>
                    </div>
                  </div>

                  {remaining > 0 && (
                    <div className="mobile-record-actions">
                      <button
                        onClick={() => {
                          setSelectedStaff(st);
                          setSalaryAmount(remaining);
                          setShowSalaryModal(true);
                        }}
                        style={{
                          background: '#4f46e5',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '10px 16px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          width: '100%',
                          boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        {t('paySalaryBtn')}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CHIQIMLAR VA XARAJATLAR */}
      {activeTab === 'expenses' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{t('tabExpenses')}</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                {lang === 'ru' ? 'Аренда, коммунальные услуги, логистика и мелкие расходы' : 'Do\'kon ijarasi, kommunal, logistika va mayda chiqimlar'}
              </p>
            </div>
            <button
              onClick={() => setShowExpenseModal(true)}
              style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              + {t('newExpenseBtn')}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {safeExpenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                {lang === 'ru' ? 'Пока нет расходов' : 'Hozircha chiqimlar mavjud emas'}
              </div>
            ) : (
              safeExpenses.map(exp => (
                <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', fontSize: '13px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{exp.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{exp.category} | Manba: {exp.source} | Sana: {exp.date}</div>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#dc2626' }}>
                    -{formatMoney(exp.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: RAD ETISH */}
      {rejectingOrder && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.65)', 
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
            borderRadius: '24px', 
            maxWidth: '420px', 
            width: '100%', 
            padding: '24px',
            margin: 'auto',
            maxHeight: 'calc(100dvh - 32px)',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '17px', color: '#0f172a' }}>
              {lang === 'ru' ? 'Отклонить заявку' : 'Zayavkani Rad Etish'}
            </h3>
            <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#64748b' }}>
              {lang === 'ru' ? 'Укажите причину отказа (будет отображена на экране продавца):' : 'Iltimos, nima sababdan rad etilayotganini yozing (bu xabar sotuvchining mobil ekranida ko\'rinadi):'}
            </p>

            <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                required
                placeholder={lang === 'ru' ? 'Например: Чек об оплате недействителен или сумма не поступила' : "Masalan: Bank to'lov cheki soxta yoki yetarli emas"}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setRejectingOrder(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
                >
                  {lang === 'ru' ? 'Подтвердить отказ' : 'Rad Etishni Tasdiqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QARZ SO'NDIRISH */}
      {showPayDebtModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.65)', 
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
            borderRadius: '24px', 
            maxWidth: '400px', 
            width: '100%', 
            padding: '24px',
            margin: 'auto',
            maxHeight: 'calc(100dvh - 32px)',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '17px', color: '#0f172a' }}>
              {lang === 'ru' ? 'Принять оплату долга' : 'Qarzni Qabul Qilish'}
            </h3>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
              {lang === 'ru' ? 'Клиент:' : 'Mijoz:'} <strong>{selectedDebt?.customerName}</strong> | {lang === 'ru' ? 'Остаток долга:' : 'Jami qarz:'} {formatMoney(selectedDebt?.remainingAmount)}
            </div>

            <form onSubmit={handleConfirmPayDebt} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  {lang === 'ru' ? 'Сумма оплаты' : 'To\'lov summasi'}
                </label>
                <input 
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  {lang === 'ru' ? 'На какой счет поступит?' : 'Qaysi balansga kirim bo\'ladi?'}
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                >
                  <option value="Naqd">{t('cash')} ({lang === 'ru' ? 'Наличные' : 'Naqd pul'})</option>
                  <option value="Karta">{t('card')} ({lang === 'ru' ? 'Терминал' : 'Plastik karta'})</option>
                  <option value="Bank perech">{t('bank')} ({lang === 'ru' ? 'Расчетный счет' : 'Perechisleniye'})</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowPayDebtModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#10b981', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
                >
                  {lang === 'ru' ? 'Принять оплату' : 'Qabul qilish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: OYLIK TO'LASH */}
      {showSalaryModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.65)', 
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
            borderRadius: '24px', 
            maxWidth: '400px', 
            width: '100%', 
            padding: '24px',
            margin: 'auto',
            maxHeight: 'calc(100dvh - 32px)',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '17px', color: '#0f172a' }}>
              {lang === 'ru' ? 'Выплата заработной платы' : 'Oylik Maosh To\'lash'}
            </h3>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
              {lang === 'ru' ? 'Сотрудник:' : 'Xodim:'} <strong>{selectedStaff?.name}</strong> ({selectedStaff?.role})
            </div>

            <form onSubmit={handleConfirmSalary} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  {lang === 'ru' ? 'Сумма выплаты' : 'To\'lov summasi'}
                </label>
                <input 
                  type="number"
                  required
                  value={salaryAmount}
                  onChange={(e) => setSalaryAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  {lang === 'ru' ? 'Из какого источника выплатить?' : 'Qaysi manbadan to\'lanadi?'}
                </label>
                <select
                  value={salarySource}
                  onChange={(e) => setSalarySource(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                >
                  <option value="Bank perech">{t('bank')} ({lang === 'ru' ? 'Расчетный счет' : 'Perechisleniye'})</option>
                  <option value="Naqd">{t('cash')} ({lang === 'ru' ? 'Наличные' : 'Naqd pul'})</option>
                  <option value="Karta">{t('card')} ({lang === 'ru' ? 'Корпоративная карта' : 'Plastik karta'})</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowSalaryModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#4f46e5', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
                >
                  {lang === 'ru' ? 'Подтвердить выплату' : 'To\'lashni Tasdiqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: YANGI CHIQIM */}
      {showExpenseModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.65)', 
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
            borderRadius: '24px', 
            maxWidth: '400px', 
            width: '100%', 
            padding: '24px',
            margin: 'auto',
            maxHeight: 'calc(100dvh - 32px)',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '17px', color: '#0f172a' }}>
              {lang === 'ru' ? 'Внести расход' : 'Yangi Chiqim Kiritish'}
            </h3>

            <form onSubmit={handleConfirmExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  {lang === 'ru' ? 'Наименование / Описание' : 'Nomi / Tavsifi'}
                </label>
                <input 
                  type="text"
                  required
                  placeholder={lang === 'ru' ? 'Например: Аренда магазина или электричество' : "Masalan: Do'kon ijarasi yoki svet puli"}
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  {lang === 'ru' ? 'Сумма (сум)' : "Summa (so'm)"}
                </label>
                <input 
                  type="number"
                  required
                  placeholder="1500000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                    {t('colCategory')}
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="Ijara">{lang === 'ru' ? 'Аренда' : 'Ijara'}</option>
                    <option value="Kommunal">{lang === 'ru' ? 'Коммунальные' : 'Kommunal'}</option>
                    <option value="Logistika">{lang === 'ru' ? 'Логистика' : 'Logistika'}</option>
                    <option value="Mayda xarajat">{lang === 'ru' ? 'Прочие расходы' : 'Mayda xarajat'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                    {lang === 'ru' ? 'Источник' : 'Manba'}
                  </label>
                  <select
                    value={expenseSource}
                    onChange={(e) => setExpenseSource(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="Naqd">{t('cash')} ({lang === 'ru' ? 'Наличные' : 'Naqd pul'})</option>
                    <option value="Karta">{t('card')} ({lang === 'ru' ? 'Терминал' : 'Plastik karta'})</option>
                    <option value="Bank perech">{t('bank')} ({lang === 'ru' ? 'Расчетный счет' : 'Perechisleniye'})</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
                >
                  {lang === 'ru' ? 'Сохранить расход' : 'Chiqimni Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
