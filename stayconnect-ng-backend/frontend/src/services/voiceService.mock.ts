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
 * Mock VoiceService for Expo Go compatibility
 * Voice calls require a native build with EAS
 */
export class VoiceService {
  private static instance: VoiceService;
  private eventCallbacks: CallEventCallback = {};
  private isMutedState = false;

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
    console.log('VoiceService (Mock): Audio session initialized');
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
    throw new Error(
      'Voice calls require a native build. Please build with: npx eas build --profile development'
    );
  }

  async leaveCall(): Promise<void> {
    console.log('VoiceService (Mock): Left voice call');
  }

  async toggleMute(mute: boolean): Promise<void> {
    this.isMutedState = mute;
    console.log('VoiceService (Mock): Microphone', mute ? 'muted' : 'unmuted');
  }

  isMuted(): boolean {
    return this.isMutedState;
  }

  getParticipants(): CallParticipant[] {
    return [];
  }

  isConnectedToRoom(): boolean {
    return false;
  }

  getRoomName(): string | null {
    return null;
  }

  async destroy(): Promise<void> {
    console.log('VoiceService (Mock) destroyed');
  }

  isVoiceAvailable(): boolean {
    return false; // Voice requires native build
  }
}

export const voiceService = VoiceService.getInstance();
export default voiceService;
