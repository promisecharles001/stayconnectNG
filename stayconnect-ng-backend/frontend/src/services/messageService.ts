import api from './api';
import {
  Message,
  Conversation,
  SendMessageDto,
  CreateConversationDto,
  MessagesResponse,
  ConversationsResponse,
  MessageResponse,
} from '../types/message.types';

class MessageService {
  // Send a message in a conversation
  async sendMessage(conversationId: string, message: string): Promise<MessageResponse> {
    const data: SendMessageDto = { conversationId, message };
    const response = await api.post<MessageResponse>('/messages', data);
    return response.data;
  }

  // Get all conversations for the current user
  async getUserConversations(
    page: number = 1,
    limit: number = 20
  ): Promise<ConversationsResponse> {
    const response = await api.get<ConversationsResponse>(
      `/messages/conversations?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Get messages for a conversation
  async getConversationMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<MessagesResponse> {
    const response = await api.get<MessagesResponse>(
      `/messages/conversation/${conversationId}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Create a new conversation (if not exists)
  async createConversation(
    hostId: string,
    propertyId: string,
    initialMessage?: string
  ): Promise<Conversation> {
    const data: CreateConversationDto = { hostId, propertyId, initialMessage };
    const response = await api.post<Conversation>('/messages/conversations', data);
    return response.data;
  }

  // Get or create conversation
  async getOrCreateConversation(
    hostId: string,
    propertyId: string
  ): Promise<Conversation> {
    try {
      // Try to find existing conversation
      const conversations = await this.getUserConversations(1, 100);
      const existingConversation = conversations.conversations.find(
        (conv) => conv.hostId === hostId && conv.propertyId === propertyId
      );

      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation if not found
      return await this.createConversation(hostId, propertyId);
    } catch (error) {
      console.error('Get or create conversation error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const messageService = new MessageService();
export default messageService;
