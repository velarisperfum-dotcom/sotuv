import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import POSCashier from './components/POSCashier';
import WarehouseView from './components/WarehouseView';
import AccountingView from './components/AccountingView';
import DirectorDashboard from './components/DirectorDashboard';
import SellerMobileView from './components/SellerMobileView';
import ReceiptModal from './components/ReceiptModal';
import MobileNav from './components/MobileNav';
import SellersView from './components/SellersView';
import CustomerReceiptView from './components/CustomerReceiptView';
import StoreOnboardingAuth from './components/StoreOnboardingAuth';
import StoreSettingsModal from './components/StoreSettingsModal';
import { Smartphone, X, CheckCircle2 } from 'lucide-react';

import { getSampleProductsForIndustry } from './data/industryProducts';
import { getIndustryById } from './data/industriesData';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_STAFF, 
  INITIAL_DEBTS, 
  INITIAL_SALES, 
  INITIAL_EXPENSES, 
  INITIAL_BALANCES,
  INITIAL_CUSTOMERS,
  INITIAL_STOCK_TRANSFERS,
  INITIAL_SELLER_ORDERS
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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  // Store Mode (Savdo sohasi)
  const [storeMode, setStoreMode] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('savdo_current_session') || 'null');
      if (session?.industryId) return session.industryId;
    } catch {}
    const saved = localStorage.getItem('billz_store_mode');
    return saved || 'clothing';
  });

  // 1. PRODUCTS (Sklad Qoldiqlari)
  const [products, setProducts] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('savdo_current_session') || 'null');
      const activeIndustry = session?.industryId || localStorage.getItem('billz_store_mode') || 'clothing';
      const savedInd = localStorage.getItem(`billz_products_${activeIndustry}`);
      if (savedInd) {
        const parsed = JSON.parse(savedInd);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return getSampleProductsForIndustry(activeIndustry);
    } catch {
      return getSampleProductsForIndustry('clothing');
    }
  });

  // 2. STOCK TRANSFERS (Direktor skladga yuborgan perexodlar / kirimlar)
  const [stockTransfers, setStockTransfers] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_stock_transfers');
      return saved ? JSON.parse(saved) : INITIAL_STOCK_TRANSFERS;
    } catch {
      return INITIAL_STOCK_TRANSFERS;
    }
  });

  // 3. SELLER ORDERS (Sotuvchilar telefondan yuborgan zayavkalar)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_seller_orders');
      return saved ? JSON.parse(saved) : INITIAL_SELLER_ORDERS;
    } catch {
      return INITIAL_SELLER_ORDERS;
    }
  });

  // 4. BALANCES (Kassa, Karta, Bank)
  const [balances, setBalances] = useState(() => {
    try {
      const saved = localStorage.getItem('billz_balances');
      return saved ? JSON.parse(saved) : { cash: 12500000, card: 8400000, bank: 34500000 };
    } catch {
      return { cash: 12500000, card: 8400000, bank: 34500000 };
    }
  });

  // 5. DEBTS (Nasiyalar daftari)
  const [debts, setDebts] = useState(() => {
    try {
      const saved = localStorage.getItem('billz_debts');
      return saved ? JSON.parse(saved) : [
        {
          id: 'd-1',
          customerName: 'Akmal Zokirov',
          customerPhone: '+998 99 876 54 32',
          totalDebt: 640000,
          remainingAmount: 640000,
          dueDate: '2026-10-30',
          date: '2026-10-16',
          status: 'pending'
        }
      ];
    } catch {
      return [];
    }
  });

  // 6. CUSTOMERS
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('billz_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // 7. STAFF (Xodimlar)
  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('blizz_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  // 8. EXPENSES (Xarajatlar)
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('billz_expenses');
      return saved ? JSON.parse(saved) : [
        { id: 'exp-1', title: 'Do\'kon oylik ijarasi', amount: 3500000, category: 'Ijara', source: 'Bank perech', date: '2026-10-01' }
      ];
    } catch {
      return [];
    }
  });

  // 9. SALES (Tarix va cheklar)
  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem('billz_sales');
      return saved ? JSON.parse(saved) : [
        {
          id: 'SL-1001',
          date: '2026-10-16 09:30:00',
          cashierName: 'Jasur Qodirov',
          customer: 'Akmal Zokirov',
          paymentMethod: 'Qarz',
          total: 640000,
          items: [{ id: 'prd-clt-1', name: "Zara Slim Fit Klassik Ko'ylak", quantity: 2, price: 320000 }]
        }
      ];
    } catch {
      return [];
    }
  });

  const [isServerConnected, setIsServerConnected] = useState(false);

  // UI Navigation: 4 Ta Asosiy Rol
  // 'director' | 'accounting' | 'warehouse' | 'seller_mobile' | 'pos' | 'sellers'
  const [currentRole, setCurrentRole] = useState('director');
  const [currentView, setCurrentView] = useState('director');
  const [activeReceiptSale, setActiveReceiptSale] = useState(null);
  const [customerReceiptSale, setCustomerReceiptSale] = useState(null);

  // Current active user
  const currentUser = staff.find(s => s.role?.toLowerCase().includes(currentRole)) || staff[0];

  // Dynamic Theme
  useEffect(() => {
    const indId = currentStoreSession?.industryId || storeMode || 'clothing';
    document.documentElement.setAttribute('data-industry', indId);
    document.body.setAttribute('data-industry', indId);
  }, [currentStoreSession, storeMode]);

  // Sync to LocalStorage
  useEffect(() => {
    const indId = currentStoreSession?.industryId || storeMode || 'clothing';
    localStorage.setItem(`billz_products_${indId}`, JSON.stringify(products));
  }, [products, currentStoreSession, storeMode]);

  useEffect(() => {
    localStorage.setItem('savdo_stock_transfers', JSON.stringify(stockTransfers));
  }, [stockTransfers]);

  useEffect(() => {
    localStorage.setItem('savdo_seller_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('billz_balances', JSON.stringify(balances));
  }, [balances]);

  useEffect(() => {
    localStorage.setItem('billz_debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('billz_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('blizz_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('billz_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Initial fetch from backend if available
  useEffect(() => {
    fetchAllServerData().then(serverData => {
      if (serverData) {
        setIsServerConnected(true);
      }
    });
  }, []);

  // Check URL params for QR receipt
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const receiptId = urlParams.get('receipt') || urlParams.get('chek');
      if (receiptId) {
        const found = sales.find(s => s.id === receiptId);
        if (found) {
          setCustomerReceiptSale({ ...found, isVerifiedOnline: true });
        }
      }
    } catch {}
  }, [sales]);

  // ==========================================
  // BIZNES JARAYON ZANJIRI HANDLERLARI (WORKFLOW)
  // ==========================================

  // 1. DIREKTOR -> SKLADGA PEREHOD (KIRIM) YUBORISH
  const handleCreateTransfer = (newTransfer) => {
    setStockTransfers(prev => [newTransfer, ...prev]);
    alert("Kirim partiyasi muvaffaqiyatli jo'natildi! Tovar Skladchining qabul qilish navbatiga o'tdi.");
  };

  // 2. SKLADCHI -> TOVARNI "QABUL QILDIM" (SKLAD BALANSIGA QO'SHISH)
  const handleReceiveTransfer = (transferId) => {
    const transfer = stockTransfers.find(t => t.id === transferId);
    if (!transfer) return;

    // Sklad qoldig'iga tovar qo'shish
    setProducts(prevProducts => {
      const existing = prevProducts.find(p => 
        (p.name || '').toLowerCase() === (transfer.productName || '').toLowerCase()
      );

      if (existing) {
        return prevProducts.map(p => 
          p.id === existing.id 
            ? { ...p, stock: (p.stock || 0) + Number(transfer.quantity || 0) }
            : p
        );
      } else {
        const newProduct = {
          id: `prd-${Date.now()}`,
          name: transfer.productName,
          category: transfer.category || 'Umumiy',
          unit: transfer.unit || 'dona',
          costPrice: Number(transfer.costPrice) || 0,
          price: Number(transfer.price) || (Number(transfer.costPrice) * 1.3),
          stock: Number(transfer.quantity) || 0,
          minStock: 3,
          barcode: `${Math.floor(1000000000 + Math.random() * 9000000000)}`
        };
        return [newProduct, ...prevProducts];
      }
    });

    // Transfer statusini yangilash
    setStockTransfers(prev => prev.map(t => 
      t.id === transferId 
        ? { 
            ...t, 
            status: 'received', 
            receivedAt: new Date().toLocaleString('uz-UZ'),
            receivedBy: 'Bobur Rahimov (Sklad Mudiri)'
          }
        : t
    ));

    alert(`"${transfer.productName}" tovari (+${transfer.quantity} ${transfer.unit}) rasman skladga qabul qilindi!`);
  };

  // 3. SOTUVCHI -> BUXGALTERGA ZAYAVKA (ZAKAZ) YUBORISH
  const handleCreateSellerOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  // 4. BUXGALTER -> ZAYAVKANI TASDIQLASH (VA SKLADGA YUBORISH)
  const handleApproveOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // To'lov turiga qarab balanslarni yangilash
    const amount = Number(order.totalAmount || 0);

    if (order.paymentMethod === 'cash') {
      setBalances(prev => ({ ...prev, cash: (prev.cash || 0) + amount }));
    } else if (order.paymentMethod === 'card') {
      setBalances(prev => ({ ...prev, card: (prev.card || 0) + amount }));
    } else if (order.paymentMethod === 'bank') {
      setBalances(prev => ({ ...prev, bank: (prev.bank || 0) + amount }));
    } else if (order.paymentMethod === 'debt') {
      // Qarz daftariga yozish
      const newDebt = {
        id: `debt-${Date.now()}`,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        totalDebt: amount,
        remainingAmount: amount,
        date: new Date().toISOString().split('T')[0],
        dueDate: '15 kun ichida',
        orderId: order.id,
        notes: `Zayavka ${order.orderNumber} bo'yicha nasiya`
      };
      setDebts(prev => [newDebt, ...prev]);
    } else if (order.paymentMethod === 'salary_deduction') {
      // Xodim oyligidan chegirib qolish
      setStaff(prev => prev.map(s => {
        if (s.name === order.sellerName || s.id === order.sellerId) {
          return { ...s, paidThisMonth: (s.paidThisMonth || 0) + amount };
        }
        return s;
      }));
    }

    // Zakaz statusini 'approved_accounting' ga o'tkazish (Skladchiga yo'naltirish)
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { 
            ...o, 
            status: 'approved_accounting', 
            accountingApprovedAt: new Date().toLocaleString('uz-UZ') 
          }
        : o
    ));

    alert(`Zayavka (${order.orderNumber}) to'lovi tasdiqlandi va Skladchiga otgruzka uchun yuborildi!`);
  };

  // 5. BUXGALTER -> ZAYAVKANI RAD ETISH
  const handleRejectOrder = (orderId, reason) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: 'rejected_accounting', rejectionReason: reason }
        : o
    ));
  };

  // 6. SKLADCHI -> TOVARLARNI SOTUVCHIGA BERISH (VA SKLADDAN YECHISH!)
  const handleDispatchOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // AYAN SHU PAYTDA SKLADDAN TOVAR YECHILADI!
    setProducts(prevProducts => {
      const updated = [...prevProducts];
      order.items?.forEach(item => {
        const prodIndex = updated.findIndex(p => p.id === item.id || p.name === item.name);
        if (prodIndex !== -1) {
          const currentStock = updated[prodIndex].stock || 0;
          updated[prodIndex] = {
            ...updated[prodIndex],
            stock: Math.max(0, currentStock - Number(item.quantity || 1))
          };
        }
      });
      return updated;
    });

    // Zakaz statusini 'dispatched_warehouse' ga o'tkazish
    const dispatchedDate = new Date().toLocaleString('uz-UZ');
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: 'dispatched_warehouse', dispatchedAt: dispatchedDate }
        : o
    ));

    // Savdolar va cheklar ro'yxatiga qo'shish
    const newSale = {
      id: order.id,
      orderNumber: order.orderNumber,
      date: dispatchedDate,
      cashierName: order.sellerName,
      customer: order.customerName,
      paymentMethod: order.paymentMethod === 'cash' ? 'Naqd' :
                     order.paymentMethod === 'card' ? 'Karta' :
                     order.paymentMethod === 'bank' ? 'Bank perech' :
                     order.paymentMethod === 'debt' ? 'Qarz' : 'Oyligidan',
      total: order.totalAmount,
      items: order.items
    };
    setSales(prev => [newSale, ...prev]);

    alert(`Zakaz (${order.orderNumber}) bo'yicha tovarlar sotuvchiga berildi va skladdan muvaffaqiyatli yechildi! ✅`);
  };

  // Tovar qo'shish / tahrirlash / o'chirish
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Kassa POS savdosi (Do'kondagi to'g'ridan-to'g'ri tezkor sotuv)
  const handleCompleteSale = (saleData) => {
    const newSale = {
      ...saleData,
      id: `SL-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleString('uz-UZ')
    };
    setSales(prev => [newSale, ...prev]);

    // Skladdan yechish
    setProducts(prevProducts => {
      const updated = [...prevProducts];
      newSale.items?.forEach(item => {
        const prodIndex = updated.findIndex(p => p.id === item.id);
        if (prodIndex !== -1) {
          updated[prodIndex] = {
            ...updated[prodIndex],
            stock: Math.max(0, (updated[prodIndex].stock || 0) - (item.quantity || 1))
          };
        }
      });
      return updated;
    });

    // Balansga qo'shish
    const total = Number(newSale.total || 0);
    if (newSale.paymentMethod === 'Naqd') {
      setBalances(prev => ({ ...prev, cash: (prev.cash || 0) + total }));
    } else if (newSale.paymentMethod === 'Karta') {
      setBalances(prev => ({ ...prev, card: (prev.card || 0) + total }));
    }

    setActiveReceiptSale(newSale);
  };

  // Counts for Badges
  const lowStockCount = products.filter(p => (p.stock || 0) <= (p.minStock || 3)).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending_accounting').length;
  const pendingTransfersCount = stockTransfers.filter(t => t.status === 'pending_warehouse').length;
  const readyToDispatchCount = orders.filter(o => o.status === 'approved_accounting').length;

  // Agar QR chek skaner qilingan bo'lsa
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
        pendingOrdersCount={pendingOrdersCount}
        pendingTransfersCount={pendingTransfersCount}
        readyToDispatchCount={readyToDispatchCount}
        storeMode={storeMode}
        currentStoreSession={currentStoreSession}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <Header 
          currentRole={currentRole}
          currentUser={currentUser}
          currentView={currentView}
          onChangeView={(view) => setCurrentView(view)}
          balances={balances}
          isServerConnected={isServerConnected}
          pendingOrdersCount={pendingOrdersCount}
          pendingTransfersCount={pendingTransfersCount}
          readyToDispatchCount={readyToDispatchCount}
          storeMode={storeMode}
          currentStoreSession={currentStoreSession}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenPwaModal={() => setIsPwaModalOpen(true)}
        />

        <main style={{ flex: 1, minHeight: 'calc(100vh - 70px)' }}>
          {/* 1. DIREKTOR BOSHQARUVI */}
          {currentView === 'director' && (
            <DirectorDashboard 
              sales={sales}
              products={products}
              staff={staff}
              balances={balances}
              debts={debts}
              expenses={expenses}
              stockTransfers={stockTransfers}
              orders={orders}
              onCreateTransfer={handleCreateTransfer}
              storeMode={storeMode}
              onViewReceipt={(sale) => setActiveReceiptSale(sale)}
              onChangeView={(view) => setCurrentView(view)}
            />
          )}

          {/* 2. BUXGALTERIYA & TO'LOV NAZORATI */}
          {currentView === 'accounting' && (
            <AccountingView 
              balances={balances}
              debts={debts}
              staff={staff}
              expenses={expenses}
              orders={orders}
              sales={sales}
              onApproveOrder={handleApproveOrder}
              onRejectOrder={handleRejectOrder}
              onPayDebt={(debtId, amount, method) => {
                setDebts(prev => prev.map(d => d.id === debtId ? { ...d, remainingAmount: Math.max(0, d.remainingAmount - amount) } : d));
                if (method === 'Naqd') setBalances(b => ({ ...b, cash: b.cash + amount }));
                if (method === 'Karta') setBalances(b => ({ ...b, card: b.card + amount }));
                if (method === 'Bank perech') setBalances(b => ({ ...b, bank: b.bank + amount }));
              }}
              onAddDebt={(d) => setDebts(prev => [d, ...prev])}
              onPaySalary={(staffId, amount, source) => {
                setStaff(prev => prev.map(s => s.id === staffId ? { ...s, paidThisMonth: (s.paidThisMonth || 0) + amount } : s));
                if (source === 'Naqd') setBalances(b => ({ ...b, cash: Math.max(0, b.cash - amount) }));
                if (source === 'Karta') setBalances(b => ({ ...b, card: Math.max(0, b.card - amount) }));
                if (source === 'Bank perech') setBalances(b => ({ ...b, bank: Math.max(0, b.bank - amount) }));
              }}
              onAddExpense={(exp) => {
                setExpenses(prev => [exp, ...prev]);
                if (exp.source === 'Naqd') setBalances(b => ({ ...b, cash: Math.max(0, b.cash - exp.amount) }));
                if (exp.source === 'Karta') setBalances(b => ({ ...b, card: Math.max(0, b.card - exp.amount) }));
                if (exp.source === 'Bank perech') setBalances(b => ({ ...b, bank: Math.max(0, b.bank - exp.amount) }));
              }}
            />
          )}

          {/* 3. SKLADCHI & LOGISTIKA BOSHQARUVI */}
          {currentView === 'warehouse' && (
            <WarehouseView 
              products={products}
              stockTransfers={stockTransfers}
              orders={orders}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onReceiveTransfer={handleReceiveTransfer}
              onDispatchOrder={handleDispatchOrder}
              storeMode={storeMode}
            />
          )}

          {/* 4. SOTUVCHI MOBIL PROFILI (APK) */}
          {currentView === 'seller_mobile' && (
            <SellerMobileView 
              products={products}
              orders={orders}
              staff={staff}
              customers={customers}
              onCreateOrder={handleCreateSellerOrder}
              onOpenReceipt={(sale) => setActiveReceiptSale(sale)}
              storeMode={storeMode}
            />
          )}

          {/* 5. TEZKOR KASSA POS */}
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
                onSelectStoreMode={(mode) => setStoreMode(mode)}
              />
            </div>
          )}

          {/* 6. XODIMLAR & SOTUVCHILAR JAMOASI */}
          {currentView === 'sellers' && (
            <SellersView 
              staff={staff}
              sales={sales}
              onAddStaff={(newS) => setStaff(prev => [...prev, newS])}
              onOpenPOS={() => setCurrentView('pos')}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav 
        currentView={currentView}
        onChangeView={(view) => setCurrentView(view)}
        lowStockCount={lowStockCount}
        pendingOrdersCount={pendingOrdersCount}
        pendingTransfersCount={pendingTransfersCount}
        readyToDispatchCount={readyToDispatchCount}
      />

      {/* Thermal Receipt Modal */}
      {activeReceiptSale && (
        <ReceiptModal 
          sale={activeReceiptSale}
          onClose={() => setActiveReceiptSale(null)}
          storeMode={storeMode}
          currentStoreSession={currentStoreSession}
        />
      )}

      {/* Store Settings Modal */}
      {isSettingsModalOpen && (
        <StoreSettingsModal 
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          currentStoreSession={currentStoreSession}
          onUpdateSession={(updated) => {
            setCurrentStoreSession(updated);
            localStorage.setItem('savdo_current_session', JSON.stringify(updated));
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

      {/* Global PWA / APK Modal */}
      {isPwaModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={22} style={{ color: '#4f46e5' }} />
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Ilovani Telefonga O'rnatish (APK)</h3>
              </div>
              <button onClick={() => setIsPwaModalOpen(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              Ushbu tizim zamonaviy <strong>PWA (Progressive Web APK)</strong> texnologiyasi bilan jihozlangan. Har bir xodim (Direktor, Buxgalter, Skladchi va ayniqsa Sotuvchilar) ilovani o'z telefoniga 1 marta bosish orqali o'rnatib oladi!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
                <span style={{ fontSize: '12px', color: '#334155' }}>
                  <strong>Barcha ma'lumotlar o'tadi:</strong> Sotuvchi telefondan zayavka berganda, buxgalter kompyuterida darhol aks etadi, buxgalter tasdiqlasa skladchiga tushadi!
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</span>
                <span style={{ fontSize: '12px', color: '#334155' }}>
                  <strong>Qanday o'rnatiladi:</strong> Telefon brauzerida saytni ochib, <strong>"Bosh ekranga qo'shish" (Добавить на главный экран)</strong> tugmasini bosish kifoya.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</span>
                <span style={{ fontSize: '12px', color: '#334155' }}>
                  <strong>Alohida 4 ta APK shart emas:</strong> Bitta havola orqali har bir xodim o'z roli (Sotuvchi, Skladchi, Buxgalter, Direktor) bo'yicha mustaqil ishlaydi.
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsPwaModalOpen(false)}
              style={{ width: '100%', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Tushundim, Rahmat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
