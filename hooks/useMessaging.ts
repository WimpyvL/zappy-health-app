import { useState, useEffect, useCallback } from 'react';
import { MessagingService, ConversationWithDoctor, MessageWithSender } from '../services/messaging';
import { useAuth } from '../contexts/AuthContext';

export interface UseMessagingReturn {
  conversations: ConversationWithDoctor[];
  currentConversation: ConversationWithDoctor | null;
  messages: MessageWithSender[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  selectConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  createConversation: (doctorId: string, subject?: string) => Promise<void>;
  markAsRead: () => Promise<void>;
  refreshConversations: () => Promise<void>;
}

export const useMessaging = (): UseMessagingReturn => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDoctor[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ConversationWithDoctor | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await MessagingService.getConversations(user.id);
      setConversations(data);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await MessagingService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Select a conversation
  const selectConversation = useCallback(async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    setCurrentConversation(conversation);
    await loadMessages(conversationId);
  }, [conversations, loadMessages]);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !currentConversation) return;

    try {
      setError(null);
      await MessagingService.sendMessage(
        currentConversation.id,
        user.id,
        content
      );
      await loadMessages(currentConversation.id);
      await loadConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  }, [user?.id, currentConversation, loadMessages, loadConversations]);

  // Create a new conversation
  const createConversation = useCallback(async (doctorId: string, subject?: string) => {
    if (!user?.id) return;

    try {
      setError(null);
      const conversation = await MessagingService.createConversation(
        user.id,
        doctorId,
        subject
      );
      await loadConversations(); // Refresh the list
      await selectConversation(conversation.id);
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Failed to create conversation');
    }
  }, [user?.id, loadConversations, selectConversation]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!user?.id || !currentConversation) return;

    try {
      const unreadMessages = messages.filter(m => 
        !m.read_at && m.sender_id !== user.id
      );
      
      if (unreadMessages.length > 0) {
        await MessagingService.markMessagesAsRead(
          unreadMessages.map(m => m.id),
          user.id
        );
        // Update local state
        setMessages(prev => prev.map(m => 
          unreadMessages.find(um => um.id === m.id) 
            ? { ...m, read_at: new Date().toISOString() }
            : m
        ));
      }
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [user?.id, currentConversation, messages]);

  // Refresh conversations
  const refreshConversations = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to conversation updates
    const conversationSub = MessagingService.subscribeToConversations(
      user.id,
      (payload) => {
        console.log('Conversation update:', payload);
        loadConversations(); // Refresh conversations when they change
      }
    );

    // Subscribe to messages in current conversation
    let messageSub: any = null;
    if (currentConversation) {
      messageSub = MessagingService.subscribeToMessages(
        currentConversation.id,
        (payload) => {
          console.log('New message:', payload);
          if (payload.eventType === 'INSERT') {
            // Add new message to the list
            loadMessages(currentConversation.id);
          }
        }
      );
    }

    // Cleanup subscriptions
    return () => {
      MessagingService.unsubscribe(conversationSub);
      if (messageSub) {
        MessagingService.unsubscribe(messageSub);
      }
    };
  }, [user?.id, currentConversation, loadConversations, loadMessages]);

  // Load conversations on mount
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id, loadConversations]);

  // Mark messages as read when conversation is viewed
  useEffect(() => {
    if (currentConversation && messages.length > 0) {
      // Auto-mark as read after a short delay
      const timer = setTimeout(() => {
        markAsRead();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentConversation, messages, markAsRead]);

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    selectConversation,
    sendMessage,
    createConversation,
    markAsRead,
    refreshConversations
  };
};
