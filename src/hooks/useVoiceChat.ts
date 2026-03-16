import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
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
import { useLanguage } from '../contexts/LanguageContext';

interface UseVoiceChatOptions {
  channelId: bigint | null;
  currentUserId: Identity | null;
  enabled: boolean;
  onError?: (message: string) => void;
}

const CHUNK_MAX_SIZE = 40000; // Base64 chars, ~30KB raw audio per chunk for DB

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

export function useVoiceChat({ channelId, currentUserId, enabled, onError }: UseVoiceChatOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const { t } = useLanguage();
  
  const localStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunkIndexRef = useRef(0);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const remoteAudiosRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map()); // For recording mix
  const processedSignalsRef = useRef<Set<bigint>>(new Set());
  const sentOffersRef = useRef<Set<string>>(new Set());
  const pendingIceCandidatesRef = useRef<Map<string, object[]>>(new Map());
  const recordingGainRef = useRef<GainNode | null>(null);
  const recordingCtxRef = useRef<AudioContext | null>(null);
  const silentCtxRef = useRef<AudioContext | null>(null);
  const silentTrackRef = useRef<MediaStreamTrack | null>(null);
  const dataIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingUploadsRef = useRef<Set<Promise<void>>>(new Set());
  
  const [voiceRooms] = useTable(tables.voiceRoom);
  const [voiceParticipants] = useTable(tables.voiceParticipant);
  const [voiceSignaling] = useTable(tables.voiceSignaling);
  const lastRecordedRoomRef = useRef<bigint | null>(null);
  
  const joinVoice = useReducer(typedReducers.joinVoice);
  const leaveVoice = useReducer(typedReducers.leaveVoice);
  const toggleMute = useReducer(typedReducers.toggleVoiceMute);
  const toggleDeafen = useReducer(typedReducers.toggleVoiceDeafen);
  const sendSignal = useReducer(typedReducers.sendVoiceSignal);
  const saveVoiceChunk = useReducer(typedReducers.saveVoiceChunk);
  
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
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: { ideal: 48000 },
          channelCount: { ideal: 1 },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = stream;
      
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
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
  }, [channelId, enabled, joinVoice]);
  
  // Handle leaving voice room
  const handleLeaveVoice = useCallback(async () => {
    if (!channelId) return;
    
    try {
      // Stop auto-recording first and wait for ALL chunk uploads (reducer requires we're still in room)
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
        await new Promise((r) => setTimeout(r, 800)); // Let final ondataavailable fire and add to pending
        const pending = [...pendingUploadsRef.current];
        if (pending.length > 0) {
          await Promise.race([
            Promise.all(pending),
            new Promise((_, rej) => setTimeout(() => rej(new Error('Upload timeout')), 10000)),
          ]).catch((err) => console.warn('Chunk upload wait:', err));
        }
      }

      // Stop local stream
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
      
      // Close all peer connections
      peerConnectionsRef.current.forEach(pc => pc.close());
      peerConnectionsRef.current.clear();
      
      // Remove remote audio elements
      remoteAudiosRef.current.forEach(audio => audio.remove());
      remoteAudiosRef.current.clear();
      
      // Clean up recording and silent audio contexts
      recordingGainRef.current = null;
      recordingCtxRef.current?.close();
      recordingCtxRef.current = null;
      silentCtxRef.current?.close();
      silentCtxRef.current = null;
      silentTrackRef.current = null;
      
      // Leave voice room on server
      await leaveVoice({ channelId });
      setIsConnected(false);
    } catch (err: any) {
      console.error('Failed to leave voice:', err);
    }
  }, [channelId, leaveVoice]);
  
  // Handle mute toggle - use GainNode for recording + replaceTrack for peers (track stays enabled to avoid MediaRecorder corruption)
  const handleToggleMute = useCallback(async () => {
    if (!channelId || !isInVoiceRoom) return;
    
    try {
      await toggleMute({ channelId });
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      
      // Recording: update GainNode (0 = silence, 1 = normal) - track stays enabled so MediaRecorder gets valid data
      if (recordingGainRef.current) {
        recordingGainRef.current.gain.value = newMuted ? 0 : 1;
      }
      
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
  }, [channelId, isInVoiceRoom, isMuted, toggleMute]);
  
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
  
  // Stable ID: only changes when someone joins/leaves, not when they mute/deafen
  const participantIds = useMemo(
    () => currentParticipants.map((p) => p.userId.toHexString()).sort().join(','),
    [currentParticipants]
  );

  // Auto-record voice to DB: designated recorder (smallest identity) saves chunks
  // Solo: record from mic directly. With remotes: mix via GainNode (mute-safe). AudioContext must be resumed.
  useEffect(() => {
    if (!currentRoom || !isInVoiceRoom || !localStreamRef.current || !currentUserId || !channelId) return;
    const myHex = currentUserId.toHexString();
    const isRecorder = currentParticipants.every((p) => p.userId.toHexString() >= myHex);
    if (!isRecorder || mediaRecorderRef.current?.state === 'recording') return;

    const localStream = localStreamRef.current;
    const remoteStreams = [...remoteStreamsRef.current.values()];
    let cancelled = false;

    void (async () => {
      let streamToRecord: MediaStream;
      if (remoteStreams.length === 0) {
        streamToRecord = localStream;
        recordingGainRef.current = null;
        recordingCtxRef.current = null;
      } else {
        try {
          const ctx = new AudioContext();
          recordingCtxRef.current = ctx;
          const gainNode = ctx.createGain();
          gainNode.gain.value = currentParticipant?.muted ? 0 : 1;
          recordingGainRef.current = gainNode;

          const dest = ctx.createMediaStreamDestination();
          localStream.getAudioTracks().forEach((track) => {
            const source = ctx.createMediaStreamSource(new MediaStream([track]));
            source.connect(gainNode);
          });
          gainNode.connect(dest);
          remoteStreams.forEach((s) => {
            s.getTracks().forEach((track) => {
              if (track.kind === 'audio') {
                const source = ctx.createMediaStreamSource(new MediaStream([track]));
                source.connect(dest);
              }
            });
          });
          streamToRecord = dest.stream;

          if (ctx.state === 'suspended') await ctx.resume();
        } catch (err) {
          voiceLog('GainNode mix failed, using local stream', err);
          streamToRecord = localStream;
          recordingGainRef.current = null;
          recordingCtxRef.current = null;
        }
      }

      if (cancelled) return;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      const recorder = new MediaRecorder(streamToRecord, { mimeType, audioBitsPerSecond: 64000 });
      // Only reset chunk index when starting in a NEW room; else continue (avoids corruption when effect re-runs)
      if (lastRecordedRoomRef.current !== currentRoom.id) {
        chunkIndexRef.current = 0;
        lastRecordedRoomRef.current = currentRoom.id;
      }
      recorder.ondataavailable = async (e) => {
        voiceLog('Chunk received:', e.data.size, 'bytes');
        if (!channelId || !currentRoom) return;
        if (e.data.size === 0) return;
        const blob = e.data;
        const uploadPromise = new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const base64 = (reader.result as string).split(',')[1] ?? '';
              for (let i = 0; i < base64.length; i += CHUNK_MAX_SIZE) {
                const chunk = base64.slice(i, i + CHUNK_MAX_SIZE);
                const idx = chunkIndexRef.current++;
                try {
                  await saveVoiceChunk({
                    roomId: currentRoom.id,
                    channelId,
                    chunkIndex: BigInt(idx),
                    dataBase64: chunk,
                  });
                  voiceLog('Saved chunk', idx);
                } catch (err) {
                  console.warn('Failed to save voice chunk:', err);
                }
              }
            } finally {
              resolve();
            }
          };
          reader.readAsDataURL(blob);
        });
        pendingUploadsRef.current.add(uploadPromise);
        uploadPromise.finally(() => pendingUploadsRef.current.delete(uploadPromise));
      };
      recorder.start(3000); // 3s timeslice - wait for encoder to produce valid data
      mediaRecorderRef.current = recorder;
      voiceLog('Auto-recording started (saving to DB)');
    })();

    return () => {
      cancelled = true;
      if (dataIntervalRef.current) {
        clearInterval(dataIntervalRef.current);
        dataIntervalRef.current = null;
      }
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
    };
  }, [currentRoom, participantIds, isInVoiceRoom, currentUserId, channelId, saveVoiceChunk]);

  // Create peer connection
  const createPeerConnection = useCallback((userId: string, targetIdentity: Identity): RTCPeerConnection => {
    voiceLog('Creating peer connection for', userId);
    const pc = new RTCPeerConnection(rtcConfig);
    
    // Add local stream track (silent when muted, real when unmuted - track stays enabled for recording)
    const realTrack = localStreamRef.current?.getAudioTracks()[0] ?? null;
    const trackToAdd = isMuted && realTrack
      ? createSilentAudioTrack(silentCtxRef, silentTrackRef) ?? realTrack
      : realTrack;
    if (trackToAdd && localStreamRef.current) {
      pc.addTrack(trackToAdd, localStreamRef.current);
    }
    
    pc.onconnectionstatechange = () => voiceLog('Connection state for', userId, ':', pc.connectionState);
    pc.oniceconnectionstatechange = () => voiceLog('ICE state for', userId, ':', pc.iceConnectionState);
    // Handle remote stream
    pc.ontrack = (event) => {
      voiceLog('Remote track received from', userId);
      const [remoteStream] = event.streams;
      let audio = remoteAudiosRef.current.get(userId);
      
      if (!audio) {
        audio = document.createElement('audio');
        audio.autoplay = true;
        audio.muted = isDeafened;
        remoteAudiosRef.current.set(userId, audio);
        document.body.appendChild(audio);
      }
      
      audio.srcObject = remoteStream;
      remoteStreamsRef.current.set(userId, remoteStream);
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
  }, [channelId, isDeafened, isMuted, sendSignal, currentUserId]);
  
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
  }, [voiceSignaling, currentRoom, isInVoiceRoom, currentUserId, channelId, createPeerConnection, sendSignal]);
  
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
  }, [currentParticipants, currentRoom, isInVoiceRoom, currentUserId, channelId, createPeerConnection, sendSignal]);
  
  // Clean up when leaving voice room
  useEffect(() => {
    if (!isInVoiceRoom) {
      sentOffersRef.current.clear();
      processedSignalsRef.current.clear();
      pendingIceCandidatesRef.current.clear();
      remoteStreamsRef.current.clear();
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
    }
  }, [isInVoiceRoom]);
  
  // Sync mute/deafen state from server
  useEffect(() => {
    if (currentParticipant) {
      setIsMuted(currentParticipant.muted);
      setIsDeafened(currentParticipant.deafened);
    }
  }, [currentParticipant]);

  // When mute state changes (from server or UI), update recording gain and peer replaceTrack
  useEffect(() => {
    if (!isInVoiceRoom) return;
    recordingGainRef.current && (recordingGainRef.current.gain.value = isMuted ? 0 : 1);
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
    participants: currentParticipants,
    joinVoice: handleJoinVoice,
    leaveVoice: handleLeaveVoice,
    toggleMute: handleToggleMute,
    toggleDeafen: handleToggleDeafen,
  };
}
