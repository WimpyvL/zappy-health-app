import { apiFetch } from './apiClient';
import type { Conversation, Doctor, Message } from '../types/api';

export interface ConversationWithDoctor extends Conversation {
  doctor?: Doctor;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface MessageWithSender extends Message {
  sender?: {
    id: string;
    full_name?: string | null;
    avatar_url?: string | null;
    is_doctor?: boolean;
    specialty?: string | null;
    theme_color?: string | null;
    [key: string]: unknown;
  };
}

function extractList<T>(payload: unknown, keys: string[]): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    for (const key of keys) {
      const value = (payload as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        return value as T[];
      }
    }
  }

  return [];
}

function extractItem<T>(payload: unknown, keys: string[]): T | null {
  if (!payload) {
    return null;
  }

  if (typeof payload !== 'object') {
    return payload as T;
  }

  for (const key of keys) {
    const value = (payload as Record<string, unknown>)[key];
    if (value) {
      return value as T;
    }
  }

  return payload as T;
}

export class MessagingService {
  static async getConversations(userId: string): Promise<ConversationWithDoctor[]> {
    const response = await apiFetch<unknown>(`/messaging/conversations?userId=${encodeURIComponent(userId)}`);
    return extractList<ConversationWithDoctor>(response, ['data', 'items', 'conversations']);
  }

  static async getMessages(conversationId: string): Promise<MessageWithSender[]> {
    const response = await apiFetch<unknown>(`/messaging/conversations/${conversationId}/messages`);
    return extractList<MessageWithSender>(response, ['data', 'items', 'messages']);
  }

  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType: string = 'text'
  ): Promise<Message> {
    const response = await apiFetch<unknown>(`/messaging/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        senderId,
        content,
        messageType,
      }),
    });

    const message = extractItem<Message>(response, ['data', 'message']);
    if (!message) {
      throw new Error('Messaging API did not return a message payload');
    }

    return message;
  }

  static async createConversation(
    patientId: string,
    doctorId: string,
    subject?: string
  ): Promise<Conversation> {
    const response = await apiFetch<unknown>('/messaging/conversations', {
      method: 'POST',
      body: JSON.stringify({
        patientId,
        doctorId,
        subject,
      }),
    });

    const conversation = extractItem<Conversation>(response, ['data', 'conversation']);
    if (!conversation) {
      throw new Error('Messaging API did not return a conversation payload');
    }

    return conversation;
  }

  static async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    await apiFetch('/messaging/messages/mark-read', {
      method: 'POST',
      body: JSON.stringify({
        messageIds,
        userId,
      }),
    });
  }

  static async getDoctors(): Promise<Doctor[]> {
    const response = await apiFetch<unknown>('/messaging/doctors');
    return extractList<Doctor>(response, ['data', 'items', 'doctors']);
  }

  static subscribeToMessages(_conversationId: string, _callback: (payload: any) => void) {
    return { unsubscribe: () => undefined };
  }

  static subscribeToConversations(_userId: string, _callback: (payload: any) => void) {
    return { unsubscribe: () => undefined };
  }

  static unsubscribe(subscription: { unsubscribe?: () => void } | null) {
    if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe();
    }
  }

  static formatMessageTime(timestamp: string): string {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return messageDate.toLocaleDateString();
    }
  }
}
