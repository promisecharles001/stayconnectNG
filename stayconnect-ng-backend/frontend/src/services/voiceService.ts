import api from './api';

export interface VoiceCallConfig {
  serverUrl: string;
  roomName: string;
  token: string;
}

export interface CallParticipant {
  identity: string;
  sid: string;
  isMuted: boolean;
  isSpeaking: boolean;
}

type CallEventCallback = {
  onParticipantJoined?: (participant: CallParticipant) => void;
  onParticipantLeft?: (participant: CallParticipant) => void;
  onParticipantSpeaking?: (participant: CallParticipant) => void;
  onDisconnected?: () => void;
  onReconnecting?: () => void;
  onReconnected?: () => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
};

/**
 * VoiceService mock implementation
 * LiveKit requires native build configuration. Install @livekit/react-native for production voice.
 */
export class VoiceService {
  private static instance: VoiceService;
  private eventCallbacks: CallEventCallback = {};
  private isMutedState = false;
  private isSpeakerOnState = false;
  private callActive = false;

  private constructor() {}

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  setEventCallbacks(callbacks: CallEventCallback): void {
    this.eventCallbacks = callbacks;
  }

  async initialize(): Promise<void> {
    console.log('[VoiceService] Initialized (mock)');
  }

  async getVoiceToken(roomName: string, participantName: string): Promise<any> {
    try {
      const response = await api.post('/voice/generate-token', {
        roomName,
        participantName,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get voice token:', error);
      throw error;
    }
  }

  async joinCall(config: VoiceCallConfig): Promise<void> {
    console.log('[VoiceService] Join call (mock):', config.roomName);
    this.callActive = true;
    // Simulate connection
    setTimeout(() => {
      this.eventCallbacks.onConnected?.();
    }, 500);
  }

  async leaveCall(): Promise<void> {
    console.log('[VoiceService] Leave call (mock)');
    this.callActive = false;
    this.isMutedState = false;
    this.eventCallbacks.onDisconnected?.();
  }

  async toggleMute(mute: boolean): Promise<void> {
    this.isMutedState = mute;
    console.log('[VoiceService] Mute toggled:', mute);
  }

  async toggleSpeaker(speakerOn: boolean): Promise<void> {
    this.isSpeakerOnState = speakerOn;
    console.log('[VoiceService] Speaker toggled:', speakerOn);
  }

  getCallDuration(): number {
    return 0;
  }

  isMuted(): boolean {
    return this.isMutedState;
  }

  isSpeakerOn(): boolean {
    return this.isSpeakerOnState;
  }

  isCallActive(): boolean {
    return this.callActive;
  }
}

export const voiceService = VoiceService.getInstance();
export default voiceService;
