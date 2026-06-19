export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
  pending?: boolean;
}

export interface Conversation {
  id: string;
  guestId: string;
  guestName: string;
  hostId: string;
  hostName: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  updatedAt: string;
}

export interface SendMessageDto {
  conversationId: string;
  message: string;
}

export interface CreateConversationDto {
  hostId: string;
  propertyId: string;
  initialMessage?: string;
}

export interface MessagesResponse {
  messages: Message[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ConversationsResponse {
  conversations: Conversation[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  message: string;
  createdAt: string;
}
