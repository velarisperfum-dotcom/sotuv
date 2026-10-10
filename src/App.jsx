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
import StoreOnboardingAuth from './components/StoreOnboardingAuth';
import StoreSettingsModal from './components/StoreSettingsModal';
import { getSampleProductsForIndustry } from './data/industryProducts';
import { getIndustryById } from './data/industriesData';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_STAFF, 
  INITIAL_DEBTS, 
  INITIAL_SALES, 
  INITIAL_EXPENSES, 
  INITIAL_BALANCES,
  INITIAL_CUSTOMERS
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
  // Store Onboarding & Session Auth State
  const [currentStoreSession, setCurrentStoreSession] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_current_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    // Agar foydalanuvchi birinchi marta kirayotgan bo'lsa (sessiya bo'lmasa), onboarding ochiladi!
    try {
      const saved = localStorage.getItem('savdo_current_session');
      return !saved;
    } catch {
      return true;
    }
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Store Mode (Savdo sohasi)
  const [storeMode, setStoreMode] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('savdo_current_session') || 'null');
      if (session?.industryId) return session.industryId;
    } catch {}
    const saved = localStorage.getItem('billz_store_mode');
    return saved || 'universal';
  });

  // Persistence with LocalStorage + Server sync
  const [products, setProducts] = useState(() => {
    try {
      // Bir martalik tozalash: agar eski aralashgan parfyum tovarlari qolib ketgan bo'lsa
      if (!localStorage.getItem('billz_store_cleaned_v2')) {
        localStorage.removeItem('billz_products_v4');
        localStorage.removeItem('blizz_products');
        localStorage.removeItem('billz_products_electronics');
        localStorage.removeItem('billz_products_clothing');
        localStorage.removeItem('billz_products_universal');
        localStorage.setItem('billz_store_cleaned_v2', 'true');
        return [];
      }

      const session = JSON.parse(localStorage.getItem('savdo_current_session') || 'null');
      const activeIndustry = session?.industryId || localStorage.getItem('billz_store_mode') || 'universal';
      const savedInd = localStorage.getItem(`billz_products_${activeIndustry}`);
      if (savedInd) {
        const parsed = JSON.parse(savedInd);
        // Agar bu parfyum bo'lmagan soha bo'lsa, ichida parfyum tovarlari aralashib qolgan bo'lsa tozalaymiz
        if (activeIndustry !== 'perfume') {
          return parsed.filter(p => !p.id?.startsWith('prd-') || p.productType === activeIndustry);
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('billz_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [sales, setSales] = useState(() => {
    try {
      // Bir martalik tozalash: agar eski parfyum savdolari qolgan bo'lsa
      if (!localStorage.getItem('billz_sales_isolated_v3')) {
        localStorage.removeItem('blizz_sales');
        localStorage.removeItem('blizz_balances');
        localStorage.removeItem('blizz_debts');
        localStorage.removeItem('blizz_expenses');
        localStorage.setItem('billz_sales_isolated_v3', 'true');
        return [];
      }
      const session = JSON.parse(localStorage.getItem('savdo_current_session') || 'null');
      const activeIndustry = session?.industryId || localStorage.getItem('billz_store_mode') || 'universal';
      const saved = localStorage.getItem(`billz_sales_${activeIndustry}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [balances, setBalances] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('savdo_current_session') || 'null');
      const activeIndustry = session?.industryId || localStorage.getItem('billz_store_mode') || 'universal';
      const saved = localStorage.getItem(`billz_balances_${activeIndustry}`);
      return saved ? JSON.parse(saved) : { cash: 0, card: 0, bank: 0 };
    } catch {
      return { cash: 0, card: 0, bank: 0 };
    }
  });

  const [debts, setDebts] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('savdo_current_session') || 'null');
      const activeIndustry = session?.industryId || localStorage.getItem('billz_store_mode') || 'universal';
      const saved = localStorage.getItem(`billz_debts_${activeIndustry}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('blizz_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('savdo_current_session') || 'null');
      const activeIndustry = session?.industryId || localStorage.getItem('billz_store_mode') || 'universal';
      const saved = localStorage.getItem(`billz_expenses_${activeIndustry}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isServerConnected, setIsServerConnected] = useState(false);

  // UI Navigation & Roles (Boshlang'ich sahifa - Sotuvchi Kassa POS)
  const [currentRole, setCurrentRole] = useState('cashier'); // cashier, director, accountant, warehouse
  const [currentView, setCurrentView] = useState('pos'); // pos, sellers, director, warehouse, accounting
  const [activeReceiptSale, setActiveReceiptSale] = useState(null);
  const [customerReceiptSale, setCustomerReceiptSale] = useState(null);

  // Dynamic Multi-Industry Theme engine
  useEffect(() => {
    const indId = currentStoreSession?.industryId || storeMode || 'clothing';
    document.documentElement.setAttribute('data-industry', indId);
    document.body.setAttribute('data-industry', indId);
  }, [currentStoreSession, storeMode]);

  // Initial fetch from Railway PostgreSQL backend
  useEffect(() => {
    fetchAllServerData().then(serverData => {
      if (serverData) {
        setIsServerConnected(true);
        try {
          const session = JSON.parse(localStorage.getItem('savdo_current_session') || 'null');
          const currentMode = session?.industryId || localStorage.getItem('billz_store_mode') || 'universal';

          if (serverData.products && serverData.products.length > 0) {
            // Faqat va faqat joriy do'konga tegishli tovarlar qabul qilinadi!
            // Boshqa soha do'konlariga parfyumeriya tovarlari aslo tushmaydi!
            if (currentMode === 'perfume') {
              const perfumeOnly = serverData.products.filter(p => 
                p.productType === 'perfume' || p.category === 'Erkaklar' || p.category === 'Ayollar' || p.category === 'Unisex'
              );
              if (perfumeOnly.length > 0 && products.length === 0) {
                setProducts(perfumeOnly);
              }
            } else {
              // Boshqa barcha sohalar uchun faqat shu sohaga tegishlilari:
              const matching = serverData.products.filter(p => 
                p.productType === currentMode || (p.storeId && p.storeId === session?.id)
              );
              if (matching.length > 0) {
                setProducts(matching);
              }
            }
          }

          // Faqat parfyumeriya do'koni bo'lsa serverdagi eski parfyumeriya savdolarini yuklash:
          if (currentMode === 'perfume') {
            if (serverData.sales && serverData.sales.length > 0) setSales(serverData.sales);
            if (serverData.balances) setBalances(serverData.balances);
            if (serverData.debts) setDebts(serverData.debts);
            if (serverData.expenses) setExpenses(serverData.expenses);
          } else {
            // Boshqa barcha sohalar (Maishiy texnika, kiyim-kechak, elektronika va h.k.) uchun:
            // Faqat shu do'konga tegishli savdolar yuklanadi, parfyumeriya ma'lumotlari aslo tushmaydi!
            const storeSales = (serverData.sales || []).filter(s => s.storeId && s.storeId === session?.id);
            if (storeSales.length > 0) setSales(storeSales);
          }
          if (serverData.staff) setStaff(serverData.staff);
        } catch (e) {
          console.error('Server data filter error:', e);
        }
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
                  name: name || 'Mahsulot',
                  volume: volume || '',
                  quantity: Number(quantity) || 1,
                  price: Number(price) || totalParam
                };
              });
            } else {
              parsedItems = JSON.parse(decodedStr);
            }
          } catch {
            parsedItems = [{ name: 'Mahsulot', quantity: 1, price: totalParam }];
          }
        } else {
          parsedItems = [{ name: 'Mahsulot', quantity: 1, price: totalParam }];
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

  // Sync to localStorage strictly per active store industry
  useEffect(() => {
    const indId = currentStoreSession?.industryId || storeMode || 'universal';
    localStorage.setItem(`billz_products_${indId}`, JSON.stringify(products));
  }, [products, currentStoreSession, storeMode]);

  useEffect(() => {
    localStorage.setItem('billz_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('billz_store_mode', storeMode);
  }, [storeMode]);

  useEffect(() => {
    const indId = currentStoreSession?.industryId || storeMode || 'universal';
    localStorage.setItem(`billz_sales_${indId}`, JSON.stringify(sales));
  }, [sales, currentStoreSession, storeMode]);

  useEffect(() => {
    const indId = currentStoreSession?.industryId || storeMode || 'universal';
    localStorage.setItem(`billz_balances_${indId}`, JSON.stringify(balances));
  }, [balances, currentStoreSession, storeMode]);

  useEffect(() => {
    const indId = currentStoreSession?.industryId || storeMode || 'universal';
    localStorage.setItem(`billz_debts_${indId}`, JSON.stringify(debts));
  }, [debts, currentStoreSession, storeMode]);

  useEffect(() => {
    const indId = currentStoreSession?.industryId || storeMode || 'universal';
    localStorage.setItem(`billz_expenses_${indId}`, JSON.stringify(expenses));
  }, [expenses, currentStoreSession, storeMode]);

  useEffect(() => {
    localStorage.setItem('blizz_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('blizz_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Current active staff object
  const currentUser = (staff || []).find(s => {
    if (!s) return false;
    if (currentRole === 'director') return s.role === 'Direktor';
    if (currentRole === 'accountant') return s.role === 'Bosh Buxgalter';
    if (currentRole === 'warehouse') return s.role === 'Sklad Mudiri';
    return s?.role && typeof s.role === 'string' && s.role.includes('Sotuvchi');
  }) || (staff && staff[0]) || { name: 'Admin', role: 'Direktor' };

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

  const handleBatchAddProducts = (newProductsList) => {
    if (!Array.isArray(newProductsList) || newProductsList.length === 0) return;
    setProducts(prev => [...newProductsList, ...prev]);
    newProductsList.forEach(p => postProductToServer(p));
  };

  const handleUpdateProduct = (updatedProd) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    updateProductOnServer(updatedProd);
  };

  const handleDeleteProduct = (prodId) => {
    setProducts(prev => prev.filter(p => p.id !== prodId));
    deleteProductOnServer(prodId);
  };

  const handleClearAllProducts = () => {
    const indId = currentStoreSession?.industryId || storeMode || 'universal';
    setProducts([]);
    localStorage.removeItem(`billz_products_${indId}`);
    localStorage.removeItem('billz_products_v4');
    localStorage.removeItem('blizz_products');
  };

  const lowStockCount = products.filter(p => p.stock <= (p.minStock || 3)).length;
  const pendingDebtsCount = debts.filter(d => d.remainingAmount > 0).length;

  // Onboarding & Login Handlers
  const handleCompleteOnboarding = (sessionData) => {
    setCurrentStoreSession(sessionData);
    const indId = sessionData.industryId || 'universal';
    setStoreMode(indId);
    localStorage.setItem('billz_store_mode', indId);

    // Yangi soha tanlanganda unga xos tovarlar va toza moliyaviy hisobot yuklanadi
    const sampleProds = getSampleProductsForIndustry(indId);
    setProducts(sampleProds);
    localStorage.setItem(`billz_products_${indId}`, JSON.stringify(sampleProds));

    const savedSales = localStorage.getItem(`billz_sales_${indId}`);
    setSales(savedSales ? JSON.parse(savedSales) : []);
    const savedBalances = localStorage.getItem(`billz_balances_${indId}`);
    setBalances(savedBalances ? JSON.parse(savedBalances) : { cash: 0, card: 0, bank: 0 });
    const savedDebts = localStorage.getItem(`billz_debts_${indId}`);
    setDebts(savedDebts ? JSON.parse(savedDebts) : []);
    const savedExpenses = localStorage.getItem(`billz_expenses_${indId}`);
    setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);

    setIsAuthModalOpen(false);

    if (sessionData.directorName) {
      setStaff(prev => prev.map(s => {
        if (s.role === 'Direktor') {
          return { ...s, name: sessionData.directorName, phone: sessionData.phone || s.phone };
        }
        return s;
      }));
    }
  };

  const handleLoginSuccess = (sessionData) => {
    setCurrentStoreSession(sessionData);
    const indId = sessionData.industryId || 'universal';
    setStoreMode(indId);
    localStorage.setItem('billz_store_mode', indId);

    const savedProds = localStorage.getItem(`billz_products_${indId}`);
    setProducts(savedProds ? JSON.parse(savedProds) : getSampleProductsForIndustry(indId));
    
    const savedSales = localStorage.getItem(`billz_sales_${indId}`);
    setSales(savedSales ? JSON.parse(savedSales) : []);
    const savedBalances = localStorage.getItem(`billz_balances_${indId}`);
    setBalances(savedBalances ? JSON.parse(savedBalances) : { cash: 0, card: 0, bank: 0 });
    const savedDebts = localStorage.getItem(`billz_debts_${indId}`);
    setDebts(savedDebts ? JSON.parse(savedDebts) : []);
    const savedExpenses = localStorage.getItem(`billz_expenses_${indId}`);
    setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);

    setIsAuthModalOpen(false);
  };

  // Do'kon sohasini almashtirish: katalog va savdolar ham o'sha sohaga mos yangilanadi
  const handleSelectStoreMode = (mode) => {
    setStoreMode(mode);
    localStorage.setItem('billz_store_mode', mode);
    const savedProds = localStorage.getItem(`billz_products_${mode}`);
    setProducts(savedProds ? JSON.parse(savedProds) : getSampleProductsForIndustry(mode));

    const savedSales = localStorage.getItem(`billz_sales_${mode}`);
    setSales(savedSales ? JSON.parse(savedSales) : []);
    const savedBalances = localStorage.getItem(`billz_balances_${mode}`);
    setBalances(savedBalances ? JSON.parse(savedBalances) : { cash: 0, card: 0, bank: 0 });
    const savedDebts = localStorage.getItem(`billz_debts_${mode}`);
    setDebts(savedDebts ? JSON.parse(savedDebts) : []);
    const savedExpenses = localStorage.getItem(`billz_expenses_${mode}`);
    setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
  };

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
        storeMode={storeMode}
        currentStoreSession={currentStoreSession}
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
          storeMode={storeMode}
          onSelectStoreMode={handleSelectStoreMode}
          currentStoreSession={currentStoreSession}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        <main style={{ flex: 1, minHeight: 'calc(100vh - 70px)' }}>
          {currentView === 'pos' && (
            <div style={{ padding: '24px' }}>
              <POSCashier 
                products={products}
                onCompleteSale={handleCompleteSale}
                currentUser={currentUser}
                onOpenSellers={() => setCurrentView('sellers')}
                onAddProduct={handleAddProduct}
                customers={customers}
                storeMode={storeMode}
                onSelectStoreMode={handleSelectStoreMode}
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
              storeMode={storeMode}
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
              onBatchAddProducts={handleBatchAddProducts}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onClearAllProducts={handleClearAllProducts}
              storeMode={storeMode}
              onSelectStoreMode={handleSelectStoreMode}
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
          storeMode={storeMode}
          currentStoreSession={currentStoreSession}
        />
      )}

      {/* Onboarding & Store Authentication Modal (24+ Savdo Tizimi & Shaxsiy Login/Parol) */}
      {isAuthModalOpen && (
        <StoreOnboardingAuth 
          onCompleteOnboarding={handleCompleteOnboarding}
          onLoginSuccess={handleLoginSuccess}
          existingSession={currentStoreSession}
        />
      )}

      {/* Do'kon Sozlamalari & Logo yuklash modali */}
      {isSettingsModalOpen && (
        <StoreSettingsModal 
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          currentStoreSession={currentStoreSession}
          onUpdateSession={(updated) => {
            setCurrentStoreSession(updated);
            localStorage.setItem('savdo_current_session', JSON.stringify(updated));
            if (updated.directorName) {
              setStaff(prev => prev.map(s => s.role === 'Direktor' ? { ...s, name: updated.directorName, phone: updated.phone || s.phone } : s));
            }
          }}
          onOpenNewStoreOnboarding={() => {
            setIsSettingsModalOpen(false);
            setIsAuthModalOpen(true);
          }}
          onLogout={() => {
            localStorage.removeItem('savdo_current_session');
            setCurrentStoreSession(null);
            setIsSettingsModalOpen(false);
            setIsAuthModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
