import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, ShoppingBag, Box, Award, 
  ArrowUpRight, ArrowDownRight, CreditCard, Banknote, Building2, 
  Clock, Eye, Sparkles, UserCheck, BarChart3, Layers
} from 'lucide-react';

export default function DirectorDashboard({ 
  sales = [], 
  products = [], 
  staff = [], 
  balances = {}, 
  debts = [], 
  expenses = [],
  onViewReceipt,
  onChangeView
}) {
  const [filterPeriod, setFilterPeriod] = useState('all'); // 'all', 'month'

  const safeSales = Array.isArray(sales) ? sales : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeStaff = Array.isArray(staff) ? staff : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  // Filter sales based on chosen period
  const filteredSales = safeSales.filter(s => {
    if (!s) return false;
    if (filterPeriod === 'all') return true;
    if (filterPeriod === 'month') {
      const currentMonth = new Date().toISOString().slice(0, 7); // "2026-10"
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

  const totalSalesCount = filteredSales.length;
  const avgCheck = totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount) : 0;
  
  // Warehouse Capital
  const warehouseCost = safeProducts.reduce((acc, p) => acc + (Number(p?.costPrice || 0) * Number(p?.stock || 0)), 0);
  const warehouseRetail = safeProducts.reduce((acc, p) => {
    const unitPrice = p?.price || (p?.prices ? Math.min(...Object.values(p.prices).filter(Boolean)) : 0) || 0;
    return acc + (Number(unitPrice) * Number(p?.stock || 0));
  }, 0);

  // Payment Breakdown
  const paymentStats = {
    cash: filteredSales.filter(s => s?.paymentMethod === 'Naqd').reduce((a, s) => a + Number(s?.total || 0), 0),
    card: filteredSales.filter(s => s?.paymentMethod === 'Karta').reduce((a, s) => a + Number(s?.total || 0), 0),
    bank: filteredSales.filter(s => s?.paymentMethod === 'Bank perech').reduce((a, s) => a + Number(s?.total || 0), 0),
    debt: filteredSales.filter(s => s?.paymentMethod === 'Qarz').reduce((a, s) => a + Number(s?.total || 0), 0)
  };

  // Top Products
  const productSalesMap = {};
  filteredSales.forEach(sale => {
    sale?.items?.forEach(item => {
      if (!item?.name) return;
      if (!productSalesMap[item.name]) {
        productSalesMap[item.name] = { name: item.name, quantity: 0, revenue: 0, id: item.id };
      }
      productSalesMap[item.name].quantity += Number(item.quantity || 1);
      productSalesMap[item.name].revenue += Number(item.quantity || 1) * Number(item.price || 0);
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Cashier Performance
  const staffSalesMap = {};
  safeStaff.filter(s => s?.role && typeof s.role === 'string' && s.role.includes('Sotuvchi')).forEach(st => {
    staffSalesMap[st.name] = { name: st.name, count: 0, total: 0, bonus: 0 };
  });

  filteredSales.forEach(s => {
    const cashier = s?.cashierName || 'Boshqa';
    if (!staffSalesMap[cashier]) {
      staffSalesMap[cashier] = { name: cashier, count: 0, total: 0, bonus: 0 };
    }
    staffSalesMap[cashier].count += 1;
    staffSalesMap[cashier].total += Number(s?.total || 0);
    staffSalesMap[cashier].bonus = Math.round(staffSalesMap[cashier].total * 0.02); // 2% bonus
  });

  const staffPerformance = Object.values(staffSalesMap);

  // Industry / Category Sales breakdown (BILLZ Multi-Industry Analytics)
  const industrySalesMap = {
    clothing: { name: 'Kiyim & Poyabzal', emoji: '👕', revenue: 0, count: 0, color: '#818cf8' },
    perfume: { name: 'Parfyumeriya & Go\'zallik', emoji: '💎', revenue: 0, count: 0, color: '#f59e0b' },
    electronics: { name: 'Elektronika & Gadjetlar', emoji: '📱', revenue: 0, count: 0, color: '#38bdf8' },
    grocery: { name: 'Oziq-ovqat & Supermarket', emoji: '🛒', revenue: 0, count: 0, color: '#34d399' },
    general: { name: 'Umumiy Tovar & Aksessuar', emoji: '📦', revenue: 0, count: 0, color: '#a78bfa' }
  };

  filteredSales.forEach(sale => {
    sale?.items?.forEach(item => {
      const prod = safeProducts.find(p => p?.id === item?.id);
      let pType = item?.productType || (prod?.productType) || (item?.volume ? 'perfume' : 'general');
      if (!industrySalesMap[pType]) pType = 'general';
      const itemRev = Number(item?.quantity || 1) * Number(item?.price || 0);
      industrySalesMap[pType].revenue += itemRev;
      industrySalesMap[pType].count += Number(item?.quantity || 1);
    });
  });

  const industrySalesList = Object.values(industrySalesMap);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>👑</span>
            <h2>BILLZ Direktor Nazorat Markazi</h2>
          </div>
          <p>Har qanday tovar turidagi savdolar, tushum, sof foyda va bo'limlararo tahlil</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {onChangeView && (
            <>
              <button 
                className="btn btn-primary"
                onClick={() => onChangeView('pos')}
                style={{ padding: '8px 14px', fontSize: '0.84rem' }}
              >
                <ShoppingBag size={15} /> 🛍️ Sotuvchi Kassa (POS)
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => onChangeView('sellers')}
                style={{ padding: '8px 14px', fontSize: '0.84rem' }}
              >
                👥 Sotuvchilar Jamoasi
              </button>
            </>
          )}
          <button 
            className={`pos-filter-btn ${filterPeriod === 'all' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('all')}
          >
            Barcha davr
          </button>
          <button 
            className={`pos-filter-btn ${filterPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setFilterPeriod('month')}
          >
            Shu oy (Oktyabr)
          </button>
        </div>
      </div>

      {/* Main KPIs (Rasmdagi: "Hamma sotuv stat." va "Hamma hisob kitoblar") */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderColor: 'rgba(99,102,241,0.4)' }}>
          <div className="stat-header">
            <span className="stat-title">Jami Savdo Tushumi</span>
            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>
              <TrendingUp size={20} color="var(--primary)" />
            </div>
          </div>
          <div className="stat-value">{formatMoney(totalRevenue)}</div>
          <div className="stat-desc">
            <span style={{ color: 'var(--success)' }}>↑ {totalSalesCount} ta muvaffaqiyatli savdo</span>
          </div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-header">
            <span className="stat-title">Sof Foyda (Net Profit)</span>
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <DollarSign size={20} color="var(--success)" />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {formatMoney(netProfit)}
          </div>
          <div className="stat-desc">
            Xarid tan narxi va xarajatlar chiqarilgach
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-header">
            <span className="stat-title">Ombor Mahsulot Kapitali</span>
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <Box size={20} color="var(--gold)" />
            </div>
          </div>
          <div className="stat-value">{formatMoney(warehouseCost)}</div>
          <div className="stat-desc">
            Sotuvdagi bahosi: {formatMoney(warehouseRetail)}
          </div>
        </div>

        <div className="stat-card cyan">
          <div className="stat-header">
            <span className="stat-title">O'rtacha Chek Qiymati</span>
            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.15)' }}>
              <ShoppingBag size={20} color="var(--info)" />
            </div>
          </div>
          <div className="stat-value">{formatMoney(avgCheck)}</div>
          <div className="stat-desc">
            Har bir mijoz o'rtacha xaridi
          </div>
        </div>
      </div>

      {/* Tovar Turlari Bo'yicha Tushum (BILLZ Multi-Industry Analytics) */}
      <div className="glass-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <Layers size={20} color="var(--primary)" />
            Tovar Turlari Bo'yicha Tushum Taqsimoti (BILLZ Retail)
          </h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Kiyim, Gadjet, Parfyum, Oziq-ovqat</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          {industrySalesList.map((ind, idx) => {
            const share = totalRevenue > 0 ? Math.round((ind.revenue / totalRevenue) * 100) : 0;
            return (
              <div 
                key={idx} 
                style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  border: `1px solid ${ind.color}33`, 
                  padding: '14px', 
                  borderRadius: '12px' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.86rem', color: ind.color }}>
                    <span style={{ fontSize: '1.1rem' }}>{ind.emoji}</span> {ind.name}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>{ind.count} dona</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  {formatMoney(ind.revenue)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Ulush: <strong style={{ color: ind.color }}>{share}%</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Methods Breakdown (Rasmdagi: Oplata turlari) */}
      <div className="glass-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <BarChart3 size={20} color="var(--primary)" />
            To'lov turlari bo'yicha savdo taqsimoti ("Oplata turlari")
          </h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Rasmdagi chizma bo'yicha</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', marginBottom: '8px' }}>
              <Banknote size={18} />
              <strong style={{ fontSize: '0.88rem' }}>Naqd pul</strong>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{formatMoney(paymentStats.cash)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {totalRevenue > 0 ? Math.round((paymentStats.cash / totalRevenue) * 100) : 0}% ulush
            </div>
          </div>

          <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '8px' }}>
              <CreditCard size={18} />
              <strong style={{ fontSize: '0.88rem' }}>Karta (Terminal)</strong>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{formatMoney(paymentStats.card)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {totalRevenue > 0 ? Math.round((paymentStats.card / totalRevenue) * 100) : 0}% ulush
            </div>
          </div>

          <div style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--info)', marginBottom: '8px' }}>
              <Building2 size={18} />
              <strong style={{ fontSize: '0.88rem' }}>Bank perechisleniye</strong>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{formatMoney(paymentStats.bank)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {totalRevenue > 0 ? Math.round((paymentStats.bank / totalRevenue) * 100) : 0}% ulush
            </div>
          </div>

          <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', marginBottom: '8px' }}>
              <Clock size={18} />
              <strong style={{ fontSize: '0.88rem' }}>Qarz (Nasiya)</strong>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{formatMoney(paymentStats.debt)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {totalRevenue > 0 ? Math.round((paymentStats.debt / totalRevenue) * 100) : 0}% ulush
            </div>
          </div>
        </div>

        {/* Progress bar visualizing payment distribution */}
        <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${totalRevenue > 0 ? (paymentStats.cash / totalRevenue) * 100 : 25}%`, background: '#10b981' }} title="Naqd" />
          <div style={{ width: `${totalRevenue > 0 ? (paymentStats.card / totalRevenue) * 100 : 25}%`, background: '#6366f1' }} title="Karta" />
          <div style={{ width: `${totalRevenue > 0 ? (paymentStats.bank / totalRevenue) * 100 : 25}%`, background: '#06b6d4' }} title="Bank perech" />
          <div style={{ width: `${totalRevenue > 0 ? (paymentStats.debt / totalRevenue) * 100 : 25}%`, background: '#f59e0b' }} title="Qarz" />
        </div>
      </div>

      {/* Two Columns: Top Products & Cashier Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Top Selling Perfumes */}
        <div className="glass-panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <h3 className="panel-title">
              <Award size={20} color="var(--gold)" />
              Eng Xaridorgir Mahsulotlar (TOP-5)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topProducts.map((p, idx) => {
              const prod = products.find(prodItem => prodItem.name === p.name);
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: idx === 0 ? 'var(--gold)' : 'rgba(255,255,255,0.1)', color: idx === 0 ? '#000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                      {idx + 1}
                    </div>
                    {prod?.image && (
                      <img src={prod.image} alt={p.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{p.quantity} dona sotildi</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{formatMoney(p.revenue)}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>Daromad</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cashier / Staff Performance */}
        <div className="glass-panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <h3 className="panel-title">
              <UserCheck size={20} color="var(--primary)" />
              Sotuvchilar Samaradorligi & KPI
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {staffPerformance.map((st, idx) => (
              <div key={idx} style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>{st.name}</div>
                  <span className="badge badge-cash">{st.count} ta chek</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span>Savdo hajmi: <strong style={{ color: '#fff' }}>{formatMoney(st.total)}</strong></span>
                  <span>Hisoblangan 2% bonus: <strong style={{ color: 'var(--gold)' }}>{formatMoney(st.bonus)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sales Journal */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-header" style={{ padding: '20px 24px', margin: 0, borderBottom: '1px solid var(--border-light)' }}>
          <h3 className="panel-title">
            <ShoppingBag size={20} color="var(--primary)" />
            Real Vaqt Savdolar Tarixi ({sales.length} ta chek)
          </h3>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Chek ID</th>
                <th>Sana va Vaqt</th>
                <th>Sotuvchi (Kassir)</th>
                <th>Sotilgan Mahsulotlar</th>
                <th>To'lov Turi</th>
                <th>Jami Summa</th>
                <th style={{ textAlign: 'right' }}>Chekni ko'rish</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 10).map(sale => (
                <tr key={sale.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{sale.id}</td>
                  <td style={{ color: 'var(--text-sub)' }}>{sale.date}</td>
                  <td style={{ fontWeight: 600 }}>{sale.cashierName}</td>
                  <td>
                    {sale.items?.map(i => `${i.name} (${i.quantity}x)`).join(', ')}
                  </td>
                  <td>
                    <span className={`badge ${
                      sale.paymentMethod === 'Naqd' ? 'badge-cash' :
                      sale.paymentMethod === 'Karta' ? 'badge-card' :
                      sale.paymentMethod === 'Bank perech' ? 'badge-bank' : 'badge-debt'
                    }`}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td style={{ fontWeight: 800, color: '#fff' }}>{formatMoney(sale.total)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => onViewReceipt(sale)}
                    >
                      <Eye size={14} /> Chek
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
