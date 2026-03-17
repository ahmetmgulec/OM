import React from 'react';
import { Mic, MicOff, Headphones, VolumeX, PhoneOff, Signal, X, Volume2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { VoiceConnectionStatus } from '../hooks/useVoiceChat';
import './VoiceControls.css';

/** Connection status: Lucide Signal (opacity by strength) and X for disconnected */
function ConnectionStatusIcon({ status }: { status: VoiceConnectionStatus }) {
  if (status === 'disconnected') {
    return <X size={12} strokeWidth={2.5} aria-hidden />;
  }
  const opacity = status === 'strong' ? 1 : status === 'connecting' ? 0.65 : 0.4;
  return <Signal size={12} strokeWidth={2.5} aria-hidden style={{ opacity }} />;
}

interface VoiceControlsProps {
  isConnected: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  connectionStatus: VoiceConnectionStatus;
  onLeave: () => void;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
}

export function VoiceControls({
  isConnected,
  isMuted,
  isDeafened,
  connectionStatus,
  onLeave,
  onToggleMute,
  onToggleDeafen,
}: VoiceControlsProps) {
  const { t } = useLanguage();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="voice-controls">
      <div className="voice-status">
        <span
          className={`voice-connection-status status-${connectionStatus}`}
          title={t(`voice.connection.${connectionStatus}`)}
          aria-label={t(`voice.connection.${connectionStatus}`)}
          role="img"
        >
          <ConnectionStatusIcon status={connectionStatus} />
        </span>
      </div>

      <div className="voice-buttons">
        <button
          type="button"
          className={`voice-btn ${isMuted ? 'muted' : ''}`}
          onClick={onToggleMute}
          title={isMuted ? t('voice.unmuteTitle') : t('voice.muteTitle')}
          aria-label={isMuted ? t('voice.unmute') : t('voice.mute')}
        >
          {isMuted ? <MicOff size={18} strokeWidth={2} aria-hidden /> : <Mic size={18} strokeWidth={2} aria-hidden />}
        </button>

        <button
          type="button"
          className={`voice-btn ${isDeafened ? 'deafened' : ''}`}
          onClick={onToggleDeafen}
          title={isDeafened ? t('voice.undeafenTitle') : t('voice.deafenTitle')}
          aria-label={isDeafened ? t('voice.undeafen') : t('voice.deafen')}
        >
          {isDeafened ? <VolumeX size={18} strokeWidth={2} aria-hidden /> : <Headphones size={18} strokeWidth={2} aria-hidden />}
        </button>

        <button
          type="button"
          className="voice-btn leave-btn"
          onClick={onLeave}
          title={t('voice.leaveTitle')}
          aria-label={t('voice.leave')}
        >
          <PhoneOff size={18} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}
