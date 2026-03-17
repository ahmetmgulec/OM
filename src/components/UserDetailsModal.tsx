import React from 'react';
import { Identity } from 'spacetimedb';
import { useLanguage } from '../contexts/LanguageContext';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { Avatar } from './Avatar';
import './AddUserToChannelModal.css';
import './UserDetailsModal.css';

interface UserDetailsUser {
  identity: Identity;
  name?: string;
  online: boolean;
  avatar?: string;
  lastIpAddress?: string;
  lastSeenAt?: { microsSinceUnixEpoch: bigint };
  authMethod?: string;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetailsUser | null;
  isAdmin: boolean;
  onKick?: (userId: Identity) => Promise<void>;
  canKick?: boolean;
  isCurrentUser?: boolean;
}

function formatTimestamp(ts: { microsSinceUnixEpoch: bigint } | undefined): string {
  if (!ts) return '';
  const ms = Number(ts.microsSinceUnixEpoch / 1000n);
  const date = new Date(ms);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays === 0) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) {
    return date.toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays < 7) {
    return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  }
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function UserDetailsModal({
  isOpen,
  onClose,
  user,
  isAdmin,
  onKick,
  canKick,
  isCurrentUser,
}: UserDetailsModalProps) {
  const { t } = useLanguage();
  useEscapeKey(onClose, isOpen);

  if (!isOpen || !user) return null;

  const displayName = user.name?.trim() || t('common.anonymous');

  const handleKick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onKick || !canKick || isCurrentUser) return;
    if (confirm(t('common.kickConfirm'))) {
      try {
        await onKick(user.identity);
        onClose();
      } catch (err: unknown) {
        alert((err as Error)?.message || t('users.kickFailed'));
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('users.detailsTitle')}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body user-details-body">
          <div className="user-details-avatar-row">
            <Avatar avatarUrl={user.avatar} name={user.name} size={80} />
            <div className="user-details-header-text">
              <h3 className="user-details-name">{displayName}</h3>
              <span className={`user-details-status ${user.online ? 'online' : 'offline'}`}>
                {user.online ? t('common.online') : t('common.offline')}
              </span>
            </div>
          </div>

          <div className="user-details-info">
            {!user.online && user.lastSeenAt && (
              <div className="user-details-row">
                <span className="user-details-label">{t('users.lastLogin')}</span>
                <span className="user-details-value">{formatTimestamp(user.lastSeenAt)}</span>
              </div>
            )}
            {user.authMethod && (
              <div className="user-details-row">
                <span className="user-details-label">{t('users.authMethod')}</span>
                <span className="user-details-value">
                  {user.authMethod === 'spacetimeauth' ? 'SpacetimeAuth' : user.authMethod}
                </span>
              </div>
            )}
            {isAdmin && (
              <div className="user-details-row">
                <span className="user-details-label">{t('common.ipAddress')}</span>
                <span className="user-details-value user-details-value-mono">
                  {user.lastIpAddress || t('common.ipNotSet')}
                </span>
              </div>
            )}
          </div>

          {canKick && !isCurrentUser && onKick && (
            <div className="user-details-actions">
              <button
                type="button"
                className="modal-button kick"
                onClick={handleKick}
                title={t('common.kickUser')}
              >
                {t('common.kick')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
