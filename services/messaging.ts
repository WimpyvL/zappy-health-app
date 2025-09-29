import { apiClient } from '../lib/apiClient'
import type { DatabaseConversation, DatabaseDoctor, DatabaseMessage } from '../types'

export interface ConversationWithDoctor extends DatabaseConversation {
  doctor: DatabaseDoctor
  lastMessage?: DatabaseMessage
  unreadCount?: number
}

export interface MessageWithSender extends DatabaseMessage {
  sender: {
    id: string
    full_name: string | null
    avatar_url: string | null
    is_doctor?: boolean
    specialty?: string
    theme_color?: string
  }
}

export class MessagingService {
  static async getConversations(userId: string): Promise<ConversationWithDoctor[]> {
    try {
      return await apiClient.get<ConversationWithDoctor[]>(`messaging/conversations`, {
        query: { userId }
      })
    } catch (error) {
      console.error('Error fetching conversations:', error)
      throw error
    }
  }

  static async getMessages(conversationId: string): Promise<MessageWithSender[]> {
    try {
      return await apiClient.get<MessageWithSender[]>(`messaging/conversations/${conversationId}/messages`)
    } catch (error) {
      console.error('Error fetching messages:', error)
      throw error
    }
  }

  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType: string = 'text'
  ): Promise<MessageWithSender> {
    try {
      return await apiClient.post<MessageWithSender>(`messaging/conversations/${conversationId}/messages`, {
        senderId,
        content,
        messageType,
      })
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  static async createConversation(
    patientId: string,
    doctorId: string,
    subject?: string
  ): Promise<ConversationWithDoctor> {
    try {
      return await apiClient.post<ConversationWithDoctor>('messaging/conversations', {
        patientId,
        doctorId,
        subject,
      })
    } catch (error) {
      console.error('Error creating conversation:', error)
      throw error
    }
  }

  static async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    try {
      await apiClient.post('messaging/messages/read', {
        messageIds,
        userId,
      })
    } catch (error) {
      console.error('Error marking messages as read:', error)
      throw error
    }
  }

  static async getDoctors(): Promise<DatabaseDoctor[]> {
    try {
      return await apiClient.get<DatabaseDoctor[]>('messaging/doctors')
    } catch (error) {
      console.error('Error fetching doctors:', error)
      throw error
    }
  }

  static subscribeToMessages(_conversationId: string, _callback: (payload: unknown) => void) {
    console.warn('Real-time messaging subscriptions are not yet implemented.')
    return {
      unsubscribe() {
        /* noop */
      }
    }
  }

  static subscribeToConversations(_userId: string, _callback: (payload: unknown) => void) {
    console.warn('Real-time conversation subscriptions are not yet implemented.')
    return {
      unsubscribe() {
        /* noop */
      }
    }
  }

  static unsubscribe(subscription: { unsubscribe: () => void }) {
    subscription.unsubscribe()
  }

  static formatMessageTime(timestamp: string): string {
    const messageDate = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - messageDate.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) {
      return 'Just now'
    } else if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    }

    return messageDate.toLocaleDateString()
  }
}
