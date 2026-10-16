import React, { useState } from 'react';
import { 
  Box, ArrowDownRight, Truck, CheckCircle2, Clock, AlertTriangle, 
  Search, Filter, Plus, Edit2, Trash2, ArrowRight, User, Phone, 
  CreditCard, Check, Sparkles, Building2, PackageCheck, Layers, Eye
} from 'lucide-react';
import { MEASURE_UNITS } from '../data/initialData';

export default function WarehouseView({ 
  products = [], 
  stockTransfers = [], 
  orders = [],
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onReceiveTransfer,
  onDispatchOrder
}) {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeTransfers = Array.isArray(stockTransfers) ? stockTransfers : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Active View Tab: 'receive_transfers' | 'dispatch_orders' | 'inventory'
  const [activeTab, setActiveTab] = useState('receive_transfers');

  // Search & Filter for Inventory
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hammasi');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states for adding/editing product
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formUnit, setFormUnit] = useState('dona');
  const [formCostPrice, setFormCostPrice] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('10');
  const [formMinStock, setFormMinStock] = useState('3');
  const [formBarcode, setFormBarcode] = useState('');

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  // Pending transfers waiting for warehousekeeper
  const pendingTransfers = safeTransfers.filter(t => t.status === 'pending_warehouse');
  const receivedTransfers = safeTransfers.filter(t => t.status === 'received');

  // Orders waiting for dispatch (Buxgalter tasdiqlagan zakazlar!)
  const readyToDispatchOrders = safeOrders.filter(o => o.status === 'approved_accounting');
  const dispatchedOrders = safeOrders.filter(o => o.status === 'dispatched_warehouse');

  // Low stock products
  const lowStockProducts = safeProducts.filter(p => (p.stock || 0) <= (p.minStock || 3));

  // Categories
  const categories = ['Hammasi', ...new Set(safeProducts.map(p => p.category).filter(Boolean))];

  // Filtered Products
  const filteredProducts = safeProducts.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.barcode || '').includes(searchTerm);
    const matchesCat = selectedCategory === 'Hammasi' || p.category === selectedCategory;
    const matchesLow = !onlyLowStock || (p.stock || 0) <= (p.minStock || 3);
    return matchesSearch && matchesCat && matchesLow;
  });

  // Handle Save Product
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: formName.trim(),
        category: formCategory.trim() || 'Umumiy',
        unit: formUnit,
        costPrice: Number(formCostPrice) || 0,
        price: Number(formPrice),
        stock: Number(formStock) || 0,
        minStock: Number(formMinStock) || 3,
        barcode: formBarcode.trim()
      });
      setEditingProduct(null);
    } else {
      onAddProduct({
        id: `prd-${Date.now()}`,
        name: formName.trim(),
        category: formCategory.trim() || 'Umumiy',
        unit: formUnit,
        costPrice: Number(formCostPrice) || 0,
        price: Number(formPrice),
        stock: Number(formStock) || 0,
        minStock: Number(formMinStock) || 3,
        barcode: formBarcode.trim() || `${Math.floor(1000000000 + Math.random() * 9000000000)}`
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormCategory('');
    setFormUnit('dona');
    setFormCostPrice('');
    setFormPrice('');
    setFormStock('10');
    setFormMinStock('3');
    setFormBarcode('');
    setEditingProduct(null);
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setFormName(p.name || '');
    setFormCategory(p.category || '');
    setFormUnit(p.unit || 'dona');
    setFormCostPrice(p.costPrice || '');
    setFormPrice(p.price || '');
    setFormStock(p.stock || '0');
    setFormMinStock(p.minStock || '3');
    setFormBarcode(p.barcode || '');
    setShowAddModal(true);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px', fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            Sklad & Logistika Boshqaruvi
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Kirim tovarlarni qabul qilish, buxgalter tasdiqlagan zakazlarni berish va qoldiq nazorati
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
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
          <Plus size={16} /> Yangi Tovar Kiritish
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div 
          onClick={() => setActiveTab('receive_transfers')}
          style={{ 
            background: '#ffffff', 
            borderRadius: '14px', 
            padding: '18px', 
            border: activeTab === 'receive_transfers' ? '2px solid #16a34a' : '1px solid #e2e8f0', 
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Kutilayotgan Kirimlar</span>
            <ArrowDownRight size={20} style={{ color: '#16a34a' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
            {pendingTransfers.length} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>ta partiya</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Jami: {pendingTransfers.reduce((acc, t) => acc + Number(t.quantity || 0), 0)} dona tovar qabul kutilmoqda
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('dispatch_orders')}
          style={{ 
            background: '#ffffff', 
            borderRadius: '14px', 
            padding: '18px', 
            border: activeTab === 'dispatch_orders' ? '2px solid #2563eb' : '1px solid #e2e8f0', 
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Otgruzkaga Tayyor Zakazlar</span>
            <Truck size={20} style={{ color: '#2563eb' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
            {readyToDispatchOrders.length} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>ta buyurtma</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Buxgalter tasdiqlagan, yuborilsa skladdan yechiladi
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('inventory')}
          style={{ 
            background: '#ffffff', 
            borderRadius: '14px', 
            padding: '18px', 
            border: activeTab === 'inventory' ? '2px solid #2563eb' : '1px solid #e2e8f0', 
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Sklad Zaxirasi</span>
            <Box size={20} style={{ color: '#475569' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
            {safeProducts.reduce((acc, p) => acc + Number(p.stock || 0), 0)} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>dona ({safeProducts.length} xil)</span>
          </div>
          <div style={{ fontSize: '12px', color: lowStockProducts.length > 0 ? '#dc2626' : '#64748b', fontWeight: lowStockProducts.length > 0 ? 700 : 400 }}>
            {lowStockProducts.length > 0 ? `${lowStockProducts.length} ta tovar kam qolgan` : "Zaxira me'yorda"}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('receive_transfers')}
          style={{
            padding: '12px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'receive_transfers' ? '2px solid #16a34a' : '2px solid transparent',
            color: activeTab === 'receive_transfers' ? '#16a34a' : '#64748b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowDownRight size={17} /> 1. Kutilayotgan Kirimlar ({pendingTransfers.length})
        </button>

        <button
          onClick={() => setActiveTab('dispatch_orders')}
          style={{
            padding: '12px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'dispatch_orders' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'dispatch_orders' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Truck size={17} /> 2. Otgruzka / Tovarlarni Berish ({readyToDispatchOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            padding: '12px 16px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'inventory' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'inventory' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Layers size={17} /> 3. Sklad Qoldiqlari
        </button>
      </div>

      {/* TAB 1: KUTILAYOTGAN KIRIMLAR (DIREKTORDAN) */}
      {activeTab === 'receive_transfers' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Direktor Yuborgan Kirim Partiyalari</h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              Tovarlar kelganda sanab olib "Qabul Qildim" tugmasini bosing, ular avtomatik sklad balansiga qo'shiladi
            </p>
          </div>

          {pendingTransfers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8', fontSize: '13px' }}>
              Hozircha kutilayotgan yangi kirim partiyalari yo'q
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingTransfers.map(trf => (
                <div key={trf.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>
                        {trf.transferNumber || trf.id}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{trf.createdAt}</span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                      {trf.productName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Yetkazib beruvchi: {trf.supplier} | Tannarx: {formatMoney(trf.costPrice)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Kirim miqdori:</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a' }}>
                        +{trf.quantity} {trf.unit}
                      </div>
                    </div>

                    <button
                      onClick={() => onReceiveTransfer(trf.id)}
                      style={{
                        background: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 18px',
                        fontSize: '13px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Check size={16} /> Qabul Qildim
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BUXGALTER TASDIQLAGAN ZAKAZLAR (OTGRUZKA & SKLADDAN YECHISH) */}
      {activeTab === 'dispatch_orders' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Buxgalter Tasdiqlagan Zakazlar (Otgruzka)</h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              Buxgalter to'lovini tasdiqlagan zakazlar. Tovar berilgach, <strong>"Sotuvchiga Berildi"</strong> tugmasini bosing — tovarlar skladdan yechiladi!
            </p>
          </div>

          {readyToDispatchOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8', fontSize: '13px' }}>
              Hozircha otgruzka qilinadigan tasdiqlangan zakazlar yo'q
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {readyToDispatchOrders.map(order => (
                <div key={order.id} style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#2563eb' }}>{order.orderNumber || order.id}</span>
                        <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                          To'lov tasdiqlangan
                        </span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                        Mijoz: {order.customerName} ({order.customerPhone})
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Sotuvchi: <strong>{order.sellerName}</strong> | Vaqt: {order.createdAt}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Jami Summa:</div>
                      <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>{formatMoney(order.totalAmount)}</div>
                      <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                        To'lov: {order.paymentMethod?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Items to pack */}
                  <div style={{ background: '#ffffff', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Berilishi kerak bo'lgan tovarlar:
                    </div>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '2px 0' }}>
                        <span>• {item.name}</span>
                        <strong style={{ color: '#2563eb' }}>{item.quantity} {item.unit || 'dona'}</strong>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#b45309' }}>
                      Tugma bosilgach, tovarlar sklad balansidan kamayadi
                    </span>

                    <button
                      onClick={() => onDispatchOrder(order.id)}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '9px 18px',
                        fontSize: '13px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Truck size={16} /> Sotuvchiga Berildi (Skladdan Yechish)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SKLAD QOLDIQLARI */}
      {activeTab === 'inventory' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
          {/* Search bar */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Tovar nomi yoki barkod bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              style={{
                padding: '9px 14px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: onlyLowStock ? '#dc2626' : '#cbd5e1',
                background: onlyLowStock ? '#fee2e2' : '#ffffff',
                color: onlyLowStock ? '#dc2626' : '#475569',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Kam qolganlar ({lowStockProducts.length})
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>Tovar Nomi</th>
                  <th style={{ padding: '12px 14px' }}>Toifa</th>
                  <th style={{ padding: '12px 14px' }}>Tannarx</th>
                  <th style={{ padding: '12px 14px' }}>Sotish Narxi</th>
                  <th style={{ padding: '12px 14px' }}>Sklad Qoldig'i</th>
                  <th style={{ padding: '12px 14px' }}>Holat</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amal</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                      Skladda tovarlar mavjud emas
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(p => {
                    const isLow = (p.stock || 0) <= (p.minStock || 3);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{p.name}</td>
                        <td style={{ padding: '12px 14px', color: '#64748b' }}>{p.category || 'Umumiy'}</td>
                        <td style={{ padding: '12px 14px', color: '#64748b' }}>{formatMoney(p.costPrice)}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#2563eb' }}>{formatMoney(p.price)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: isLow ? '#dc2626' : '#0f172a' }}>
                            {p.stock || 0} {p.unit || 'dona'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: isLow ? '#fee2e2' : '#dcfce7',
                            color: isLow ? '#dc2626' : '#15803d'
                          }}>
                            {isLow ? "Kam qoldi" : "Yetarli"}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openEdit(p)}
                              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#475569' }}
                              title="Tahrirlash"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`"${p.name}" tovarini o'chirishni xohlaysizmi?`)) {
                                  onDeleteProduct(p.id);
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: TOVAR QO'SHISH / TAHRIRLASH */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', maxWidth: '440px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                {editingProduct ? "Tovarni Tahrirlash" : "Yangi Tovar Kiritish"}
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Tovar Nomi *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Tovar nomi"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Toifa</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Kiyim"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>O'lchov Birligi</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#ffffff' }}
                  >
                    {MEASURE_UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Tannarx (so'm)</label>
                  <input 
                    type="number" 
                    placeholder="150000"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Sotish Narxi (so'm) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="250000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Skladdagi Qoldiq</label>
                  <input 
                    type="number" 
                    placeholder="10"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Min Qoldiq</label>
                  <input 
                    type="number" 
                    placeholder="3"
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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

    </div>
  );
}
