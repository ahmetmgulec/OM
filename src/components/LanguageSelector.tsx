import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSelector.css';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${language === 'tr' ? 'active' : ''}`}
        onClick={() => setLanguage('tr')}
        title="Türkçe"
      >
        🇹🇷 TR
      </button>
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
        title="English"
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
