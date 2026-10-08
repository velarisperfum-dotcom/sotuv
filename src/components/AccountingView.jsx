import React, { useState } from 'react';
import { 
  DollarSign, CreditCard, Building2, Clock, Users, Plus, 
  ArrowDownCircle, ArrowUpCircle, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';

export default function AccountingView({ 
  balances, 
  debts, 
  staff, 
  expenses, 
  sales,
  onPayDebt, 
  onAddDebt, 
  onPaySalary, 
  onAddExpense 
}) {
  const [activeTab, setActiveTab] = useState('debts'); // 'debts', 'salary', 'bank', 'expenses'
  
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

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  const totalDebtsRemaining = debts.reduce((acc, d) => acc + (d.remainingAmount || 0), 0);
  const totalSalaries = staff.reduce((acc, s) => acc + (s.baseSalary || 0), 0);
  const totalPaidSalaries = staff.reduce((acc, s) => acc + (s.paidThisMonth || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);

  const handleOpenPayDebt = (debt) => {
    setSelectedDebt(debt);
    setPayAmount(debt.remainingAmount);
    setPayMethod('Naqd');
    setShowPayDebtModal(true);
  };

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

  const handleOpenSalary = (st) => {
    setSelectedStaff(st);
    const remainingToPay = Math.max(0, st.baseSalary - (st.paidThisMonth || 0));
    setSalaryAmount(remainingToPay);
    setSalarySource('Bank perech');
    setShowSalaryModal(true);
  };

  const handleConfirmSalary = (e) => {
    e.preventDefault();
    if (!salaryAmount || Number(salaryAmount) <= 0) return;
    onPaySalary(selectedStaff.id, Number(salaryAmount), salarySource);
    setShowSalaryModal(false);
    setSelectedStaff(null);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Buxgalteriya & Moliya Nazorati</h2>
          <p>Oplata turlari, qarz daftari, xodimlar oyligi va bank hisob-kitoblari</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setShowExpenseModal(true)}>
            <Plus size={16} /> Chiqim / Xarajat kiritish
          </button>
        </div>
      </div>

      {/* Balances Cards */}
      <div className="stats-grid">
        <div className="stat-card emerald">
          <div className="stat-header">
            <span className="stat-title">Naqd Pul Kassasi</span>
            <div className="stat-icon"><DollarSign size={20} color="var(--success)" /></div>
          </div>
          <div className="stat-value">{formatMoney(balances.cash)}</div>
          <div className="stat-desc">Kassada mavjud real naqd mablag'</div>
        </div>

        <div className="stat-card" style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
          <div className="stat-header">
            <span className="stat-title">Terminal / Karta</span>
            <div className="stat-icon"><CreditCard size={20} color="var(--primary)" /></div>
          </div>
          <div className="stat-value">{formatMoney(balances.card)}</div>
          <div className="stat-desc">Uzcard & Humo tushumlari</div>
        </div>

        <div className="stat-card cyan">
          <div className="stat-header">
            <span className="stat-title">Bank Perechisleniye</span>
            <div className="stat-icon"><Building2 size={20} color="var(--info)" /></div>
          </div>
          <div className="stat-value">{formatMoney(balances.bank)}</div>
          <div className="stat-desc">Korxona hisob raqamidagi balans</div>
        </div>

        <div className="stat-card amber">
          <div className="stat-header">
            <span className="stat-title">Kutilayotgan Qarzlar</span>
            <div className="stat-icon"><Clock size={20} color="var(--gold)" /></div>
          </div>
          <div className="stat-value">{formatMoney(totalDebtsRemaining)}</div>
          <div className="stat-desc">{debts.length} ta faol nasiya kelishuvi</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', marginBottom: '20px' }}>
        <button 
          className={`pos-filter-btn ${activeTab === 'debts' ? 'active' : ''}`}
          onClick={() => setActiveTab('debts')}
        >
          📋 Qarz daftari (Nasiyalar) ({debts.length})
        </button>
        <button 
          className={`pos-filter-btn ${activeTab === 'salary' ? 'active' : ''}`}
          onClick={() => setActiveTab('salary')}
        >
          💼 Xodimlar Oyligi ({staff.length})
        </button>
        <button 
          className={`pos-filter-btn ${activeTab === 'bank' ? 'active' : ''}`}
          onClick={() => setActiveTab('bank')}
        >
          🏦 Bank Perechisleniye
        </button>
        <button 
          className={`pos-filter-btn ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          📉 Xarajatlar & Chiqimlar ({expenses.length})
        </button>
      </div>

      {/* Tab 1: Qarz Daftari */}
      {activeTab === 'debts' && (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '20px 24px', margin: 0, borderBottom: '1px solid var(--border-light)' }}>
            <h3 className="panel-title">
              <Clock size={20} color="var(--gold)" />
              Mijozlar Nasiya & Qarz Daftari
            </h3>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mijoz F.I.Sh</th>
                  <th>Telefon</th>
                  <th>Olingan Parfyum</th>
                  <th>Umumiy Summa</th>
                  <th>To'langan</th>
                  <th>Qoldiq Qarz</th>
                  <th>To'lov Muddati</th>
                  <th>Holati</th>
                  <th style={{ textAlign: 'right' }}>Amal</th>
                </tr>
              </thead>
              <tbody>
                {debts.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{d.customerName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{d.phone}</td>
                    <td>{d.productSummary}</td>
                    <td>{formatMoney(d.totalAmount)}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{formatMoney(d.paidAmount)}</td>
                    <td style={{ color: 'var(--gold)', fontWeight: 800 }}>{formatMoney(d.remainingAmount)}</td>
                    <td>{d.dueDate}</td>
                    <td>
                      <span className={`badge ${d.remainingAmount === 0 ? 'badge-cash' : 'badge-debt'}`}>
                        {d.remainingAmount === 0 ? 'Yopilgan' : d.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {d.remainingAmount > 0 ? (
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleOpenPayDebt(d)}
                        >
                          Qarzni to'lash
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--success)' }}>To'liq to'langan</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Xodimlar Oyligi */}
      {activeTab === 'salary' && (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '20px 24px', margin: 0, borderBottom: '1px solid var(--border-light)' }}>
            <h3 className="panel-title">
              <Users size={20} color="var(--primary)" />
              Xodimlar Maoshi va Ish Haqi ("Oylik")
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Jami oylik fondi: <strong>{formatMoney(totalSalaries)}</strong> | To'landi: <strong style={{ color: 'var(--success)' }}>{formatMoney(totalPaidSalaries)}</strong>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Xodim F.I.Sh</th>
                  <th>Lavozim (Rol)</th>
                  <th>Telefon</th>
                  <th>Asosiy Oylik</th>
                  <th>Savdo Bonusi</th>
                  <th>Shu oy to'landi</th>
                  <th>Holati</th>
                  <th style={{ textAlign: 'right' }}>Oylik to'lash</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(s => {
                  const remaining = Math.max(0, s.baseSalary - (s.paidThisMonth || 0));
                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 700, color: '#fff' }}>{s.name}</td>
                      <td>
                        <span className="badge badge-card">{s.role}</span>
                      </td>
                      <td style={{ color: 'var(--text-sub)' }}>{s.phone}</td>
                      <td style={{ fontWeight: 600 }}>{formatMoney(s.baseSalary)}</td>
                      <td style={{ color: 'var(--gold)' }}>
                        {s.bonusRate ? `${s.bonusRate}% (Savdodan)` : '—'}
                      </td>
                      <td style={{ color: 'var(--success)', fontWeight: 700 }}>
                        {formatMoney(s.paidThisMonth)}
                      </td>
                      <td>
                        <span className={`badge ${s.status === "To'langan" ? 'badge-cash' : 'badge-debt'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {remaining > 0 ? (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleOpenSalary(s)}
                          >
                            To'lash ({formatMoney(remaining)})
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                            To'liq berildi ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Bank Perechisleniye */}
      {activeTab === 'bank' && (
        <div className="glass-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Building2 size={20} color="var(--info)" />
              Bank Perechisleniye & Hisob-Faktura Tarixi
            </h3>
            <span className="badge badge-bank">Hisob raqam balansi: {formatMoney(balances.bank)}</span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Korxona va tashkilotlar bilan tuzilgan shartnomalar, hisob-fakturalar hamda bank o'tkazmalari orqali amalga oshirilgan savdolar:
          </p>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Chek / Hujjat №</th>
                  <th>Sana</th>
                  <th>Kontragent / Mijoz</th>
                  <th>Mahsulotlar</th>
                  <th>Summa</th>
                  <th>Turi</th>
                  <th>Holati</th>
                </tr>
              </thead>
              <tbody>
                {sales.filter(s => s.paymentMethod === 'Bank perech').map(s => (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{s.id}</td>
                    <td>{s.date}</td>
                    <td style={{ fontWeight: 600 }}>{s.customer || 'Korporativ mijoz'}</td>
                    <td>{s.items?.map(i => i.name).join(', ')}</td>
                    <td style={{ fontWeight: 800, color: '#fff' }}>{formatMoney(s.total)}</td>
                    <td><span className="badge badge-bank">Bank perech</span></td>
                    <td><span className="badge badge-cash">Tasdiqlangan</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Xarajatlar */}
      {activeTab === 'expenses' && (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '20px 24px', margin: 0, borderBottom: '1px solid var(--border-light)' }}>
            <h3 className="panel-title">
              <ArrowDownCircle size={20} color="var(--danger)" />
              Do'kon Xarajatlari & Chiqimlari
            </h3>
            <div style={{ fontWeight: 700, color: 'var(--danger)' }}>
              Jami xarajat: {formatMoney(totalExpenses)}
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Xarajat Nomi</th>
                  <th>Kategoriya</th>
                  <th>Sana</th>
                  <th>To'lov Manbai</th>
                  <th style={{ textAlign: 'right' }}>Chiqim Summasi</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{e.title}</td>
                    <td><span className="badge badge-card">{e.category}</span></td>
                    <td style={{ color: 'var(--text-sub)' }}>{e.date}</td>
                    <td>{e.source || 'Naqd kassa'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--danger)' }}>
                      -{formatMoney(e.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pay Debt Modal */}
      {showPayDebtModal && selectedDebt && (
        <div className="modal-backdrop" onClick={() => setShowPayDebtModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Qarz To'lovini Qabul Qilish</h3>
              <button className="cart-qty-btn" onClick={() => setShowPayDebtModal(false)}>✕</button>
            </div>
            <form onSubmit={handleConfirmPayDebt}>
              <div className="modal-body">
                <div style={{ marginBottom: '14px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{selectedDebt.customerName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedDebt.phone}</div>
                  <div style={{ marginTop: '6px', fontSize: '0.85rem' }}>
                    Qoldiq qarz summasi: <strong style={{ color: 'var(--gold)' }}>{formatMoney(selectedDebt.remainingAmount)}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">To'lanayotgan summa (so'm) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={payAmount} 
                    onChange={(e) => setPayAmount(e.target.value)} 
                    max={selectedDebt.remainingAmount}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Qaysi hisobga kirim qilinsin?</label>
                  <select 
                    className="form-control"
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                  >
                    <option value="Naqd">💵 Naqd pul kassa</option>
                    <option value="Karta">💳 Terminal (Karta)</option>
                    <option value="Bank perech">🏦 Bank perechisleniye</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPayDebtModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> To'lovni tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Salary Modal */}
      {showSalaryModal && selectedStaff && (
        <div className="modal-backdrop" onClick={() => setShowSalaryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Oylik Maosh To'lash</h3>
              <button className="cart-qty-btn" onClick={() => setShowSalaryModal(false)}>✕</button>
            </div>
            <form onSubmit={handleConfirmSalary}>
              <div className="modal-body">
                <div style={{ marginBottom: '14px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{selectedStaff.name} ({selectedStaff.role})</div>
                  <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                    Belgilangan oylik: <strong>{formatMoney(selectedStaff.baseSalary)}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">To'lanadigan summa (so'm) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={salaryAmount} 
                    onChange={(e) => setSalaryAmount(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">To'lov manbai (Qaysi hisobdan chiqim bo'lsin?)</label>
                  <select 
                    className="form-control"
                    value={salarySource}
                    onChange={(e) => setSalarySource(e.target.value)}
                  >
                    <option value="Naqd">💵 Naqd kassa</option>
                    <option value="Bank perech">🏦 Bank hisob raqami</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSalaryModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-success">
                  To'lashni tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="modal-backdrop" onClick={() => setShowExpenseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Xarajat / Chiqim Kiritish</h3>
              <button className="cart-qty-btn" onClick={() => setShowExpenseModal(false)}>✕</button>
            </div>
            <form onSubmit={handleConfirmExpense}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Xarajat maqsadi *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Masalan: Do'kon ijarasi, marketing, tozalik mollari"
                    value={expenseTitle} 
                    onChange={(e) => setExpenseTitle(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Summa (so'm) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="1500000"
                    value={expenseAmount} 
                    onChange={(e) => setExpenseAmount(e.target.value)} 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Kategoriya</label>
                    <select 
                      className="form-control"
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                    >
                      <option value="Ijara">Ijara</option>
                      <option value="Marketing">Marketing & Reklama</option>
                      <option value="Kommunal">Kommunal</option>
                      <option value="Qadoqlash">Qadoqlash & Paketlar</option>
                      <option value="Boshqa">Boshqa operatsion</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">To'lov manbai</label>
                    <select 
                      className="form-control"
                      value={expenseSource}
                      onChange={(e) => setExpenseSource(e.target.value)}
                    >
                      <option value="Naqd">Naqd kassa</option>
                      <option value="Bank perech">Bank hisob raqami</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpenseModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
