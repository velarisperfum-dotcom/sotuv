import React, { useState } from 'react';
import { 
  Box, ArrowDownRight, Truck, CheckCircle2, Clock, AlertTriangle, 
  Search, Filter, Plus, Edit2, Trash2, ArrowRight, User, Phone, 
  CreditCard, Check, Sparkles, Building2, PackageCheck, Layers, Eye
} from 'lucide-react';
import { getIndustryById } from '../data/industriesData';
import { MEASURE_UNITS } from '../data/initialData';

export default function WarehouseView({ 
  products = [], 
  stockTransfers = [], 
  orders = [],
  onAddProduct, 
  onBatchAddProducts,
  onUpdateProduct, 
  onDeleteProduct,
  onReceiveTransfer,
  onDispatchOrder,
  storeMode = 'universal'
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
  const [formSupplier, setFormSupplier] = useState('');

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
    setFormSupplier('');
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
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Top Header & Overview */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Sklad Mudiri & Logistika Boshqaruvi</h2>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
                Direktordan kirimlarni qabul qilish, buxgalter tasdiqlagan zakazlarni otgruzka qilish va qoldiqlar
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            style={{
              background: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
            }}
          >
            <Plus size={16} /> Yangi Tovar Qo'shish
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div 
          onClick={() => setActiveTab('receive_transfers')}
          style={{ 
            background: activeTab === 'receive_transfers' ? '#f0fdf4' : '#ffffff', 
            borderRadius: '18px', 
            padding: '18px', 
            border: activeTab === 'receive_transfers' ? '2px solid #22c55e' : '1px solid #e2e8f0', 
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>Kutilayotgan Kirimlar</span>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>
              {pendingTransfers.length} ta partiya
            </span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>
            {pendingTransfers.reduce((acc, t) => acc + Number(t.quantity || 0), 0)} dona
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Direktor yuborgan, qabul qilish kutilmoqda</div>
        </div>

        <div 
          onClick={() => setActiveTab('dispatch_orders')}
          style={{ 
            background: activeTab === 'dispatch_orders' ? '#eff6ff' : '#ffffff', 
            borderRadius: '18px', 
            padding: '18px', 
            border: activeTab === 'dispatch_orders' ? '2px solid #3b82f6' : '1px solid #e2e8f0', 
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af' }}>Otgruzkaga Tayyor Zakazlar</span>
            <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>
              {readyToDispatchOrders.length} ta zakaz
            </span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>
            {formatMoney(readyToDispatchOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0))}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Buxgalter tasdiqlagan, yuborilsa skladdan yechiladi</div>
        </div>

        <div 
          onClick={() => setActiveTab('inventory')}
          style={{ 
            background: activeTab === 'inventory' ? '#f8fafc' : '#ffffff', 
            borderRadius: '18px', 
            padding: '18px', 
            border: activeTab === 'inventory' ? '2px solid #6366f1' : '1px solid #e2e8f0', 
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#4338ca' }}>Sklad Umumiy Qoldig'i</span>
            <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>
              {safeProducts.length} xil tovar
            </span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>
            {safeProducts.reduce((acc, p) => acc + Number(p.stock || 0), 0)} dona
          </div>
          <div style={{ fontSize: '12px', color: lowStockProducts.length > 0 ? '#ef4444' : '#64748b', fontWeight: lowStockProducts.length > 0 ? 700 : 400 }}>
            {lowStockProducts.length > 0 ? `⚠️ ${lowStockProducts.length} ta tovar tugamoqda!` : "Zaxira holati barqaror"}
          </div>
        </div>
      </div>

      {/* Main Tab Buttons */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e2e8f0', marginBottom: '20px', overflowX: 'auto', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('receive_transfers')}
          style={{
            padding: '12px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'receive_transfers' ? '3px solid #16a34a' : '3px solid transparent',
            color: activeTab === 'receive_transfers' ? '#16a34a' : '#64748b',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowDownRight size={18} /> 1. Kutilayotgan Kirimlar (Direktordan) 
          {pendingTransfers.length > 0 && (
            <span style={{ background: '#16a34a', color: '#ffffff', borderRadius: '10px', padding: '2px 8px', fontSize: '11px' }}>
              {pendingTransfers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('dispatch_orders')}
          style={{
            padding: '12px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'dispatch_orders' ? '3px solid #3b82f6' : '3px solid transparent',
            color: activeTab === 'dispatch_orders' ? '#3b82f6' : '#64748b',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Truck size={18} /> 2. Otgruzka (Buxgalter tasdiqlagan zakazlar)
          {readyToDispatchOrders.length > 0 && (
            <span style={{ background: '#3b82f6', color: '#ffffff', borderRadius: '10px', padding: '2px 8px', fontSize: '11px' }}>
              {readyToDispatchOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            padding: '12px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'inventory' ? '3px solid #4f46e5' : '3px solid transparent',
            color: activeTab === 'inventory' ? '#4f46e5' : '#64748b',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Layers size={18} /> 3. Sklad Qoldiqlari & Tovar Boshqaruvi
        </button>
      </div>

      {/* TAB 1: KUTILAYOTGAN KIRIMLAR (DIREKTOR BERGAN TOVARLARNI QABUL QILISH) */}
      {activeTab === 'receive_transfers' && (
        <div>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Direktor Yuborgan Kirim Partiyalari</h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                  Tovar kelgach, skladchi tovarlarni sanab "Qabul qildim" tugmasini bosadi va ular sklad qoldig'iga qo'shiladi
                </p>
              </div>
            </div>

            {pendingTransfers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <CheckCircle2 size={36} style={{ color: '#16a34a', margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 4px', color: '#1e293b' }}>Hozirda kutilayotgan kirimlar yo'q</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Direktor yangi partiya tovar yuborganida shu yerda paydo bo'ladi</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingTransfers.map(transfer => (
                  <div 
                    key={transfer.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #bbf7d0',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                      boxShadow: '0 2px 5px rgba(34, 197, 94, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        📥
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: '6px' }}>
                            {transfer.transferNumber || transfer.id}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{transfer.createdAt}</span>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                          {transfer.productName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          Yetkazib beruvchi: <strong>{transfer.supplier || 'Import/Zavod'}</strong> | Toifa: {transfer.category || 'Umumiy'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Kirim Miqdori:</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a' }}>
                          +{transfer.quantity} {transfer.unit || 'dona'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Tannarxi: {formatMoney(transfer.costPrice)}
                        </div>
                      </div>

                      <button
                        onClick={() => onReceiveTransfer(transfer.id)}
                        style={{
                          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '14px',
                          padding: '12px 20px',
                          fontSize: '14px',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                        }}
                      >
                        <Check size={18} /> Qabul Qildim (Skladga Kiritish)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Qabul qilingan kirimlar tarixi */}
          {receivedTransfers.length > 0 && (
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#475569' }}>Yaqinda Skladga Qabul Qilingan Kirimlar Tarixi</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {receivedTransfers.slice(0, 5).map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{t.productName}</span>
                      <span style={{ color: '#64748b', marginLeft: '10px' }}>({t.quantity} {t.unit})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Qabul qildi: {t.receivedBy || 'Sklad Mudiri'}</span>
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                        Qabul qilingan ✅
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BUXGALTER TASDIQLAGAN ZAKAZLAR (OTGRUZKA & SKLADDAN YECHISH!) */}
      {activeTab === 'dispatch_orders' && (
        <div>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Buxgalter Tasdiqlagan Zayavkalar (Otgruzka)</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                Buxgalter to'lovini tasdiqlagan zakazlar. Skladchi tovarlarni yig'ib <strong>"Sotuvchiga Yuborildi"</strong> tugmasini bosganda tovarlar skladdan avtomatik yechiladi!
              </p>
            </div>

            {readyToDispatchOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <PackageCheck size={36} style={{ color: '#3b82f6', margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 4px', color: '#1e293b' }}>Hozircha otgruzka qilinadigan yangi zakaz yo'q</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Sotuvchilar zakaz yuborib, buxgalter tasdiqlaganida shu yerga keladi</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {readyToDispatchOrders.map(order => (
                  <div 
                    key={order.id}
                    style={{
                      background: '#ffffff',
                      border: '2px solid #93c5fd',
                      borderRadius: '18px',
                      padding: '18px',
                      boxShadow: '0 4px 10px rgba(59, 130, 246, 0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#1d4ed8', background: '#eff6ff', padding: '2px 10px', borderRadius: '8px' }}>
                            {order.orderNumber || order.id}
                          </span>
                          <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                            To'lov buxgalter tomonidan tasdiqlangan ✅
                          </span>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                          Mijoz: {order.customerName} ({order.customerPhone})
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Sotuvchi: <strong>{order.sellerName}</strong> | Vaqt: {order.createdAt}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Buyurtma Summasi:</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{formatMoney(order.totalAmount)}</div>
                        <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                          To'lov: {order.paymentMethod?.toUpperCase()} ({order.paymentDetails || 'Tasdiqlangan'})
                        </div>
                      </div>
                    </div>

                    {/* Tovarlar ro'yxati (Skladchi nimani olib berishi kerakligi!) */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        📦 Qadoqlanishi kerak bo'lgan tovarlar:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#1e293b' }}>
                            <div>
                              <strong>• {item.name}</strong>
                              <span style={{ color: '#64748b', marginLeft: '6px' }}>({formatMoney(item.price)})</span>
                            </div>
                            <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                              {item.quantity} {item.unit || 'dona'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skladchi Harakati */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ fontSize: '12px', color: '#b45309', background: '#fef3c7', padding: '6px 12px', borderRadius: '8px', fontWeight: 600 }}>
                        ⚠️ Diqqat: Ushbu tugma bosilishi bilan tovarlar sklad balansidan rasman yechiladi!
                      </div>

                      <button
                        onClick={() => onDispatchOrder(order.id)}
                        style={{
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '14px',
                          padding: '12px 24px',
                          fontSize: '14px',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                        }}
                      >
                        <Truck size={18} /> Sotuvchiga Yuborildi (Skladdan Yechish) 🚀
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Otgruzka qilingan buyurtmalar tarixi */}
          {dispatchedOrders.length > 0 && (
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#475569' }}>Yetkazilgan & Skladdan Yechilgan Zakazlar</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dispatchedOrders.slice(0, 5).map(o => (
                  <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{o.orderNumber || o.id}</span>
                      <span style={{ color: '#64748b', marginLeft: '10px' }}>Mijoz: {o.customerName}</span>
                      <span style={{ color: '#4f46e5', marginLeft: '10px', fontWeight: 700 }}>({formatMoney(o.totalAmount)})</span>
                    </div>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                      Skladdan yechilgan ✅
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SKLAD QOLDIQLARI VA TOVARLAR KATALOGI */}
      {activeTab === 'inventory' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text"
                  placeholder="Tovar nomi, barkod..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff', color: '#1e293b' }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: onlyLowStock ? '#ef4444' : '#cbd5e1',
                background: onlyLowStock ? '#fee2e2' : '#ffffff',
                color: onlyLowStock ? '#dc2626' : '#475569',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <AlertTriangle size={15} /> Tugayotgan tovarlar ({lowStockProducts.length})
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>Tovar Nomi</th>
                  <th style={{ padding: '12px 14px' }}>Toifa</th>
                  <th style={{ padding: '12px 14px' }}>Tannarx</th>
                  <th style={{ padding: '12px 14px' }}>Sotish Narxi</th>
                  <th style={{ padding: '12px 14px' }}>Skladdagi Qoldiq</th>
                  <th style={{ padding: '12px 14px' }}>Holat</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const isLow = (p.stock || 0) <= (p.minStock || 3);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Barkod: {p.barcode || '—'}</div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{p.category || 'Umumiy'}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{formatMoney(p.costPrice)}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#4f46e5' }}>{formatMoney(p.price)}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: isLow ? '#ef4444' : '#0f172a' }}>
                          {p.stock || 0} {p.unit || 'dona'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {isLow ? (
                          <span style={{ background: '#fee2e2', color: '#dc2626', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                            Kam qoldi (min: {p.minStock})
                          </span>
                        ) : (
                          <span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                            Yetarli
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => openEdit(p)}
                            style={{ background: '#ede9fe', color: '#6d28d9', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' }}
                            title="Tahrirlash"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Haqiqatan ham "${p.name}" tovarini o'chirmoqchimisiz?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' }}
                            title="O'chirish"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: YANGI TOVAR QO'SHISH / TAHRIRLASH */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                {editingProduct ? "Tovarni Tahrirlash" : "Yangi Tovar Qo'shish"}
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Tovar Nomi *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Masalan: Nike Air Max 270"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Toifa</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Poyabzal"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>O'lchov Birligi</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    {MEASURE_UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Tannarx (so'm)</label>
                  <input 
                    type="number" 
                    placeholder="250000"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Sotish Narxi *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="400000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Skladdagi Qoldiq</label>
                  <input 
                    type="number" 
                    placeholder="10"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Min Qoldiq</label>
                  <input 
                    type="number" 
                    placeholder="3"
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Barkod (ixtiyoriy)</label>
                <input 
                  type="text" 
                  placeholder="47800101001"
                  value={formBarcode}
                  onChange={(e) => setFormBarcode(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#4f46e5', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
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
