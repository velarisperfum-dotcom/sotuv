import React, { useState } from 'react';
import { 
  X, Sparkles, FileSpreadsheet, FileText, ClipboardList, 
  Upload, Check, AlertCircle, CheckCircle2, Trash2, 
  RefreshCw, Package, ArrowRight, Layers, Tag, DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { parseExcelFile, parsePdfFile, parseCatalogTextWithAi } from '../services/aiImportService';
import { getIndustryById } from '../data/industriesData';

export default function CatalogImportModal({
  isOpen,
  onClose,
  onImportProducts,
  storeMode = 'universal'
}) {
  if (!isOpen) return null;

  const currentIndustry = getIndustryById(storeMode);

  const [activeTab, setActiveTab] = useState('excel'); // 'excel' | 'pdf' | 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Extracted products state
  const [extractedProducts, setExtractedProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const formatMoney = (val) => Number(val || 0).toLocaleString('uz-UZ') + " so'm";

  // File selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMsg('');
    }
  };

  // Sample prompt insert for text tab
  const handleInsertSample = (type) => {
    if (type === 'perfume') {
      setRawText(`1. Creed Aventus - 5ml 130000, 10ml 250000, 20ml 480000, 50ml 1100000, tannarxi 700000, qoldiq 15 dona
2. Baccarat Rouge 540 Extrait - 5ml 160000, 10ml 300000, 50ml 1400000, qoldiq 8 dona
3. Tom Ford Tobacco Vanille - 5ml 140000, 10ml 260000, 30ml 650000, 50ml 1050000
4. Chanel Bleu de Chanel EDP - 10ml 180000, 20ml 340000, 50ml 850000, qoldiq 12
5. Dior Sauvage Elixir - 5ml 120000, 10ml 230000, 50ml 950000, tannarx 600000`);
    } else {
      setRawText(`1. Zara Slim Fit Erkaklar Kostyumi - Qora va Moviy, 46-52 razmer, narxi 750000, tannarx 500000, qoldiq 20
2. Nike Air Force 1 Classic - Oq krossovka, 40-44 razmer, narxi 420000, tannarx 280000, qoldiq 15
3. Polo Ralph Lauren Futbolka - S, M, L, XL, narxi 220000, tannarx 140000, qoldiq 30 dona
4. Levi's 501 Klassik Jinsi shim - 30-36 razmer, narxi 380000, tannarx 240000, qoldiq 18 dona`);
    }
  };

  // Run AI / Parser
  const handleStartImport = async () => {
    setErrorMsg('');
    setLoading(true);
    setProgressMsg("Fayl ma'lumotlari tahlil qilinmoqda...");

    try {
      let results = [];

      if (activeTab === 'excel') {
        if (!selectedFile) throw new Error("Iltimos, Excel (.xlsx, .csv) faylini tanlang!");
        results = await parseExcelFile(selectedFile, storeMode, setProgressMsg);
      } else if (activeTab === 'pdf') {
        if (!selectedFile) throw new Error("Iltimos, PDF katalog faylini tanlang!");
        results = await parsePdfFile(selectedFile, storeMode, setProgressMsg);
      } else {
        if (!rawText.trim()) throw new Error("Iltimos, katalog yoki narxnoma matnini kiriting!");
        results = await parseCatalogTextWithAi(rawText, storeMode, setProgressMsg);
      }

      if (!results || results.length === 0) {
        throw new Error("Tovar ma'lumotlari aniqlanmadi. Matn yoki faylni qayta tekshirib ko'ring.");
      }

      setExtractedProducts(results);
      // Select all by default
      setSelectedIds(new Set(results.map(p => p.id)));
      setProgressMsg(`Muvaffaqiyatli! ${results.length} ta mahsulot aniqlandi.`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Tahlil jarayonida xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  // Checkbox toggle
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === extractedProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(extractedProducts.map(p => p.id)));
    }
  };

  // Delete product from list
  const handleRemoveProduct = (id) => {
    setExtractedProducts(prev => prev.filter(p => p.id !== id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Final confirmation: save all selected to warehouse
  const handleConfirmSave = () => {
    const toSave = extractedProducts.filter(p => selectedIds.has(p.id));
    if (toSave.length === 0) {
      alert("Hech bo'lmaganda bitta mahsulot tanlanishi kerak!");
      return;
    }

    onImportProducts(toSave);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 11000 }}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '880px', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
            }}>
              <Sparkles size={22} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>AI & Excel/PDF Avtomatik Katalog Importi</h3>
                <span style={{ fontSize: '0.72rem', background: 'rgba(245,158,11,0.2)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                  Groq AI Tezkor
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Fayl yoki matnni tashlang — tizim 5ml, 10ml, razmerlar va narxlargacha avtomatik kiritadi!
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Source Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'excel' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setActiveTab('excel'); setSelectedFile(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileSpreadsheet size={16} />
              <span>Excel / Sheets (.xlsx, .csv)</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'pdf' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setActiveTab('pdf'); setSelectedFile(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileText size={16} />
              <span>PDF Katalog (.pdf)</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'text' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('text')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ClipboardList size={16} />
              <span>Telegram / Matn (Nusxa olish)</span>
            </button>
          </div>

          {/* Upload & Input Area (if not yet parsed or to re-run) */}
          {extractedProducts.length === 0 && (
            <div>
              {activeTab === 'excel' && (
                <div style={{
                  border: '2px dashed var(--border-light)',
                  borderRadius: '16px',
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.2)',
                  marginBottom: '20px'
                }}>
                  <FileSpreadsheet size={42} color="var(--success)" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                    Excel yoki Google Sheets faylini tanlang
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '16px' }}>
                    Formatlar: .xlsx, .xls, .csv (Sarlavha qatorlari, narxlar va hajmlar avtomatik aniqlanadi)
                  </p>
                  <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Upload size={16} />
                    <span>{selectedFile ? selectedFile.name : '📁 Kompyuterdan Excel fayl tanlash'}</span>
                    <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>
              )}

              {activeTab === 'pdf' && (
                <div style={{
                  border: '2px dashed var(--border-light)',
                  borderRadius: '16px',
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.2)',
                  marginBottom: '20px'
                }}>
                  <FileText size={42} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                    PDF Katalog yoki Narxnoma faylini yuklang
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '16px' }}>
                    Yetkazib beruvchi (optomchi) bergan PDF katalog matnlari sun'iy intellekt orqali o'qiladi
                  </p>
                  <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Upload size={16} />
                    <span>{selectedFile ? selectedFile.name : '📁 PDF katalog faylini tanlash'}</span>
                    <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>
              )}

              {activeTab === 'text' && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ margin: 0 }}>
                      Telegram kanal, Word yoki qoralamadagi narxnomani bu yerga qo'ying:
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm" 
                        style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        onClick={() => handleInsertSample('perfume')}
                      >
                        💎 Atirlar namunasi
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm" 
                        style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        onClick={() => handleInsertSample('clothing')}
                      >
                        👗 Kiyimlar namunasi
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="form-input"
                    rows="7"
                    placeholder="Masalan:&#10;Baccarat Rouge 540 - 5ml 120 ming, 10ml 220 ming, 50ml 900 ming&#10;Creed Aventus - 10ml 250.000, 20ml 480.000&#10;Nike Air Force 1 - 41-45 razmer narxi 450000"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5' }}
                  />
                </div>
              )}

              {/* Error message banner */}
              {errorMsg && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: 'var(--danger)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Progress status */}
              {loading && (
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
                    <RefreshCw size={16} className="rotate-spin" />
                    <span>{progressMsg}</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #6366f1, #f59e0b)', animation: 'progressAnim 1.8s infinite' }} />
                  </div>
                </div>
              )}

              {/* Start AI Button */}
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #6366f1, #f59e0b)' }}
                onClick={handleStartImport}
                disabled={loading || (activeTab !== 'text' && !selectedFile) || (activeTab === 'text' && !rawText.trim())}
              >
                <Sparkles size={18} />
                <span>{loading ? 'AI Tahlil Qilmoqda...' : '🧠 AI Orqali Barcha Tovarlarni Aniqlash va Kiritish'}</span>
              </button>
            </div>
          )}

          {/* Results Live Preview Table */}
          {extractedProducts.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={18} color="var(--success)" />
                    <strong style={{ fontSize: '1rem', color: '#fff' }}>
                      {extractedProducts.length} ta mahsulot aniqlandi
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ({selectedIds.size} ta tanlangan)
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={toggleSelectAll}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {selectedIds.size === extractedProducts.length ? 'Barchasini bekor qilish' : 'Barchasini tanlash'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => { setExtractedProducts([]); setSelectedIds(new Set()); }}
                    style={{ fontSize: '0.78rem' }}
                  >
                    Qaytadan yuklash
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive" style={{ maxHeight: '380px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                <table className="custom-table" style={{ fontSize: '0.82rem' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.size === extractedProducts.length && extractedProducts.length > 0} 
                          onChange={toggleSelectAll} 
                        />
                      </th>
                      <th>Tovar & Brend</th>
                      <th>Hajmlar / Narxlar (5ml, 10ml...)</th>
                      <th>Sotish Narxi</th>
                      <th>Tannarx</th>
                      <th>Qoldiq</th>
                      <th>Birlik</th>
                      <th style={{ textAlign: 'center' }}>O'chirish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedProducts.map((p) => {
                      const isChecked = selectedIds.has(p.id);

                      return (
                        <tr key={p.id} style={{ opacity: isChecked ? 1 : 0.5, background: isChecked ? 'transparent' : 'rgba(0,0,0,0.2)' }}>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={isChecked} 
                              onChange={() => toggleSelect(p.id)} 
                            />
                          </td>
                          <td>
                            <div>
                              <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{p.name}</strong>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)' }}>
                                {p.brand} • {p.category}
                              </div>
                            </div>
                          </td>
                          <td>
                            {/* Extracted volume breakdown chips */}
                            {p.prices && Object.keys(p.prices).length > 0 ? (
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {Object.entries(p.prices).map(([vol, price]) => (
                                  <span 
                                    key={vol} 
                                    style={{
                                      fontSize: '0.7rem',
                                      padding: '2px 6px',
                                      borderRadius: '6px',
                                      background: 'rgba(245, 158, 11, 0.15)',
                                      color: 'var(--gold)',
                                      border: '1px solid rgba(245, 158, 11, 0.3)',
                                      fontWeight: 600
                                    }}
                                  >
                                    {vol}: {Number(price || 0).toLocaleString()}
                                  </span>
                                ))}
                              </div>
                            ) : p.variants && p.variants.length > 0 ? (
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {p.variants.slice(0, 3).map((v, i) => (
                                  <span 
                                    key={i} 
                                    style={{
                                      fontSize: '0.7rem',
                                      padding: '2px 6px',
                                      borderRadius: '6px',
                                      background: 'rgba(99, 102, 241, 0.15)',
                                      color: 'var(--primary)',
                                      border: '1px solid rgba(99, 102, 241, 0.3)'
                                    }}
                                  >
                                    {v.size || v.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-sub)', fontSize: '0.75rem' }}>Standart dona</span>
                            )}
                          </td>
                          <td>
                            <strong style={{ color: '#fff' }}>{formatMoney(p.price)}</strong>
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>
                            {formatMoney(p.costPrice)}
                          </td>
                          <td>
                            <strong style={{ color: 'var(--success)' }}>{p.stock}</strong>
                          </td>
                          <td style={{ color: 'var(--text-sub)' }}>
                            {p.unit}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="btn btn-icon btn-secondary"
                              style={{ width: '28px', height: '28px', color: 'var(--danger)' }}
                              onClick={() => handleRemoveProduct(p.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Confirm & Save Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                  Tanlangan tovarlar to'g'ridan-to'g'ri do'kon bazasi va kassa katalogiga kiritiladi.
                </span>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '10px 22px', fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                    onClick={handleConfirmSave}
                  >
                    <Check size={16} />
                    <span>Barcha {selectedIds.size} ta Tovarni Omborga Saqlash</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
