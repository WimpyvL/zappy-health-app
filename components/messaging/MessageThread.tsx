import React, { useRef, useEffect } from 'react';
import { MessageWithSender } from '../../services/messaging';
import { MessagingService } from '../../services/messaging';
import { UserCircleIcon } from '../../constants';

interface MessageThreadProps {
  messages: MessageWithSender[];
  currentUserId: string;
  isLoading: boolean;
}

const MessageBubble: React.FC<{
  message: MessageWithSender;
  isOwnMessage: boolean;
}> = ({ message, isOwnMessage }) => {
  const { content, created_at, sender, read_at } = message;
  
  return (
    <div className={`message-bubble mb-4 ${isOwnMessage ? 'flex justify-end' : 'flex justify-start'}`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwnMessage && (
          <div className={`w-8 h-8 bg-${sender.theme_color || 'blue'}-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0`}>
            {sender.avatar_url ? (
              <img 
                src={sender.avatar_url} 
                alt={sender.full_name || 'User'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className={`w-5 h-5 text-${sender.theme_color || 'blue'}-600`} />
            )}
          </div>
        )}

        {/* Message Content */}
        <div>
          {!isOwnMessage && (
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium text-gray-900 mr-2">
                {sender.full_name}
              </span>
              {sender.is_doctor && (
                <span className={`text-xs px-2 py-0.5 rounded-full bg-${sender.theme_color || 'blue'}-100 text-${sender.theme_color || 'blue'}-800`}>
                  {sender.specialty}
                </span>
              )}
            </div>
          )}
          
          <div className={`message-content px-4 py-2 rounded-lg ${
            isOwnMessage 
              ? 'bg-blue-600 text-white' 
              : `bg-${sender.theme_color || 'blue'}-50 text-gray-900`
          }`}>
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
          
          <div className={`flex items-center mt-1 text-xs text-gray-500 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <time dateTime={created_at}>
              {MessagingService.formatMessageTime(created_at)}
            </time>
            {isOwnMessage && read_at && (
              <span className="ml-2 text-blue-600">✓ Read</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  currentUserId,
  isLoading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <p className="text-gray-600">No messages yet. Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-thread flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwnMessage={message.sender_id === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageThread;
