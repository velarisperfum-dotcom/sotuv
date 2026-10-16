import React, { useState } from 'react';
import { Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import ThemeControlModal from './ThemeControlModal';

export default function ThemeToggleButton() {
  const { resolvedTheme } = useTheme();
  const { lang } = useLang();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: '#0f172a',
          border: '1px solid #334155',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          transition: 'all 0.15s ease',
          padding: 0,
          flexShrink: 0
        }}
        title={lang === 'ru' ? 'Настройки темы и яркости' : 'Yorug\'lik va mavzu sozlamalari'}
      >
        <Sun size={19} color="#ffffff" strokeWidth={2.2} />
      </button>

      <ThemeControlModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
