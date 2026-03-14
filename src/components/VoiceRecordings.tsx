import React, { useState, useMemo } from 'react';
import { useTable } from 'spacetimedb/react';
import { tables } from '../module_bindings';
import './VoiceRecordings.css';

interface VoiceRecordingsProps {
  channelId: bigint;
  canListen: boolean; // Only admins can listen (ADMIN permission)
}

/** Groups chunks by roomId and sorts by chunkIndex for playback */
function buildRecordingFromChunks(chunks: { roomId: bigint; chunkIndex: bigint; dataBase64: string }[]) {
  if (chunks.length === 0) return null;
  const sorted = [...chunks].sort((a, b) => Number(a.chunkIndex - b.chunkIndex));
  const base64 = sorted.map((c) => c.dataBase64).join('');
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: 'audio/webm' });
  } catch {
    return null;
  }
}

export function VoiceRecordings({ channelId, canListen }: VoiceRecordingsProps) {
  if (!canListen) return null;
  const [chunks] = useTable(tables.voiceRecordingChunk);
  const [playingRoomId, setPlayingRoomId] = useState<bigint | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  type Chunk = (typeof chunks)[number];
  // Group chunks by roomId for this channel
  const recordings = useMemo(() => {
    const byChannel = chunks.filter((c) => c.channelId === channelId);
    const byRoom = new Map<string, Chunk[]>();
    for (const c of byChannel) {
      const key = c.roomId.toString();
      const existing = byRoom.get(key);
      byRoom.set(key, existing ? [...existing, c] : [c]);
    }
    return [...byRoom.entries()].map(([roomId, roomChunks]) => ({
      roomId: BigInt(roomId),
      chunks: roomChunks,
      createdAt: roomChunks[0]?.createdAt,
    }));
  }, [chunks, channelId]);

  const handlePlay = (roomId: bigint, roomChunks: Array<(typeof chunks)[number]>) => {
    setPlaybackError(null);
    const blob = buildRecordingFromChunks(
      roomChunks.map((c) => ({ roomId: c.roomId, chunkIndex: c.chunkIndex, dataBase64: c.dataBase64 }))
    );
    if (!blob || blob.size === 0) {
      setPlaybackError('Kayıt boş veya okunamıyor.');
      return;
    }
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    setPlayingRoomId(roomId);
    audio.onended = () => {
      URL.revokeObjectURL(url);
      setPlayingRoomId(null);
    };
    audio.onerror = () => {
      setPlaybackError('Kayıt oynatılamadı.');
      URL.revokeObjectURL(url);
      setPlayingRoomId(null);
    };
    audio.play().catch(() => {
      setPlaybackError('Oynatma başlatılamadı.');
      setPlayingRoomId(null);
    });
  };

  if (recordings.length === 0) return null;

  return (
    <div className="voice-recordings">
      <h4 className="voice-recordings-title">Ses Kayıtları</h4>
      {playbackError && <div className="voice-recordings-error">{playbackError}</div>}
      <ul className="voice-recordings-list">
        {recordings.map(({ roomId, chunks: roomChunks, createdAt }) => {
          const isPlaying = playingRoomId === roomId;
          const dateStr = createdAt ? createdAt.toDate().toLocaleString('tr-TR') : '';
          return (
            <li key={roomId.toString()} className="voice-recordings-item">
              <button
                type="button"
                className={`voice-recordings-play ${isPlaying ? 'playing' : ''}`}
                onClick={() => handlePlay(roomId, roomChunks)}
                title={isPlaying ? 'Oynatılıyor' : 'Kaydı dinle'}
              >
                {isPlaying ? (
                  <span className="voice-recordings-icon playing-icon">⏸</span>
                ) : (
                  <span className="voice-recordings-icon">▶</span>
                )}
              </button>
              <span className="voice-recordings-date">{dateStr}</span>
              <span className="voice-recordings-chunks">{roomChunks.length} parça</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
