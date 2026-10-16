import React from 'react';
import { useLang } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle({ compact = false }) {
  const { lang, setLang } = useLang();

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: '#f1f5f9',
      padding: '2px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      userSelect: 'none'
    }}>
      <button
        type="button"
        onClick={() => setLang('uz')}
        style={{
          background: lang === 'uz' ? '#ffffff' : 'transparent',
          color: lang === 'uz' ? '#0f172a' : '#64748b',
          border: 'none',
          borderRadius: '8px',
          padding: compact ? '4px 8px' : '5px 10px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: lang === 'uz' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
        title="O'zbek tili"
      >
        <span>🇺🇿</span>
        <span>O'ZB</span>
      </button>

      <button
        type="button"
        onClick={() => setLang('ru')}
        style={{
          background: lang === 'ru' ? '#ffffff' : 'transparent',
          color: lang === 'ru' ? '#0f172a' : '#64748b',
          border: 'none',
          borderRadius: '8px',
          padding: compact ? '4px 8px' : '5px 10px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: lang === 'ru' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
        title="Русский язык"
      >
        <span>🇷🇺</span>
        <span>РУС</span>
      </button>
    </div>
  );
}
