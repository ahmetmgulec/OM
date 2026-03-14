import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Sidebar.css';

interface Channel {
  id: bigint;
  name: string;
  description?: string;
}

interface SidebarProps {
  channels: Channel[];
  selectedChannelId: bigint | null;
  onSelectChannel: (channelId: bigint) => void;
  onCreateChannel: () => void;
}

export function Sidebar({ channels, selectedChannelId, onSelectChannel, onCreateChannel }: SidebarProps) {
  const { t } = useLanguage();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>{t('common.selectChannel')}</h2>
        <button
          className="create-channel-btn"
          onClick={onCreateChannel}
          title={t('channels.createChannel')}
        >
          +
        </button>
      </div>
      <div className="channel-list">
        {channels.length === 0 ? (
          <div className="no-channels-message">
            <p>{t('common.noChannels')}</p>
            <p style={{ fontSize: '12px', color: '#72767d', marginTop: '8px' }}>
              {t('common.createFirstChannel')}
            </p>
          </div>
        ) : (
          channels.map((channel) => (
            <div
              key={channel.id.toString()}
              className={`channel-item ${selectedChannelId === channel.id ? 'active' : ''}`}
              onClick={() => onSelectChannel(channel.id)}
            >
              <span className="channel-icon">#</span>
              <span className="channel-name">{channel.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
