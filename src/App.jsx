import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WarehouseView from './components/WarehouseView';
import AccountingView from './components/AccountingView';
import DirectorDashboard from './components/DirectorDashboard';
import SellerMobileView from './components/SellerMobileView';
import AuthLoginView from './components/AuthLoginView';
import ReceiptModal from './components/ReceiptModal';
import CustomerReceiptView from './components/CustomerReceiptView';
import IosInstallModal from './components/IosInstallModal';

import { 
  SYSTEM_USERS,
  INITIAL_STAFF,
  INITIAL_PRODUCTS,
  INITIAL_STOCK_TRANSFERS,
  INITIAL_SELLER_ORDERS,
  INITIAL_BALANCES,
  INITIAL_DEBTS,
  INITIAL_EXPENSES,
  INITIAL_SALES,
  INITIAL_CUSTOMERS
} from './data/initialData';

export default function App() {
  // 1. ACTIVE LOGGED IN USER STATE
  const [activeUser, setActiveUser] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  // Eski aralashgan test ma'lumotlarini tozalash (0 Clean slate)
  useEffect(() => {
    if (!localStorage.getItem('savdo_clean_v6_zero')) {
      localStorage.removeItem('billz_products_perfume');
      localStorage.removeItem('billz_products_universal');
      localStorage.removeItem('billz_sales_isolated_v3');
      localStorage.removeItem('savdo_products_v5');
      localStorage.removeItem('savdo_stock_transfers_v5');
      localStorage.removeItem('savdo_seller_orders_v5');
      localStorage.removeItem('savdo_balances_v5');
      localStorage.removeItem('savdo_debts_v5');
      localStorage.removeItem('savdo_expenses_v5');
      localStorage.removeItem('savdo_sales_v5');
      localStorage.setItem('savdo_clean_v6_zero', 'true');
    }
  }, []);

  // 2. USERS (Tizimga kirish uchun login & parollar)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_system_users_v6');
      const list = saved ? JSON.parse(saved) : [];
      // SYSTEM_USERS (sklad, direktor, buxgalter, sotuvchi) doim mavjud bo'lishi shart
      const merged = [...SYSTEM_USERS];
      if (Array.isArray(list)) {
        list.forEach(item => {
          const idx = merged.findIndex(m => (m.username || '').toLowerCase() === (item.username || '').toLowerCase());
          if (idx !== -1) {
            merged[idx] = { ...merged[idx], ...item };
          } else if (item.username) {
            merged.push(item);
          }
        });
      }
      return merged;
    } catch {
      return SYSTEM_USERS;
    }
  });

  // 3. STAFF (Xodimlar ro'yxati va oyliklari)
  const [staff, setStaff] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_staff_v6');
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // 4. PRODUCTS (Sklad Qoldiqlari - Boshlang'ich 0)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_products_v6');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 5. STOCK TRANSFERS (Direktor skladga yuborgan kirimlar - Boshlang'ich 0)
  const [stockTransfers, setStockTransfers] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_stock_transfers_v6');
      return saved ? JSON.parse(saved) : INITIAL_STOCK_TRANSFERS;
    } catch {
      return INITIAL_STOCK_TRANSFERS;
    }
  });

  // 6. SELLER ORDERS (Sotuvchilar telefondan buxgalterga yuborgan zayavkalar - Boshlang'ich 0)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_seller_orders_v6');
      return saved ? JSON.parse(saved) : INITIAL_SELLER_ORDERS;
    } catch {
      return INITIAL_SELLER_ORDERS;
    }
  });

  // 7. BALANCES (Kassa, Karta, Bank - Boshlang'ich 0)
  const [balances, setBalances] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_balances_v6');
      return saved ? JSON.parse(saved) : INITIAL_BALANCES;
    } catch {
      return INITIAL_BALANCES;
    }
  });

  // 8. DEBTS (Nasiyalar daftari - Boshlang'ich 0)
  const [debts, setDebts] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_debts_v6');
      return saved ? JSON.parse(saved) : INITIAL_DEBTS;
    } catch {
      return INITIAL_DEBTS;
    }
  });

  // 9. EXPENSES (Chiqimlar - Boshlang'ich 0)
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_expenses_v6');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  // 10. SALES (Sotuvlar tarixi - Boshlang'ich 0)
  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_sales_v6');
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [activeReceiptSale, setActiveReceiptSale] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('savdo_system_users_v6', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('savdo_staff_v6', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('savdo_products_v6', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('savdo_stock_transfers_v6', JSON.stringify(stockTransfers));
  }, [stockTransfers]);

  useEffect(() => {
    localStorage.setItem('savdo_seller_orders_v6', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('savdo_balances_v6', JSON.stringify(balances));
  }, [balances]);

  useEffect(() => {
    localStorage.setItem('savdo_debts_v6', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('savdo_expenses_v6', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('savdo_sales_v6', JSON.stringify(sales));
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
  // XODIMLAR VA HUQUQLAR BOSHQARUVI (DIREKTOR)
  // ==========================================
  const handleAddStaff = (newStaff) => {
    setStaff(prev => [...prev, newStaff]);
    
    // Tizim foydalanuvchisi sifatida qo'shish (Login & parol bilan kirish imkoniyati)
    const newUser = {
      id: newStaff.id,
      username: newStaff.username,
      password: newStaff.password,
      role: newStaff.systemRole || 'seller_mobile',
      name: newStaff.name,
      position: newStaff.role,
      phone: newStaff.phone,
      baseSalary: newStaff.baseSalary,
      badge: newStaff.role,
      color: '#2563eb'
    };
    setUsers(prev => [...prev.filter(u => u.username !== newUser.username), newUser]);
    alert(`Yangi xodim (${newStaff.name}) muvaffaqiyatli qo'shildi. Login: ${newStaff.username}, Parol: ${newStaff.password}`);
  };

  const handleUpdateStaff = (updatedStaff) => {
    setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    setUsers(prev => prev.map(u => {
      if (u.id === updatedStaff.id || u.username === updatedStaff.username) {
        return {
          ...u,
          name: updatedStaff.name,
          username: updatedStaff.username,
          password: updatedStaff.password,
          role: updatedStaff.systemRole || u.role,
          position: updatedStaff.role,
          phone: updatedStaff.phone,
          baseSalary: updatedStaff.baseSalary
        };
      }
      return u;
    }));
    alert(`Xodim (${updatedStaff.name}) ma'lumotlari yangilandi!`);
  };

  const handleDeleteStaff = (staffId) => {
    const st = staff.find(s => s.id === staffId);
    if (!window.confirm(`${st?.name || 'Xodim'}ni tizimdan o'chirishni tasdiqlaysizmi?`)) return;
    setStaff(prev => prev.filter(s => s.id !== staffId));
    setUsers(prev => prev.filter(u => u.id !== staffId));
  };

  // ==========================================
  // BIZNES JARAYON ZANJIRI HANDLERLARI (WORKFLOW)
  // ==========================================

  // 1. DIREKTOR -> SKLADGA PEREHOD (KIRIM) YUBORISH
  const handleCreateTransfer = (newTransfer) => {
    setStockTransfers(prev => [newTransfer, ...prev]);
    alert("Kirim partiyasi muvaffaqiyatli jo'natildi. Skladchi qabul qilishi kutilmoqda.");
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

    alert(`"${transfer.productName}" tovari (+${transfer.quantity} ${transfer.unit}) rasman skladga qabul qilindi.`);
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

    alert(`Zayavka (${order.orderNumber}) to'lovi tasdiqlandi va Skladchiga otgruzka uchun yuborildi.`);
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

    // SKLADDAN TOVAR YECHILADI
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

    alert(`Zakaz (${order.orderNumber}) bo'yicha tovarlar berildi va skladdan muvaffaqiyatli yechildi.`);
  };

  // Tovar boshqaruvi (Skladchi uchun)
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
          users={users}
          onLoginSuccess={handleLoginSuccess}
          onOpenPwaModal={() => setIsPwaModalOpen(true)}
        />

        <IosInstallModal 
          isOpen={isPwaModalOpen} 
          onClose={() => setIsPwaModalOpen(false)} 
        />
      </>
    );
  }

  // AGAR TIZIMGA KIRGAN BO'LSA — FAQAT O'ZIGA TEGISHLI BO'LIM TO'LIQ OCHILADI!
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
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
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
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
            onOpenInstallModal={() => setIsPwaModalOpen(true)}
            storeMode="clothing"
          />
        )}
      </main>

      {/* Dedicated iOS & Android PWA Installation Modal */}
      <IosInstallModal 
        isOpen={isPwaModalOpen} 
        onClose={() => setIsPwaModalOpen(false)} 
      />

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
