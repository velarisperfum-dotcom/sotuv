import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import POSCashier from './components/POSCashier';
import WarehouseView from './components/WarehouseView';
import AccountingView from './components/AccountingView';
import DirectorDashboard from './components/DirectorDashboard';
import ReceiptModal from './components/ReceiptModal';
import MobileNav from './components/MobileNav';
import SellersView from './components/SellersView';
import CustomerReceiptView from './components/CustomerReceiptView';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_STAFF, 
  INITIAL_DEBTS, 
  INITIAL_SALES, 
  INITIAL_EXPENSES, 
  INITIAL_BALANCES 
} from './data/initialData';

import { 
  fetchAllServerData, 
  postSaleToServer, 
  postProductToServer, 
  updateProductOnServer, 
  deleteProductOnServer, 
  updateDebtOnServer, 
  postExpenseToServer, 
  updateBalancesOnServer 
} from './services/api';

export default function App() {
  // Persistence with LocalStorage + Server sync
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('blizz_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('blizz_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [balances, setBalances] = useState(() => {
    const saved = localStorage.getItem('blizz_balances');
    return saved ? JSON.parse(saved) : INITIAL_BALANCES;
  });

  const [debts, setDebts] = useState(() => {
    const saved = localStorage.getItem('blizz_debts');
    return saved ? JSON.parse(saved) : INITIAL_DEBTS;
  });

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('blizz_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('blizz_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [isServerConnected, setIsServerConnected] = useState(false);

  // UI Navigation & Roles (Boshlang'ich sahifa - Sotuvchi Kassa POS)
  const [currentRole, setCurrentRole] = useState('cashier'); // cashier, director, accountant, warehouse
  const [currentView, setCurrentView] = useState('pos'); // pos, sellers, director, warehouse, accounting
  const [activeReceiptSale, setActiveReceiptSale] = useState(null);
  const [customerReceiptSale, setCustomerReceiptSale] = useState(null);

  // Initial fetch from Railway PostgreSQL backend
  useEffect(() => {
    fetchAllServerData().then(serverData => {
      if (serverData) {
        setIsServerConnected(true);
        if (serverData.products && serverData.products.length > 0) setProducts(serverData.products);
        if (serverData.sales && serverData.sales.length > 0) setSales(serverData.sales);
        if (serverData.balances) setBalances(serverData.balances);
        if (serverData.debts) setDebts(serverData.debts);
        if (serverData.staff) setStaff(serverData.staff);
        if (serverData.expenses) setExpenses(serverData.expenses);
      }
    });
  }, []);

  // Handle QR Code Scan: agar QR-kod skaner qilingan bo'lsa, FAQAT CHEKNING O'ZI ochiladi!
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const receiptId = urlParams.get('receipt') || urlParams.get('chek');
      if (receiptId) {
        const found = sales.find(s => s.id === receiptId);
        if (found) {
          setCustomerReceiptSale({ ...found, isVerifiedOnline: true });
          return;
        }

        const totalParam = Number(urlParams.get('total')) || 0;
        const dateParam = urlParams.get('date') || new Date().toLocaleString('uz-UZ');
        const cashierParam = urlParams.get('cashier') || 'Sotuvchi-kassir';
        const methodParam = urlParams.get('method') || 'Karta';
        const customerParam = urlParams.get('customer') || '';
        const rawItemsParam = urlParams.get('items');

        let parsedItems = [];
        if (rawItemsParam) {
          try {
            const decodedStr = decodeURIComponent(rawItemsParam);
            if (decodedStr.includes('|')) {
              parsedItems = decodedStr.split('~').map(part => {
                const [name, volume, quantity, price] = part.split('|');
                return {
                  name: name || 'Atir',
                  volume: volume || '',
                  quantity: Number(quantity) || 1,
                  price: Number(price) || totalParam
                };
              });
            } else {
              parsedItems = JSON.parse(decodedStr);
            }
          } catch {
            parsedItems = [{ name: 'Selektiv parfyumeriya', quantity: 1, price: totalParam }];
          }
        } else {
          parsedItems = [{ name: 'Selektiv parfyumeriya', quantity: 1, price: totalParam }];
        }

        setCustomerReceiptSale({
          id: receiptId,
          date: decodeURIComponent(dateParam),
          cashierName: decodeURIComponent(cashierParam),
          total: totalParam,
          paymentMethod: decodeURIComponent(methodParam),
          customer: customerParam ? decodeURIComponent(customerParam) : null,
          items: parsedItems,
          isVerifiedOnline: true
        });
      }
    } catch (err) {
      console.error('URL receipt check error:', err);
    }
  }, [sales]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('blizz_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('blizz_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('blizz_balances', JSON.stringify(balances));
  }, [balances]);

  useEffect(() => {
    localStorage.setItem('blizz_debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('blizz_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('blizz_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Current active staff object
  const currentUser = staff.find(s => {
    if (currentRole === 'director') return s.role === 'Direktor';
    if (currentRole === 'accountant') return s.role === 'Bosh Buxgalter';
    if (currentRole === 'warehouse') return s.role === 'Sklad Mudiri';
    return s.role.includes('Sotuvchi');
  }) || staff[0];

  // Sale completion handler
  const handleCompleteSale = (newSale) => {
    // 1. Update stock in warehouse
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const soldItem = newSale.items.find(item => item.id === p.id);
        if (soldItem) {
          const updatedStock = Math.max(0, p.stock - soldItem.quantity);
          return { ...p, stock: updatedStock };
        }
        return p;
      });
    });

    // 2. Update balances based on payment breakdown
    setBalances(prev => {
      const breakdown = newSale.paymentBreakdown || {};
      const newCash = prev.cash + (breakdown.cash || 0);
      const newCard = prev.card + (breakdown.card || 0);
      const newBank = prev.bank + (breakdown.bank || 0);
      return { cash: newCash, card: newCard, bank: newBank };
    });

    // 3. If debt, add to debts registry
    if (newSale.paymentMethod === 'Qarz' && newSale.debtDetails) {
      const newDebtItem = {
        id: `dbt-${Date.now()}`,
        customerName: newSale.customer || 'Noma’lum mijoz',
        phone: newSale.customerPhone || '—',
        productSummary: newSale.items.map(i => `${i.name} (${i.quantity}x)`).join(', '),
        totalAmount: newSale.total,
        paidAmount: newSale.debtDetails.paidAmount || 0,
        remainingAmount: newSale.debtDetails.remainingAmount,
        dueDate: newSale.debtDetails.dueDate,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Faol'
      };
      setDebts(prev => [newDebtItem, ...prev]);
    }

    // 4. Prepend to sales
    setSales(prev => [newSale, ...prev]);

    // Asynchronously sync with Railway backend
    postSaleToServer(newSale);

    // 5. Open receipt modal
    setActiveReceiptSale(newSale);
  };

  // Pay Debt handler
  const handlePayDebt = (debtId, amount, payMethod) => {
    let updatedDebtObj = null;
    setDebts(prev => prev.map(d => {
      if (d.id === debtId) {
        const updatedPaid = d.paidAmount + amount;
        const updatedRemaining = Math.max(0, d.totalAmount - updatedPaid);
        updatedDebtObj = {
          ...d,
          paidAmount: updatedPaid,
          remainingAmount: updatedRemaining,
          status: updatedRemaining === 0 ? 'To\'langan' : d.status
        };
        return updatedDebtObj;
      }
      return d;
    }));

    if (updatedDebtObj) {
      updateDebtOnServer(updatedDebtObj);
    }

    // Update balances
    setBalances(prev => {
      const nextBalances = { ...prev };
      if (payMethod === 'Naqd') nextBalances.cash += amount;
      if (payMethod === 'Karta') nextBalances.card += amount;
      if (payMethod === 'Bank perech') nextBalances.bank += amount;
      updateBalancesOnServer(nextBalances);
      return nextBalances;
    });
  };

  // Pay Salary handler
  const handlePaySalary = (staffId, amount, source) => {
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        const updatedPaid = (s.paidThisMonth || 0) + amount;
        const isFull = updatedPaid >= s.baseSalary;
        return {
          ...s,
          paidThisMonth: updatedPaid,
          status: isFull ? 'To\'langan' : 'Qisman to\'langan'
        };
      }
      return s;
    }));

    // Deduct from balance
    setBalances(prev => {
      const next = { ...prev };
      if (source === 'Naqd') {
        next.cash = Math.max(0, next.cash - amount);
      } else {
        next.bank = Math.max(0, next.bank - amount);
      }
      updateBalancesOnServer(next);
      return next;
    });
  };

  // Add Expense handler
  const handleAddExpense = (expense) => {
    setExpenses(prev => [expense, ...prev]);
    postExpenseToServer(expense);

    setBalances(prev => {
      const next = { ...prev };
      if (expense.source === 'Naqd') {
        next.cash = Math.max(0, next.cash - expense.amount);
      } else {
        next.bank = Math.max(0, next.bank - expense.amount);
      }
      updateBalancesOnServer(next);
      return next;
    });
  };

  // Warehouse product actions
  const handleAddProduct = (newProd) => {
    setProducts(prev => [newProd, ...prev]);
    postProductToServer(newProd);
  };

  const handleUpdateProduct = (updatedProd) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    updateProductOnServer(updatedProd);
  };

  const handleDeleteProduct = (prodId) => {
    setProducts(prev => prev.filter(p => p.id !== prodId));
    deleteProductOnServer(prodId);
  };

  const lowStockCount = products.filter(p => p.stock <= (p.minStock || 3)).length;
  const pendingDebtsCount = debts.filter(d => d.remainingAmount > 0).length;

  // AGAR QR-KOD SKANERLANGAN BO'LSA, FAQAT CHEKNING O'ZI CHIQSIN!
  if (customerReceiptSale) {
    return (
      <CustomerReceiptView 
        sale={customerReceiptSale}
        onGoHome={() => {
          const newUrl = window.location.pathname;
          window.history.pushState({}, '', newUrl);
          setCustomerReceiptSale(null);
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentRole={currentRole}
        onChangeRole={(role) => setCurrentRole(role)}
        currentView={currentView}
        onChangeView={(view) => setCurrentView(view)}
        lowStockCount={lowStockCount}
        pendingDebtsCount={pendingDebtsCount}
      />

      {/* Main App Content Area */}
      <div className="main-wrapper">
        <Header 
          currentRole={currentRole}
          currentUser={currentUser}
          currentView={currentView}
          onChangeView={(view) => setCurrentView(view)}
          balances={balances}
          lowStockCount={lowStockCount}
          pendingDebtsCount={pendingDebtsCount}
          isServerConnected={isServerConnected}
        />

        <main style={{ flex: 1, minHeight: 'calc(100vh - 70px)' }}>
          {currentView === 'pos' && (
            <div style={{ padding: '24px' }}>
              <POSCashier 
                products={products}
                onCompleteSale={handleCompleteSale}
                currentUser={currentUser}
                onOpenSellers={() => setCurrentView('sellers')}
              />
            </div>
          )}

          {currentView === 'director' && (
            <DirectorDashboard 
              sales={sales}
              products={products}
              staff={staff}
              balances={balances}
              debts={debts}
              expenses={expenses}
              onViewReceipt={(sale) => setActiveReceiptSale(sale)}
              onChangeView={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'sellers' && (
            <SellersView 
              staff={staff}
              sales={sales}
              onAddStaff={(newS) => setStaff(prev => [...prev, newS])}
              onOpenPOS={() => setCurrentView('pos')}
            />
          )}

          {currentView === 'warehouse' && (
            <WarehouseView 
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {currentView === 'accounting' && (
            <AccountingView 
              balances={balances}
              debts={debts}
              staff={staff}
              expenses={expenses}
              sales={sales}
              onPayDebt={handlePayDebt}
              onAddDebt={(d) => setDebts(prev => [d, ...prev])}
              onPaySalary={handlePaySalary}
              onAddExpense={handleAddExpense}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Telefonlar uchun) */}
      <MobileNav 
        currentView={currentView}
        onChangeView={(view) => setCurrentView(view)}
        lowStockCount={lowStockCount}
        pendingDebtsCount={pendingDebtsCount}
      />

      {/* Thermal receipt modal if any sale is open */}
      {activeReceiptSale && (
        <ReceiptModal 
          sale={activeReceiptSale}
          onClose={() => setActiveReceiptSale(null)}
        />
      )}
    </div>
  );
}
