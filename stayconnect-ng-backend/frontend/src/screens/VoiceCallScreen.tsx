import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { voiceService, CallParticipant } from '../services/voiceService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AppStackParamList } from '../navigation/AppNavigator';

type VoiceCallScreenProps = StackScreenProps<AppStackParamList, 'VoiceCall'>;

const VoiceCallScreen: React.FC<VoiceCallScreenProps> = ({ route, navigation }) => {
  const { bookingId, propertyId, otherUserId, otherUserName } = route.params;
  const { user } = useAuth();
  const { showError, showInfo } = useToast();

  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnected'>('idle');
  const [participants, setParticipants] = useState<CallParticipant[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const channelName = bookingId ? `booking-${bookingId}` : `property-${propertyId}-${otherUserId}`;
  const participantName = user?.email || `user-${user?.id}`;

  useEffect(() => {
    requestAudioPermission();
    initializeVoiceService();

    return () => {
      cleanupCall();
    };
  }, []);

  const requestAudioPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        showError('Microphone permission is required for voice calls');
      }
    } catch (error) {
      console.warn('Audio permission request failed:', error);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    // Set up event callbacks
    voiceService.setEventCallbacks({
      onConnected: () => {
        setConnectionStatus('connected');
        setIsInCall(true);
        setIsLoading(false);
        startCallTimer();
      },
      onParticipantJoined: (participant) => {
        setParticipants(prev => [...prev, participant]);
      },
      onParticipantLeft: (participant) => {
        setParticipants(prev => prev.filter(p => p.identity !== participant.identity));
      },
      onParticipantSpeaking: (participant) => {
        // Update speaking status
        setParticipants(prev => prev.map(p => 
          p.identity === participant.identity 
            ? { ...p, isSpeaking: true }
            : { ...p, isSpeaking: false }
        ));
      },
      onDisconnected: () => {
        setConnectionStatus('disconnected');
        setIsInCall(false);
        cleanupCall();
      },
      onReconnecting: () => {
        setConnectionStatus('connecting');
      },
      onReconnected: () => {
        setConnectionStatus('connected');
      },
      onError: (error) => {
        setIsLoading(false);
        showError(error.message);
      },
    });
  }, []);

  const initializeVoiceService = async () => {
    try {
      await voiceService.initialize();
      console.log('Voice service initialized');
    } catch (error) {
      console.error('Failed to initialize voice service:', error);
      showError('Voice calling initialization failed. Build with EAS for full support.');
    }
  };

  const startCall = async () => {
    if (isInCall || connectionStatus === 'connecting') return;

    if (hasPermission === false) {
      showError('Microphone permission denied. Enable it in settings to make calls.');
      return;
    }

    try {
      setIsLoading(true);
      setConnectionStatus('connecting');

      // Get token from backend
      const tokenResponse = await voiceService.getVoiceToken(channelName, participantName);

      if (!tokenResponse || !tokenResponse.token) {
        throw new Error('Failed to get call token from server');
      }

      // Join the call
      await voiceService.joinCall({
        serverUrl: tokenResponse.serverUrl,
        roomName: tokenResponse.roomName,
        token: tokenResponse.token,
      });

      console.log('Call started successfully');
    } catch (error: any) {
      console.error('Failed to start call:', error);
      setIsLoading(false);
      setConnectionStatus('idle');
      showError(error.message || 'Failed to start call. Check your connection and try again.');
    }
  };

  const endCall = async () => {
    try {
      await voiceService.leaveCall();
      setIsInCall(false);
      setConnectionStatus('disconnected');
      cleanupCall();
      console.log('Call ended');
      
      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Failed to end call:', error);
      navigation.goBack();
    }
  };

  const toggleMute = async () => {
    try {
      await voiceService.toggleMute(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  };

  const toggleSpeaker = async () => {
    setIsSpeakerOn(!isSpeakerOn);
    // Note: Speaker control is handled automatically by LiveKit
    // This is just for UI state
  };

  const startCallTimer = () => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setCallTimer(timer);
  };

  const cleanupCall = () => {
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    setCallDuration(0);
    setParticipants([]);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionStatusText = (): string => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Ready to call';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Call</Text>
        <Text style={styles.subtitle}>Calling {otherUserName}</Text>
        <Text style={[
          styles.status,
          { color: connectionStatus === 'connected' ? '#4CAF50' : '#666' }
        ]}>
          {getConnectionStatusText()}
        </Text>
        {isInCall && (
          <Text style={styles.timer}>{formatTime(callDuration)}</Text>
        )}
      </View>

      <View style={styles.userAvatar}>
        <Text style={styles.avatarText}>
          {otherUserName.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Remote participants */}
      {participants.length > 0 && (
        <View style={styles.participantsContainer}>
          <Text style={styles.participantsLabel}>
            {participants.length} participant{participants.length > 1 ? 's' : ''} in call
          </Text>
        </View>
      )}

      <View style={styles.controls}>
        {!isInCall ? (
          <TouchableOpacity 
            style={[styles.callButton, isLoading && styles.callButtonDisabled]} 
            onPress={startCall}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.callButtonText}>Start Call</Text>
            )}
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.controlRow}>
              <TouchableOpacity
                style={[styles.controlButton, isMuted && styles.mutedButton]}
                onPress={toggleMute}
              >
                <Ionicons 
                  name={isMuted ? 'mic-off' : 'mic'} 
                  size={24} 
                  color={isMuted ? '#fff' : '#333'} 
                />
                <Text style={[styles.controlLabel, isMuted && styles.controlLabelActive]}>
                  {isMuted ? 'Unmute' : 'Mute'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, isSpeakerOn && styles.speakerButton]}
                onPress={toggleSpeaker}
              >
                <Ionicons 
                  name={isSpeakerOn ? 'volume-high' : 'volume-medium'} 
                  size={24} 
                  color={isSpeakerOn ? '#fff' : '#333'} 
                />
                <Text style={[styles.controlLabel, isSpeakerOn && styles.controlLabelActive]}>
                  {isSpeakerOn ? 'Speaker Off' : 'Speaker On'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.callButton, styles.endCallButton]}
              onPress={endCall}
            >
              <Ionicons name="call" size={20} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
              <Text style={styles.callButtonText}>End Call</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    marginBottom: 8,
  },
  timer: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
  userAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  participantsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  participantsLabel: {
    fontSize: 14,
    color: '#666',
  },
  controls: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 30,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  controlButton: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mutedButton: {
    backgroundColor: '#ff4444',
  },
  speakerButton: {
    backgroundColor: '#4CAF50',
  },
  controlLabel: {
    fontSize: 14,
    color: '#666',
  },
  controlLabelActive: {
    color: '#fff',
  },
  callButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    marginBottom: 20,
  },
  callButtonDisabled: {
    backgroundColor: '#999',
  },
  endCallButton: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    gap: 8,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default VoiceCallScreen;
