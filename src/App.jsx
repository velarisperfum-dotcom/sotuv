import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WarehouseView from './components/WarehouseView';
import AccountingView from './components/AccountingView';
import DirectorDashboard from './components/DirectorDashboard';
import SellerMobileView from './components/SellerMobileView';
import AuthLoginView from './components/AuthLoginView';
import ReceiptModal from './components/ReceiptModal';
import CustomerReceiptView from './components/CustomerReceiptView';
import { Smartphone, X } from 'lucide-react';

import { getSampleProductsForIndustry } from './data/industryProducts';
import { 
  SYSTEM_USERS,
  INITIAL_STOCK_TRANSFERS,
  INITIAL_SELLER_ORDERS,
  INITIAL_STAFF,
  INITIAL_CUSTOMERS
} from './data/initialData';

import { 
  fetchAllServerData, 
  postSaleToServer, 
  postProductToServer, 
  updateProductOnServer 
} from './services/api';

export default function App() {
  // 1. ACTIVE LOGGED IN USER STATE (Login & Parol orqali)
  const [activeUser, setActiveUser] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_active_user');
      return saved ? JSON.parse(saved) : null; // Dastlab tizimga kirish ekrani chiqadi!
    } catch {
      return null;
    }
  });

  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  // Eski aralashgan test ma'lumotlarini tozalash (Clean slate)
  useEffect(() => {
    if (!localStorage.getItem('savdo_clean_v5')) {
      localStorage.removeItem('billz_products_perfume');
      localStorage.removeItem('billz_products_universal');
      localStorage.removeItem('billz_sales_isolated_v3');
      localStorage.setItem('savdo_clean_v5', 'true');
    }
  }, []);

  // 2. PRODUCTS (Sklad Qoldiqlari)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_products_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return getSampleProductsForIndustry('clothing');
    } catch {
      return getSampleProductsForIndustry('clothing');
    }
  });

  // 3. STOCK TRANSFERS (Direktor skladga yuborgan kirimlar / perexodlar)
  const [stockTransfers, setStockTransfers] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_stock_transfers_v5');
      return saved ? JSON.parse(saved) : INITIAL_STOCK_TRANSFERS;
    } catch {
      return INITIAL_STOCK_TRANSFERS;
    }
  });

  // 4. SELLER ORDERS (Sotuvchilar telefondan buxgalterga yuborgan zayavkalar)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_seller_orders_v5');
      return saved ? JSON.parse(saved) : INITIAL_SELLER_ORDERS;
    } catch {
      return INITIAL_SELLER_ORDERS;
    }
  });

  // 5. BALANCES (Kassa, Karta, Bank)
  const [balances, setBalances] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_balances_v5');
      return saved ? JSON.parse(saved) : { cash: 12500000, card: 8400000, bank: 34500000 };
    } catch {
      return { cash: 12500000, card: 8400000, bank: 34500000 };
    }
  });

  // 6. DEBTS (Nasiyalar daftari)
  const [debts, setDebts] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_debts_v5');
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

  // 7. STAFF
  const [staff, setStaff] = useState(() => {
    return INITIAL_STAFF;
  });

  // 8. EXPENSES
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_expenses_v5');
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
      const saved = localStorage.getItem('savdo_sales_v5');
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

  const [activeReceiptSale, setActiveReceiptSale] = useState(null);
  const [customerReceiptSale, setCustomerReceiptSale] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('savdo_products_v5', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('savdo_stock_transfers_v5', JSON.stringify(stockTransfers));
  }, [stockTransfers]);

  useEffect(() => {
    localStorage.setItem('savdo_seller_orders_v5', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('savdo_balances_v5', JSON.stringify(balances));
  }, [balances]);

  useEffect(() => {
    localStorage.setItem('savdo_debts_v5', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('savdo_expenses_v5', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('savdo_sales_v5', JSON.stringify(sales));
  }, [sales]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setActiveUser(user);
    localStorage.setItem('savdo_active_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setActiveUser(null);
    localStorage.removeItem('savdo_active_user');
  };

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

    const amount = Number(order.totalAmount || 0);

    // To'lov turiga qarab balanslarni yangilash
    if (order.paymentMethod === 'cash') {
      setBalances(prev => ({ ...prev, cash: (prev.cash || 0) + amount }));
    } else if (order.paymentMethod === 'card') {
      setBalances(prev => ({ ...prev, card: (prev.card || 0) + amount }));
    } else if (order.paymentMethod === 'bank') {
      setBalances(prev => ({ ...prev, bank: (prev.bank || 0) + amount }));
    } else if (order.paymentMethod === 'debt') {
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

    const dispatchedDate = new Date().toLocaleString('uz-UZ');
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: 'dispatched_warehouse', dispatchedAt: dispatchedDate }
        : o
    ));

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

    alert(`Zakaz (${order.orderNumber}) bo'yicha tovarlar berildi va skladdan muvaffaqiyatli yechildi! ✅`);
  };

  // Tovar boshqaruvi
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // AGAR FOYDALANUVCHI TIZIMGA KIRMAGAN BO'LSA — FAQAT LOGIN EKRANI CHIQADI!
  if (!activeUser) {
    return (
      <>
        <AuthLoginView 
          onLoginSuccess={handleLoginSuccess}
          onOpenPwaModal={() => setIsPwaModalOpen(true)}
        />

        {/* Global PWA Modal */}
        {isPwaModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Smartphone size={22} style={{ color: '#2563eb' }} />
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Telefonga APK O'rnatish</h3>
                </div>
                <button onClick={() => setIsPwaModalOpen(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                Sotuvchilar ushbu saytni telefon brauzerida ochib, <strong>"Bosh ekranga qo'shish" (Добавить на главный экран)</strong> tugmasi orqali APK ilova sifatida o'rnatib olishlari mumkin. Barcha ma'lumotlar markaziy bazada sinxron ishlaydi!
              </p>

              <button
                onClick={() => setIsPwaModalOpen(false)}
                style={{ width: '100%', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
              >
                Tushundim
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // AGAR TIZIMGA KIRGAN BO'LSA — FAQAT O'ZIGA TEGISHLI BO'LIM TO'LIQ OCHILADI!
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Top Corporate White Header */}
      <Header 
        currentUser={activeUser}
        currentRole={activeUser.role}
        onLogout={handleLogout}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        balances={balances}
      />

      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {/* 1. DIREKTOR KABINETI */}
        {activeUser.role === 'director' && (
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
            storeMode="clothing"
            onViewReceipt={(sale) => setActiveReceiptSale(sale)}
          />
        )}

        {/* 2. BUXGALTERIYA & TO'LOV NAZORATI KABINETI */}
        {activeUser.role === 'accountant' && (
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

        {/* 3. SKLADCHI & LOGISTIKA KABINETI */}
        {activeUser.role === 'warehouse' && (
          <WarehouseView 
            products={products}
            stockTransfers={stockTransfers}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onReceiveTransfer={handleReceiveTransfer}
            onDispatchOrder={handleDispatchOrder}
            storeMode="clothing"
          />
        )}

        {/* 4. SOTUVCHI MOBIL KABINETI (APK REJIMI) */}
        {activeUser.role === 'seller_mobile' && (
          <SellerMobileView 
            products={products}
            orders={orders}
            staff={staff}
            customers={INITIAL_CUSTOMERS}
            onCreateOrder={handleCreateSellerOrder}
            onOpenReceipt={(sale) => setActiveReceiptSale(sale)}
            storeMode="clothing"
          />
        )}
      </main>

      {/* Global PWA Modal */}
      {isPwaModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={22} style={{ color: '#2563eb' }} />
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Telefonga APK O'rnatish</h3>
              </div>
              <button onClick={() => setIsPwaModalOpen(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              Ushbu tizim zamonaviy <strong>PWA WebAPK</strong> texnologiyasiga ega. Xodimlar telefon brauzerida saytni ochib, <strong>"Bosh ekranga qo'shish"</strong> orqali ilova kabi o'rnatib oladilar!
            </p>

            <button
              onClick={() => setIsPwaModalOpen(false)}
              style={{ width: '100%', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Tushundim
            </button>
          </div>
        </div>
      )}

      {/* Thermal Receipt Modal */}
      {activeReceiptSale && (
        <ReceiptModal 
          sale={activeReceiptSale}
          onClose={() => setActiveReceiptSale(null)}
          storeMode="clothing"
        />
      )}
    </div>
  );
}
