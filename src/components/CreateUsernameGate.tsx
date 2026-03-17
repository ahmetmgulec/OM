import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './CreateUsernameGate.css';

interface CreateUsernameGateProps {
  onSubmit: (name: string) => Promise<void>;
  error?: string;
}

export function CreateUsernameGate({ onSubmit, error }: CreateUsernameGateProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setLocalError(t('errors.displayNameEmpty'));
      return;
    }
    if (trimmed.length > 32) {
      setLocalError(t('errors.displayNameTooLong'));
      return;
    }
    setLocalError(null);
    setSubmitting(true);
    try {
      await onSubmit(trimmed);
    } catch (err) {
      setLocalError(t('errors.setNameFailed') + ' ' + ((err as Error)?.message || ''));
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="app-container">
      <div className="create-username-gate">
        <div className="create-username-card">
          <h1 className="create-username-title">{t('auth.createUsername') ?? 'Choose a username'}</h1>
          <p className="create-username-hint">
            {t('auth.createUsernameHint') ?? 'Your username will be shown to other users.'}
          </p>
          <form onSubmit={handleSubmit} className="create-username-form">
            <div className="form-group">
              <label htmlFor="username-input">{t('auth.usernamePlaceholder') ?? 'Username'}</label>
              <input
                id="username-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('auth.usernamePlaceholder') ?? 'Username'}
                maxLength={32}
                autoFocus
                disabled={submitting}
                className="create-username-input"
              />
            </div>
            {displayError && (
              <p className="create-username-error">{displayError}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="create-username-submit"
            >
              {submitting ? (t('auth.creating') ?? 'Creating...') : (t('auth.createUsernameButton') ?? 'Continue')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
