import React from 'react';
import { Avatar } from './Avatar';
import { useLanguage } from '../contexts/LanguageContext';
import './ProfilePictureWithEdit.css';

interface ProfilePictureWithEditProps {
  avatarUrl?: string | null;
  name: string;
  size?: number;
  className?: string;
  onEditClick?: () => void;
}

export function ProfilePictureWithEdit({
  avatarUrl,
  name,
  size = 64,
  className = '',
  onEditClick,
}: ProfilePictureWithEditProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`profile-picture-with-edit ${className}`}
      style={{ width: size, height: size }}
    >
      <Avatar avatarUrl={avatarUrl || undefined} name={name} size={size} className="profile-picture-avatar" />
      {onEditClick && (
        <button
          type="button"
          className="profile-picture-edit-overlay"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick();
          }}
          aria-label={t('profile.editPhoto')}
        >
          <span className="profile-picture-edit-icon">✏️</span>
          <span className="profile-picture-edit-label">{t('profile.editPhoto')}</span>
        </button>
      )}
    </div>
  );
}
