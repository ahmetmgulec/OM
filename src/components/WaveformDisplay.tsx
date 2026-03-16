import React, { useEffect, useMemo, useRef, useState } from 'react';

const BAR_COUNT = 120;
const BAR_GAP = 1;
const MIN_BAR_HEIGHT = 3;

/** SoundCloud-style colors */
const COLOR_PLAYED = '#ff5500';
const COLOR_UNPLAYED = '#535353';
const COLOR_IDLE = '#72767d';

interface WaveformDisplayProps {
  chunks: Array<{ chunkIndex: bigint; dataBase64: string }>;
  isPlaying?: boolean;
  progress?: number; // 0-1, for future playhead
  precomputedWaveform?: number[]; // from playback capture - use when available for full waveform
  className?: string;
}

/** Same per-chunk decode as VoiceRecordings - concatenating base64 then decoding fails for multi-chunk WebM */
function buildBlobFromChunks(chunks: { chunkIndex: bigint; dataBase64: string }[]): Blob | null {
  if (chunks.length === 0) return null;
  const sorted = [...chunks].sort((a, b) => Number(a.chunkIndex - b.chunkIndex));
  const parts: Uint8Array[] = [];
  for (const c of sorted) {
    let chunkBase64 = String(c.dataBase64 || '').replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
    if (!chunkBase64) continue;
    const clean = chunkBase64.split('').filter((char) => {
      const code = char.charCodeAt(0);
      return (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || (code >= 48 && code <= 57) || code === 43 || code === 47;
    }).join('');
    const pad = (4 - (clean.length % 4)) % 4;
    const paddedChunk = clean + '='.repeat(pad);
    try {
      const binary = atob(paddedChunk);
      const arr = new Uint8Array(binary.length);
      for (let j = 0; j < binary.length; j++) arr[j] = binary.charCodeAt(j) & 0xff;
      parts.push(arr);
    } catch {
      /* skip invalid chunk */
    }
  }
  if (parts.length === 0) return null;
  const totalLen = parts.reduce((s, p) => s + p.length, 0);
  const bytes = new Uint8Array(totalLen);
  let offset = 0;
  for (const p of parts) {
    bytes.set(p, offset);
    offset += p.length;
  }
  const blob = new Blob([bytes], { type: 'audio/webm;codecs=opus' });
  return blob.size > 0 ? blob : null;
}

/** Extract downsampled amplitude from channel data */
function samplesToBars(samples: Float32Array | number[]): number[] {
  const length = samples.length;
  if (length === 0) return [];
  const blockSize = Math.max(1, Math.floor(length / BAR_COUNT));
  const bars: number[] = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    const start = i * blockSize;
    let sum = 0;
    for (let j = 0; j < blockSize && start + j < length; j++) {
      const v = typeof samples[start + j] === 'number' ? samples[start + j] : (samples as Float32Array)[start + j];
      sum += Math.abs(v);
    }
    const avg = blockSize > 0 ? sum / blockSize : 0;
    bars.push(Math.max(MIN_BAR_HEIGHT / 24, Math.min(1, avg * 4)));
  }
  return bars;
}

/** Extract downsampled amplitude - try combined blob, then per-chunk and merge */
async function getWaveformData(chunks: { chunkIndex: bigint; dataBase64: string }[]): Promise<number[] | null> {
  const hasData = chunks.some((c) => (c.dataBase64?.length ?? 0) > 0);
  if (!hasData) return null;

  const blob = buildBlobFromChunks(chunks);
  if (!blob || blob.size === 0) return null;

  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const tryDecode = async (data: ArrayBuffer): Promise<Float32Array | null> => {
    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      const buffer = await audioContext.decodeAudioData(data.slice(0));
      return buffer.getChannelData(0);
    } catch {
      return null;
    }
  };

  try {
    const sorted = [...chunks].sort((a, b) => Number(a.chunkIndex - b.chunkIndex));
    const chunkBuffers: ArrayBuffer[] = [];
    for (const c of sorted) {
      const cb = buildBlobFromChunks([c]);
      if (!cb || cb.size === 0) continue;
      chunkBuffers.push(await cb.arrayBuffer());
    }
    if (chunkBuffers.length === 0) {
      await audioContext.close();
      return null;
    }

    // 1) Progressive decode - chunk0, then chunk0+chunk1, then chunk0+chunk1+chunk2...
    // chunk0, then chunk0+chunk1, then chunk0+chunk1+chunk2...
    let cumulative = new Uint8Array(0);
    const allSamples: number[] = [];
    for (let i = 0; i < chunkBuffers.length; i++) {
      const next = new Uint8Array(chunkBuffers[i]);
      const merged = new Uint8Array(cumulative.length + next.length);
      merged.set(cumulative);
      merged.set(next, cumulative.length);
      cumulative = merged;
      const buf = await tryDecode(cumulative.buffer);
      if (buf) {
        const prevLen = allSamples.length;
        for (let j = 0; j < buf.length; j++) allSamples.push(Math.abs(buf[j]));
        if (allSamples.length > prevLen) {
          allSamples.splice(0, prevLen);
        }
      }
    }
    if (allSamples.length > 0) {
      await audioContext.close();
      return samplesToBars(allSamples);
    }

    // 2) Try prepending init (first ~4KB of chunk0) to each subsequent chunk - some decoders need init per segment
    const init = chunkBuffers[0] ? new Uint8Array(chunkBuffers[0]).slice(0, 4096) : new Uint8Array(0);
    if (init.length > 0 && chunkBuffers.length > 1) {
      const initDecode: number[] = [];
      const buf0 = await tryDecode(chunkBuffers[0]);
      if (buf0) for (let j = 0; j < buf0.length; j++) initDecode.push(Math.abs(buf0[j]));
      for (let i = 1; i < chunkBuffers.length; i++) {
        const raw = new Uint8Array(chunkBuffers[i]);
        const withInit = new Uint8Array(init.length + raw.length);
        withInit.set(init);
        withInit.set(raw, init.length);
        const buf = await tryDecode(withInit.buffer);
        if (buf) for (let j = 0; j < buf.length; j++) initDecode.push(Math.abs(buf[j]));
      }
      if (initDecode.length > 0) {
        await audioContext.close();
        return samplesToBars(initDecode);
      }
    }

    // 3) Fallback: per-chunk decode (only first chunk usually works when standalone)
    for (const c of sorted) {
      const chunkBlob = buildBlobFromChunks([c]);
      if (!chunkBlob || chunkBlob.size === 0) continue;
      const buf = await tryDecode(await chunkBlob.arrayBuffer());
      if (buf) {
        for (let i = 0; i < buf.length; i++) allSamples.push(Math.abs(buf[i]));
      }
    }
    await audioContext.close();
    if (allSamples.length > 0) return samplesToBars(allSamples);
    if (import.meta.env.DEV) console.warn('[WaveformDisplay] decode failed: combined + per-chunk');
    return null;
  } catch (e) {
    await audioContext.close();
    if (import.meta.env.DEV) console.warn('[WaveformDisplay] getWaveformData error', e);
    return null;
  }
}

export function WaveformDisplay({ chunks, isPlaying = false, progress = 0, precomputedWaveform, className = '' }: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveform, setWaveform] = useState<number[] | null>(precomputedWaveform && precomputedWaveform.length > 0 ? precomputedWaveform : null);
  const [loading, setLoading] = useState(!precomputedWaveform || precomputedWaveform.length === 0);
  const [error, setError] = useState(false);

  const chunkKey = useMemo(
    () => chunks
      .map((c) => `${c.chunkIndex}:${(c.dataBase64?.length ?? 0)}`)
      .sort()
      .join(','),
    [chunks]
  );

  const [stableKey, setStableKey] = useState(chunkKey);
  const chunksRef = useRef(chunks);
  chunksRef.current = chunks;

  useEffect(() => {
    if (chunkKey === stableKey) return;
    const t = setTimeout(() => setStableKey(chunkKey), 350);
    return () => clearTimeout(t);
  }, [chunkKey, stableKey]);

  useEffect(() => {
    if (precomputedWaveform && precomputedWaveform.length > 0) {
      setWaveform(precomputedWaveform);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    const currentChunks = chunksRef.current;

    getWaveformData(currentChunks)
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setWaveform(data);
        } else {
          // Decode failed - show synthetic placeholder so something is visible
          const synth = Array.from({ length: BAR_COUNT }, (_, i) => 0.15 + 0.25 * Math.sin((i / BAR_COUNT) * Math.PI * 4));
          setWaveform(synth);
        }
      })
      .catch(() => {
        if (cancelled) return;
        const synth = Array.from({ length: BAR_COUNT }, (_, i) => 0.15 + 0.25 * Math.sin((i / BAR_COUNT) * Math.PI * 4));
        setWaveform(synth);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [stableKey, precomputedWaveform]);

  const drawWaveform = React.useCallback(
    (canvasEl: HTMLCanvasElement) => {
      const ctx = canvasEl.getContext('2d');
      if (!ctx || !waveform) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvasEl.getBoundingClientRect();
      canvasEl.width = rect.width * dpr;
      canvasEl.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const barWidth = Math.max(1, (w - (waveform.length - 1) * BAR_GAP) / waveform.length);
      const centerY = h / 2;
      const halfHeight = (h / 2) - 2;

      ctx.clearRect(0, 0, w, h);

      waveform.forEach((norm, i) => {
        const x = i * (barWidth + BAR_GAP);
        const barHeight = Math.max(MIN_BAR_HEIGHT, norm * halfHeight);
        const top = centerY - barHeight / 2;

        const progressThreshold = (i + 0.5) / waveform.length;
        const isPlayed = progress >= progressThreshold;
        const fillColor =
          isPlaying
            ? (isPlayed ? COLOR_PLAYED : COLOR_UNPLAYED)
            : COLOR_IDLE;

        ctx.fillStyle = fillColor;
        ctx.beginPath();
        const radius = Math.min(barWidth / 2, 2);
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, top, barWidth, barHeight, radius);
        } else {
          ctx.rect(x, top, barWidth, barHeight);
        }
        ctx.fill();
      });
    },
    [waveform, isPlaying, progress]
  );

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!waveform || !canvasEl) return;

    drawWaveform(canvasEl);

    const ro = new ResizeObserver(() => {
      if (canvasRef.current) drawWaveform(canvasRef.current);
    });
    ro.observe(canvasEl);
    return () => ro.disconnect();
  }, [waveform, isPlaying, progress, drawWaveform]);

  if (loading) {
    return (
      <div className={`waveform-display waveform-loading ${className}`}>
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            className="waveform-bar waveform-bar-placeholder"
            style={{ height: `${20 + (i % 5) * 8}%`, animationDelay: `${i * 0.02}s` }}
          />
        ))}
      </div>
    );
  }

  if (error || !waveform) {
    const fallbackBars = Array.from({ length: BAR_COUNT }, (_, i) => 0.2 + 0.3 * Math.sin((i / BAR_COUNT) * Math.PI));
    return (
      <canvas
        ref={(el) => {
          if (!el || !fallbackBars.length) return;
          const ctx = el.getContext('2d');
          if (!ctx) return;
          const dpr = window.devicePixelRatio || 1;
          const rect = el.getBoundingClientRect();
          el.width = rect.width * dpr;
          el.height = rect.height * dpr;
          ctx.scale(dpr, dpr);
          const w = rect.width;
          const h = rect.height;
          const barWidth = Math.max(1, (w - (fallbackBars.length - 1) * BAR_GAP) / fallbackBars.length);
          const centerY = h / 2;
          const halfHeight = h / 2 - 2;
          ctx.clearRect(0, 0, w, h);
          fallbackBars.forEach((norm, i) => {
            const x = i * (barWidth + BAR_GAP);
            const barHeight = Math.max(MIN_BAR_HEIGHT, norm * halfHeight);
            const top = centerY - barHeight / 2;
            ctx.fillStyle = COLOR_IDLE;
            ctx.beginPath();
            const radius = Math.min(barWidth / 2, 2);
            if (typeof ctx.roundRect === 'function') ctx.roundRect(x, top, barWidth, barHeight, radius);
            else ctx.rect(x, top, barWidth, barHeight);
            ctx.fill();
          });
        }}
        className={`waveform-display waveform-canvas waveform-fallback ${className}`}
        style={{ width: '100%', height: '28px', display: 'block' }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`waveform-display waveform-canvas ${className}`}
      style={{ width: '100%', height: '28px', display: 'block' }}
    />
  );
}
