/** Outgoing mic gain sent to peers (Web Audio GainNode), stored as percent of unity gain. */
export const MIC_SEND_GAIN_STORAGE_KEY = 'mic_send_gain_percent_v1';

export const DEFAULT_MIC_SEND_GAIN_PERCENT = 100;
export const MIN_MIC_SEND_GAIN_PERCENT = 50;
export const MAX_MIC_SEND_GAIN_PERCENT = 200;

export function readMicSendGainPercent(): number {
  if (typeof localStorage === 'undefined') return DEFAULT_MIC_SEND_GAIN_PERCENT;
  const raw = localStorage.getItem(MIC_SEND_GAIN_STORAGE_KEY);
  if (raw === null) return DEFAULT_MIC_SEND_GAIN_PERCENT;
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_MIC_SEND_GAIN_PERCENT;
  return Math.min(
    MAX_MIC_SEND_GAIN_PERCENT,
    Math.max(MIN_MIC_SEND_GAIN_PERCENT, Math.round(n))
  );
}

export function writeMicSendGainPercent(percent: number): void {
  if (typeof localStorage === 'undefined') return;
  const clamped = Math.min(
    MAX_MIC_SEND_GAIN_PERCENT,
    Math.max(MIN_MIC_SEND_GAIN_PERCENT, Math.round(percent))
  );
  localStorage.setItem(MIC_SEND_GAIN_STORAGE_KEY, String(clamped));
}

/** Remote / incoming voice playback level (HTMLAudioElement.volume). */
export const INCOMING_VOICE_VOLUME_STORAGE_KEY = 'incoming_voice_volume_v1';

export const DEFAULT_INCOMING_VOICE_VOLUME_PERCENT = 100;
export const MIN_INCOMING_VOICE_VOLUME_PERCENT = 0;
export const MAX_INCOMING_VOICE_VOLUME_PERCENT = 100;

/** Returns 0–1 for `HTMLAudioElement.volume`. */
export function readIncomingVoiceVolume(): number {
  if (typeof localStorage === 'undefined') return 1;
  const raw = localStorage.getItem(INCOMING_VOICE_VOLUME_STORAGE_KEY);
  if (raw === null) return 1;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 1;
  const pct = Math.min(
    MAX_INCOMING_VOICE_VOLUME_PERCENT,
    Math.max(MIN_INCOMING_VOICE_VOLUME_PERCENT, Math.round(n))
  );
  return pct / 100;
}

export function writeIncomingVoiceVolumePercent(percent: number): void {
  if (typeof localStorage === 'undefined') return;
  const clamped = Math.min(
    MAX_INCOMING_VOICE_VOLUME_PERCENT,
    Math.max(MIN_INCOMING_VOICE_VOLUME_PERCENT, Math.round(percent))
  );
  localStorage.setItem(INCOMING_VOICE_VOLUME_STORAGE_KEY, String(clamped));
}
