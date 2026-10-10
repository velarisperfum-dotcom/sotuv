import React, { useState, useEffect } from 'react';

import { 
  Plus, AlertTriangle, Search, Filter, 
  ArrowUpRight, Edit2, Trash2, Box,
  Download, Barcode, Shirt, Smartphone, Apple, 
  Sparkles, Check, Image, Upload
} from 'lucide-react';
import { MEASURE_UNITS, PRODUCT_TYPES } from '../data/initialData';
import { getIndustryById } from '../data/industriesData';
import CatalogImportModal from './CatalogImportModal';

export default function WarehouseView({ 
  products = [], 
  onAddProduct, 
  onBatchAddProducts,
  onUpdateProduct, 
  onDeleteProduct,
  onClearAllProducts,
  storeMode = 'universal',
  onSelectStoreMode
}) {
  const safeProducts = Array.isArray(products) ? products : [];
  const currentIndustry = getIndustryById(storeMode);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hammasi');
  const [filterBrand, setFilterBrand] = useState('Hammasi');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAiImportModal, setShowAiImportModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states for dynamic product creation
  const [formType, setFormType] = useState(currentIndustry?.specialType || 'clothing');
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formUnit, setFormUnit] = useState(currentIndustry?.unit || 'dona');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCostPrice, setFormCostPrice] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formWholesalePrice, setFormWholesalePrice] = useState('');
  const [formStock, setFormStock] = useState('10');
  const [formMinStock, setFormMinStock] = useState('3');
  const [formImage, setFormImage] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Industry-specific attribute states:
  // 1. Clothing:
  const [formClothingSizes, setFormClothingSizes] = useState('S, M, L, XL');
  const [formClothingColors, setFormClothingColors] = useState('Qora, Oq');
  const [formClothingMaterial, setFormClothingMaterial] = useState('Paxta 100%');
  
  // 2. Electronics:
  const [formTechWarranty, setFormTechWarranty] = useState('12 oy');
  const [formTechMemory, setFormTechMemory] = useState('128GB, 256GB');
  
  // 3. Perfume:
  const [formPerfumeVolume, setFormPerfumeVolume] = useState('50 ml');
  const [formPerfumeConcentration, setFormPerfumeConcentration] = useState('EDP');
  const [formPerfumePrices, setFormPerfumePrices] = useState({
    '10 ml': '',
    '20 ml': '',
    '30 ml': '',
    '50 ml': ''
  });

  // 4. Grocery:
  const [formGroceryExpiry, setFormGroceryExpiry] = useState('');

  // 5. Pharmacy:
  const [formPharmacyExpiry, setFormPharmacyExpiry] = useState('');
  const [formPharmacyDosage, setFormPharmacyDosage] = useState('');

  // Rasm faylini qurilmadan yuklash handler
  const handleProductImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Rasm hajmi 5MB dan oshmasligi kerak!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Helper: Tovar turini aniqlash
  const getProductType = (p) => {
    if (!p) return 'general';
    if (p.productType) return p.productType;
    if (p.prices && (p.prices['10 ml'] || p.volume)) return 'perfume';
    return 'general';
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'clothing': return { label: 'Kiyim', emoji: '👕', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.15)' };
      case 'perfume': return { label: 'Parfyum', emoji: '💎', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
      case 'electronics': return { label: 'Gadjet', emoji: '📱', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' };
      case 'grocery': return { label: 'Oziq-ovqat', emoji: '🛒', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' };
      default: return { label: 'Tovar', emoji: '📦', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)' };
    }
  };

  // Do'konning maxsus sohasiga xos kategoriyalar
  const industryCategories = ['Hammasi', ...Array.from(new Set([
    ...(currentIndustry?.categories?.filter(c => c !== 'Hammasi') || []),
    ...safeProducts.map(p => p.category).filter(Boolean)
  ]))];

  const brands = ['Hammasi', ...Array.from(new Set(safeProducts.map(p => p?.brand).filter(Boolean)))];

  // Filtrlangan tovarlar ro'yxati
  const filteredProducts = safeProducts.filter(p => {
    if (!p) return false;
    const matchesCategory = selectedCategory === 'Hammasi' || p.category === selectedCategory;
    const matchesBrand = filterBrand === 'Hammasi' || p.brand === filterBrand;
    const matchesLowStock = !onlyLowStock || Number(p.stock || 0) <= Number(p.minStock || 3);

    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      !term ||
      (p.name && String(p.name).toLowerCase().includes(term)) ||
      (p.brand && String(p.brand).toLowerCase().includes(term)) ||
      (p.category && String(p.category).toLowerCase().includes(term)) ||
      (p.barcode && String(p.barcode).toLowerCase().includes(term));

    return matchesCategory && matchesBrand && matchesLowStock && matchesSearch;
  });

  // Ombordagi hisob-kitoblar
  const lowStockCount = safeProducts.filter(p => Number(p?.stock || 0) <= Number(p?.minStock || 3)).length;
  const totalStockCount = safeProducts.reduce((acc, p) => acc + Number(p?.stock || 0), 0);
  const totalCostValue = safeProducts.reduce((acc, p) => acc + (Number(p?.costPrice || 0) * Number(p?.stock || 0)), 0);
  const totalRetailValue = safeProducts.reduce((acc, p) => {
    const unitPrice = p?.price || (p?.prices ? Math.min(...Object.values(p.prices).filter(Boolean)) : 0) || 0;
    return acc + (Number(unitPrice) * Number(p?.stock || 0));
  }, 0);
  const potentialProfit = totalRetailValue - totalCostValue;

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  // Yangi tovar modalini ochish
  const handleOpenAdd = () => {
    setEditingProduct(null);
    const indType = currentIndustry?.specialType || currentIndustry?.id || 'general';
    setFormType(indType);
    setFormName('');
    setFormBrand('');
    const defaultCat = currentIndustry?.categories?.find(c => c !== 'Hammasi') || 'Boshqa';
    setFormCategory(defaultCat);
    setFormUnit(currentIndustry?.unit || 'dona');
    setFormBarcode(Math.floor(100000000000 + Math.random() * 900000000000).toString());
    setFormCostPrice('');
    setFormPrice('');
    setFormWholesalePrice('');
    setFormStock('10');
    setFormMinStock('3');
    setFormImage('');
    setFormNotes('');
    setFormClothingSizes('S, M, L, XL');
    setFormClothingColors('Qora, Oq');
    setFormClothingMaterial('Paxta 100%');
    setFormTechWarranty('12 oy');
    setFormTechMemory('128GB, 256GB');
    setFormPerfumeVolume('50 ml');
    setFormPerfumeConcentration('EDP');
    setFormPerfumePrices({ '5 ml': '', '10 ml': '', '20 ml': '', '30 ml': '', '50 ml': '', '100 ml': '' });
    setFormGroceryExpiry('');
    setShowAddModal(true);
  };

  // Tahrirlash modalini ochish
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    const pType = getProductType(p);
    setFormType(pType);
    setFormName(p.name || '');
    setFormBrand(p.brand || '');
    setFormCategory(p.category || '');
    setFormUnit(p.unit || 'dona');
    setFormBarcode(p.barcode || '');
    setFormCostPrice(p.costPrice || '');
    setFormPrice(p.price || '');
    setFormWholesalePrice(p.wholesalePrice || '');
    setFormStock(p.stock || '0');
    setFormMinStock(p.minStock || '3');
    setFormImage(p.image || '');
    setFormNotes(p.notes || '');

    if (pType === 'clothing' && p.variants) {
      const sizes = Array.from(new Set(p.variants.map(v => v.size).filter(Boolean))).join(', ');
      const colors = Array.from(new Set(p.variants.map(v => v.color).filter(Boolean))).join(', ');
      setFormClothingSizes(sizes || 'S, M, L');
      setFormClothingColors(colors || 'Qora, Oq');
    }

    if (pType === 'perfume') {
      setFormPerfumeVolume(p.volume || '50 ml');
      setFormPerfumeConcentration(p.concentration || 'EDP');
      setFormPerfumePrices(p.prices || { '10 ml': '', '20 ml': '', '30 ml': '', '50 ml': '' });
    }

    setShowAddModal(true);
  };

  // Mahsulotni saqlash (Qo'shish yoki Tahrirlash)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formName || !formPrice) {
      alert("Iltimos, tovar nomi va sotish narxini kiriting!");
      return;
    }

    const priceNum = Number(formPrice);
    const costPriceNum = Number(formCostPrice) || Math.round(priceNum * 0.7);

    // Variantlarni generatsiya qilish (agar kiyim yoki elektronika bo'lsa)
    let variants = editingProduct?.variants || [];
    if (formType === 'clothing' && formClothingSizes) {
      const sizes = formClothingSizes.split(',').map(s => s.trim()).filter(Boolean);
      const colors = formClothingColors.split(',').map(c => c.trim()).filter(Boolean);
      variants = [];
      sizes.forEach((sz, idx) => {
        colors.forEach((col, cIdx) => {
          variants.push({
            id: `v-${idx}-${cIdx}-${Date.now()}`,
            name: `${sz} / ${col}`,
            size: sz,
            color: col,
            price: priceNum,
            costPrice: costPriceNum,
            stock: Math.max(1, Math.floor(Number(formStock) / (sizes.length * colors.length || 1)))
          });
        });
      });
    }

    const payload = {
      id: editingProduct ? editingProduct.id : `prd-${Date.now()}`,
      name: formName,
      brand: formBrand || 'Do\'kon',
      category: formCategory || 'Tovarlar',
      productType: formType,
      unit: formUnit || 'dona',
      barcode: formBarcode || Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      price: priceNum,
      costPrice: costPriceNum,
      wholesalePrice: Number(formWholesalePrice) || Math.round(priceNum * 0.85),
      stock: Number(formStock) || 0,
      minStock: Number(formMinStock) || 3,
      image: formImage || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
      notes: formNotes,
      hasVariants: variants.length > 0 || (formType === 'perfume' && Boolean(formPerfumePrices['10 ml'])),
      variants: variants.length > 0 ? variants : undefined,
      // Perfume-specific:
      volume: formType === 'perfume' ? formPerfumeVolume : undefined,
      concentration: formType === 'perfume' ? formPerfumeConcentration : undefined,
      prices: formType === 'perfume' ? formPerfumePrices : undefined,
      // Electronics-specific:
      warranty: formType === 'electronics' ? formTechWarranty : undefined,
      // Grocery & Pharmacy-specific:
      expiryDate: (formType === 'grocery' ? formGroceryExpiry : (formType === 'pharmacy' ? formPharmacyExpiry : undefined)),
      dosage: formType === 'pharmacy' ? formPharmacyDosage : undefined
    };

    if (editingProduct) {
      onUpdateProduct(payload);
    } else {
      onAddProduct(payload);
    }

    setShowAddModal(false);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Tovar Nomi', 'Brend', 'Toifa', 'Tovar Turi', 'Birlik', 'Sotish Narxi', 'Tannarx', 'Qoldiq', 'Shtrix-kod'];
    const rows = products.map(p => [
      p.id,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.brand || '').replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      getProductType(p),
      p.unit || 'dona',
      p.price || 0,
      p.costPrice || 0,
      p.stock || 0,
      p.barcode || ''
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `billz_ombor_baza_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>{currentIndustry.emoji || '📦'}</span>
            <h2>Ombor va Mahsulotlar Katalogi ({currentIndustry.shortName})</h2>
          </div>
          <p>{currentIndustry.name} — Mahsulotlar, qoldiqlar va narxlarni boshqarish</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            type="button"
            className="btn btn-primary" 
            style={{ 
              background: 'linear-gradient(135deg, #f59e0b, #6366f1)', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontWeight: 800,
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.35)'
            }}
            onClick={() => setShowAiImportModal(true)}
            title="Excel, PDF yoki Telegram narxnomalaridan AI orqali avtomatik kiritish"
          >
            <Sparkles size={16} /> 
            <span>✨ AI & Excel/PDF Import</span>
          </button>
          
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Excel / CSV Eksport
          </button>

          {products.length > 0 && (
            <button 
              type="button"
              className="btn btn-secondary"
              style={{ color: 'var(--danger)', borderColor: 'rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', gap: '5px' }}
              onClick={() => {
                if (window.confirm("DIQQAT: Ushbu do'kondagi barcha tovarlarni bazadan tozalab o'chirmoqchimisiz?")) {
                  if (onClearAllProducts) onClearAllProducts();
                }
              }}
              title="Do'kondagi barcha mahsulotlarni o'chirish"
            >
              <Trash2 size={15} />
              <span>Tozalash ({products.length})</span>
            </button>
          )}

          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Yangi Tovar Qo'shish
          </button>
        </div>
      </div>

      {/* Warehouse Summary KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">
            <span>Jami Tovar Birligi</span>
            <Box size={18} color="var(--primary)" />
          </div>
          <div className="kpi-value">{totalStockCount.toLocaleString()}</div>
          <div className="kpi-subtitle">
            Bazada: <strong>{products.length} xil</strong> mahsulot turi
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Ombor Tannarx Sarmoyasi</span>
            <ArrowUpRight size={18} color="var(--info)" />
          </div>
          <div className="kpi-value">{formatMoney(totalCostValue)}</div>
          <div className="kpi-subtitle">Xarid qilingan jami qiymat</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Chakana Savdo Qiymati</span>
            <Sparkles size={18} color="var(--success)" />
          </div>
          <div className="kpi-value">{formatMoney(totalRetailValue)}</div>
          <div className="kpi-subtitle">
            Kutilayotgan sof marja: <strong style={{ color: 'var(--success)' }}>+{formatMoney(potentialProfit)}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Kam Qolgan Zaxira</span>
            <AlertTriangle size={18} color={lowStockCount > 0 ? 'var(--danger)' : 'var(--success)'} />
          </div>
          <div className="kpi-value" style={{ color: lowStockCount > 0 ? 'var(--danger)' : 'var(--text-main)' }}>
            {lowStockCount} ta
          </div>
          <div className="kpi-subtitle">
            {lowStockCount > 0 ? (
              <button 
                onClick={() => setOnlyLowStock(!onlyLowStock)} 
                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 700, padding: 0 }}
              >
                {onlyLowStock ? 'Barchasini ko\'rsatish' : 'Faqat kam qolganlarni ko\'rish →'}
              </button>
            ) : 'Barcha tovarlar yetarli miqdorda'}
          </div>
        </div>
      </div>

      {/* STORE DEDICATED INDUSTRY CATEGORIES */}
      <div className="billz-industry-nav" style={{ marginBottom: '16px' }}>
        <div className="billz-industry-scroll">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px', padding: '0 8px' }}>
            <span style={{ fontSize: '1.2rem' }}>{currentIndustry.emoji}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: currentIndustry.color }}>
              {currentIndustry.shortName} Kategoriyalari:
            </span>
          </div>
          {industryCategories.map(cat => {
            const isActive = selectedCategory === cat;
            const count = cat === 'Hammasi' 
              ? safeProducts.length 
              : safeProducts.filter(p => p.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                className={`billz-industry-tab ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={isActive ? { borderColor: currentIndustry.color, background: `linear-gradient(135deg, ${currentIndustry.color}, #4f46e5)` } : {}}
              >
                <span className="tab-name">{cat}</span>
                <span className="tab-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-card">
        <div className="search-wrap">
          <Search size={18} color="var(--text-sub)" />
          <input 
            type="text" 
            placeholder="Tovar nomi, brendi, toifasi yoki shtrix-kod bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} color="var(--text-sub)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Brend:</span>
            <select 
              className="filter-select"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
            >
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <label className="checkbox-wrap" style={{ cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={onlyLowStock} 
              onChange={(e) => setOnlyLowStock(e.target.checked)} 
            />
            <span style={{ fontSize: '0.82rem', color: onlyLowStock ? 'var(--danger)' : 'var(--text-muted)' }}>
              Faqat kam qolganlar ({lowStockCount})
            </span>
          </label>
        </div>
      </div>

      {/* BILLZ Products Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tovar va Brend</th>
                <th>Turi & Toifa</th>
                <th>Shtrix-kod</th>
                <th>Tannarx</th>
                <th>Sotish Narxi</th>
                <th>Foyda (Marja)</th>
                <th>Qoldiq (Sklad)</th>
                <th>Holat</th>
                <th style={{ textAlign: 'center' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sub)' }}>
                    Mos keluvchi tovar topilmadi
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const pType = getProductType(product);
                  const badge = getTypeBadge(pType);
                  const isLow = product.stock <= (product.minStock || 3);
                  const profitSum = (product.price || 0) - (product.costPrice || 0);
                  const profitPercent = product.price > 0 ? Math.round((profitSum / product.price) * 100) : 0;

                  return (
                    <tr key={product.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={product.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80'} 
                            alt="" 
                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} 
                          />
                          <div>
                            <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{product.name}</strong>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>
                              {product.brand} {product.unit ? `• ${product.unit}` : ''}
                              {product.variants ? ` • (${product.variants.length} variant)` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span className="product-type-badge-inline" style={{ color: badge.color, background: badge.bg }}>
                            {badge.emoji} {badge.label}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {product.category || 'Tovarlar'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          <Barcode size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                          {product.barcode || '—'}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                        {formatMoney(product.costPrice)}
                      </td>
                      <td style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>
                        {formatMoney(product.price)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: profitSum >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                          <strong>+{formatMoney(profitSum)}</strong>
                          <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>({profitPercent}%)</span>
                        </div>
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.92rem', color: isLow ? 'var(--danger)' : '#fff' }}>
                          {product.stock} {product.unit || 'dona'}
                        </strong>
                      </td>
                      <td>
                        <span className={`status-pill ${isLow ? 'status-danger' : 'status-success'}`}>
                          {product.stock === 0 ? 'Tugagan' : isLow ? 'Kam qoldi' : 'Mavjud'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button 
                            className="btn btn-icon btn-secondary" 
                            onClick={() => handleOpenEdit(product)}
                            title="Tahrirlash"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn btn-icon btn-secondary" 
                            style={{ color: 'var(--danger)', borderColor: 'rgba(244,63,94,0.3)' }}
                            onClick={() => {
                              if (confirm(`Haqiqatan ham "${product.name}" mahsulotini o'chirmoqchimisiz?`)) {
                                onDeleteProduct(product.id);
                              }
                            }}
                            title="O'chirish"
                          >
                            <Trash2 size={14} />
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

      {/* Universal BILLZ Product Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {editingProduct ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo\'shish'}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {currentIndustry.name} tizimi uchun tovar ma'lumotlarini kiritish
                </p>
              </div>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ padding: '20px' }}>
              {/* Do'kon Soha Identifikatori (Bitta yo'nalish bo'yicha) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                marginBottom: '16px'
              }}>
                <div style={{
                  fontSize: '1.6rem',
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {currentIndustry.emoji}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                      {currentIndustry.name}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--success)'
                    }}>
                      Aktiv Tizim
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    Ushbu tovar faqat {currentIndustry.shortName} katalogiga kiritiladi.
                  </p>
                </div>
              </div>

              {/* Basic Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="form-label">Tovar Nomi *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Masalan: Nike Air Force, iPhone 15, Creed Aventus..." 
                    value={formName} 
                    onChange={(e) => setFormName(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Brend / Ishlab chiqaruvchi</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Nike, Zara, Apple..." 
                    value={formBrand} 
                    onChange={(e) => setFormBrand(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="form-label">Kategoriya *</label>
                  <select 
                    className="form-input" 
                    value={formCategory} 
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {currentIndustry.categories.filter(c => c !== 'Hammasi').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Boshqa">+ Boshqa toifa</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">O'lchov Birligi</label>
                  <select 
                    className="form-input"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                  >
                    {MEASURE_UNITS.map(u => (
                      <option key={u.id} value={u.id}>{u.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Shtrix-kod (EAN-13)</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formBarcode} 
                      onChange={(e) => setFormBarcode(e.target.value)} 
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setFormBarcode(Math.floor(100000000000 + Math.random() * 900000000000).toString())}
                      title="Tasodifiy generatsiya"
                    >
                      🎲
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Industry Specific Attributes */}
              {formType === 'clothing' && (
                <div className="industry-specific-box">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818cf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shirt size={15} /> Kiyim va Poyabzal Variantlari (Razmer & Rang):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">O'lchamlar (vergul bilan):</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="S, M, L, XL yoki 40, 41, 42" 
                        value={formClothingSizes} 
                        onChange={(e) => setFormClothingSizes(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="form-label">Ranglar (vergul bilan):</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Qora, Oq, Moviy" 
                        value={formClothingColors} 
                        onChange={(e) => setFormClothingColors(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {formType === 'electronics' && (
                <div className="industry-specific-box">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Smartphone size={15} /> Elektronika Xususiyatlari:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">Xotira / Variantlar:</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="128GB, 256GB, 512GB" 
                        value={formTechMemory} 
                        onChange={(e) => setFormTechMemory(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="form-label">Rasmiy Kafolat Muddati:</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="12 oy, 6 oy..." 
                        value={formTechWarranty} 
                        onChange={(e) => setFormTechWarranty(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {(formType === 'perfume' || currentIndustry.hasVolumeMl) && (
                <div className="industry-specific-box">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={15} /> Parfyumeriya Quyma Hajmlar Narxi:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                    {['5 ml', '10 ml', '20 ml', '30 ml', '50 ml', '100 ml'].map(vol => (
                      <div key={vol}>
                        <label className="form-label" style={{ fontSize: '0.74rem' }}>{vol}:</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Narx"
                          value={formPerfumePrices[vol] || ''}
                          onChange={(e) => setFormPerfumePrices({ ...formPerfumePrices, [vol]: Number(e.target.value) })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formType === 'grocery' && (
                <div className="industry-specific-box">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Apple size={15} /> Oziq-ovqat va Supermarket Parametrlari:
                  </div>
                  <div>
                    <label className="form-label">Yaroqlilik muddati:</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={formGroceryExpiry} 
                      onChange={(e) => setFormGroceryExpiry(e.target.value)} 
                    />
                  </div>
                </div>
              )}

              {formType === 'pharmacy' && (
                <div className="industry-specific-box">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ec4899', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    💊 Dorixona va Salomatlik Parametrlari:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label className="form-label">Yaroqlilik muddati:</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={formPharmacyExpiry} 
                        onChange={(e) => setFormPharmacyExpiry(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="form-label">Dozasi (masalan: 500mg, 10ml):</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="500 mg, 100 ml..." 
                        value={formPharmacyDosage} 
                        onChange={(e) => setFormPharmacyDosage(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Prices and Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', margin: '14px 0' }}>
                <div>
                  <label className="form-label">Tannarxi (so'm)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="150000" 
                    value={formCostPrice} 
                    onChange={(e) => setFormCostPrice(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="form-label">Chakana Sotish Narxi *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="220000" 
                    value={formPrice} 
                    onChange={(e) => setFormPrice(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Ulgurji (Optom) Narx</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="185000" 
                    value={formWholesalePrice} 
                    onChange={(e) => setFormWholesalePrice(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Ombordagi Soni *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={formStock} 
                    onChange={(e) => setFormStock(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Min Zaxira Limiti</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={formMinStock} 
                    onChange={(e) => setFormMinStock(e.target.value)} 
                  />
                </div>
              </div>

              {/* Device Image Uploader */}
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Image size={15} color="var(--primary)" />
                  <span>Tovar Rasmi (Qurilmangizdan yuklash):</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    background: 'var(--bg-elevated)',
                    border: '1.5px dashed var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {formImage ? (
                      <img src={formImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Box size={24} color="var(--text-sub)" />
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <label className="btn btn-sm btn-secondary" style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.8rem' }}>
                        <Upload size={14} /> <span>📁 Qurilmadan rasm tanlash (Telefon / Kompyuter)</span>
                        <input type="file" accept="image/*" onChange={handleProductImageFile} style={{ display: 'none' }} />
                      </label>
                      {formImage && (
                        <button 
                          type="button" 
                          className="btn btn-sm btn-secondary" 
                          style={{ color: 'var(--danger)', padding: '6px 10px' }} 
                          onClick={() => setFormImage('')}
                          title="Rasmni o'chirish"
                        >
                          <Trash2 size={14} /> <span>O'chirish</span>
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-sub)' }}>yoki URL:</span>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="https://images.unsplash.com/..." 
                        value={formImage} 
                        onChange={(e) => setFormImage(e.target.value)} 
                        style={{ fontSize: '0.75rem', padding: '4px 8px', height: '28px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label className="form-label">Izoh / Tavsif</label>
                <textarea 
                  className="form-input" 
                  rows="2" 
                  placeholder="Mahsulot haqida qo'shimcha ma'lumot..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                  <Check size={16} /> Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI & Excel/PDF Smart Catalog Import Modal */}
      {showAiImportModal && (
        <CatalogImportModal 
          isOpen={showAiImportModal}
          onClose={() => setShowAiImportModal(false)}
          storeMode={storeMode}
          onImportProducts={(importedList) => {
            if (onBatchAddProducts) {
              onBatchAddProducts(importedList);
            } else {
              importedList.forEach(p => onAddProduct(p));
            }
          }}
        />
      )}
    </div>
  );
}
