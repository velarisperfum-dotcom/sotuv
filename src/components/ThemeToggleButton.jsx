import React, { useState } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import ThemeControlModal from './ThemeControlModal';

export default function ThemeToggleButton() {
  const { themeMode, resolvedTheme } = useTheme();
  const { lang } = useLang();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          background: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
          border: `1px solid ${resolvedTheme === 'dark' ? '#334155' : '#cbd5e1'}`,
          borderRadius: '10px',
          padding: '7px 11px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: resolvedTheme === 'dark' ? '#f8fafc' : '#334155',
          fontSize: '12px',
          fontWeight: 700,
          transition: 'all 0.15s ease'
        }}
        title={lang === 'ru' ? 'Настройки темы и яркости' : 'Yorug\'lik va mavzu sozlamalari'}
      >
        {themeMode === 'light' && <Sun size={15} color="#eab308" />}
        {themeMode === 'dark' && <Moon size={15} color="#60a5fa" />}
        {themeMode === 'auto' && <Sparkles size={15} color="#d97706" />}
        <span style={{ fontSize: '11px', fontWeight: 800 }}>
          {themeMode === 'auto' ? (lang === 'ru' ? 'Авто' : 'Avto') : (themeMode === 'light' ? (lang === 'ru' ? 'Свет' : 'Yorug\'') : (lang === 'ru' ? 'Тьма' : 'Tun'))}
        </span>
      </button>

      <ThemeControlModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
