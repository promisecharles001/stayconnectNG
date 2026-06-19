import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import messageService from '../services/messageService';
import notificationService from '../services/notificationService';
import { Message, Conversation } from '../types/message.types';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

type ChatScreenRouteProp = RouteProp<AppStackParamList, 'Chat'>;
type ChatScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Chat'>;

interface RouteParams {
  conversationId: string;
  propertyTitle?: string;
  otherUserName?: string;
}

const ChatScreen: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  const flatListRef = useRef<FlatList>(null);

  const { conversationId, propertyTitle, otherUserName } = route.params as RouteParams;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const currentUserId = user?.id?.toString();

  const fetchMessages = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await messageService.getConversationMessages(conversationId, pageNum, 50);

      if (append) {
        setMessages((prev) => [...response.messages, ...prev]);
      } else {
        setMessages(response.messages);
      }

      setHasMore(pageNum < response.meta.totalPages);
      setPage(pageNum);
    } catch (error: any) {
      console.error('Fetch messages error:', error);
      showError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages(1, false);
  }, [fetchMessages]);

  // Set navigation title
  useEffect(() => {
    navigation.setOptions({
      title: otherUserName || 'Chat',
    });
  }, [navigation, otherUserName]);

  const handleSendMessage = async (messageText: string): Promise<void> => {
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      conversationId,
      senderId: user?.id || 'me',
      senderName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'You',
      message: messageText,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    // Optimistically add message immediately
    setMessages((prev) => [...prev, optimisticMessage]);
    setSending(true);

    // Scroll to bottom immediately
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);

    try {
      const response = await messageService.sendMessage(conversationId, messageText);

      // Replace optimistic message with confirmed message
      const confirmedMessage: Message = {
        id: response.id,
        conversationId: response.conversationId,
        senderId: response.senderId,
        senderName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'You',
        message: response.message,
        createdAt: response.createdAt,
      };

      setMessages((prev) => prev.map((m) => (m.id === tempId ? confirmedMessage : m)));

      // Show success toast for message sent
      // Note: In a real app, you might want to skip this for every message
      // and only show on the first message in a conversation
      if (messages.length === 0) {
        showSuccess(`Message sent to ${otherUserName || 'host'}`);
      }
    } catch (error: any) {
      console.error('Send message error:', error);
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      showError('Failed to send message. Please try again.');
      throw error;
    } finally {
      setSending(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchMessages(page + 1, true);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = currentUserId !== undefined && item.senderId === currentUserId;
    return <MessageBubble message={item} isCurrentUser={isCurrentUser} />;
  };

  const renderHeader = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header Info */}
        {propertyTitle && (
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyLabel}>Regarding:</Text>
            <Text style={styles.propertyTitle}>{propertyTitle}</Text>
          </View>
        )}

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          ListHeaderComponent={renderHeader}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          inverted={false}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (messages.length > 0 && page === 1) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
        />

        {/* Chat Input */}
        <ChatInput
          onSend={handleSendMessage}
          disabled={sending}
          placeholder="Type a message..."
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  propertyInfo: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  propertyLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  messagesList: {
    paddingVertical: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default ChatScreen;
