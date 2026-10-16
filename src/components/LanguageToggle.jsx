import React from 'react';
import { useLang } from '../context/LanguageContext';

export default function LanguageToggle({ compact = false }) {
  const { lang, setLang } = useLang();

  const toggleLanguage = () => {
    setLang(lang === 'uz' ? 'ru' : 'uz');
  };

  return (
    <div className="language-toggle-wrapper">
      {/* Mobile Single Flag Button (Super compact, saves header space on phones) */}
      <button
        type="button"
        onClick={toggleLanguage}
        className="lang-toggle-mobile-btn"
        title={lang === 'uz' ? "Русский язык (нажмите для переключения)" : "O'zbek tili (o'tish uchun bosing)"}
        aria-label="Tilni o'zgartirish / Сменить язык"
      >
        <span className="lang-flag-emoji">{lang === 'uz' ? '🇷🇺' : '🇺🇿'}</span>
      </button>

      {/* Desktop Dual Switcher */}
      <div className="lang-toggle-desktop-group">
        <button
          type="button"
          onClick={() => setLang('uz')}
          className={`lang-pill-btn ${lang === 'uz' ? 'active' : ''}`}
          title="O'zbek tili"
        >
          <span>🇺🇿</span>
          <span>O'ZB</span>
        </button>

        <button
          type="button"
          onClick={() => setLang('ru')}
          className={`lang-pill-btn ${lang === 'ru' ? 'active' : ''}`}
          title="Русский язык"
        >
          <span>🇷🇺</span>
          <span>РУС</span>
        </button>
      </div>
    </div>
  );
}
