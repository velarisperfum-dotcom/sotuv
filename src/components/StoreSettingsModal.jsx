import React, { useState } from 'react';
import { 
  X, Store, Image, Upload, Trash2, Check, Phone, 
  MapPin, ShieldCheck, RefreshCw, LogOut, Sparkles, 
  Receipt, User, FileText, CheckCircle2 
} from 'lucide-react';
import { getIndustryById } from '../data/industriesData';

export default function StoreSettingsModal({
  isOpen,
  onClose,
  currentStoreSession,
  onUpdateSession,
  onOpenNewStoreOnboarding,
  onLogout
}) {
  if (!isOpen) return null;

  const activeIndustry = getIndustryById(currentStoreSession?.industryId);

  const [storeName, setStoreName] = useState(currentStoreSession?.storeName || activeIndustry.brandName);
  const [directorName, setDirectorName] = useState(currentStoreSession?.directorName || 'Rahbar');
  const [phone, setPhone] = useState(currentStoreSession?.phone || activeIndustry.contact || '');
  const [address, setAddress] = useState(currentStoreSession?.address || 'Toshkent shahar');
  const [receiptFooter, setReceiptFooter] = useState(currentStoreSession?.receiptFooter || activeIndustry.receiptFooter || '');
  const [storeLogo, setStoreLogo] = useState(currentStoreSession?.logo || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Logo file upload from device
  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Logo fayli hajmi 4MB dan oshmasligi kerak!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setStoreLogo(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...currentStoreSession,
      storeName: storeName.trim(),
      directorName: directorName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      receiptFooter: receiptFooter.trim(),
      logo: storeLogo
    };

    onUpdateSession(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 10000 }}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${activeIndustry.color}, #6366f1)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem'
            }}>
              {storeLogo ? (
                <img src={storeLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
              ) : (
                activeIndustry.emoji
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Do'kon Sozlamalari & Brending</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {activeIndustry.name} tizimi parametrlari
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          {/* Dedicated Industry Indicator */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${activeIndustry.color}40`,
            borderRadius: '14px',
            padding: '14px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>{activeIndustry.emoji}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{activeIndustry.name}</strong>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '20px',
                    background: `${activeIndustry.color}25`,
                    color: activeIndustry.color,
                    border: `1px solid ${activeIndustry.color}50`
                  }}>
                    Alohida Tizim (SaaS)
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '2px' }}>
                  Do'koningiz faqat o'z sohasiga mos katalog, kassa va ombor bilan ishlaydi.
                </p>
              </div>
            </div>
          </div>

          {/* Logo Upload Section */}
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-light)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Image size={16} color="var(--primary)" />
              <span>Do'kon Logotipi (Qurilmadan yuklash):</span>
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {/* Preview Avatar */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                border: '2px dashed var(--border-light)',
                background: 'var(--bg-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {storeLogo ? (
                  <img src={storeLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '6px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{activeIndustry.emoji}</span>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-sub)' }}>Logosiz</div>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.82rem', padding: '8px 14px' }}>
                    <Upload size={15} />
                    <span>📁 Telefondan / Kompyuterdan tanlash</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoFileChange}
                      style={{ display: 'none' }} 
                    />
                  </label>

                  {storeLogo && (
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      style={{ color: 'var(--danger)', borderColor: 'rgba(244,63,94,0.3)', padding: '8px 12px' }}
                      onClick={() => setStoreLogo('')}
                      title="Logoni o'chirish"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-sub)', marginTop: '8px' }}>
                  Tavsiya: PNG, JPG yoki SVG (kvadrat yoki shaffof fon). Ushbu logo cheklarda va yon menyuda chiqadi.
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label className="form-label">Do'kon Nomi *</label>
              <div className="input-with-icon">
                <Store size={16} color="var(--text-sub)" />
                <input 
                  type="text" 
                  className="form-input" 
                  value={storeName} 
                  onChange={(e) => setStoreName(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div>
              <label className="form-label">Direktor / Rahbar Ismi</label>
              <div className="input-with-icon">
                <User size={16} color="var(--text-sub)" />
                <input 
                  type="text" 
                  className="form-input" 
                  value={directorName} 
                  onChange={(e) => setDirectorName(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label className="form-label">Aloqa Telefoni</label>
              <div className="input-with-icon">
                <Phone size={16} color="var(--text-sub)" />
                <input 
                  type="text" 
                  className="form-input" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
            </div>
            <div>
              <label className="form-label">Do'kon Manzili</label>
              <div className="input-with-icon">
                <MapPin size={16} color="var(--text-sub)" />
                <input 
                  type="text" 
                  className="form-input" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Kassa Chekining Pastki Matni (Footer):</label>
            <div className="input-with-icon">
              <Receipt size={16} color="var(--text-sub)" />
              <input 
                type="text" 
                className="form-input" 
                value={receiptFooter} 
                onChange={(e) => setReceiptFooter(e.target.value)} 
                placeholder="Xaridingiz uchun rahmat! Mahsulot almashtirish kafolati..." 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {onOpenNewStoreOnboarding && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    onClose();
                    onOpenNewStoreOnboarding();
                  }}
                  title="Boshqa mijoz uchun yangi do'kon tizimi ochish"
                  style={{ fontSize: '0.78rem' }}
                >
                  <Sparkles size={14} color="var(--primary)" />
                  <span>Yangi Do'kon O'rnatish</span>
                </button>
              )}

              {onLogout && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--danger)', fontSize: '0.78rem' }}
                  onClick={() => {
                    if (confirm("Haqiqatan ham do'kon hisobidan chiqmoqchimisiz?")) {
                      onClose();
                      onLogout();
                    }
                  }}
                  title="Chiqish"
                >
                  <LogOut size={14} />
                  <span>Chiqish</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Bekor qilish
              </button>
              <button type="submit" className="btn btn-primary" style={{ minWidth: '130px' }}>
                {savedSuccess ? (
                  <>
                    <CheckCircle2 size={16} /> Saqlandi!
                  </>
                ) : (
                  <>
                    <Check size={16} /> Saqlash
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
