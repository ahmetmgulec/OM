import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './CreateChannelModal.css';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string) => void;
}

export function CreateChannelModal({ isOpen, onClose, onCreate }: CreateChannelModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), description.trim() || undefined);
      setName('');
      setDescription('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t('channels.createChannel')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="channel-name">{t('channels.channelName')}</label>
            <input
              id="channel-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. general"
              required
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <label htmlFor="channel-description">{t('channels.channelDescription')}</label>
            <textarea
              id="channel-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this channel about?"
              rows={3}
              maxLength={500}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              {t('channels.cancel')}
            </button>
            <button type="submit" disabled={!name.trim()}>
              {t('channels.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
