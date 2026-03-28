import { useEffect, useRef, useState, useCallback } from 'react';
import { Identity } from 'spacetimedb';

function voiceLog(...args: unknown[]) {
  const on =
    import.meta.env.DEV ||
    import.meta.env.VITE_VOICE_DEBUG === 'true' ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('voice_debug') === '1') ||
    (typeof location !== 'undefined' && location.search.includes('voice_debug'));
  if (on) console.log('[Voice]', ...args);
}
/** Set higher Opus bitrate (128kbps) for better voice quality over WebRTC */
function applyHighQualityAudio(pc: RTCPeerConnection) {
  pc.getSenders().forEach((sender) => {
    if (sender.track?.kind === 'audio') {
      try {
        const params = sender.getParameters();
        const enc = params.encodings ?? [{}];
        if (enc[0]) (enc[0] as RTCRtpEncodingParameters).maxBitrate = 128000;
        params.encodings = enc;
        void sender.setParameters(params);
      } catch {
        /* ignore */
      }
    }
  });
}

import { useTable, useReducer } from 'spacetimedb/react';
import { tables } from '../module_bindings';
import { typedReducers } from '../reducers';
import {
  DEFAULT_MIC_SEND_GAIN_PERCENT,
  MAX_MIC_SEND_GAIN_PERCENT,
  MIN_MIC_SEND_GAIN_PERCENT,
} from '../config/voiceSettings';

/** Local ring: tap raw mic (pre–send-gain) so the indicator isn’t dimmed when send volume is low. */
const LOCAL_SPEAKING_RING_THRESHOLD = 10;
/** Remote streams: slightly higher to limit false positives from line noise. */
const REMOTE_SPEAKING_RING_THRESHOLD = 18;

interface UseVoiceChatOptions {
  channelId: bigint | null;
  currentUserId: Identity | null;
  enabled: boolean;
  onError?: (message: string) => void;
  /** 50–200: outgoing mic gain as % (100 = unity). Applied via Web Audio GainNode to audio sent to peers. */
  micSendGainPercent?: number;
  /** 0–1, applied to remote peer `HTMLAudioElement.volume` (incoming voice). */
  incomingVoiceVolume?: number;
}

/** Creates a silent audio track for replaceTrack when muting. Keeps AudioContext alive. */
function createSilentAudioTrack(ctxRef: { current: AudioContext | null }, trackRef: { current: MediaStreamTrack | null }) {
  if (trackRef.current) return trackRef.current;
  try {
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    oscillator.connect(gain);
    const dest = ctx.createMediaStreamDestination();
    gain.connect(dest);
    oscillator.start();
    const track = dest.stream.getAudioTracks()[0];
    trackRef.current = track;
    return track;
  } catch {
    return null;
  }
}

export type VoiceConnectionStatus = 'strong' | 'connecting' | 'weak' | 'disconnected';

type MicAnalyserBundle = {
  context: AudioContext;
  analyser: AnalyserNode;
  source: MediaStreamAudioSourceNode;
};

function teardownMicAnalyser(bundle: MicAnalyserBundle | null) {
  if (!bundle) return;
  try {
    bundle.source.disconnect();
    bundle.analyser.disconnect();
    void bundle.context.close();
  } catch {
    /* ignore */
  }
}

/** Average frequency energy above threshold ≈ someone speaking (not silence / noise gate). */
function isAnalyserSpeaking(analyser: AnalyserNode, threshold = 18): boolean {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i];
  return sum / data.length > threshold;
}

function aggregateConnectionStatus(pcs: Map<string, RTCPeerConnection>): VoiceConnectionStatus {
  if (pcs.size === 0) return 'strong'; // Solo in room, no P2P
  const states = [...pcs.values()].map((pc) => pc.iceConnectionState);
  if (states.some((s) => s === 'failed' || s === 'closed')) return 'disconnected';
  if (states.some((s) => s === 'disconnected')) return 'weak';
  if (states.some((s) => s === 'checking' || s === 'new')) return 'connecting';
  return 'strong';
}

export function useVoiceChat({
  channelId,
  currentUserId,
  enabled,
  onError,
  micSendGainPercent = DEFAULT_MIC_SEND_GAIN_PERCENT,
  incomingVoiceVolume = 1,
}: UseVoiceChatOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<VoiceConnectionStatus>('strong');

  const updateConnectionStatus = useCallback(() => {
    setConnectionStatus(aggregateConnectionStatus(peerConnectionsRef.current));
  }, []);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const remoteAudiosRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const processedSignalsRef = useRef<Set<bigint>>(new Set());
  const sentOffersRef = useRef<Set<string>>(new Set());
  const pendingIceCandidatesRef = useRef<Map<string, object[]>>(new Map());
  const silentCtxRef = useRef<AudioContext | null>(null);
  const silentTrackRef = useRef<MediaStreamTrack | null>(null);

  const localMicAnalyserRef = useRef<MicAnalyserBundle | null>(null);
  const remoteMicAnalysersRef = useRef<Map<string, MicAnalyserBundle>>(new Map());
  const [speakingByHex, setSpeakingByHex] = useState<Record<string, boolean>>({});
  const micGainCtxRef = useRef<AudioContext | null>(null);
  const micGainNodeRef = useRef<GainNode | null>(null);
  const rawMicStreamRef = useRef<MediaStream | null>(null);

  const attachLocalMicAnalyser = useCallback((stream: MediaStream, opts?: { smoothing?: number }) => {
    teardownMicAnalyser(localMicAnalyserRef.current);
    localMicAnalyserRef.current = null;
    try {
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = opts?.smoothing ?? 0.85;
      source.connect(analyser);
      localMicAnalyserRef.current = { context, analyser, source };
      void context.resume();
    } catch (e) {
      voiceLog('Local mic analyser failed', e);
    }
  }, []);

  const attachRemoteMicAnalyser = useCallback((userId: string, stream: MediaStream) => {
    const prev = remoteMicAnalysersRef.current.get(userId);
    if (prev) teardownMicAnalyser(prev);
    try {
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.85;
      source.connect(analyser);
      remoteMicAnalysersRef.current.set(userId, { context, analyser, source });
      void context.resume();
    } catch (e) {
      voiceLog('Remote mic analyser failed', userId, e);
    }
  }, []);

  const teardownAllMicAnalysers = useCallback(() => {
    teardownMicAnalyser(localMicAnalyserRef.current);
    localMicAnalyserRef.current = null;
    for (const bundle of remoteMicAnalysersRef.current.values()) {
      teardownMicAnalyser(bundle);
    }
    remoteMicAnalysersRef.current.clear();
    setSpeakingByHex({});
  }, []);

  const teardownOutgoingGainPipeline = useCallback(() => {
    micGainNodeRef.current = null;
    try {
      void micGainCtxRef.current?.close();
    } catch {
      /* ignore */
    }
    micGainCtxRef.current = null;
    rawMicStreamRef.current?.getTracks().forEach((t) => t.stop());
    rawMicStreamRef.current = null;
  }, []);

  const [voiceRooms] = useTable(tables.voiceRoom);
  const [voiceParticipants] = useTable(tables.voiceParticipant);
  const [voiceSignaling] = useTable(tables.voiceSignaling);
  
  const joinVoice = useReducer(typedReducers.joinVoice);
  const leaveVoice = useReducer(typedReducers.leaveVoice);
  const toggleMute = useReducer(typedReducers.toggleVoiceMute);
  const toggleDeafen = useReducer(typedReducers.toggleVoiceDeafen);
  const sendSignal = useReducer(typedReducers.sendVoiceSignal);
  
  // Get current room and participants
  const currentRoom = enabled && channelId ? voiceRooms.find(r => r.channelId === channelId) : null;
  const currentParticipants = enabled && currentRoom && currentUserId
    ? voiceParticipants.filter(p => p.roomId === currentRoom.id)
    : [];
  const isInVoiceRoom = enabled && currentUserId
    ? currentParticipants.some(p => p.userId.isEqual(currentUserId))
    : false;
  const currentParticipant = enabled && currentUserId
    ? currentParticipants.find(p => p.userId.isEqual(currentUserId))
    : null;
  
  // STUN + TURN servers - TURN needed for NAT traversal (symmetric NAT, corporate firewalls)
  const rtcConfig: RTCConfiguration = {
    iceCandidatePoolSize: 10, // Pre-gather candidates for faster connection
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:freeturn.net:3478' },
      { urls: 'turn:freeturn.net:3478', username: 'free', credential: 'free' },
      { urls: 'turns:freeturn.net:5349', username: 'free', credential: 'free' },
    ],
  };
  
  // Initialize audio elements
  useEffect(() => {
    if (!enabled) return;
    
    localAudioRef.current = document.createElement('audio');
    localAudioRef.current.autoplay = true;
    localAudioRef.current.muted = true; // Prevent echo
    
    return () => {
      localAudioRef.current?.remove();
      remoteAudiosRef.current.forEach(audio => audio.remove());
      remoteAudiosRef.current.clear();
    };
  }, [enabled]);
  
  // Handle joining voice room
  const handleJoinVoice = useCallback(async () => {
    if (!channelId || !enabled) return;
    
    try {
      // Get user media - high quality audio constraints
      const rawStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: { ideal: 48000 },
          channelCount: { ideal: 1 },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      rawMicStreamRef.current = rawStream;

      const gainLinear = Math.min(
        MAX_MIC_SEND_GAIN_PERCENT / 100,
        Math.max(MIN_MIC_SEND_GAIN_PERCENT / 100, micSendGainPercent / 100)
      );
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(rawStream);
      const gainNode = ctx.createGain();
      gainNode.gain.value = gainLinear;
      const dest = ctx.createMediaStreamDestination();
      source.connect(gainNode);
      gainNode.connect(dest);
      micGainCtxRef.current = ctx;
      micGainNodeRef.current = gainNode;
      void ctx.resume();

      const outgoing = dest.stream;
      localStreamRef.current = outgoing;
      // Analyse raw mic so the speaking ring isn’t tied to outgoing gain (slider).
      attachLocalMicAnalyser(rawStream, { smoothing: 0.55 });

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = outgoing;
      }

      // Join voice room on server
      await joinVoice({ channelId });
      voiceLog('Joined voice room', channelId.toString());
      setIsConnected(true);
    } catch (err: any) {
      // "Already in voice room" = idempotent, not a real failure (race from double-mount etc.)
      if (String(err?.message ?? '').includes('already in the voice room')) {
        voiceLog('Already in voice room (ok)');
        setIsConnected(true);
        return;
      }
      console.error('Failed to join voice:', err);
    }
  }, [channelId, enabled, joinVoice, attachLocalMicAnalyser, micSendGainPercent]);
  
  // Local-only cleanup for channel switch. No server call - join_voice auto-leaves old room.
  const prepareForChannelSwitch = useCallback(() => {
    teardownAllMicAnalysers();
    teardownOutgoingGainPipeline();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
    remoteAudiosRef.current.forEach(audio => audio.remove());
    remoteAudiosRef.current.clear();
    silentCtxRef.current?.close();
    silentCtxRef.current = null;
    silentTrackRef.current = null;
    setIsConnected(false);
  }, [teardownAllMicAnalysers, teardownOutgoingGainPipeline]);

  // Handle leaving voice room
  const handleLeaveVoice = useCallback(async () => {
    if (!channelId) return;

    try {
      teardownAllMicAnalysers();
      teardownOutgoingGainPipeline();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      peerConnectionsRef.current.forEach(pc => pc.close());
      peerConnectionsRef.current.clear();
      remoteAudiosRef.current.forEach(audio => audio.remove());
      remoteAudiosRef.current.clear();
      silentCtxRef.current?.close();
      silentCtxRef.current = null;
      silentTrackRef.current = null;
      await leaveVoice({ channelId });
      setIsConnected(false);
    } catch (err: any) {
      console.error('Failed to leave voice:', err);
    }
  }, [channelId, leaveVoice, teardownAllMicAnalysers, teardownOutgoingGainPipeline]);
  
  // Handle mute toggle - replaceTrack for peers (silent when muted, real when unmuted)
  const handleToggleMute = useCallback(async () => {
    if (!channelId || !isInVoiceRoom) return;
    if (isDeafened) return;

    try {
      await toggleMute({ channelId });
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      
      // Peers: replaceTrack with silent track when muted, real track when unmuted
      const realTrack = localStreamRef.current?.getAudioTracks()[0] ?? null;
      const silentTrack = newMuted ? createSilentAudioTrack(silentCtxRef, silentTrackRef) : null;
      peerConnectionsRef.current.forEach((pc) => {
        pc.getSenders().forEach((sender) => {
          if (sender.track?.kind === 'audio') {
            void sender.replaceTrack(newMuted ? (silentTrack ?? null) : realTrack);
          }
        });
      });
    } catch (err: any) {
      console.error('Failed to toggle mute:', err);
    }
  }, [channelId, isInVoiceRoom, isMuted, isDeafened, toggleMute]);
  
  // Handle deafen toggle
  const handleToggleDeafen = useCallback(async () => {
    if (!channelId || !isInVoiceRoom) return;
    
    try {
      await toggleDeafen({ channelId });
      const newDeafened = !isDeafened;
      setIsDeafened(newDeafened);
      
      // Mute/unmute all remote audio
      remoteAudiosRef.current.forEach(audio => {
        audio.muted = newDeafened;
      });
    } catch (err: any) {
      console.error('Failed to toggle deafen:', err);
    }
  }, [channelId, isInVoiceRoom, isDeafened, toggleDeafen]);

  // Create peer connection
  const createPeerConnection = useCallback((userId: string, targetIdentity: Identity): RTCPeerConnection => {
    voiceLog('Creating peer connection for', userId);
    const pc = new RTCPeerConnection(rtcConfig);
    
    // Add local stream track (silent when muted, real when unmuted)
    const realTrack = localStreamRef.current?.getAudioTracks()[0] ?? null;
    const trackToAdd = isMuted && realTrack
      ? createSilentAudioTrack(silentCtxRef, silentTrackRef) ?? realTrack
      : realTrack;
    if (trackToAdd && localStreamRef.current) {
      pc.addTrack(trackToAdd, localStreamRef.current);
    }
    
    pc.onconnectionstatechange = () => voiceLog('Connection state for', userId, ':', pc.connectionState);
    pc.oniceconnectionstatechange = () => {
      voiceLog('ICE state for', userId, ':', pc.iceConnectionState);
      updateConnectionStatus();
    };
    // Handle remote stream
    pc.ontrack = (event) => {
      voiceLog('Remote track received from', userId);
      const [remoteStream] = event.streams;
      let audio = remoteAudiosRef.current.get(userId);
      
      if (!audio) {
        audio = document.createElement('audio');
        audio.autoplay = true;
        audio.muted = isDeafened;
        audio.volume = incomingVoiceVolume;
        remoteAudiosRef.current.set(userId, audio);
        document.body.appendChild(audio);
      } else {
        audio.volume = incomingVoiceVolume;
      }

      audio.srcObject = remoteStream;
      attachRemoteMicAnalyser(userId, remoteStream);
    };

    // Handle ICE candidates - only send real candidates (end-of-candidates can cause issues if sent too early)
    pc.onicecandidate = (event) => {
      if (!event.candidate || !channelId || !currentUserId) return;
      sendSignal({
        channelId,
        toUserId: targetIdentity,
        signalType: 'ice-candidate',
        signalData: JSON.stringify(event.candidate),
      }).catch(console.error);
    };
    
    return pc;
  }, [channelId, isDeafened, isMuted, sendSignal, currentUserId, updateConnectionStatus, attachRemoteMicAnalyser, incomingVoiceVolume]);

  // Apply incoming volume to all remote playback elements (including after reconnect / new peers).
  useEffect(() => {
    const v = Math.min(1, Math.max(0, incomingVoiceVolume));
    remoteAudiosRef.current.forEach((audio) => {
      audio.volume = v;
    });
  }, [incomingVoiceVolume]);
  
  // Handle signaling messages
  useEffect(() => {
    if (!currentRoom || !isInVoiceRoom || !localStreamRef.current || !currentUserId) return;
    
    const relevantSignals = voiceSignaling
      .filter(s => s.roomId === currentRoom.id && s.toUserId.isEqual(currentUserId))
      .filter(s => !processedSignalsRef.current.has(s.id))
      .sort((a, b) => {
        // Process offers first, then answers, then ice-candidates
        const order = { 'offer': 0, 'answer': 1, 'ice-candidate': 2 };
        return (order[a.signalType as keyof typeof order] || 99) - (order[b.signalType as keyof typeof order] || 99);
      });
    
    void (async () => {
      for (const signal of relevantSignals) {
      processedSignalsRef.current.add(signal.id);
      voiceLog('Processing signal', signal.signalType, 'from', signal.fromUserId.toHexString());
      
      const fromUserId = signal.fromUserId.toHexString();
      let pc = peerConnectionsRef.current.get(fromUserId);
      
      if (!pc) {
        pc = createPeerConnection(fromUserId, signal.fromUserId);
        peerConnectionsRef.current.set(fromUserId, pc);
        updateConnectionStatus();
      }
      
      try {
        if (signal.signalType === 'offer') {
          if (pc.signalingState === 'have-local-offer') continue;
          if (pc.signalingState === 'stable') {
            const offer = JSON.parse(signal.signalData) as RTCSessionDescriptionInit;
            await pc.setRemoteDescription(offer);
            
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            applyHighQualityAudio(pc);
            if (channelId) {
              await sendSignal({
                channelId,
                toUserId: signal.fromUserId,
                signalType: 'answer',
                signalData: JSON.stringify(answer),
              });
              voiceLog('Sent answer to', fromUserId);
            }
            const pending = pendingIceCandidatesRef.current.get(fromUserId) || [];
            for (const c of pending) {
              try {
                await pc.addIceCandidate(c instanceof RTCIceCandidate ? c : new RTCIceCandidate(c as RTCIceCandidateInit));
              } catch (e) {
                console.warn('Error adding queued ICE candidate:', e);
              }
            }
            pendingIceCandidatesRef.current.delete(fromUserId);
          }
        } else if (signal.signalType === 'answer') {
          if (pc.signalingState === 'have-local-offer') {
            const answer = JSON.parse(signal.signalData) as RTCSessionDescriptionInit;
            await pc.setRemoteDescription(answer);
            const pending = pendingIceCandidatesRef.current.get(fromUserId) || [];
            for (const c of pending) {
              try {
                await pc.addIceCandidate(c instanceof RTCIceCandidate ? c : new RTCIceCandidate(c as RTCIceCandidateInit));
              } catch (e) {
                console.warn('Error adding queued ICE candidate:', e);
              }
            }
            pendingIceCandidatesRef.current.delete(fromUserId);
          }
        } else if (signal.signalType === 'ice-candidate') {
          const parsed = JSON.parse(signal.signalData) as RTCIceCandidateInit | null;
          if (!parsed || typeof parsed !== 'object') continue;
          const candidate = parsed;
          if (pc.remoteDescription) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              if (candidate.candidate) console.warn('Error adding ICE candidate:', e);
            }
          } else {
            const pending = pendingIceCandidatesRef.current.get(fromUserId) || [];
            pending.push(candidate);
            pendingIceCandidatesRef.current.set(fromUserId, pending);
          }
        }
      } catch (err: any) {
        processedSignalsRef.current.delete(signal.id);
        console.error('Error handling signal:', err);
      }
    }
    })();
  }, [voiceSignaling, currentRoom, isInVoiceRoom, currentUserId, channelId, createPeerConnection, sendSignal, updateConnectionStatus]);
  
  // Create offer for new participants (glare prevention: only smaller identity creates offer)
  useEffect(() => {
    if (!currentRoom || !isInVoiceRoom || !localStreamRef.current || !currentUserId) return;
    
    const myHex = currentUserId.toHexString();
    
    const otherParticipants = currentParticipants.filter(
      p => !p.userId.isEqual(currentUserId) && !sentOffersRef.current.has(p.userId.toHexString())
    );
    
    otherParticipants.forEach(async (participant) => {
      // Only we create offer if our identity < theirs (lexicographic); otherwise we wait for their offer
      const theirHex = participant.userId.toHexString();
      if (myHex >= theirHex) return;
      const userId = participant.userId.toHexString();
      
      if (!peerConnectionsRef.current.has(userId)) {
        const pc = createPeerConnection(userId, participant.userId);
        peerConnectionsRef.current.set(userId, pc);
        updateConnectionStatus();
        
        try {
          // Wait for peer to subscribe and be ready (helps when 3+ participants)
          await new Promise(resolve => setTimeout(resolve, 400));
          
          // Only create offer if connection is in stable state
          if (pc.signalingState === 'stable') {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            applyHighQualityAudio(pc);
            sentOffersRef.current.add(userId);
            voiceLog('Sent offer to', userId);
            
            if (channelId) {
              await sendSignal({
                channelId,
                toUserId: participant.userId,
                signalType: 'offer',
                signalData: JSON.stringify(offer),
              });
            }
          }
        } catch (err) {
          console.error('Error creating offer:', err);
          sentOffersRef.current.delete(userId);
        }
      }
    });
  }, [currentParticipants, currentRoom, isInVoiceRoom, currentUserId, channelId, createPeerConnection, sendSignal, updateConnectionStatus]);
  
  // Clean up when leaving voice room
  useEffect(() => {
    if (!isInVoiceRoom) {
      sentOffersRef.current.clear();
      processedSignalsRef.current.clear();
      pendingIceCandidatesRef.current.clear();
    }
  }, [isInVoiceRoom]);
  
  // Sync mute/deafen state from server
  useEffect(() => {
    if (currentParticipant) {
      setIsMuted(currentParticipant.muted);
      setIsDeafened(currentParticipant.deafened);
    }
  }, [currentParticipant]);

  // When mute state changes (from server or UI), sync replaceTrack on peer connections
  useEffect(() => {
    if (!isInVoiceRoom) return;
    const realTrack = localStreamRef.current?.getAudioTracks()[0] ?? null;
    const silentTrack = isMuted ? createSilentAudioTrack(silentCtxRef, silentTrackRef) : null;
    peerConnectionsRef.current.forEach((pc) => {
      pc.getSenders().forEach((sender) => {
        if (sender.track?.kind === 'audio') {
          void sender.replaceTrack(isMuted ? (silentTrack ?? null) : realTrack);
        }
      });
    });
  }, [isMuted, isInVoiceRoom]);

  // Voice activity (Web Audio analysers) → green avatar border in sidebar when someone speaks
  useEffect(() => {
    if (!isInVoiceRoom || !currentUserId) return;
    let rafId = 0;
    let frame = 0;
    const localHex = currentUserId.toHexString();

    const tick = () => {
      frame++;
      const next: Record<string, boolean> = {};
      const localMic = localMicAnalyserRef.current;
      if (localMic && !isMuted) {
        next[localHex] = isAnalyserSpeaking(localMic.analyser, LOCAL_SPEAKING_RING_THRESHOLD);
      } else {
        next[localHex] = false;
      }
      for (const [hex, bundle] of remoteMicAnalysersRef.current) {
        next[hex] = isAnalyserSpeaking(bundle.analyser, REMOTE_SPEAKING_RING_THRESHOLD);
      }

      if (frame % 4 === 0) {
        setSpeakingByHex((prev) => {
          const prevKeys = Object.keys(prev);
          const nextKeys = Object.keys(next);
          if (prevKeys.length !== nextKeys.length) return next;
          for (const k of nextKeys) {
            if (prev[k] !== next[k]) return next;
          }
          for (const k of prevKeys) {
            if (!(k in next)) return next;
          }
          return prev;
        });
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInVoiceRoom, currentUserId, isMuted]);

  useEffect(() => {
    const g = micGainNodeRef.current;
    if (!g) return;
    g.gain.value = Math.min(
      MAX_MIC_SEND_GAIN_PERCENT / 100,
      Math.max(MIN_MIC_SEND_GAIN_PERCENT / 100, micSendGainPercent / 100)
    );
  }, [micSendGainPercent]);

  useEffect(() => {
    if (!isInVoiceRoom) return;
    const allowed = new Set(currentParticipants.map((p) => p.userId.toHexString()));
    for (const hex of remoteMicAnalysersRef.current.keys()) {
      if (!allowed.has(hex)) {
        const node = remoteMicAnalysersRef.current.get(hex);
        if (node) teardownMicAnalyser(node);
        remoteMicAnalysersRef.current.delete(hex);
      }
    }
  }, [currentParticipants, isInVoiceRoom]);
  
  // Cleanup on unmount or channel change
  useEffect(() => {
    return () => {
      if (isConnected) {
        handleLeaveVoice();
      }
    };
  }, [channelId]);
  
  return {
    isConnected: isInVoiceRoom,
    isMuted,
    isDeafened,
    connectionStatus,
    participants: currentParticipants,
    speakingByHex,
    joinVoice: handleJoinVoice,
    leaveVoice: handleLeaveVoice,
    prepareForChannelSwitch,
    toggleMute: handleToggleMute,
    toggleDeafen: handleToggleDeafen,
  };
}
