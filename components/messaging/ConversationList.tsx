import React from 'react';
import { ConversationWithDoctor } from '../../services/messaging';
import { MessagingService } from '../../services/messaging';
import { UserCircleIcon } from '../../constants';

interface ConversationListProps {
  conversations: ConversationWithDoctor[];
  currentConversation: ConversationWithDoctor | null;
  onSelectConversation: (conversationId: string) => void;
  isLoading: boolean;
}

const ConversationItem: React.FC<{
  conversation: ConversationWithDoctor;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ conversation, isSelected, onSelect }) => {
  const { doctor, lastMessage, unreadCount } = conversation;
  
  return (
    <article
      className={`conversation-item p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Conversation with ${doctor.full_name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex items-start space-x-3">
        {/* Doctor Avatar */}
        <div className={`w-12 h-12 bg-${doctor.theme_color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
          {doctor.avatar_url ? (
            <img 
              src={doctor.avatar_url} 
              alt={doctor.full_name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className={`w-8 h-8 text-${doctor.theme_color}-600`} />
          )}
        </div>

        {/* Conversation Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {doctor.full_name}
            </h3>
            <div className="flex items-center space-x-2">
              {lastMessage && (
                <time className="text-xs text-gray-500">
                  {MessagingService.formatMessageTime(lastMessage.created_at)}
                </time>
              )}
              {unreadCount && unreadCount > 0 && (
                <div className={`w-5 h-5 bg-${doctor.theme_color}-500 rounded-full flex items-center justify-center`}>
                  <span className="text-xs text-white font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-xs text-gray-600 mb-2">{doctor.specialty}</p>
          
          {lastMessage && (
            <p className="text-sm text-gray-700 truncate">
              {lastMessage.content}
            </p>
          )}
          
          {conversation.subject && (
            <p className="text-xs text-gray-500 mt-1 italic">
              Re: {conversation.subject}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversation,
  onSelectConversation,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-gray-600">
          Start a conversation with one of our healthcare providers
        </p>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={currentConversation?.id === conversation.id}
          onSelect={() => onSelectConversation(conversation.id)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
