import React, { useState, useMemo, useRef } from 'react';
import { useTable } from 'spacetimedb/react';
import { tables } from '../module_bindings';
import { useLanguage } from '../contexts/LanguageContext';
import { WaveformDisplay } from './WaveformDisplay';
import './VoiceRecordings.css';

interface VoiceRecordingsProps {
  channelId: bigint;
  canListen: boolean; // Only admins can listen (ADMIN permission)
}

const CHUNK_DURATION_SEC = 3;
const WAVEFORM_BAR_COUNT = 120;

/** Downsample captured samples to waveform bars */
function samplesToBars(samples: number[]): number[] {
  const length = samples.length;
  if (length === 0) return [];
  const blockSize = Math.max(1, Math.floor(length / WAVEFORM_BAR_COUNT));
  const bars: number[] = [];
  for (let i = 0; i < WAVEFORM_BAR_COUNT; i++) {
    const start = i * blockSize;
    let sum = 0;
    for (let j = 0; j < blockSize && start + j < length; j++) {
      sum += samples[start + j];
    }
    const avg = blockSize > 0 ? sum / blockSize : 0;
    bars.push(Math.max(3 / 24, Math.min(1, avg * 4)));
  }
  return bars;
}

/** Groups chunks by roomId and sorts by chunkIndex for playback */
async function buildRecordingFromChunksAsync(
  chunks: Array<{ roomId: bigint; chunkIndex: bigint; dataBase64?: string; data_base_64?: string; createdAt?: { toDate: () => Date } }>
): Promise<Blob | null> {
  if (chunks.length === 0) return null;
  const sorted = [...chunks].sort((a, b) => Number(a.chunkIndex - b.chunkIndex));
  // Dedupe by chunkIndex: if effect re-ran, we may have 0,0,1,1,2,3; keep the one with earliest createdAt (earlier session)
  const byIndex = new Map<number, (typeof chunks)[0]>();
  for (const c of sorted) {
    const idx = Number(c.chunkIndex);
    const existing = byIndex.get(idx);
    const cTime = c.createdAt?.toDate?.()?.getTime?.() ?? 0;
    const exTime = existing?.createdAt?.toDate?.()?.getTime?.() ?? Infinity;
    if (!existing || cTime < exTime) byIndex.set(idx, c);
  }
  const deduped = [...byIndex.entries()].sort((a, b) => a[0] - b[0]).map(([, c]) => c);
  const getData = (c: (typeof deduped)[0]) => {
    const raw = (typeof c === 'object' && c !== null) ? { ...c } as Record<string, unknown> : {};
    let s = String(raw.dataBase64 ?? raw.data_base_64 ?? raw['dataBase64'] ?? raw['data_base_64'] ?? '');
    if (!s && typeof c === 'object') {
      for (const k of Object.keys(c)) {
        if (k.toLowerCase().includes('data') && typeof (c as Record<string, unknown>)[k] === 'string') {
          s = String((c as Record<string, unknown>)[k]);
          break;
        }
      }
    }
    return s;
  };
  const chunkLengths = deduped.map((c, i) => ({ idx: i, chunkIdx: Number(c.chunkIndex), len: getData(c).length }));
  const totalLen = chunkLengths.reduce((s, x) => s + x.len, 0);
  if (import.meta.env.DEV) console.log('[VoiceRecordings] Chunk data lengths:', chunkLengths, 'total=', totalLen);
  const emptyCount = chunkLengths.filter((x) => x.len === 0).length;
  if (emptyCount > 0) {
    console.warn('[VoiceRecordings]', emptyCount, 'chunks have no data - check SpacetimeDB subscription. Keys on first chunk:', deduped[0] ? Object.keys(deduped[0] as object) : []);
  }
  // Join ALL chunks in order - do not filter; empty chunks become '' but preserve chunk sequence
  const base64 = deduped
    .map(getData)
    .join('')
    .replace(/\s/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/'); // URL-safe base64 → standard
  if (!base64) return null;
  // Strip invalid chars; keep only chars with exact base64 ASCII codes (handles Unicode lookalikes)
  const strictAscii = base64.split('')
    .filter((c) => {
      const code = c.charCodeAt(0);
      return (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || (code >= 48 && code <= 57) || code === 43 || code === 47;
    })
    .join('');
  // Decode each storage chunk separately, then merge binary - avoids boundary issues when slicing concatenated base64
  const parts: Uint8Array[] = [];
  for (let i = 0; i < deduped.length; i++) {
    let chunkBase64 = getData(deduped[i]).replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
    if (!chunkBase64) continue;
    const clean = chunkBase64.split('').filter((c) => {
      const code = c.charCodeAt(0);
      return (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || (code >= 48 && code <= 57) || code === 43 || code === 47;
    }).join('');
    const pad = (4 - (clean.length % 4)) % 4;
    const paddedChunk = clean + '='.repeat(pad);
    try {
      const binary = atob(paddedChunk);
      const arr = new Uint8Array(binary.length);
      for (let j = 0; j < binary.length; j++) arr[j] = binary.charCodeAt(j) & 0xff;
      parts.push(arr);
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[VoiceRecordings] Failed to decode chunk', i, e);
    }
  }
  if (parts.length === 0) return null;
  const totalBytesLen = parts.reduce((s, a) => s + a.length, 0);
  const bytes = new Uint8Array(totalBytesLen);
  let offset = 0;
  for (const p of parts) {
    bytes.set(p, offset);
    offset += p.length;
  }
  const blob = new Blob([bytes], { type: 'audio/webm;codecs=opus' });
  return blob.size > 0 ? blob : null;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatDuration(chunkCount: number): string {
  const sec = chunkCount * CHUNK_DURATION_SEC;
  if (sec < 60) return `~${sec}s`;
  const mins = Math.floor(sec / 60);
  const remainderSec = sec % 60;
  if (mins < 60) return remainderSec > 0 ? `~${mins}m ${remainderSec}s` : `~${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainderMins = mins % 60;
  return remainderMins > 0 ? `~${hours}h ${remainderMins}m` : `~${hours}h`;
}

export function VoiceRecordings({ channelId, canListen }: VoiceRecordingsProps) {
  const { t } = useLanguage();
  if (!canListen) return null;

  const [chunks] = useTable(tables.voiceRecordingChunk);
  const [playingRoomId, setPlayingRoomId] = useState<bigint | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [waveformCache, setWaveformCache] = useState<Record<string, number[]>>({});
  const [expanded, setExpanded] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  type Chunk = (typeof chunks)[number];
  const recordings = useMemo(() => {
    const chId = BigInt(channelId);
    const byChannel = chunks.filter((c) => BigInt(c.channelId) === chId);
    const byRoom = new Map<string, Chunk[]>();
    for (const c of byChannel) {
      const key = c.roomId.toString();
      const existing = byRoom.get(key);
      byRoom.set(key, existing ? [...existing, c] : [c]);
    }
    return [...byRoom.entries()]
      .map(([roomId, roomChunks]) => {
        const sorted = [...roomChunks].sort((a, b) => Number(a.chunkIndex - b.chunkIndex));
        const createdAt = sorted[0]?.createdAt;
        return {
          roomId: BigInt(roomId),
          chunks: sorted,
          createdAt,
        };
      })
      .sort((a, b) => {
        const aT = a.createdAt?.toDate().getTime() ?? 0;
        const bT = b.createdAt?.toDate().getTime() ?? 0;
        return bT - aT;
      });
  }, [chunks, channelId]);

  const getChunkData = (c: Chunk) =>
    (c as { dataBase64?: string; data_base_64?: string }).dataBase64 ??
    (c as { data_base_64?: string }).data_base_64 ??
    '';

  const handlePlay = async (roomId: bigint, roomChunks: Array<(typeof chunks)[number]>) => {
    setPlaybackError(null);
    const prev = audioRef.current;
    if (prev) {
      prev.pause();
      prev.currentTime = 0;
      audioRef.current = null;
    }
    const blob = await buildRecordingFromChunksAsync(roomChunks);
    if (!blob || blob.size === 0) {
      const totalLen = roomChunks.reduce((s, c) => s + getChunkData(c).length, 0);
      const sample = getChunkData(roomChunks[0] ?? {}).slice(0, 60);
      console.warn('[VoiceRecordings] Empty blob: chunks=', roomChunks.length, 'totalBase64Len=', totalLen, 'sample=', sample);
      setPlaybackError(t('voiceRecordings.errorEmpty'));
      return;
    }
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    const roomKey = roomId.toString();

    // Capture waveform during playback via AudioWorkletNode (replaces deprecated ScriptProcessorNode)
    const captureSamples: number[] = [];
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const workletUrl = new URL('/waveform-processor.js', window.location.origin).href;
    try {
      await ctx.audioWorklet.addModule(workletUrl);
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[VoiceRecordings] AudioWorklet addModule failed, waveform capture disabled', err);
      // Continue playback without waveform capture
    }
    const source = ctx.createMediaElementSource(audio);
    let workletNode: AudioWorkletNode | null = null;
    try {
      workletNode = new AudioWorkletNode(ctx, 'waveform-capture-processor');
      workletNode.port.onmessage = (e) => {
        if (e.data?.type === 'samples' && Array.isArray(e.data.data)) {
          captureSamples.push(...e.data.data);
        }
      };
    } catch {
      workletNode = null;
    }
    if (workletNode) {
      source.connect(workletNode);
      workletNode.connect(ctx.destination);
    } else {
      source.connect(ctx.destination);
    }

    audioRef.current = audio;
    setPlayingRoomId(roomId);
    setPlaybackProgress(0);
    audio.ontimeupdate = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setPlaybackProgress(audio.currentTime / audio.duration);
      }
    };
    audio.onended = () => {
      workletNode?.disconnect();
      source.disconnect();
      ctx.close();
      if (captureSamples.length > 0) {
        setWaveformCache((prev) => ({ ...prev, [roomKey]: samplesToBars(captureSamples) }));
      }
      audioRef.current = null;
      setPlaybackProgress(0);
      URL.revokeObjectURL(url);
      setPlayingRoomId(null);
    };
    audio.onerror = () => {
      workletNode?.disconnect();
      source.disconnect();
      ctx.close();
      audioRef.current = null;
      setPlaybackProgress(0);
      setPlaybackError(t('voiceRecordings.errorPlayback'));
      URL.revokeObjectURL(url);
      setPlayingRoomId(null);
    };
    audio.play().catch(() => {
      setPlaybackError(t('voiceRecordings.errorStart'));
      setPlayingRoomId(null);
    });
  };

  const handleDownload = async (roomId: bigint, roomChunks: Array<(typeof chunks)[number]>, createdAt?: { toDate: () => Date } | undefined) => {
    const blob = await buildRecordingFromChunksAsync(roomChunks);
    if (!blob || blob.size === 0) {
      setPlaybackError(t('voiceRecordings.errorEmpty'));
      return;
    }
    const date = createdAt?.toDate();
    const dateStr = date ? date.toISOString().slice(0, 19).replace(/[:T]/g, '-') : roomId.toString();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${dateStr}.webm`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  if (recordings.length === 0) return null;

  return (
    <div className={`voice-recordings ${!expanded ? 'collapsed' : ''}`}>
      <button
        type="button"
        className="voice-recordings-header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-label={expanded ? t('voiceRecordings.collapse') : t('voiceRecordings.expand')}
      >
        <span className="voice-recordings-icon-header">🎙️</span>
        <h4 className="voice-recordings-title">{t('voiceRecordings.title')}</h4>
        <span className="voice-recordings-count">{recordings.length}</span>
        <span className="voice-recordings-chevron" aria-hidden>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </span>
      </button>
      {expanded && (
        <>
          {playbackError && (
            <div className="voice-recordings-error">
              <span className="voice-recordings-error-icon">⚠</span>
              {playbackError}
            </div>
          )}
          <div className="voice-recordings-list">
        {recordings.map(({ roomId, chunks: roomChunks, createdAt }) => {
          const isPlaying = playingRoomId === roomId;
          const date = createdAt?.toDate();
          const dateStr = date ? date.toLocaleString() : '';
          const relativeStr = date ? formatRelativeTime(date) : '';
          const durationStr = formatDuration(roomChunks.length);

          return (
            <div key={roomId.toString()} className={`voice-recordings-item ${isPlaying ? 'playing' : ''}`}>
              <button
                type="button"
                className="voice-recordings-play"
                onClick={() => handlePlay(roomId, roomChunks)}
                title={isPlaying ? t('voiceRecordings.playing') : t('voiceRecordings.listen')}
                aria-label={isPlaying ? t('voiceRecordings.playing') : t('voiceRecordings.listen')}
              >
                {isPlaying ? (
                  <svg className="voice-recordings-btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="voice-recordings-btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <div
                className="voice-recordings-waveform-wrap"
                onClick={() => handlePlay(roomId, roomChunks)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handlePlay(roomId, roomChunks)}
                aria-label={t('voiceRecordings.listen')}
              >
                <WaveformDisplay
                  chunks={roomChunks.map((c) => ({ chunkIndex: c.chunkIndex, dataBase64: getChunkData(c) }))}
                  isPlaying={isPlaying}
                  progress={isPlaying ? playbackProgress : undefined}
                  precomputedWaveform={waveformCache[roomId.toString()]}
                />
              </div>
              <div className="voice-recordings-info">
                <span className="voice-recordings-date" title={dateStr}>
                  {relativeStr}
                </span>
                <span className="voice-recordings-meta">
                  {durationStr}
                  {isPlaying && <span className="voice-recordings-badge">{t('voiceRecordings.playing')}</span>}
                </span>
              </div>
              <button
                type="button"
                className="voice-recordings-download"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(roomId, roomChunks, createdAt);
                }}
                title={t('voiceRecordings.download')}
                aria-label={t('voiceRecordings.download')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" />
                </svg>
              </button>
            </div>
          );
        })}
          </div>
        </>
      )}
    </div>
  );
}
