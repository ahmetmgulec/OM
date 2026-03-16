import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './CreateChannelModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayName: string;
  onSubmitName: (name: string) => void | Promise<void>;
  onLogout: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  displayName,
  onSubmitName,
  onLogout,
}: SettingsModalProps) {
  const [name, setName] = useState(displayName);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setName(displayName);
    }
  }, [isOpen, displayName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    try {
      await onSubmitName(trimmedName);
      onClose();
    } catch {
      // Keep modal open on error so user can fix and retry
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t('settings.title')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="display-name">{t('settings.displayName')}</label>
            <input
              id="display-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              {t('channels.cancel')}
            </button>
            <button type="submit" disabled={!name.trim()}>
              {t('settings.save')}
            </button>
          </div>
        </form>
        <div className="form-actions" style={{ marginTop: '16px', borderTop: '1px solid #4f545c', paddingTop: '16px' }}>
          <button
            type="button"
            onClick={() => {
              onLogout();
            }}
            style={{ background: '#ed4245', color: '#fff' }}
          >
            {t('settings.logout')}
          </button>
        </div>
      </div>
    </div>
  );
}
