import React, { useState, useMemo } from 'react';
import { Identity } from 'spacetimedb';
import { useLanguage } from '../contexts/LanguageContext';
import { useEscapeKey } from '../hooks/useEscapeKey';
import './AddUserToChannelModal.css';

interface User {
  identity: Identity;
  name?: string;
  online: boolean;
}

interface AddUserToChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (userId: Identity) => Promise<void>;
  users: User[];
  currentUserId: Identity;
  channelMembers: Array<{ userId: Identity; channelId: bigint }>;
  channelId: bigint;
}

export function AddUserToChannelModal({
  isOpen,
  onClose,
  onAdd,
  users,
  currentUserId,
  channelMembers,
  channelId,
}: AddUserToChannelModalProps) {
  const { t } = useLanguage();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter out users who are already members of this channel
  const availableUsers = useMemo(() => {
    const memberIds = new Set(
      channelMembers
        .filter(m => m.channelId === channelId)
        .map(m => m.userId.toHexString())
    );
    
    return users.filter(
      user => 
        !user.identity.isEqual(currentUserId) && 
        !memberIds.has(user.identity.toHexString())
    );
  }, [users, channelMembers, channelId, currentUserId]);

  const handleAdd = async () => {
    if (!selectedUserId) {
      setError('Lütfen bir kullanıcı seçin');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Find the user identity from the selected ID
      const user = users.find(u => u.identity.toHexString() === selectedUserId);
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      await onAdd(user.identity);
      setSelectedUserId(null);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Kullanıcı eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Kullanıcı Ekle</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          {availableUsers.length === 0 ? (
            <p className="no-users-message">
              Bu kanala eklenebilecek başka kullanıcı yok.
            </p>
          ) : (
            <>
              <label htmlFor="user-select">Kullanıcı seçin:</label>
              <select
                id="user-select"
                value={selectedUserId || ''}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={loading}
                className="user-select"
              >
                <option value="">-- Kullanıcı seçin --</option>
                {availableUsers.map((user) => (
                  <option key={user.identity.toHexString()} value={user.identity.toHexString()}>
                    {user.name?.trim() || t('common.anonymous')}
                    {user.online ? ' 🟢' : ' ⚫'}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="modal-button cancel"
            onClick={onClose}
            disabled={loading}
          >
            İptal
          </button>
          {availableUsers.length > 0 && (
            <button
              className="modal-button primary"
              onClick={handleAdd}
              disabled={loading || !selectedUserId}
            >
              {loading ? 'Ekleniyor...' : 'Ekle'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
