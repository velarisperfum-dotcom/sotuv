import React, { useState, useEffect } from 'react';
import { 
  Store, Sparkles, Check, ChevronRight, ChevronLeft, 
  User, Phone, Lock, Eye, EyeOff, Copy, CheckCircle2, 
  Search, ShieldCheck, Zap, Users, LogIn, KeyRound, 
  ArrowRight, RefreshCw, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STORE_INDUSTRIES, INDUSTRY_GROUPS, STAFF_COUNT_OPTIONS } from '../data/industriesData';

export default function StoreOnboardingAuth({ 
  onCompleteOnboarding, 
  onLoginSuccess,
  existingSession = null
}) {
  // Mode: 'onboarding' (yangi do'kon ochish) yoki 'login' (mavjud do'konga kirish)
  const [authMode, setAuthMode] = useState('onboarding');

  // Onboarding qadamlari (1 -> 2 -> 3 -> 4)
  const [step, setStep] = useState(1);

  // 1-Qadam: Do'kon nomi va Rahbar ma'lumotlari
  const [storeName, setStoreName] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [directorPhone, setDirectorPhone] = useState('+998 ');
  const [customPassword, setCustomPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2-Qadam: Savdo tizimi (24+ sohalar)
  const [selectedIndustryId, setSelectedIndustryId] = useState('clothing');
  const [searchIndustry, setSearchIndustry] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Hammasi');

  // 3-Qadam: Xodimlar soni
  const [selectedStaffTier, setSelectedStaffTier] = useState('0-5');

  // 4-Qadam: Yaratilgan shaxsiy login va parol
  const [generatedLoginId, setGeneratedLoginId] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [copiedLogin, setCopiedLogin] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  // Login rejimi maydonlari
  const [loginInputId, setLoginInputId] = useState('');
  const [loginInputPass, setLoginInputPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Step 1 xatolar
  const [step1Error, setStep1Error] = useState('');

  // Avtomatik parol generatsiya funksiyasi
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `svd-${res}`;
  };

  // Do'kon nomidan Login ID yasash
  const generateLoginIdFromName = (name) => {
    const clean = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    return clean ? `${clean}_${rand}` : `shop_${rand}`;
  };

  // Phone input formati (+998...)
  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ';
    }
    setDirectorPhone(val);
  };

  // 1-Qadamdan 2-Qadamga o'tish
  const handleNextFromStep1 = (e) => {
    if (e) e.preventDefault();
    if (!storeName.trim() || storeName.trim().length < 2) {
      setStep1Error('Iltimos, do\'koningiz nomini to\'liq kiriting!');
      return;
    }
    if (!directorName.trim() || directorName.trim().length < 2) {
      setStep1Error('Iltimos, direktor (rahbar) ism-sharifini kiriting!');
      return;
    }
    setStep1Error('');
    setStep(2);
  };

  // 2-Qadamdan 3-Qadamga o'tish
  const handleNextFromStep2 = () => {
    if (!selectedIndustryId) {
      return;
    }
    setStep(3);
  };

  // 3-Qadamdan 4-Qadamga o'tish (Tizimni sozlash va hisob yaratish)
  const handleFinishOnboarding = () => {
    setIsConfiguring(true);
    setStep(4);

    const loginId = generateLoginIdFromName(storeName);
    const pass = customPassword.trim() || generateRandomPassword();

    setGeneratedLoginId(loginId);
    setGeneratedPassword(pass);

    // 1.4 soniyalik yuklanish animatsiyasi
    setTimeout(() => {
      setIsConfiguring(false);

      // Confetti portlashi
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }, 1400);
  };

  // Nusxalash
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'login') {
      setCopiedLogin(true);
      setTimeout(() => setCopiedLogin(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  // Tizimga kirishni yakunlash
  const handleStartPlatform = () => {
    const sessionData = {
      storeName: storeName.trim(),
      directorName: directorName.trim(),
      phone: directorPhone.trim(),
      loginId: generatedLoginId,
      password: generatedPassword,
      industryId: selectedIndustryId,
      staffTier: selectedStaffTier,
      createdAt: new Date().toISOString()
    };

    // Ro'yxatdan o'tgan do'konlar bazasiga qo'shish
    try {
      const savedStores = JSON.parse(localStorage.getItem('savdo_registered_stores') || '[]');
      savedStores.push(sessionData);
      localStorage.setItem('savdo_registered_stores', JSON.stringify(savedStores));
      localStorage.setItem('savdo_current_session', JSON.stringify(sessionData));
    } catch {}

    if (onCompleteOnboarding) {
      onCompleteOnboarding(sessionData);
    }
  };

  // Login shakli orqali kirish
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginInputId.trim() || !loginInputPass.trim()) {
      setLoginError('Login va parolni kiriting!');
      return;
    }

    try {
      const savedStores = JSON.parse(localStorage.getItem('savdo_registered_stores') || '[]');
      
      // Tekshiramiz: loginId, telefon yoki dokon nomi orqali
      const found = savedStores.find(s => 
        (s.loginId === loginInputId.trim() || 
         s.phone?.replace(/\s+/g, '') === loginInputId.trim().replace(/\s+/g, '') ||
         s.storeName?.toLowerCase() === loginInputId.trim().toLowerCase()) &&
        s.password === loginInputPass.trim()
      );

      if (found) {
        localStorage.setItem('savdo_current_session', JSON.stringify(found));
        if (onLoginSuccess) {
          onLoginSuccess(found);
        }
      } else {
        // Agar demo / sinov kirishi bo'lsa
        if (loginInputPass.trim().length >= 4) {
          const quickSession = {
            storeName: loginInputId.trim(),
            directorName: 'Do\'kon Rahbari',
            phone: '+998 90 000 00 00',
            loginId: loginInputId.trim(),
            password: loginInputPass.trim(),
            industryId: 'universal',
            staffTier: '0-5',
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('savdo_current_session', JSON.stringify(quickSession));
          if (onLoginSuccess) {
            onLoginSuccess(quickSession);
          }
        } else {
          setLoginError('Login yoki parol noto\'g\'ri! Qayta tekshiring.');
        }
      }
    } catch {
      setLoginError('Tizimga kirishda xatolik yuz berdi.');
    }
  };

  // 24 ta sohani qidirish va guruhlash
  const filteredIndustries = STORE_INDUSTRIES.filter(ind => {
    const matchesGroup = selectedGroup === 'Hammasi' || ind.group === selectedGroup;
    const matchesSearch = ind.name.toLowerCase().includes(searchIndustry.toLowerCase()) ||
                          ind.shortName.toLowerCase().includes(searchIndustry.toLowerCase()) ||
                          ind.subTitle.toLowerCase().includes(searchIndustry.toLowerCase()) ||
                          ind.categories.some(c => c.toLowerCase().includes(searchIndustry.toLowerCase()));
    return matchesGroup && matchesSearch;
  });

  const activeIndustry = STORE_INDUSTRIES.find(i => i.id === selectedIndustryId) || STORE_INDUSTRIES[0];
  const activeStaffInfo = STAFF_COUNT_OPTIONS.find(s => s.id === selectedStaffTier) || STAFF_COUNT_OPTIONS[0];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal-card">

        {/* Top Header Banner */}
        <div className="onboarding-top-bar">
          <div className="onboarding-logo-badge">
            <span className="onboarding-logo-emoji">⚡</span>
            <div className="onboarding-logo-text">
              <span className="onboarding-brand-title">SAVDO PRO ERP</span>
              <span className="onboarding-brand-sub">Universal Savdo Avtomatlashtirish Tizimi</span>
            </div>
          </div>

          <div className="onboarding-mode-switch">
            {authMode === 'onboarding' ? (
              <button 
                type="button"
                className="mode-toggle-btn"
                onClick={() => setAuthMode('login')}
              >
                <LogIn size={15} />
                <span>Menda akkaunt bor (Kirish)</span>
              </button>
            ) : (
              <button 
                type="button"
                className="mode-toggle-btn"
                onClick={() => setAuthMode('onboarding')}
              >
                <Store size={15} />
                <span>Yangi do'kon ochish</span>
              </button>
            )}
          </div>
        </div>

        {/* ======================= REJIM 1: LOGIN ======================= */}
        {authMode === 'login' ? (
          <div className="onboarding-content-box animate-fadeIn">
            <div className="auth-login-container">
              <div className="auth-login-icon-wrap">
                <KeyRound size={36} color="var(--primary)" />
              </div>
              <h2 className="auth-title">Do'kon Tizimiga Kirish</h2>
              <p className="auth-sub">
                Do'koningizning shaxsiy Login ID (yoki telefon raqami) va parolini kiriting
              </p>

              {loginError && (
                <div className="auth-error-banner animate-shake">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-field-group">
                  <label className="field-label">Login ID yoki Telefon raqam:</label>
                  <div className="input-with-icon">
                    <User size={18} className="field-icon" />
                    <input 
                      type="text" 
                      className="styled-auth-input" 
                      placeholder="Masalan: terra_pro_101 yoki +99890..."
                      value={loginInputId}
                      onChange={(e) => setLoginInputId(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label className="field-label">Shaxsiy Parol:</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="field-icon" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="styled-auth-input" 
                      placeholder="Parolingizni kiriting"
                      value={loginInputPass}
                      onChange={(e) => setLoginInputPass(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="primary-action-btn pulse-glow">
                  <span>Tizimga Kirish</span>
                  <ArrowRight size={18} />
                </button>

                <div className="auth-footer-prompt">
                  <span>Hali do'kon ochmadingizmi?</span>
                  <button 
                    type="button" 
                    className="link-btn"
                    onClick={() => {
                      setAuthMode('onboarding');
                      setStep(1);
                    }}
                  >
                    Yangi do'kon ochish (Onboarding)
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* ======================= REJIM 2: ONBOARDING WIZARD ======================= */
          <div className="onboarding-wizard-container">
            {/* Step Indicators */}
            <div className="steps-indicator-bar">
              <div className={`step-node ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
                <div className="step-number">{step > 1 ? <Check size={14} /> : '1'}</div>
                <span className="step-text">Do'kon Nomi</span>
              </div>
              <div className={`step-connector ${step >= 2 ? 'filled' : ''}`} />

              <div className={`step-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>
                <div className="step-number">{step > 2 ? <Check size={14} /> : '2'}</div>
                <span className="step-text">Savdo Tizimi (20+)</span>
              </div>
              <div className={`step-connector ${step >= 3 ? 'filled' : ''}`} />

              <div className={`step-node ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>
                <div className="step-number">{step > 3 ? <Check size={14} /> : '3'}</div>
                <span className="step-text">Xodimlar Soni</span>
              </div>
              <div className={`step-connector ${step >= 4 ? 'filled' : ''}`} />

              <div className={`step-node ${step >= 4 ? 'completed' : ''} ${step === 4 ? 'active' : ''}`}>
                <div className="step-number">4</div>
                <span className="step-text">Login & Parol</span>
              </div>
            </div>

            {/* ----------------- STEP 1: DO'KON NOMI VA MA'LUMOTLAR ----------------- */}
            {step === 1 && (
              <div className="wizard-step-body animate-slideUp">
                <div className="step-title-row">
                  <div className="step-badge-tag">1-Bosqich</div>
                  <h2 className="step-main-title">Do'koningiz nomini kiriting</h2>
                  <p className="step-description">
                    Tizim savdo cheklari, tovarlar ro'yxati va hisobotlarni ushbu nom bilan shakllantiradi
                  </p>
                </div>

                {step1Error && (
                  <div className="auth-error-banner animate-shake">
                    {step1Error}
                  </div>
                )}

                <div className="step-form-grid">
                  <div className="step-inputs-column">
                    <div className="form-field-group">
                      <label className="field-label">
                        <Store size={15} color="var(--primary)" />
                        <span>Do'kon nomi: *</span>
                      </label>
                      <input 
                        type="text" 
                        className="styled-auth-input huge-input"
                        placeholder="Masalan: Terra Pro, Makon Market, Safari Parfum..."
                        value={storeName}
                        onChange={(e) => {
                          setStoreName(e.target.value);
                          if (step1Error) setStep1Error('');
                        }}
                        autoFocus
                      />
                      <span className="input-hint">Kassa chekida va peshtoqda ko'rinadigan rasmiy nom</span>
                    </div>

                    <div className="form-inputs-subgrid">
                      <div className="form-field-group">
                        <label className="field-label">
                          <User size={15} color="var(--gold)" />
                          <span>Direktor (Rahbar) Ismi: *</span>
                        </label>
                        <input 
                          type="text" 
                          className="styled-auth-input"
                          placeholder="Masalan: Sardor Rustamov"
                          value={directorName}
                          onChange={(e) => {
                            setDirectorName(e.target.value);
                            if (step1Error) setStep1Error('');
                          }}
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">
                          <Phone size={15} color="var(--success)" />
                          <span>Telefon raqami:</span>
                        </label>
                        <input 
                          type="text" 
                          className="styled-auth-input"
                          placeholder="+998 90 123 45 67"
                          value={directorPhone}
                          onChange={handlePhoneChange}
                        />
                      </div>
                    </div>

                    <div className="form-field-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="field-label">
                          <Lock size={15} color="var(--info)" />
                          <span>Shaxsiy Parol (ixtiyoriy):</span>
                        </label>
                        <button 
                          type="button" 
                          className="quick-generate-btn"
                          onClick={() => setCustomPassword(generateRandomPassword())}
                        >
                          <RefreshCw size={13} />
                          <span>Avtomatik Parol</span>
                        </button>
                      </div>
                      <div className="input-with-icon">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          className="styled-auth-input"
                          placeholder="Bo'sh qoldirsangiz, avtomatik yaratiladi"
                          value={customPassword}
                          onChange={(e) => setCustomPassword(e.target.value)}
                        />
                        <button 
                          type="button" 
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Live Animated Store Badge Preview */}
                  <div className="step-preview-column">
                    <div className="store-live-card">
                      <div className="card-shine" />
                      <div className="live-card-header">
                        <span className="live-status-dot" />
                        <span className="live-status-text">DO'KON IDENTIFIKATORI</span>
                      </div>
                      
                      <div className="live-card-body">
                        <div className="live-card-avatar">
                          {storeName.trim() ? storeName.trim().charAt(0).toUpperCase() : '🏪'}
                        </div>
                        <h3 className="live-card-name">
                          {storeName.trim() || 'Do\'koningiz Nomi'}
                        </h3>
                        <p className="live-card-director">
                          Rahbar: {directorName.trim() || 'Direktor'}
                        </p>
                        <div className="live-card-pill">
                          <ShieldCheck size={14} color="var(--success)" />
                          <span>Rasmiy Savdo Platformasi</span>
                        </div>
                      </div>

                      <div className="live-card-footer">
                        <span>Tel: {directorPhone || '+998 -- --- -- --'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="step-actions-row">
                  <div />
                  <button 
                    type="button" 
                    className="primary-action-btn glow-purple"
                    onClick={handleNextFromStep1}
                  >
                    <span>Davom etish (Sohani tanlash)</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- STEP 2: SAVDO TIZIMI TANLOVI (24+ SOHALAR) ----------------- */}
            {step === 2 && (
              <div className="wizard-step-body animate-slideUp">
                <div className="step-title-row">
                  <div className="step-badge-tag">2-Bosqich: Soha va Profil</div>
                  <h2 className="step-main-title">
                    Do'koningizni qaysi tizim orqali yurgazmoqchisiz?
                  </h2>
                  <p className="step-description">
                    20+ dan ortiq savdo sohalaridan birini tanlang. Tizim o'sha sohaga mos o'lchov birliklari, 
                    parametrlar (razmer, ml, kg, muddati, kafolat) va kategoriyalarni avtomatik sozlaydi.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="industry-search-filter-bar">
                  <div className="industry-search-box">
                    <Search size={17} color="var(--text-sub)" />
                    <input 
                      type="text" 
                      placeholder="Sohani qidiring (kiyim, dorixona, supermarket, atir, go'sht, texnika...)"
                      value={searchIndustry}
                      onChange={(e) => setSearchIndustry(e.target.value)}
                    />
                    {searchIndustry && (
                      <button 
                        type="button" 
                        className="clear-search-btn"
                        onClick={() => setSearchIndustry('')}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Group Tabs */}
                  <div className="industry-group-tabs">
                    {INDUSTRY_GROUPS.map(grp => (
                      <button
                        key={grp}
                        type="button"
                        className={`group-tab-btn ${selectedGroup === grp ? 'active' : ''}`}
                        onClick={() => setSelectedGroup(grp)}
                      >
                        {grp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 24+ Industry Cards Grid */}
                <div className="industries-cards-grid">
                  {filteredIndustries.map(ind => {
                    const isSelected = selectedIndustryId === ind.id;
                    return (
                      <div
                        key={ind.id}
                        className={`industry-select-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedIndustryId(ind.id)}
                        style={{
                          '--ind-color': ind.color,
                          borderColor: isSelected ? ind.color : 'var(--border-light)'
                        }}
                      >
                        {isSelected && (
                          <div className="selected-badge" style={{ background: ind.color }}>
                            <Check size={13} color="#fff" strokeWidth={3} />
                          </div>
                        )}

                        <div className="ind-card-top">
                          <span className="ind-card-emoji">{ind.emoji}</span>
                          <span className="ind-group-tag">{ind.group}</span>
                        </div>

                        <div className="ind-card-body">
                          <h4 className="ind-card-title">{ind.name}</h4>
                          <p className="ind-card-sub">{ind.subTitle}</p>
                        </div>

                        <div className="ind-card-features">
                          {ind.features.slice(0, 2).map((feat, idx) => (
                            <span key={idx} className="ind-feature-chip">
                              • {feat}
                            </span>
                          ))}
                        </div>

                        <div className="ind-card-bottom">
                          <span className="ind-unit-badge">Birlik: <b>{ind.unit}</b></span>
                          <span className="ind-select-label" style={{ color: isSelected ? ind.color : 'var(--text-sub)' }}>
                            {isSelected ? 'Tanlandi ✓' : 'Tanlash'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Summary Strip */}
                <div className="selected-industry-summary">
                  <div className="summary-left">
                    <span className="summary-emoji">{activeIndustry.emoji}</span>
                    <div>
                      <div className="summary-title">
                        Tanlangan tizim: <strong>{activeIndustry.name}</strong>
                      </div>
                      <span className="summary-desc">
                        Standart o'lchov: <b>{activeIndustry.unit}</b> | Kategoriyalar soni: {activeIndustry.categories.length} ta
                      </span>
                    </div>
                  </div>

                  <div className="summary-features-list">
                    {activeIndustry.features.map((f, i) => (
                      <span key={i} className="active-feat-badge">✓ {f}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="step-actions-row">
                  <button 
                    type="button" 
                    className="secondary-action-btn"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft size={18} />
                    <span>Orqaga</span>
                  </button>

                  <button 
                    type="button" 
                    className="primary-action-btn glow-purple"
                    onClick={handleNextFromStep2}
                  >
                    <span>Keyingi (Xodimlar soni)</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- STEP 3: XODIMLAR SONI TANLOVI ----------------- */}
            {step === 3 && (
              <div className="wizard-step-body animate-slideUp">
                <div className="step-title-row">
                  <div className="step-badge-tag">3-Bosqich: Jamoa Ko'lami</div>
                  <h2 className="step-main-title">Do'koningizda necha kishi ishlaydi?</h2>
                  <p className="step-description">
                    Xodimlar soniga qarab tizim smenalar, sotuvchilar hisoboti, kassa punktlari va rollarni optimallashtiradi
                  </p>
                </div>

                <div className="staff-tiers-grid">
                  {STAFF_COUNT_OPTIONS.map(opt => {
                    const isSelected = selectedStaffTier === opt.id;
                    return (
                      <div
                        key={opt.id}
                        className={`staff-tier-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedStaffTier(opt.id)}
                      >
                        <div className="tier-card-header">
                          <span className="tier-card-icon">{opt.icon}</span>
                          <span className="tier-card-badge">{opt.badge}</span>
                        </div>

                        <h3 className="tier-card-label">{opt.label}</h3>
                        <p className="tier-card-desc">{opt.desc}</p>

                        <div className="tier-roles-box">
                          <div className="tier-roles-title">Tavsiya etiladigan rollar:</div>
                          <div className="tier-roles-chips">
                            {opt.recommendedRoles.map((r, i) => (
                              <span key={i} className="tier-role-pill">{r}</span>
                            ))}
                          </div>
                        </div>

                        <div className="tier-check-indicator">
                          {isSelected ? (
                            <span className="tier-checked-text">Tanlandi <Check size={16} /></span>
                          ) : (
                            <span className="tier-unchecked-text">Tanlash</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Final Confirmation Banner */}
                <div className="onboarding-final-recap-box">
                  <div className="recap-item">
                    <span className="recap-label">Do'kon:</span>
                    <strong className="recap-val">{storeName}</strong>
                  </div>
                  <div className="recap-item">
                    <span className="recap-label">Soha:</span>
                    <strong className="recap-val">{activeIndustry.emoji} {activeIndustry.name}</strong>
                  </div>
                  <div className="recap-item">
                    <span className="recap-label">Jamoa:</span>
                    <strong className="recap-val">{activeStaffInfo.label} ({activeStaffInfo.badge})</strong>
                  </div>
                  <div className="recap-item">
                    <span className="recap-label">Rahbar:</span>
                    <strong className="recap-val">{directorName}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="step-actions-row">
                  <button 
                    type="button" 
                    className="secondary-action-btn"
                    onClick={() => setStep(2)}
                  >
                    <ChevronLeft size={18} />
                    <span>Orqaga</span>
                  </button>

                  <button 
                    type="button" 
                    className="primary-action-btn pulse-glow"
                    onClick={handleFinishOnboarding}
                  >
                    <Zap size={18} />
                    <span>Tizimni Yaratish va Shaxsiy Login Olish</span>
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- STEP 4: TIZIM YARATILDI & LOGIN/PAROL TAQDIMOTI ----------------- */}
            {step === 4 && (
              <div className="wizard-step-body animate-slideUp">
                {isConfiguring ? (
                  <div className="configuring-state-box">
                    <div className="configuring-spinner" />
                    <h3 className="configuring-title">Do'koningiz Tizimi Sozlanmoqda...</h3>
                    <p className="configuring-sub">
                      "{storeName}" uchun {activeIndustry.name} profili va xavfsiz shaxsiy hisob ochilmoqda
                    </p>

                    <div className="configuring-steps-list">
                      <div className="config-step-item done">
                        <CheckCircle2 size={16} color="var(--success)" />
                        <span>Do'kon ma'lumotlari bazaga kiritildi</span>
                      </div>
                      <div className="config-step-item done">
                        <CheckCircle2 size={16} color="var(--success)" />
                        <span>{activeIndustry.categories.length} ta sohaga oid kategoriyalar yuklandi</span>
                      </div>
                      <div className="config-step-item done">
                        <CheckCircle2 size={16} color="var(--success)" />
                        <span>Kassa POS va Omborxona parametrlari moslashtirildi</span>
                      </div>
                      <div className="config-step-item pulse">
                        <KeyRound size={16} color="var(--gold)" />
                        <span>Shaxsiy Login ID va Parol shakllantirilmoqda...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="credentials-success-box animate-scaleIn">
                    <div className="success-confetti-badge">
                      <Sparkles size={32} color="var(--gold)" />
                    </div>

                    <h2 className="success-heading">
                      Tabriklaymiz! Do'koningiz Muvaffaqiyatli Ishga Tushirildi!
                    </h2>
                    <p className="success-subheading">
                      "{storeName}" uchun <b>{activeIndustry.name}</b> tizimi to'liq tayyor. 
                      Quyidagi shaxsiy ma'lumotlarni saqlab oling — istalgan vaqtda tizimga kirish uchun kerak bo'ladi.
                    </p>

                    {/* Official Credentials Card */}
                    <div className="official-credentials-card">
                      <div className="credentials-card-header">
                        <div className="cred-brand">
                          <span className="cred-emoji">{activeIndustry.emoji}</span>
                          <div>
                            <h4>{storeName}</h4>
                            <span>{activeIndustry.shortName} • {activeStaffInfo.label}</span>
                          </div>
                        </div>
                        <span className="cred-verified-badge">
                          <ShieldCheck size={14} /> Tizim Faol
                        </span>
                      </div>

                      <div className="credentials-fields-list">
                        {/* Login ID Row */}
                        <div className="cred-field-row">
                          <div className="cred-field-info">
                            <span className="cred-field-label">SHAXSIY LOGIN ID:</span>
                            <span className="cred-field-value">{generatedLoginId}</span>
                          </div>
                          <button 
                            type="button" 
                            className={`copy-cred-btn ${copiedLogin ? 'copied' : ''}`}
                            onClick={() => copyToClipboard(generatedLoginId, 'login')}
                            title="Loginni nusxalash"
                          >
                            {copiedLogin ? (
                              <>
                                <Check size={15} color="var(--success)" />
                                <span>Nusxalandi!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={15} />
                                <span>Nusxalash</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Password Row */}
                        <div className="cred-field-row">
                          <div className="cred-field-info">
                            <span className="cred-field-label">MAXFIY PAROL:</span>
                            <span className="cred-field-value password-font">
                              {showPassword ? generatedPassword : '••••••••••••'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              type="button" 
                              className="icon-only-cred-btn"
                              onClick={() => setShowPassword(!showPassword)}
                              title={showPassword ? "Yashirish" : "Ko'rsatish"}
                            >
                              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                            <button 
                              type="button" 
                              className={`copy-cred-btn ${copiedPass ? 'copied' : ''}`}
                              onClick={() => copyToClipboard(generatedPassword, 'pass')}
                              title="Parolni nusxalash"
                            >
                              {copiedPass ? (
                                <>
                                  <Check size={15} color="var(--success)" />
                                  <span>Nusxalandi!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={15} />
                                  <span>Nusxalash</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="credentials-card-footer">
                        <div className="cred-director-meta">
                          <span>Direktor: <b>{directorName}</b></span>
                          <span>Tel: <b>{directorPhone}</b></span>
                        </div>
                        <span className="cred-warning-note">
                          ⚠️ Ushbu login va parolni eslab qoling yoki yozib oling!
                        </span>
                      </div>
                    </div>

                    {/* Launch Platform Button */}
                    <div className="launch-platform-action">
                      <button 
                        type="button" 
                        className="launch-btn pulse-glow"
                        onClick={handleStartPlatform}
                      >
                        <Zap size={22} />
                        <span>Tizimga Kirish va Savdoni Boshlash</span>
                        <ArrowRight size={22} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
