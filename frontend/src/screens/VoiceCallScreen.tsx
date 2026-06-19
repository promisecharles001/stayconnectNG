import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { voiceService, VoiceCallConfig } from '../services/voiceService';
import { useAuth } from '../contexts/AuthContext';

interface VoiceCallScreenProps {
  route: {
    params: {
      bookingId: string;
      otherUserId: number;
      otherUserName: string;
    };
  };
  navigation: any;
}

const VoiceCallScreen: React.FC<VoiceCallScreenProps> = ({ route, navigation }) => {
  const { bookingId, otherUserId, otherUserName } = route.params;
  const { user, jwtToken } = useAuth();
  
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);

  const channelName = `booking-${bookingId}`;
  const localUid = user?.id || Math.floor(Math.random() * 100000);
  const remoteUid = otherUserId;

  useEffect(() => {
    initializeAgora();
    
    return () => {
      cleanupCall();
    };
  }, []);

  const initializeAgora = async () => {
    try {
      // Get Agora App ID from environment or config
      const appId = 'YOUR_AGORA_APP_ID'; // Replace with your actual App ID
      await voiceService.initialize(appId);
    } catch (error) {
      console.error('Failed to initialize Agora:', error);
      Alert.alert('Error', 'Failed to initialize voice calling service');
    }
  };

  const startCall = async () => {
    try {
      // Get token from backend
      const tokenResponse = await voiceService.getAgoraToken(
        channelName,
        localUid,
        jwtToken || ''
      );

      const config: VoiceCallConfig = {
        appId: 'YOUR_AGORA_APP_ID',
        channelName: tokenResponse.channelName,
        uid: tokenResponse.uid,
        token: tokenResponse.token,
      };

      // Join the call
      await voiceService.joinCall(config);
      setIsInCall(true);

      // Start call timer
      startCallTimer();

      console.log('Call started successfully');
    } catch (error) {
      console.error('Failed to start call:', error);
      Alert.alert('Error', 'Failed to start call');
    }
  };

  const endCall = async () => {
    try {
      await voiceService.leaveCall();
      setIsInCall(false);
      cleanupCall();
      console.log('Call ended');
      
      // Navigate back or to another screen
      navigation.goBack();
    } catch (error) {
      console.error('Failed to end call:', error);
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
    try {
      await voiceService.setSpeakerphone(!isSpeakerOn);
      setIsSpeakerOn(!isSpeakerOn);
    } catch (error) {
      console.error('Failed to toggle speaker:', error);
    }
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
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Call</Text>
        <Text style={styles.subtitle}>Calling {otherUserName}</Text>
        {isInCall && (
          <Text style={styles.timer}>{formatTime(callDuration)}</Text>
        )}
      </View>

      <View style={styles.userAvatar}>
        <Text style={styles.avatarText}>
          {otherUserName.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.controls}>
        {!isInCall ? (
          <TouchableOpacity style={styles.callButton} onPress={startCall}>
            <Text style={styles.callButtonText}>Start Call</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.controlRow}>
              <TouchableOpacity
                style={[styles.controlButton, isMuted && styles.mutedButton]}
                onPress={toggleMute}
              >
                <Text style={styles.controlButtonText}>
                  {isMuted ? '🔇' : '🎤'}
                </Text>
                <Text style={styles.controlLabel}>
                  {isMuted ? 'Unmute' : 'Mute'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, isSpeakerOn && styles.speakerButton]}
                onPress={toggleSpeaker}
              >
                <Text style={styles.controlButtonText}>
                  {isSpeakerOn ? '🔊' : '🔈'}
                </Text>
                <Text style={styles.controlLabel}>
                  {isSpeakerOn ? 'Speaker Off' : 'Speaker On'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.callButton, styles.endCallButton]}
              onPress={endCall}
            >
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
    marginBottom: 16,
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
  controlButtonText: {
    fontSize: 24,
    marginBottom: 8,
  },
  controlLabel: {
    fontSize: 14,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    marginBottom: 20,
  },
  endCallButton: {
    backgroundColor: '#ff3b30',
  },
  callButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default VoiceCallScreen;