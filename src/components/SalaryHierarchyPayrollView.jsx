import React, { useState, useMemo } from 'react';
import { 
  Users, DollarSign, Award, CheckCircle2, AlertCircle, 
  Printer, ArrowRight, ShieldCheck, UserCheck, Clock, 
  FileText, Plus, ChevronRight, Layers, ArrowUpRight, 
  Wallet, CreditCard, Building2, Eye, Download, Check,
  ChevronDown, Search, Filter, Sparkles, Network, UserPlus
} from 'lucide-react';
import { HIERARCHY_ROLES } from '../data/initialData';
import { useLang } from '../context/LanguageContext';

export default function SalaryHierarchyPayrollView({
  staff = [],
  balances = { cash: 0, card: 0, bank: 0 },
  sales = [],
  orders = [],
  currentRole = 'accountant', // 'director' | 'accountant'
  onPaySalary,
  onApproveSalary,
  onApproveAllSalaries,
  onOpenAddStaff
}) {
  const { t, lang } = useLang();

  // Active Sub-tab: 'tree' | 'sheet' | 'history'
  const [viewMode, setViewMode] = useState('tree'); // 'tree' | 'sheet' | 'history'
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Payout Modal state (for Accountant)
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutSource, setPayoutSource] = useState('Naqd'); // 'Naqd' | 'Karta' | 'Bank perech'
  const [payoutNote, setPayoutNote] = useState('');

  // Slip / Receipt Modal state (Printable document)
  const [slipData, setSlipData] = useState(null);

  const formatMoney = (val) => Number(val || 0).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ') + " " + t('currency');

  // Compute live sales & deductions per staff member
  const enrichedStaff = useMemo(() => {
    return staff.map(s => {
      // 1. Shaxsiy sotuvlar (Med. pres yoki sotuvchilar uchun)
      const directSales = sales.filter(sl => sl?.cashierName === s.name || sl?.sellerId === s.id);
      const directSalesTotal = directSales.reduce((acc, sl) => acc + Number(sl?.total || 0), 0);

      // 2. Oyligidan ushlab qolingan summa (Salary deductions from orders/sales)
      const deductionOrders = orders.filter(o => 
        (o.paymentMethod === 'salary_deduction') && 
        (o.sellerName === s.name || o.sellerId === s.id)
      );
      const ordersDeductionsTotal = deductionOrders.reduce((acc, o) => acc + Number(o?.totalAmount || 0), 0);
      
      const deductionSales = sales.filter(sl => 
        (sl.paymentMethod === 'Oyligidan') && 
        (sl.cashierName === s.name)
      );
      const salesDeductionsTotal = deductionSales.reduce((acc, sl) => acc + Number(sl?.total || 0), 0);
      const totalDeductions = ordersDeductionsTotal + salesDeductionsTotal;

      // 3. Jamoaviy sotuvlar (Ierarxiya bo'yicha hisoblash)
      let teamSalesTotal = directSalesTotal;
      if (s.hierarchyRole === 'senior') {
        const myReps = staff.filter(sub => sub.managerId === s.id);
        const repSales = sales.filter(sl => myReps.some(r => r.name === sl.cashierName || r.id === sl.sellerId));
        teamSalesTotal += repSales.reduce((acc, sl) => acc + Number(sl?.total || 0), 0);
      } else if (s.hierarchyRole === 'manager') {
        const mySeniors = staff.filter(sub => sub.managerId === s.id);
        const myReps = staff.filter(sub => mySeniors.some(sen => sen.id === sub.managerId));
        const allTeam = [...mySeniors, ...myReps];
        const teamSales = sales.filter(sl => allTeam.some(m => m.name === sl.cashierName || m.id === sl.sellerId));
        teamSalesTotal += teamSales.reduce((acc, sl) => acc + Number(sl?.total || 0), 0);
      } else if (s.hierarchyRole === 'res_manager') {
        teamSalesTotal = sales.reduce((acc, sl) => acc + Number(sl?.total || 0), 0);
      }

      // 4. Bonus hisobi
      const bonusRate = s.bonusRate ?? 2;
      const salesForBonus = (s.hierarchyRole === 'senior' || s.hierarchyRole === 'manager' || s.hierarchyRole === 'res_manager') 
        ? teamSalesTotal 
        : directSalesTotal;
      const calculatedBonus = Math.round((salesForBonus * bonusRate) / 100);

      // 5. Sof hisoblangan oylik va qoldiq
      const baseSalary = Number(s.baseSalary || 0);
      const netSalary = Math.max(0, baseSalary + calculatedBonus - totalDeductions);
      const paidSoFar = Number(s.paidThisMonth || 0);
      const remainingToPay = Math.max(0, netSalary - paidSoFar);

      // Manager name
      const manager = staff.find(m => m.id === s.managerId);

      return {
        ...s,
        baseSalary,
        bonusRate,
        directSalesTotal,
        teamSalesTotal,
        calculatedBonus,
        totalDeductions,
        netSalary,
        paidSoFar,
        remainingToPay,
        managerName: manager?.name || (s.hierarchyRole === 'res_manager' ? 'Bosh Direktor' : '—'),
        isDirectorApproved: s.directorApproved !== false
      };
    });
  }, [staff, sales, orders]);

  // Overall totals
  const totalPayrollFund = enrichedStaff.reduce((acc, s) => acc + s.netSalary, 0);
  const totalApproved = enrichedStaff.filter(s => s.isDirectorApproved).reduce((acc, s) => acc + s.netSalary, 0);
  const totalPaid = enrichedStaff.reduce((acc, s) => acc + s.paidSoFar, 0);
  const totalRemaining = enrichedStaff.reduce((acc, s) => acc + s.remainingToPay, 0);

  // Group staff by hierarchy levels matching the notebook:
  // Level 1: Res. Menejeri
  // Level 2: Menejer
  // Level 3: Starshi
  // Level 4: Med. pres (Med. presta)
  const resManagers = enrichedStaff.filter(s => s.hierarchyRole === 'res_manager');
  const branchManagers = enrichedStaff.filter(s => s.hierarchyRole === 'manager');
  const seniorReps = enrichedStaff.filter(s => s.hierarchyRole === 'senior');
  const medReps = enrichedStaff.filter(s => s.hierarchyRole === 'med_rep');
  const executives = enrichedStaff.filter(s => ['director', 'accountant', 'warehouse'].includes(s.hierarchyRole));

  // Filtered staff for Table View
  const filteredStaff = enrichedStaff.filter(s => {
    const matchesRole = roleFilter === 'all' ? true : s.hierarchyRole === roleFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (s.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.phone || '').includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  // Open Payout Modal
  const handleOpenPayout = (s) => {
    setSelectedStaff(s);
    setPayoutAmount(s.remainingToPay > 0 ? s.remainingToPay : s.netSalary);
    setPayoutSource('Naqd');
    setPayoutNote(`${new Date().toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })} oylik maoshi`);
    setShowPayoutModal(true);
  };

  // Submit Payout
  const handleConfirmPayout = (e) => {
    e.preventDefault();
    if (!selectedStaff || Number(payoutAmount) <= 0) return;

    const amount = Number(payoutAmount);
    
    // Check balance sufficiency
    const availBalance = payoutSource === 'Naqd' ? (balances?.cash || 0) :
                         payoutSource === 'Karta' ? (balances?.card || 0) : (balances?.bank || 0);

    if (amount > availBalance) {
      if (!window.confirm(`Diqqat! Tanlangan hisobda (${payoutSource}) mablag' yetarli emas: mavjud ${formatMoney(availBalance)}. Baribir davom ettirilsinmi?`)) {
        return;
      }
    }

    const receiptNo = `VED-${Date.now().toString().slice(-6)}`;
    const payoutRecord = {
      id: `pay-${Date.now()}`,
      receiptNo,
      date: new Date().toLocaleString('uz-UZ'),
      amount,
      source: payoutSource,
      note: payoutNote,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      staffRole: selectedStaff.role,
      managerName: selectedStaff.managerName
    };

    onPaySalary(selectedStaff.id, amount, payoutSource, payoutRecord);

    setShowPayoutModal(false);

    // Open Printable Slip
    setSlipData({
      ...payoutRecord,
      baseSalary: selectedStaff.baseSalary,
      calculatedBonus: selectedStaff.calculatedBonus,
      totalDeductions: selectedStaff.totalDeductions,
      netSalary: selectedStaff.netSalary,
      remainingToPay: Math.max(0, selectedStaff.remainingToPay - amount),
      isDirectorApproved: selectedStaff.isDirectorApproved
    });
  };

  // View existing slip
  const handleViewSlip = (s) => {
    setSlipData({
      receiptNo: `SLIP-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('uz-UZ'),
      amount: s.paidSoFar > 0 ? s.paidSoFar : s.netSalary,
      source: 'Kassa / Bank',
      note: `${new Date().toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })} oylik vedomosti`,
      staffId: s.id,
      staffName: s.name,
      staffRole: s.role,
      managerName: s.managerName,
      baseSalary: s.baseSalary,
      calculatedBonus: s.calculatedBonus,
      totalDeductions: s.totalDeductions,
      netSalary: s.netSalary,
      remainingToPay: s.remainingToPay,
      isDirectorApproved: s.isDirectorApproved
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Header & Notebook Concept Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(49, 46, 129, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: '#fef08a',
                color: '#854d0e',
                fontWeight: 900,
                fontSize: '12px',
                padding: '3px 8px',
                borderRadius: '6px',
                letterSpacing: '1px'
              }}>
                II-BO'LIM
              </span>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#ffffff' }}>
                {t('salaryHierarchyTitle')}
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#c7d2fe', maxWidth: '680px', lineHeight: 1.5 }}>
              <strong>Direktor</strong> — Oylik vedomostlarini tasdiqlash va shtat nazorati | 
              <strong> Buxgalter</strong> — Oyliklarni chiqarish (Kassa, Karta, Bank) | 
              <strong> Xodimlar</strong> — Ierarxiya: <em>Res. Menejeri ➔ Menejer ➔ Starshi ➔ Med. pres</em>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {currentRole === 'director' && (
              <button
                onClick={() => {
                  if (onApproveAllSalaries) {
                    onApproveAllSalaries();
                  } else {
                    alert("Barcha xodimlarning oylik vedomosti rasman tasdiqlandi!");
                  }
                }}
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                }}
              >
                <ShieldCheck size={17} /> {t('approveAllSalariesBtn')}
              </button>
            )}

            {onOpenAddStaff && (
              <button
                onClick={onOpenAddStaff}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <UserPlus size={16} /> {t('addStaffBtn')}
              </button>
            )}
          </div>
        </div>

        {/* 4 Quick KPI Summary Cards inside header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          marginTop: '22px'
        }}>
          {/* FOT */}
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ fontSize: '11px', color: '#c7d2fe', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} /> {t('totalPayrollFund')}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>
              {formatMoney(totalPayrollFund)}
            </div>
            <div style={{ fontSize: '11px', color: '#a5b4fc', marginTop: '2px' }}>
              {staff.length} nafar xodim hisobi
            </div>
          </div>

          {/* Direktor tasdiqlagan */}
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ fontSize: '11px', color: '#86efac', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} /> {t('totalApprovedDirector')}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#4ade80', marginTop: '4px' }}>
              {formatMoney(totalApproved)}
            </div>
            <div style={{ fontSize: '11px', color: '#bbf7d0', marginTop: '2px' }}>
              Direktor imzosi qo'yilgan
            </div>
          </div>

          {/* Buxgalter to'lagan */}
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wallet size={14} /> {t('totalPaidAccountant')}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#60a5fa', marginTop: '4px' }}>
              {formatMoney(totalPaid)}
            </div>
            <div style={{ fontSize: '11px', color: '#bfdbfe', marginTop: '2px' }}>
              Kassa/Bankdan chiqarilgan
            </div>
          </div>

          {/* Qoldiq */}
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ fontSize: '11px', color: '#fde047', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} /> {t('totalRemainingSalary')}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#facc15', marginTop: '4px' }}>
              {formatMoney(totalRemaining)}
            </div>
            <div style={{ fontSize: '11px', color: '#fef08a', marginTop: '2px' }}>
              Chiqarilishi kutilmoqda
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mode Switcher & Filter Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#ffffff',
        padding: '12px 18px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        {/* Toggle between Tree Diagram & Table View */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', gap: '4px' }}>
          <button
            onClick={() => setViewMode('tree')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              background: viewMode === 'tree' ? '#ffffff' : 'transparent',
              color: viewMode === 'tree' ? '#4f46e5' : '#64748b',
              boxShadow: viewMode === 'tree' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Network size={16} /> {t('tabHierarchyTree')}
          </button>

          <button
            onClick={() => setViewMode('sheet')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              background: viewMode === 'sheet' ? '#ffffff' : 'transparent',
              color: viewMode === 'sheet' ? '#4f46e5' : '#64748b',
              boxShadow: viewMode === 'sheet' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <FileText size={16} /> {t('tabPayrollSheet')}
          </button>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              fontWeight: 700,
              background: '#ffffff',
              color: '#334155'
            }}
          >
            <option value="all">Barcha Pog'onalar</option>
            <option value="res_manager">Res. Menejeri</option>
            <option value="manager">Menejer</option>
            <option value="senior">Starshi</option>
            <option value="med_rep">Med. pres</option>
            <option value="director">Direktor</option>
            <option value="accountant">Buxgalter</option>
          </select>
        </div>
      </div>

      {/* 3. VIEW MODE 1: INTERACTIVE ORG TREE (NOTEBOOK DRAWING) */}
      {viewMode === 'tree' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Tree Description Note */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Network size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                  Xodimlar Bo'ysunuv Ierarxiyasi va Oylik Ko'rsatkichlari
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                  Respublika Menejeri ➔ Menejerlar ➔ Katta xodimlar (Starshi) ➔ Medpredstavitellar (Tibbiyot vakillari)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', fontSize: '11px', fontWeight: 700 }}>
              <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#f3e8ff', color: '#6d28d9' }}>1. Res. Menejeri</span>
              <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: '#1d4ed8' }}>2. Menejer</span>
              <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#ccfbf1', color: '#0f766e' }}>3. Starshi</span>
              <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#fef3c7', color: '#b45309' }}>4. Med. pres</span>
            </div>
          </div>

          {/* LEVEL 1: RES. MENEJERI */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#7c3aed', marginBottom: '8px', letterSpacing: '0.5px' }}>
              ▼ 1-BOSQICH: RESPUBLIKA BO'YICHA BOSHQARUVCHI (RES. MENEJERI)
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              {resManagers.map(staffMember => (
                <StaffHierarchyCard 
                  key={staffMember.id}
                  staff={staffMember}
                  currentRole={currentRole}
                  onPay={handleOpenPayout}
                  onApprove={onApproveSalary}
                  onSlip={handleViewSlip}
                  formatMoney={formatMoney}
                  themeColor="#7c3aed"
                  themeBg="#f3e8ff"
                  levelLabel="Res. Menejeri"
                  width="380px"
                />
              ))}
            </div>

            {/* Connecting Vertical Line */}
            <div style={{ width: '2px', height: '28px', background: '#cbd5e1', margin: '4px 0' }} />
          </div>

          {/* LEVEL 2: MENEJERLAR */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', marginBottom: '8px', letterSpacing: '0.5px' }}>
              ▼ 2-BOSQICH: HUDUDIY MENEJERLAR (MENEJER)
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '18px',
              width: '100%',
              maxWidth: '900px'
            }}>
              {branchManagers.map(staffMember => (
                <StaffHierarchyCard 
                  key={staffMember.id}
                  staff={staffMember}
                  currentRole={currentRole}
                  onPay={handleOpenPayout}
                  onApprove={onApproveSalary}
                  onSlip={handleViewSlip}
                  formatMoney={formatMoney}
                  themeColor="#2563eb"
                  themeBg="#eff6ff"
                  levelLabel="Menejer"
                />
              ))}
            </div>

            {/* Connecting Vertical Line */}
            <div style={{ width: '2px', height: '28px', background: '#cbd5e1', margin: '4px 0' }} />
          </div>

          {/* LEVEL 3: STARSHILAR */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0d9488', marginBottom: '8px', letterSpacing: '0.5px' }}>
              ▼ 3-BOSQICH: KATTA XODIMLAR (STARSHI)
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '18px',
              width: '100%',
              maxWidth: '900px'
            }}>
              {seniorReps.map(staffMember => (
                <StaffHierarchyCard 
                  key={staffMember.id}
                  staff={staffMember}
                  currentRole={currentRole}
                  onPay={handleOpenPayout}
                  onApprove={onApproveSalary}
                  onSlip={handleViewSlip}
                  formatMoney={formatMoney}
                  themeColor="#0d9488"
                  themeBg="#ccfbf1"
                  levelLabel="Starshi"
                />
              ))}
            </div>

            {/* Connecting Vertical Line */}
            <div style={{ width: '2px', height: '28px', background: '#cbd5e1', margin: '4px 0' }} />
          </div>

          {/* LEVEL 4: MED. PRES (MED. PRESTA) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#d97706', marginBottom: '8px', letterSpacing: '0.5px' }}>
              ▼ 4-BOSQICH: TIBBIYOT VAKILLARI / SOTUVCHILAR (MED. PRES / MED. PRESTA)
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
              width: '100%'
            }}>
              {medReps.map(staffMember => (
                <StaffHierarchyCard 
                  key={staffMember.id}
                  staff={staffMember}
                  currentRole={currentRole}
                  onPay={handleOpenPayout}
                  onApprove={onApproveSalary}
                  onSlip={handleViewSlip}
                  formatMoney={formatMoney}
                  themeColor="#d97706"
                  themeBg="#fef3c7"
                  levelLabel="Med. pres"
                />
              ))}
            </div>
          </div>

          {/* SEPARATE SECTION: MARKAZIY BOSHQARUV (Direktor, Buxgalter, Sklad) */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            marginTop: '12px'
          }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 800, color: '#475569' }}>
              🏢 Markaziy Boshqaruv va Administratsiya
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px'
            }}>
              {executives.map(staffMember => (
                <StaffHierarchyCard 
                  key={staffMember.id}
                  staff={staffMember}
                  currentRole={currentRole}
                  onPay={handleOpenPayout}
                  onApprove={onApproveSalary}
                  onSlip={handleViewSlip}
                  formatMoney={formatMoney}
                  themeColor="#475569"
                  themeBg="#f1f5f9"
                  levelLabel="Administratsiya"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEW MODE 2: FULL PAYROLL SHEET TABLE (VEDOMOST) */}
      {viewMode === 'sheet' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                Xodimlarning Rasmiy Oylik Maosh Vedomosti
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                Asosiy oklad, savdo bonusi, oyligidan olingan tovarlar (ushlab qolishlar) va to'lovlar
              </p>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="desktop-table-view">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '12px 14px' }}>{t('colFullName')}</th>
                    <th style={{ padding: '12px 14px' }}>Pog'ona</th>
                    <th style={{ padding: '12px 14px' }}>{t('colManager')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colBaseSalary')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colSalesBonus')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colDeductions')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colNetSalary')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colPaid')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('colRemaining')}</th>
                    <th style={{ padding: '12px 14px' }}>{t('directorApproval')}</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map(st => (
                    <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                        <div>{st.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{st.phone}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: st.hierarchyRole === 'res_manager' ? '#f3e8ff' :
                                      st.hierarchyRole === 'manager' ? '#eff6ff' :
                                      st.hierarchyRole === 'senior' ? '#ccfbf1' :
                                      st.hierarchyRole === 'med_rep' ? '#fef3c7' : '#f1f5f9',
                          color: st.hierarchyRole === 'res_manager' ? '#6d28d9' :
                                 st.hierarchyRole === 'manager' ? '#1d4ed8' :
                                 st.hierarchyRole === 'senior' ? '#0f766e' :
                                 st.hierarchyRole === 'med_rep' ? '#b45309' : '#334155'
                        }}>
                          {st.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569', fontSize: '12px' }}>
                        {st.managerName}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 600 }}>
                        {formatMoney(st.baseSalary)}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: 700 }}>
                        +{formatMoney(st.calculatedBonus)}
                        <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>({st.bonusRate}%)</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: st.totalDeductions > 0 ? '#dc2626' : '#94a3b8', fontWeight: 700 }}>
                        {st.totalDeductions > 0 ? `-${formatMoney(st.totalDeductions)}` : '0'}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 800 }}>
                        {formatMoney(st.netSalary)}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#2563eb', fontWeight: 700 }}>
                        {formatMoney(st.paidSoFar)}
                      </td>
                      <td style={{ padding: '12px 14px', color: st.remainingToPay > 0 ? '#d97706' : '#16a34a', fontWeight: 800 }}>
                        {formatMoney(st.remainingToPay)}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: st.isDirectorApproved ? '#dcfce7' : '#fee2e2',
                          color: st.isDirectorApproved ? '#15803d' : '#b91c1c',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {st.isDirectorApproved ? <Check size={12} /> : <Clock size={12} />}
                          {st.isDirectorApproved ? 'Tasdiqlangan' : 'Kutilmoqda'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleViewSlip(st)}
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Oylik kvitansiyasini ko'rish"
                          >
                            <FileText size={14} /> Slip
                          </button>

                          {st.remainingToPay > 0 && (
                            <button
                              onClick={() => handleOpenPayout(st)}
                              style={{
                                background: '#10b981',
                                border: 'none',
                                color: '#ffffff',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                              }}
                            >
                              <DollarSign size={14} /> {t('payoutSalaryBtn')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="mobile-card-view">
            {filteredStaff.map(st => (
              <div key={st.id} className="mobile-record-card">
                <div className="mobile-record-header">
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{st.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{st.role} • Rahbari: {st.managerName}</div>
                  </div>
                  <span style={{
                    background: st.isDirectorApproved ? '#dcfce7' : '#fee2e2',
                    color: st.isDirectorApproved ? '#15803d' : '#b91c1c',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}>
                    {st.isDirectorApproved ? 'Tasdiqlangan' : 'Kutilmoqda'}
                  </span>
                </div>

                <div className="mobile-record-grid">
                  <div>
                    <span className="mobile-record-label">Oklad:</span>
                    <span className="mobile-record-val">{formatMoney(st.baseSalary)}</span>
                  </div>
                  <div>
                    <span className="mobile-record-label">Bonus ({st.bonusRate}%):</span>
                    <span style={{ fontWeight: 700, color: '#16a34a' }}>+{formatMoney(st.calculatedBonus)}</span>
                  </div>
                  <div>
                    <span className="mobile-record-label">Chegirma:</span>
                    <span style={{ fontWeight: 700, color: st.totalDeductions > 0 ? '#dc2626' : '#64748b' }}>
                      {st.totalDeductions > 0 ? `-${formatMoney(st.totalDeductions)}` : '0'}
                    </span>
                  </div>
                  <div>
                    <span className="mobile-record-label">Sof Oylik:</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{formatMoney(st.netSalary)}</span>
                  </div>
                  <div>
                    <span className="mobile-record-label">To'langan:</span>
                    <span style={{ fontWeight: 700, color: '#2563eb' }}>{formatMoney(st.paidSoFar)}</span>
                  </div>
                  <div>
                    <span className="mobile-record-label">Qoldiq:</span>
                    <span style={{ fontWeight: 800, color: st.remainingToPay > 0 ? '#d97706' : '#16a34a' }}>
                      {formatMoney(st.remainingToPay)}
                    </span>
                  </div>
                </div>

                <div className="mobile-record-actions" style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleViewSlip(st)}
                    style={{
                      flex: 1,
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <FileText size={14} /> Slip
                  </button>

                  {st.remainingToPay > 0 && (
                    <button
                      onClick={() => handleOpenPayout(st)}
                      style={{
                        flex: 2,
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <DollarSign size={14} /> {t('payoutSalaryBtn')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MODAL: OYLIKNI CHIQARISH (PAYOUT MODAL) */}
      {showPayoutModal && selectedStaff && (
        <div className="modal-backdrop" onClick={() => setShowPayoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                    {t('payoutSalaryBtn')}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                    {selectedStaff.name} ({selectedStaff.role})
                  </p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowPayoutModal(false)}>✕</button>
            </div>

            <form onSubmit={handleConfirmPayout} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Financial summary banner */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Asosiy Oklad:</span>
                  <span style={{ fontWeight: 700 }}>{formatMoney(selectedStaff.baseSalary)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Savdo Bonusi ({selectedStaff.bonusRate}%):</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>+{formatMoney(selectedStaff.calculatedBonus)}</span>
                </div>
                {selectedStaff.totalDeductions > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#dc2626' }}>Chegirmalar (Oyligidan olingan):</span>
                    <span style={{ fontWeight: 700, color: '#dc2626' }}>-{formatMoney(selectedStaff.totalDeductions)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '6px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>To'lanishi Kerak Qoldiq:</span>
                  <span style={{ fontWeight: 900, color: '#2563eb', fontSize: '14px' }}>{formatMoney(selectedStaff.remainingToPay)}</span>
                </div>
              </div>

              {/* Input: Chiqariladigan Summa */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  {t('payoutAmountLabel')} (so'm):
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '2px solid #2563eb',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Input: To'lov Manbasi (Kassa, Karta, Bank) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  {t('payoutSourceLabel')}:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setPayoutSource('Naqd')}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '10px',
                      border: payoutSource === 'Naqd' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      background: payoutSource === 'Naqd' ? '#ecfdf5' : '#ffffff',
                      color: payoutSource === 'Naqd' ? '#15803d' : '#475569',
                      fontWeight: 700,
                      fontSize: '11px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div>💵 Naqd Kassa</div>
                    <div style={{ fontSize: '10px', marginTop: '3px', color: '#64748b' }}>{formatMoney(balances?.cash || 0)}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutSource('Karta')}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '10px',
                      border: payoutSource === 'Karta' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: payoutSource === 'Karta' ? '#eff6ff' : '#ffffff',
                      color: payoutSource === 'Karta' ? '#1d4ed8' : '#475569',
                      fontWeight: 700,
                      fontSize: '11px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div>💳 Karta / Term.</div>
                    <div style={{ fontSize: '10px', marginTop: '3px', color: '#64748b' }}>{formatMoney(balances?.card || 0)}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutSource('Bank perech')}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '10px',
                      border: payoutSource === 'Bank perech' ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                      background: payoutSource === 'Bank perech' ? '#f3e8ff' : '#ffffff',
                      color: payoutSource === 'Bank perech' ? '#6d28d9' : '#475569',
                      fontWeight: 700,
                      fontSize: '11px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div>🏦 Bank Perech</div>
                    <div style={{ fontSize: '10px', marginTop: '3px', color: '#64748b' }}>{formatMoney(balances?.bank || 0)}</div>
                  </button>
                </div>
              </div>

              {/* Input: Izoh */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  {t('payoutNoteLabel')}:
                </label>
                <input
                  type="text"
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                  placeholder="Oktyabr oyi oylik maoshi"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  style={{
                    flex: 1,
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {t('cancel')}
                </button>

                <button
                  type="submit"
                  style={{
                    flex: 2,
                    background: '#10b981',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} /> Oylikni Chiqarish va Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: OYLIK TO'LOV KVITANSIYASI / SLIP (PRINTABLE) */}
      {slipData && (
        <div className="modal-backdrop" onClick={() => setSlipData(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', background: '#ffffff', borderRadius: '18px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  {t('paySlipTitle')}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSlipData(null)}>✕</button>
            </div>

            {/* Printable Slip Content */}
            <div id="salary-print-slip" style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#0f172a' }}>
              
              {/* Slip Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#1e1b4b', letterSpacing: '1px' }}>
                  PLUMTECH & SAVDO ERP
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#4338ca', marginTop: '2px' }}>
                  RASMIY XODIM OYLIK TO'LOV VEDOMOSTI
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Hujjat №: <strong>{slipData.receiptNo}</strong> | Sana: {slipData.date}
                </div>
              </div>

              {/* Staff Details */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', fontSize: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Xodim (F.I.Sh):</span>
                  <span style={{ fontWeight: 800 }}>{slipData.staffName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Lavozim pog'onasi:</span>
                  <span style={{ fontWeight: 700, color: '#4338ca' }}>{slipData.staffRole}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Bevosita rahbari:</span>
                  <span style={{ fontWeight: 600 }}>{slipData.managerName || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>To'lov tafsiloti:</span>
                  <span style={{ fontWeight: 600 }}>{slipData.note || 'Oylik maosh'}</span>
                </div>
              </div>

              {/* Breakdown Table */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', fontSize: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 12px', color: '#64748b' }}>1. Asosiy oklad:</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>{formatMoney(slipData.baseSalary)}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 12px', color: '#64748b' }}>2. Savdo bonusi / KPI:</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>+{formatMoney(slipData.calculatedBonus)}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 12px', color: '#64748b' }}>3. Chegirmalar (Oyligidan olingan tovarlar):</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: slipData.totalDeductions > 0 ? '#dc2626' : '#64748b' }}>
                        {slipData.totalDeductions > 0 ? `-${formatMoney(slipData.totalDeductions)}` : '0 so\'m'}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '2px solid #cbd5e1', background: '#f8fafc' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 800 }}>Sof hisoblangan oylik fondi:</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#0f172a' }}>{formatMoney(slipData.netSalary)}</td>
                    </tr>
                    <tr style={{ background: '#ecfdf5' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 900, color: '#065f46', fontSize: '13px' }}>Chiqarilgan (To'langan) summa:</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#059669', fontSize: '15px' }}>
                        {formatMoney(slipData.amount)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', color: '#64748b' }}>To'lov manbasi:</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>{slipData.source}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures & Seal */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '24px', paddingTop: '16px', borderTop: '2px dashed #cbd5e1', fontSize: '11px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: '#dcfce7',
                    color: '#15803d',
                    fontWeight: 800,
                    marginBottom: '8px',
                    fontSize: '10px',
                    border: '1px solid #86efac'
                  }}>
                    ✓ DIREKTOR TASDIQLAGAN
                  </div>
                  <div style={{ color: '#64748b' }}>Bosh Direktor:</div>
                  <div style={{ fontWeight: 800, marginTop: '2px' }}>Sardor Alimov</div>
                  <div style={{ color: '#94a3b8', fontStyle: 'italic', marginTop: '6px' }}>[ Imzolandi ]</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontWeight: 800,
                    marginBottom: '8px',
                    fontSize: '10px',
                    border: '1px solid #bfdbfe'
                  }}>
                    ✓ BUXGALTER TO'LADI
                  </div>
                  <div style={{ color: '#64748b' }}>Bosh Buxgalter:</div>
                  <div style={{ fontWeight: 800, marginTop: '2px' }}>Malika Rustamova</div>
                  <div style={{ color: '#94a3b8', fontStyle: 'italic', marginTop: '6px' }}>[ Imzolandi ]</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '10px', color: '#94a3b8' }}>
                Ushbu vedomost korporativ elektron moliya moduli orqali shakllantirilgan.
              </div>
            </div>

            {/* Slip Action buttons */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={15} /> {t('printSlipBtn')}
              </button>

              <button
                onClick={() => setSlipData(null)}
                style={{
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// SUB-COMPONENT: INTERACTIVE STAFF CARD IN ORG TREE
// ==========================================
function StaffHierarchyCard({
  staff,
  currentRole,
  onPay,
  onApprove,
  onSlip,
  formatMoney,
  themeColor = '#4f46e5',
  themeBg = '#eff6ff',
  levelLabel = 'Xodim',
  width = 'auto'
}) {
  return (
    <div style={{
      width: width,
      background: '#ffffff',
      borderRadius: '16px',
      padding: '16px',
      border: `1.5px solid ${themeColor}30`,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      position: 'relative',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box'
    }}>
      {/* Top Banner: Avatar, Name, Level Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${themeColor}, #4338ca)`,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '15px',
            flexShrink: 0,
            boxShadow: `0 3px 8px ${themeColor}40`
          }}>
            {staff.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{staff.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{
                background: themeBg,
                color: themeColor,
                padding: '2px 7px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 800
              }}>
                {levelLabel}
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{staff.phone}</span>
            </div>
          </div>
        </div>

        {/* Director Approval Badge */}
        <div style={{ textAlign: 'right' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            padding: '3px 7px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 800,
            background: staff.isDirectorApproved ? '#dcfce7' : '#fee2e2',
            color: staff.isDirectorApproved ? '#15803d' : '#b91c1c'
          }}>
            {staff.isDirectorApproved ? <Check size={11} /> : <Clock size={11} />}
            {staff.isDirectorApproved ? 'Tasdiqlangan' : 'Kutilmoqda'}
          </span>
        </div>
      </div>

      {/* Hierarchy Linkage Note */}
      {staff.managerName && staff.managerName !== '—' && (
        <div style={{ fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px' }}>
          <span>Bevosita rahbari: </span>
          <strong style={{ color: '#334155' }}>{staff.managerName}</strong>
        </div>
      )}

      {/* Salary Calculations Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        background: '#f8fafc',
        padding: '10px',
        borderRadius: '10px',
        fontSize: '11px'
      }}>
        <div>
          <span style={{ color: '#64748b', display: 'block' }}>Asosiy Oklad:</span>
          <strong style={{ color: '#0f172a', fontSize: '12px' }}>{formatMoney(staff.baseSalary)}</strong>
        </div>
        <div>
          <span style={{ color: '#64748b', display: 'block' }}>Savdo Bonusi ({staff.bonusRate}%):</span>
          <strong style={{ color: '#16a34a', fontSize: '12px' }}>+{formatMoney(staff.calculatedBonus)}</strong>
        </div>
        <div>
          <span style={{ color: '#64748b', display: 'block' }}>Chegirmalar:</span>
          <strong style={{ color: staff.totalDeductions > 0 ? '#dc2626' : '#64748b', fontSize: '12px' }}>
            {staff.totalDeductions > 0 ? `-${formatMoney(staff.totalDeductions)}` : '0'}
          </strong>
        </div>
        <div>
          <span style={{ color: '#64748b', display: 'block' }}>Sof Oylik:</span>
          <strong style={{ color: '#0f172a', fontSize: '12px' }}>{formatMoney(staff.netSalary)}</strong>
        </div>
      </div>

      {/* Remaining & Payout Action Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8px',
        borderTop: '1px solid #f1f5f9'
      }}>
        <div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Chiqarilishi kerak:</div>
          <div style={{
            fontSize: '14px',
            fontWeight: 900,
            color: staff.remainingToPay > 0 ? '#d97706' : '#16a34a'
          }}>
            {formatMoney(staff.remainingToPay)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {/* Slip view */}
          <button
            onClick={() => onSlip(staff)}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#334155',
              borderRadius: '8px',
              padding: '6px 9px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="Oylik kvitansiyasi (Slip)"
          >
            <FileText size={13} />
          </button>

          {/* Director Approve Toggle */}
          {currentRole === 'director' && (
            <button
              onClick={() => onApprove && onApprove(staff.id)}
              style={{
                background: staff.isDirectorApproved ? '#ecfdf5' : '#10b981',
                color: staff.isDirectorApproved ? '#059669' : '#ffffff',
                border: staff.isDirectorApproved ? '1px solid #a7f3d0' : 'none',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={13} />
              {staff.isDirectorApproved ? 'Tasdiqlangan' : 'Tasdiqlash'}
            </button>
          )}

          {/* Accountant Payout Action */}
          {staff.remainingToPay > 0 && (
            <button
              onClick={() => onPay(staff)}
              style={{
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
              }}
            >
              <DollarSign size={13} /> Oylik Chiqarish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
