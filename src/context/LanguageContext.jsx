import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('savdo_lang');
      return saved === 'ru' ? 'ru' : 'uz';
    } catch {
      return 'uz';
    }
  });

  const setLang = (newLang) => {
    const valid = newLang === 'ru' ? 'ru' : 'uz';
    setLangState(valid);
    try {
      localStorage.setItem('savdo_lang', valid);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key, fallback = '') => {
    return translations[lang]?.[key] ?? translations['uz']?.[key] ?? fallback ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRu: lang === 'ru' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: 'uz',
      setLang: () => {},
      t: (key, fallback = '') => translations['uz']?.[key] ?? fallback ?? key,
      isRu: false
    };
  }
  return ctx;
}
