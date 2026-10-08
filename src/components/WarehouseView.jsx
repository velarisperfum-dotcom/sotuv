import React, { useState } from 'react';
import { 
  Package, Plus, AlertTriangle, Search, Filter, 
  ArrowUpRight, ArrowDownRight, Edit2, Trash2, CheckCircle2, Box
} from 'lucide-react';

export default function WarehouseView({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('Hammasi');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // New product form
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('Unisex');
  const [formVolume, setFormVolume] = useState('100 ml');
  const [formConcentration, setFormConcentration] = useState('EDP');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCostPrice, setFormCostPrice] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formMinStock, setFormMinStock] = useState('3');
  const [formImage, setFormImage] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const brands = ['Hammasi', ...Array.from(new Set(products.map(p => p.brand)))];

  const filteredProducts = products.filter(p => {
    const matchesBrand = filterBrand === 'Hammasi' || p.brand === filterBrand;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.barcode && p.barcode.includes(searchTerm));
    return matchesBrand && matchesSearch;
  });

  const lowStockCount = products.filter(p => p.stock <= (p.minStock || 3)).length;
  const totalStockCount = products.reduce((acc, p) => acc + Number(p.stock), 0);
  const totalCostValue = products.reduce((acc, p) => acc + (Number(p.costPrice) * Number(p.stock)), 0);
  const totalRetailValue = products.reduce((acc, p) => acc + (Number(p.price) * Number(p.stock)), 0);
  const potentialProfit = totalRetailValue - totalCostValue;

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('');
    setFormCategory('Unisex');
    setFormVolume('100 ml');
    setFormConcentration('EDP');
    setFormBarcode(Math.floor(1000000000000 + Math.random() * 9000000000000).toString());
    setFormCostPrice('');
    setFormPrice('');
    setFormStock('');
    setFormMinStock('3');
    setFormImage('https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80');
    setFormNotes('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormVolume(p.volume);
    setFormConcentration(p.concentration);
    setFormBarcode(p.barcode || '');
    setFormCostPrice(p.costPrice);
    setFormPrice(p.price);
    setFormStock(p.stock);
    setFormMinStock(p.minStock || 3);
    setFormImage(p.image);
    setFormNotes(p.notes || '');
    setShowAddModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formName || !formBrand || !formPrice || !formCostPrice || !formStock) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    const payload = {
      id: editingProduct ? editingProduct.id : `prd-${Date.now()}`,
      name: formName,
      brand: formBrand,
      category: formCategory,
      volume: formVolume,
      concentration: formConcentration,
      barcode: formBarcode,
      costPrice: Number(formCostPrice),
      price: Number(formPrice),
      stock: Number(formStock),
      minStock: Number(formMinStock),
      image: formImage || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
      notes: formNotes
    };

    if (editingProduct) {
      onUpdateProduct(payload);
    } else {
      onAddProduct(payload);
    }

    setShowAddModal(false);
  };

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Sklad & Ombor Boshqaruvi</h2>
          <p>Atirlar qoldig'i, yangi partiya kirimi va zaxira monitoringi</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Yangi atir / Kirim qilish
        </button>
      </div>

      {/* Sklad Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card cyan">
          <div className="stat-header">
            <span className="stat-title">Jami Atirlar zaxirasi</span>
            <div className="stat-icon"><Package size={20} color="var(--info)" /></div>
          </div>
          <div className="stat-value">{totalStockCount} dona</div>
          <div className="stat-desc">{products.length} xil parfyum turi mavjud</div>
        </div>

        <div className="stat-card amber">
          <div className="stat-header">
            <span className="stat-title">Ombor Tan Narxi (Kapital)</span>
            <div className="stat-icon"><Box size={20} color="var(--gold)" /></div>
          </div>
          <div className="stat-value">{formatMoney(totalCostValue)}</div>
          <div className="stat-desc">Xarid qilingan asl bahosi</div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-header">
            <span className="stat-title">Sotuvdagi umumiy qiymati</span>
            <div className="stat-icon"><ArrowUpRight size={20} color="var(--success)" /></div>
          </div>
          <div className="stat-value">{formatMoney(totalRetailValue)}</div>
          <div className="stat-desc">Kutilayotgan sof marja: {formatMoney(potentialProfit)}</div>
        </div>

        <div className={`stat-card ${lowStockCount > 0 ? 'rose' : ''}`}>
          <div className="stat-header">
            <span className="stat-title">Kam qolgan atirlar</span>
            <div className="stat-icon"><AlertTriangle size={20} color={lowStockCount > 0 ? "var(--danger)" : "#94a3b8"} /></div>
          </div>
          <div className="stat-value" style={{ color: lowStockCount > 0 ? 'var(--danger)' : undefined }}>
            {lowStockCount} ta atir
          </div>
          <div className="stat-desc">{lowStockCount > 0 ? 'Zudlik bilan buyurtma berish lozim' : 'Barcha zaxiralar me’yorda'}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="header-search" style={{ flex: 1, minWidth: '260px' }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Nomi, brendi yoki shtrix-kod bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Brend bo'yicha:</span>
            <select 
              className="form-control" 
              style={{ width: 'auto', padding: '6px 12px' }}
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
            >
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Warehouse Products Table */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-header" style={{ padding: '20px 24px', margin: 0, borderBottom: '1px solid var(--border-light)' }}>
          <h3 className="panel-title">
            <Package size={20} color="var(--primary)" />
            Ombordagi tovarlar ro'yxati ({filteredProducts.length})
          </h3>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Atir / Mahsulot</th>
                <th>Brend & Kategoriya</th>
                <th>Hajmi & Turi</th>
                <th>Tan Narxi</th>
                <th>Sotish Narxi</th>
                <th>Ombor Qoldig'i</th>
                <th>Shtrix-kod</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const isLow = product.stock <= (product.minStock || 3);
                return (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{product.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{product.notes ? product.notes.slice(0, 32) + '...' : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--gold)' }}>{product.brand}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.category}</div>
                    </td>
                    <td>
                      <div>{product.volume}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{product.concentration}</div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {formatMoney(product.costPrice)}
                    </td>
                    <td style={{ fontWeight: 700, color: '#fff' }}>
                      {formatMoney(product.price)}
                    </td>
                    <td>
                      <span className={`badge ${isLow ? 'badge-danger' : 'badge-cash'}`}>
                        {product.stock} dona {isLow && '(Kam qoldi)'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                      {product.barcode || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button 
                          className="cart-qty-btn" 
                          title="Tahrirlash / Zaxira qo'shish"
                          onClick={() => handleOpenEdit(product)}
                        >
                          <Edit2 size={14} color="var(--primary)" />
                        </button>
                        <button 
                          className="cart-qty-btn" 
                          title="O'chirish"
                          onClick={() => {
                            if (confirm(`${product.name} atirini ro'yxatdan o'chirishni tasdiqlaysizmi?`)) {
                              onDeleteProduct(product.id);
                            }
                          }}
                        >
                          <Trash2 size={14} color="var(--danger)" />
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

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {editingProduct ? 'Atir ma’lumotlarini tahrirlash / Kirim' : 'Yangi Atir Qo‘shish (Kirim)'}
              </h3>
              <button className="cart-qty-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Atir nomi *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Masalan: Baccarat Rouge 540"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brendi *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Masalan: Maison Francis Kurkdjian"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Toifa</label>
                    <select 
                      className="form-control"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      <option value="Erkaklar">Erkaklar</option>
                      <option value="Ayollar">Ayollar</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hajmi (ml)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="100 ml"
                      value={formVolume}
                      onChange={(e) => setFormVolume(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Konsentratsiya</label>
                    <select 
                      className="form-control"
                      value={formConcentration}
                      onChange={(e) => setFormConcentration(e.target.value)}
                    >
                      <option value="EDP">EDP (Parfumer suvi)</option>
                      <option value="Parfum">Parfum (Sof atir)</option>
                      <option value="Extrait">Extrait de Parfum</option>
                      <option value="EDT">EDT (Tualet suvi)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Tan narxi (Kirim bahosi) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="2500000"
                      value={formCostPrice}
                      onChange={(e) => setFormCostPrice(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sotish narxi *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="3500000"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Ombor miqdori (dona) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="10"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Min. ogohlantirish zaxirasi</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="3"
                      value={formMinStock}
                      onChange={(e) => setFormMinStock(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Shtrix-kod</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Shtrix-kod"
                      value={formBarcode}
                      onChange={(e) => setFormBarcode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Rasm URL manzili</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="https://images.unsplash.com/..."
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Atir notalari (Tavsif)</label>
                  <textarea 
                    className="form-control" 
                    rows={2}
                    placeholder="Masalan: Bergamot, ananas, pachuli, kedr..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
