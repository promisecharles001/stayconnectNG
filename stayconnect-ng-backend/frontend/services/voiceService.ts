import RtcEngine from 'react-native-agora';
import { API_BASE_URL } from '../config';

interface AgoraTokenResponse {
  token: string;
  channelName: string;
  uid: number;
  expiresIn: number;
}

interface VoiceCallConfig {
  appId: string;
  channelName: string;
  uid: number;
  token: string;
}

export class VoiceService {
  private static instance: VoiceService;
  private engine: RtcEngine | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  /**
   * Initialize the Agora engine
   */
  async initialize(appId: string): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.engine = await RtcEngine.create(appId);
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Enable audio
      await this.engine.enableAudio();
      
      this.isInitialized = true;
      console.log('Agora engine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Agora engine:', error);
      throw error;
    }
  }

  /**
   * Set up Agora event listeners
   */
  private setupEventListeners(): void {
    if (!this.engine) return;

    // User joined channel
    this.engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('User joined:', uid, elapsed);
    });

    // User left channel
    this.engine.addListener('UserOffline', (uid, reason) => {
      console.log('User offline:', uid, reason);
    });

    // Connection state changed
    this.engine.addListener('ConnectionStateChanged', (state, reason) => {
      console.log('Connection state changed:', state, reason);
    });

    // Audio volume indication
    this.engine.addListener('AudioVolumeIndication', (speakers, speakerNumber, totalVolume) => {
      console.log('Audio volume:', speakers, speakerNumber, totalVolume);
    });
  }

  /**
   * Get Agora token from backend
   */
  async getAgoraToken(channelName: string, uid: number, jwtToken: string): Promise<AgoraTokenResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/voice/generate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          channelName,
          uid,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get Agora token:', error);
      throw error;
    }
  }

  /**
   * Join a voice call
   */
  async joinCall(config: VoiceCallConfig): Promise<void> {
    if (!this.engine || !this.isInitialized) {
      throw new Error('Agora engine not initialized');
    }

    try {
      // Join the channel
      await this.engine.joinChannel(config.token, config.channelName, null, config.uid);
      console.log('Joined channel:', config.channelName);
    } catch (error) {
      console.error('Failed to join channel:', error);
      throw error;
    }
  }

  /**
   * Leave current call
   */
  async leaveCall(): Promise<void> {
    if (!this.engine) {
      throw new Error('Agora engine not initialized');
    }

    try {
      await this.engine.leaveChannel();
      console.log('Left channel');
    } catch (error) {
      console.error('Failed to leave channel:', error);
      throw error;
    }
  }

  /**
   * Mute/unmute local audio
   */
  async toggleMute(mute: boolean): Promise<void> {
    if (!this.engine) {
      throw new Error('Agora engine not initialized');
    }

    try {
      if (mute) {
        await this.engine.muteLocalAudioStream(true);
      } else {
        await this.engine.muteLocalAudioStream(false);
      }
      console.log('Audio muted:', mute);
    } catch (error) {
      console.error('Failed to toggle mute:', error);
      throw error;
    }
  }

  /**
   * Enable/disable speakerphone
   */
  async setSpeakerphone(enabled: boolean): Promise<void> {
    if (!this.engine) {
      throw new Error('Agora engine not initialized');
    }

    try {
      await this.engine.setEnableSpeakerphone(enabled);
      console.log('Speakerphone enabled:', enabled);
    } catch (error) {
      console.error('Failed to set speakerphone:', error);
      throw error;
    }
  }

  /**
   * Clean up resources
   */
  async destroy(): Promise<void> {
    if (this.engine) {
      await this.leaveCall();
      await this.engine.destroy();
      this.engine = null;
      this.isInitialized = false;
      console.log('Agora engine destroyed');
    }
  }
}

// Export singleton instance
export const voiceService = VoiceService.getInstance();