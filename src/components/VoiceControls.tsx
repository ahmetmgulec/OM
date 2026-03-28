import React, { useState, useId } from 'react';
import { Mic, MicOff, Headphones, VolumeX, PhoneOff, Signal, X, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { VoiceConnectionStatus } from '../hooks/useVoiceChat';
import {
  MAX_MIC_SEND_GAIN_PERCENT,
  MIN_MIC_SEND_GAIN_PERCENT,
  MAX_INCOMING_VOICE_VOLUME_PERCENT,
  MIN_INCOMING_VOICE_VOLUME_PERCENT,
} from '../config/voiceSettings';
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
  micSendGainPercent: number;
  onMicSendGainPercentChange: (percent: number) => void;
  incomingVoiceVolumePercent: number;
  onIncomingVoiceVolumePercentChange: (percent: number) => void;
}

export function VoiceControls({
  isConnected,
  isMuted,
  isDeafened,
  connectionStatus,
  onLeave,
  onToggleMute,
  onToggleDeafen,
  micSendGainPercent,
  onMicSendGainPercentChange,
  incomingVoiceVolumePercent,
  onIncomingVoiceVolumePercentChange,
}: VoiceControlsProps) {
  const { t } = useLanguage();
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);
  const settingsPanelId = useId();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="voice-controls">
      <div className="voice-controls-row voice-controls-row-main">
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
            disabled={isDeafened}
            title={isDeafened ? t('voice.muteDisabledWhileDeafenedTitle') : isMuted ? t('voice.unmuteTitle') : t('voice.muteTitle')}
            aria-label={isDeafened ? t('voice.muteDisabledWhileDeafenedTitle') : isMuted ? t('voice.unmute') : t('voice.mute')}
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
            className={`voice-btn ${voiceSettingsOpen ? 'voice-settings-active' : ''}`}
            onClick={() => setVoiceSettingsOpen((o) => !o)}
            title={t('voice.voiceSettingsButtonTitle')}
            aria-label={t('voice.voiceSettingsButtonTitle')}
            aria-expanded={voiceSettingsOpen}
            aria-controls={voiceSettingsOpen ? settingsPanelId : undefined}
          >
            <Settings size={18} strokeWidth={2} aria-hidden />
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

      {voiceSettingsOpen && (
      <div
        id={settingsPanelId}
        className="voice-controls-settings"
        role="dialog"
        aria-modal="true"
        aria-label={t('voice.voiceSettingsGroup')}
      >
        <div className="voice-controls-settings-header">
          <span className="voice-controls-settings-title">{t('voice.voiceSettingsGroup')}</span>
          <button
            type="button"
            className="voice-controls-settings-close"
            onClick={() => setVoiceSettingsOpen(false)}
            aria-label={t('voice.closeVoiceSettings')}
          >
            <X size={16} strokeWidth={2.5} aria-hidden />
          </button>
        </div>
        <div className="voice-control-slider-block">
          <div className="voice-control-slider-label-row">
            <label htmlFor="mic-send-gain">{t('voice.micSendVolume')}</label>
            <span className="voice-control-slider-value" aria-hidden>
              {micSendGainPercent}%
            </span>
          </div>
          <div className="voice-control-slider-row">
            <span className="voice-control-slider-end">{t('voice.micSendQuieter')}</span>
            <input
              id="mic-send-gain"
              type="range"
              min={MIN_MIC_SEND_GAIN_PERCENT}
              max={MAX_MIC_SEND_GAIN_PERCENT}
              value={micSendGainPercent}
              onChange={(e) => onMicSendGainPercentChange(Number(e.target.value))}
              className="voice-control-range"
            />
            <span className="voice-control-slider-end">{t('voice.micSendLouder')}</span>
          </div>
          <p className="voice-control-hint">{t('voice.micSendVolumeHint')}</p>
        </div>

        <div className="voice-control-slider-block">
          <div className="voice-control-slider-label-row">
            <label htmlFor="incoming-voice-volume">{t('voice.incomingVolume')}</label>
            <span className="voice-control-slider-value" aria-hidden>
              {incomingVoiceVolumePercent}%
            </span>
          </div>
          <div className="voice-control-slider-row">
            <span className="voice-control-slider-end">0%</span>
            <input
              id="incoming-voice-volume"
              type="range"
              min={MIN_INCOMING_VOICE_VOLUME_PERCENT}
              max={MAX_INCOMING_VOICE_VOLUME_PERCENT}
              value={incomingVoiceVolumePercent}
              onChange={(e) => onIncomingVoiceVolumePercentChange(Number(e.target.value))}
              className="voice-control-range"
            />
            <span className="voice-control-slider-end">100%</span>
          </div>
          <p className="voice-control-hint">{t('voice.incomingVolumeHint')}</p>
        </div>
      </div>
      )}
    </div>
  );
}
