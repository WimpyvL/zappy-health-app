import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import ConversationList from '../components/messaging/ConversationList';
import MessageThread from '../components/messaging/MessageThread';
import MessageComposer from '../components/messaging/MessageComposer';
import { useMessaging } from '../hooks/useMessaging';
import { useAuth } from '../contexts/AuthContext';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    selectConversation,
    sendMessage,
    refreshConversations
  } = useMessaging();

  // Handle URL parameters for auto-selecting conversation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const conversationId = searchParams.get('conversation');
    
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        selectConversation(conversationId);
      }
    }
  }, [location.search, conversations, selectConversation]);

  const handleRefresh = () => {
    refreshConversations();
  };

  if (!user) {
    return (
      <div className="flex flex-col flex-grow">
        <Header title="Messages" subtitle="Connect with your healthcare team" />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in required</h3>
            <p className="text-gray-600">Please sign in to access your messages</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow bg-white">
      <Header 
        title="Messages" 
        subtitle={currentConversation ? currentConversation.doctor.full_name : "Connect with your healthcare team"}
        showNotificationBell={true}
      />
      
      <main className="flex flex-1 overflow-hidden">
        {/* Conversation List - Left Sidebar */}
        <div className="w-full md:w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                aria-label="Refresh conversations"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto h-full">
            <ConversationList
              conversations={conversations}
              currentConversation={currentConversation}
              onSelectConversation={selectConversation}
              isLoading={isLoading && conversations.length === 0}
            />
          </div>
        </div>

        {/* Message Thread - Main Content */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${currentConversation.doctor.theme_color}-100 rounded-full flex items-center justify-center`}>
                    {currentConversation.doctor.avatar_url ? (
                      <img 
                        src={currentConversation.doctor.avatar_url} 
                        alt={currentConversation.doctor.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <svg className={`w-6 h-6 text-${currentConversation.doctor.theme_color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentConversation.doctor.full_name}</h3>
                    <p className="text-sm text-gray-600">{currentConversation.doctor.specialty}</p>
                    {currentConversation.subject && (
                      <p className="text-xs text-gray-500 italic">Re: {currentConversation.subject}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <MessageThread
                messages={messages}
                currentUserId={user.id}
                isLoading={isLoading && currentConversation !== null}
              />

              {/* Message Composer */}
              <MessageComposer
                onSendMessage={sendMessage}
                placeholder={`Message ${currentConversation.doctor.full_name}...`}
              />
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <div>
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600 mb-4">
                  Choose a conversation from the sidebar to start messaging
                </p>
                {conversations.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No conversations yet. Contact support to get started with a healthcare provider.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
