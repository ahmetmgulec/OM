import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './SessionExpiredScreen.css';

interface SessionExpiredScreenProps {
  errorMessage?: string;
  onSignInAgain: () => void;
}

export function SessionExpiredScreen({ errorMessage, onSignInAgain }: SessionExpiredScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="app-container session-expired-container">
      <div className="session-expired-card">
        <div className="session-expired-icon" aria-hidden>⚠️</div>
        <h1 className="session-expired-title">{t('auth.sessionExpired') ?? 'Session expired'}</h1>
        <p className="session-expired-message">
          {errorMessage ?? (t('auth.sessionExpiredHint') ?? 'Please sign in again to continue.')}
        </p>
        <button
          type="button"
          className="session-expired-btn"
          onClick={onSignInAgain}
        >
          {t('auth.signInAgain') ?? 'Sign in again'}
        </button>
      </div>
    </div>
  );
}
