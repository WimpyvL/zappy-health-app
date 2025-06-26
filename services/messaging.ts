import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type Doctor = Database['public']['Tables']['doctors']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];
type ConversationInsert = Database['public']['Tables']['conversations']['Insert'];

export interface ConversationWithDoctor extends Conversation {
  doctor: Doctor;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface MessageWithSender extends Message {
  sender: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    is_doctor?: boolean;
    specialty?: string;
    theme_color?: string;
  };
}

export class MessagingService {
  // Get all conversations for the current user
  static async getConversations(userId: string): Promise<ConversationWithDoctor[]> {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        doctor:doctors!conversations_doctor_id_fkey(*)
      `)
      .eq('patient_id', userId)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    // Get unread message counts for each conversation
    const conversationsWithCounts = await Promise.all(
      conversations.map(async (conv) => {
        const { count } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .is('read_at', null)
          .neq('sender_id', userId);

        // Get the last message
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        return {
          ...conv,
          unreadCount: count || 0,
          lastMessage: lastMessage || undefined
        };
      })
    );

    return conversationsWithCounts;
  }

  // Get messages for a specific conversation
  static async getMessages(conversationId: string): Promise<MessageWithSender[]> {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    // Enhance sender info with doctor details if applicable
    const enhancedMessages = await Promise.all(
      messages.map(async (message) => {
        const { data: doctor } = await supabase
          .from('doctors')
          .select('specialty, theme_color')
          .eq('user_id', message.sender_id)
          .single();

        return {
          ...message,
          sender: {
            ...message.sender,
            is_doctor: !!doctor,
            specialty: doctor?.specialty,
            theme_color: doctor?.theme_color
          }
        };
      })
    );

    return enhancedMessages;
  }

  // Send a new message
  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType: string = 'text'
  ): Promise<Message> {
    const messageData: MessageInsert = {
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      message_type: messageType
    };

    const { data: message, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return message;
  }

  // Create a new conversation with a doctor
  static async createConversation(
    patientId: string,
    doctorId: string,
    subject?: string
  ): Promise<Conversation> {
    const conversationData: ConversationInsert = {
      patient_id: patientId,
      doctor_id: doctorId,
      subject
    };

    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert(conversationData)
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }

    return conversation;
  }

  // Mark messages as read
  static async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    const readStatusData = messageIds.map(messageId => ({
      message_id: messageId,
      user_id: userId
    }));

    const { error } = await supabase
      .from('message_read_status')
      .insert(readStatusData);

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error marking messages as read:', error);
      throw error;
    }

    // Update the read_at timestamp on the messages
    const { error: updateError } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .in('id', messageIds);

    if (updateError) {
      console.error('Error updating message read timestamps:', updateError);
    }
  }

  // Get available doctors
  static async getDoctors(): Promise<Doctor[]> {
    const { data: doctors, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('is_active', true)
      .order('full_name');

    if (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }

    return doctors;
  }

  // Subscribe to new messages for a conversation
  static subscribeToMessages(
    conversationId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`messages:conversation_id=eq.${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        callback
      )
      .subscribe();
  }

  // Subscribe to conversation updates
  static subscribeToConversations(
    userId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`conversations:patient_id=eq.${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `patient_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }

  // Unsubscribe from realtime updates
  static unsubscribe(subscription: any) {
    return supabase.removeChannel(subscription);
  }

  // Format message time for display
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
