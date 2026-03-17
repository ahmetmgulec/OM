import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useEscapeKey } from '../hooks/useEscapeKey';
import './CreateChannelModal.css';

export type ChannelType = 'text' | 'voice';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string, type?: ChannelType) => void;
}

export function CreateChannelModal({ isOpen, onClose, onCreate }: CreateChannelModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [channelType, setChannelType] = useState<ChannelType>('text');
  const { t } = useLanguage();

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), description.trim() || undefined, channelType);
      setName('');
      setDescription('');
      setChannelType('text');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t('channels.createChannel')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('channels.channelType')}</label>
            <div className="channel-type-selector">
              <button
                type="button"
                className={`channel-type-btn ${channelType === 'text' ? 'active' : ''}`}
                onClick={() => setChannelType('text')}
              >
                <span className="channel-type-icon">#</span>
                {t('channels.channelTypeText')}
              </button>
              <button
                type="button"
                className={`channel-type-btn ${channelType === 'voice' ? 'active' : ''}`}
                onClick={() => setChannelType('voice')}
              >
                <span className="channel-type-icon">🔊</span>
                {t('channels.channelTypeVoice')}
              </button>
            </div>
          </div>
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
