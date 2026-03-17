import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Avatar } from './Avatar';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { imageToDataUrl } from '../utils/imageToDataUrl';
import './EditAvatarModal.css';

interface EditAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl?: string;
  displayName: string;
  googlePictureUrl?: string | null;
  onSave: (avatarUrl: string) => void | Promise<void>;
}

export function EditAvatarModal({
  isOpen,
  onClose,
  avatarUrl = '',
  displayName,
  googlePictureUrl,
  onSave,
}: EditAvatarModalProps) {
  const [avatar, setAvatar] = useState(avatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setAvatar(avatarUrl ?? '');
      setError(null);
    }
  }, [isOpen, avatarUrl]);

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  const handleUseGooglePhoto = () => {
    if (googlePictureUrl?.trim()) {
      const url = googlePictureUrl.includes('=') ? googlePictureUrl : `${googlePictureUrl.replace(/\?.*$/, '')}?sz=128`;
      setAvatar(url);
      setError(null);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(t('profile.uploadImageType'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t('profile.uploadImageTooBig'));
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const url = await imageToDataUrl(file);
      setAvatar(url);
    } catch {
      setError(t('profile.uploadFailed'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    setError(null);
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    const trimmedAvatar = avatar.trim();
    if (trimmedAvatar) {
      if (trimmedAvatar.startsWith('data:image/')) {
        if (trimmedAvatar.length > 150_000) {
          setError(t('profile.avatarTooLarge'));
          setSaving(false);
          return;
        }
      } else if (trimmedAvatar.length > 500) {
        setError(t('profile.avatarUrlTooLong'));
        setSaving(false);
        return;
      }
    }
    try {
      await onSave(trimmedAvatar);
      onClose();
    } catch {
      setError(t('errors.setNameFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-avatar-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('profile.profilePicture')}</h2>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="edit-avatar-preview">
          <Avatar avatarUrl={avatar || undefined} name={displayName} size={96} className="edit-avatar-img" />
        </div>
        <div className="edit-avatar-actions">
          {googlePictureUrl?.trim() && (
            <button
              type="button"
              className="edit-avatar-btn edit-avatar-btn--secondary"
              onClick={handleUseGooglePhoto}
              disabled={uploading}
            >
              {t('profile.useGooglePhoto')}
            </button>
          )}
          <button
            type="button"
            className="edit-avatar-btn edit-avatar-btn--primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? t('profile.uploading') : t('profile.uploadImage')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="edit-avatar-file-input"
            onChange={handleFileSelect}
            aria-hidden
          />
          {avatar && (
            <button
              type="button"
              className="edit-avatar-btn edit-avatar-btn--danger"
              onClick={handleRemovePhoto}
              disabled={uploading}
            >
              {t('profile.removePhoto')}
            </button>
          )}
        </div>
        {error && <div className="modal-error">{error}</div>}
        <div className="edit-avatar-footer">
          <button type="button" className="edit-avatar-btn edit-avatar-btn--ghost" onClick={onClose}>
            {t('channels.cancel')}
          </button>
          <button
            type="button"
            className="edit-avatar-btn edit-avatar-btn--save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? t('profile.saving') : t('settings.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
