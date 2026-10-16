import React, { useState } from 'react';
import { 
  Lock, User, ArrowRight, ShieldCheck, Building2, 
  Smartphone, Eye, EyeOff, AlertCircle, HelpCircle,
  X, MessageSquare, Phone, Server, CheckCircle2
} from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useLang } from '../context/LanguageContext';
import { SYSTEM_USERS } from '../data/initialData';

export default function AuthLoginView({ users = [], onLoginSuccess, onOpenPwaModal }) {
  const { t } = useLang();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleFormLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const rawUser = username.trim().toLowerCase();
    const rawPass = String(password).trim();

    // Map common role aliases for extreme ease of use
    const normalizeUser = (name) => {
      const u = (name || '').toLowerCase().trim();
      if (u === 'skladchi' || u === 'ombor' || u === 'omborchi') return 'sklad';
      if (u === 'director') return 'direktor';
      if (u === 'bux' || u === 'accountant') return 'buxgalter';
      if (u === 'seller' || u === 'agent') return 'sotuvchi';
      return u;
    };

    const targetUser = normalizeUser(rawUser);

    // Combine prop users and initial fallback users
    const userPool = [...(Array.isArray(users) ? users : []), ...SYSTEM_USERS];

    const found = userPool.find(u => {
      const normalizedCurrent = normalizeUser(u.username);
      const passMatches = String(u.password).trim() === rawPass || String(u.password) === String(password);
      return (normalizedCurrent === targetUser || (u.username && u.username.toLowerCase().trim() === rawUser)) && passMatches;
    });

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (found) {
        onLoginSuccess(found);
      } else {
        setErrorMsg(t('loginError'));
      }
    }, 200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{
        maxWidth: '430px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
        padding: '36px 32px',
        position: 'relative'
      }}>
        {/* Language Switcher in top right of login card (no theme toggle here as requested) */}
        <div style={{ position: 'absolute', top: '18px', right: '18px' }}>
          <LanguageToggle compact={true} />
        </div>

        {/* Company / ERP Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px', marginTop: '10px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
          }}>
            <Building2 size={26} strokeWidth={2.2} />
          </div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
            {t('loginTitle')}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748b' }}>
            {t('loginSubtitle')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleFormLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '6px' }}>
              {t('usernameLabel')}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                required
                autoComplete="username"
                placeholder={t('usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  background: '#ffffff',
                  transition: 'border-color 0.15s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                {t('passwordLabel')}
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {t('forgotPassword')}
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                autoComplete="current-password"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  background: '#ffffff',
                  transition: 'border-color 0.15s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '13px',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              transition: 'background 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
          >
            {isSubmitting ? t('loggingIn') : t('loginButton')}
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </form>

        {/* iPhone & Android App install banner */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          <button
            type="button"
            onClick={onOpenPwaModal}
            style={{
              width: '100%',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '10px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Smartphone size={15} style={{ color: '#2563eb' }} />
            <span>{t('appForIosAndroid')}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '11px', color: '#94a3b8' }}>
            <ShieldCheck size={14} style={{ color: '#16a34a' }} />
            <span>{t('secureConnection')}</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HelpCircle size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  {t('forgotPasswordTitle')}
                </h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Instruction for Employees */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} style={{ color: '#2563eb' }} /> {t('forgotPasswordStaffHintTitle')}
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                {t('forgotPasswordStaffHint')}
              </p>
            </div>

            {/* Instruction for Director */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '14px', marginBottom: '18px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e40af', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Server size={15} style={{ color: '#2563eb' }} /> {t('forgotPasswordDirectorHintTitle')}
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#1e3a8a', lineHeight: '1.5' }}>
                {t('forgotPasswordDirectorHint')}
              </p>

              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #93c5fd', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <a 
                  href="https://t.me/LOGO_55" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', textDecoration: 'none', fontWeight: 700 }}
                >
                  <MessageSquare size={16} /> Telegram: <span style={{ textDecoration: 'underline' }}>@LOGO_55</span>
                </a>
                <a 
                  href="tel:+998937188885"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', textDecoration: 'none', fontWeight: 700 }}
                >
                  <Phone size={16} /> Telefon: <span style={{ textDecoration: 'underline' }}>+998 93 718 88 85</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              style={{
                width: '100%',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '11px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
