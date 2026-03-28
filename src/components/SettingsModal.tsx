import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from 'react-oidc-context';
import { useLanguage } from '../contexts/LanguageContext';
import { ProfilePictureWithEdit } from './ProfilePictureWithEdit';
import { useEscapeKey } from '../hooks/useEscapeKey';
import './CreateChannelModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayName: string;
  avatarUrl?: string;
  googlePictureUrl?: string | null;
  onSubmitProfile: (name: string, avatarUrl: string) => void | Promise<void>;
  onEditAvatar?: () => void;
  onLogout: () => void;
  onOpenRoles?: () => void;
  showRolesButton?: boolean;
}

export function SettingsModal({
  isOpen,
  onClose,
  displayName,
  avatarUrl = '',
  onSubmitProfile,
  onEditAvatar,
  onLogout,
  onOpenRoles,
  showRolesButton,
}: SettingsModalProps) {
  const [name, setName] = useState(displayName);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [accessTokenRemaining, setAccessTokenRemaining] = useState<string | null>(null);
  const auth = useAuth();
  const { t } = useLanguage();

  const expiresAtSec = auth.user?.expires_at;

  const formatRemaining = useMemo(
    () => (expiresAt: number) => {
      const now = Date.now() / 1000;
      const sec = Math.max(0, Math.floor(expiresAt - now));
      if (sec <= 0) return '—';
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      if (m >= 60) {
        const h = Math.floor(m / 60);
        const mm = m % 60;
        return `${h}h ${mm}m`;
      }
      if (m > 0) return `${m}m ${s}s`;
      return `${s}s`;
    },
    []
  );

  useEffect(() => {
    if (!isOpen || expiresAtSec === undefined) {
      setAccessTokenRemaining(null);
      return;
    }
    const tick = () => setAccessTokenRemaining(formatRemaining(expiresAtSec));
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, [isOpen, expiresAtSec, formatRemaining]);

  useEffect(() => {
    if (isOpen) {
      setName(displayName);
      setError(null);
    }
  }, [isOpen, displayName]);

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t('errors.displayNameEmpty'));
      setSaving(false);
      return;
    }
    if (trimmedName.length > 32) {
      setError(t('errors.displayNameTooLong'));
      setSaving(false);
      return;
    }
    try {
      await onSubmitProfile(trimmedName, avatarUrl ?? '');
      onClose();
    } catch {
      setError(t('errors.setNameFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('profile.title')}</h2>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="settings-avatar-wrapper">
          <ProfilePictureWithEdit
            avatarUrl={avatarUrl}
            name={name}
            size={64}
            className="settings-avatar"
            onEditClick={onEditAvatar}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="display-name">{t('settings.displayName')}</label>
            <input
              id="display-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
              placeholder={t('profile.namePlaceholder')}
            />
          </div>
          {error && <div className="modal-error">{error}</div>}
          <div className="form-actions">
            <button type="submit" disabled={saving || !name.trim()}>
              {saving ? t('profile.saving') : t('settings.save')}
            </button>
          </div>
        </form>
        {expiresAtSec !== undefined && accessTokenRemaining !== null && (
          <div
            className="settings-session-info"
            style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #4f545c', fontSize: '13px', color: '#b9bbbe' }}
          >
            <div>
              <strong style={{ color: '#dcddde' }}>{t('settings.accessTokenExpires')}:</strong>{' '}
              {accessTokenRemaining}
            </div>
            <p style={{ margin: '8px 0 0', lineHeight: 1.4 }}>{t('settings.accessTokenExpiresHint')}</p>
          </div>
        )}
        {expiresAtSec === undefined && isOpen && auth.isAuthenticated && (
          <p style={{ marginTop: '16px', fontSize: '13px', color: '#b9bbbe' }}>{t('settings.accessTokenUnknown')}</p>
        )}
        {showRolesButton && onOpenRoles && (
          <div className="form-actions" style={{ marginTop: '16px', borderTop: '1px solid #4f545c', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRoles();
              }}
              style={{ background: '#43b581', color: '#fff' }}
            >
              {t('common.roles')}
            </button>
          </div>
        )}
        <div className="form-actions" style={{ marginTop: showRolesButton && onOpenRoles ? '12px' : '16px', borderTop: '1px solid #4f545c', paddingTop: '16px' }}>
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
