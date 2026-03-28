import React from 'react';
import { MicOff, VolumeX } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Avatar } from './Avatar';
import './Sidebar.css';

interface Channel {
  id: bigint;
  name: string;
  description?: string;
  type?: string; // 'text' | 'voice'
}

interface VoiceParticipant {
  identity: import('spacetimedb').Identity;
  name?: string;
  avatar?: string;
  isSpeaking?: boolean;
  muted?: boolean;
  deafened?: boolean;
}

interface SidebarProps {
  channels: Channel[];
  selectedChannelId: bigint | null;
  onSelectChannel: (channelId: bigint) => void;
  onSelectVoiceChannel: (channelId: bigint) => void;
  onCreateChannel: () => void;
  voiceControls?: React.ReactNode;
  voiceChannelParticipants?: Map<bigint, VoiceParticipant[]>;
  unreadCountByChannel?: Map<string, number>;
}

export function Sidebar({ channels, selectedChannelId, onSelectChannel, onSelectVoiceChannel, onCreateChannel, voiceControls, voiceChannelParticipants, unreadCountByChannel }: SidebarProps) {
  const { t } = useLanguage();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>{t('sidebar.channels')}</h2>
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
          <>
            {(() => {
              const textChannels = channels.filter(c => !c.type || c.type === 'text');
              const voiceChannels = channels.filter(c => c.type === 'voice');
              return (
                <>
                  {textChannels.length > 0 && (
                    <div className="sidebar-section">
                      <div className="sidebar-section-header">{t('sidebar.textChannels')}</div>
                      {textChannels.map((channel) => {
                        const unread = unreadCountByChannel?.get(channel.id.toString()) ?? 0;
                        return (
                          <div
                            key={`text-${channel.id.toString()}`}
                            className={`channel-item ${selectedChannelId === channel.id ? 'active' : ''}`}
                            onClick={() => onSelectChannel(channel.id)}
                          >
                            <span className="channel-icon">#</span>
                            <span className="channel-name">{channel.name}</span>
                            {unread > 0 && <span className="channel-unread-badge">{unread > 99 ? '99+' : unread}</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {voiceChannels.length > 0 && (
                    <div className="sidebar-section">
                      <div className="sidebar-section-header">{t('sidebar.voiceChannels')}</div>
                      {voiceChannels.map((channel) => {
                        const participants = voiceChannelParticipants?.get(channel.id) ?? [];
                        return (
                          <div key={`voice-${channel.id.toString()}`} className="channel-with-participants">
                            <div
                              className={`channel-item channel-item-voice ${selectedChannelId === channel.id ? 'active' : ''}`}
                              onClick={() => onSelectVoiceChannel(channel.id)}
                            >
                              <span className="channel-icon">🔊</span>
                              <span className="channel-name">{channel.name}</span>
                              {(unreadCountByChannel?.get(channel.id.toString()) ?? 0) > 0 && (
                                <span className="channel-unread-badge">{(unreadCountByChannel!.get(channel.id.toString()) ?? 0) > 99 ? '99+' : unreadCountByChannel!.get(channel.id.toString())}</span>
                              )}
                            </div>
                            {participants.length > 0 && (
                              <div className="channel-participants">
                                {participants.map((p) => (
                                  <div key={p.identity.toHexString()} className="channel-participant">
                                    <div
                                      className={`channel-participant-avatar-wrap ${p.isSpeaking ? 'speaking' : ''}`}
                                      aria-hidden
                                    >
                                      <Avatar
                                        avatarUrl={p.avatar}
                                        name={p.name}
                                        size={22}
                                        className="channel-participant-avatar"
                                      />
                                    </div>
                                    <span className="participant-name">
                                      <span className="participant-name-text">
                                        {p.name?.trim() || t('common.anonymous')}
                                      </span>
                                      {p.muted && (
                                        <span className="participant-voice-badge" title={t('voice.mutedInVoice')} aria-label={t('voice.mutedInVoice')}>
                                          <MicOff size={12} strokeWidth={2.5} aria-hidden />
                                        </span>
                                      )}
                                      {p.deafened && (
                                        <span className="participant-voice-badge participant-voice-badge-deafen" title={t('voice.deafenedInVoice')} aria-label={t('voice.deafenedInVoice')}>
                                          <VolumeX size={12} strokeWidth={2.5} aria-hidden />
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </div>
      {voiceControls && (
        <div className="sidebar-voice-controls">
          {voiceControls}
        </div>
      )}
    </div>
  );
}
