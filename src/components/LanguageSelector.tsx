import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSelector.css';

const LABELS: Record<string, string> = { en: 'EN', tr: 'TR' };

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const toggle = () => setLanguage(language === 'en' ? 'tr' : 'en');

  return (
    <button
      type="button"
      className="lang-btn lang-btn--active"
      onClick={toggle}
      title={language === 'en' ? 'English' : 'Türkçe'}
      aria-label={`Language: ${LABELS[language]}. Click to switch.`}
    >
      {LABELS[language]}
    </button>
  );
}
