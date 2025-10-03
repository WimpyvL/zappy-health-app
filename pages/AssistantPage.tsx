import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Heart, 
  MessageCircle,
  Trash2,
  Loader2
} from 'lucide-react';
import {
  ChatMessage,
  sendMessage,
  getConversationStarters,
  getQuickResponses,
  saveConversation,
  loadConversation,
  clearConversation
} from '../lib/deepseekService';
import { verifyDeepSeekConfig } from '../lib/deepseekVerify';

const AssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversation history on mount
  useEffect(() => {
    // Verify DeepSeek configuration
    verifyDeepSeekConfig();
    
    const savedMessages = loadConversation();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
      setShowStarters(false);
    } else {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: "Hey there! 👋 I'm Zap, your personal health assistant! I'm here to help you crush your health goals, answer questions about Zappy products, and keep you motivated every step of the way. What would you like to talk about today? 💪✨",
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input after loading
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageContent,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setShowStarters(false);
    setIsLoading(true);

    try {
      // Get response from DeepSeek
      const response = await sendMessage(newMessages.filter(m => m.role !== 'system'));
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: Date.now()
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      saveConversation(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "Oops! I had a little hiccup there. 😅 Could you try asking that again? I'm here to help!",
        timestamp: Date.now()
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterClick = (starter: string) => {
    const cleanStarter = starter.replace(/[🎯💇✨📱💪]/g, '').trim();
    handleSendMessage(cleanStarter);
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear this conversation? This cannot be undone.')) {
      clearConversation();
      setMessages([{
        role: 'assistant',
        content: "Fresh start! 🌟 I'm here whenever you need me. What's on your mind?",
        timestamp: Date.now()
      }]);
      setShowStarters(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const conversationStarters = getConversationStarters();
  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
  const quickResponses = lastAssistantMessage 
    ? getQuickResponses(lastAssistantMessage.content)
    : [];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Zap</h1>
                <p className="text-xs text-gray-500">Your Health Assistant</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Clear conversation"
          >
            <Trash2 className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {message.timestamp && (
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-purple-100' : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </p>
                )}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 ml-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                  <span className="text-sm text-gray-600">Zap is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Conversation Starters */}
      {showStarters && messages.length <= 1 && (
        <div className="px-4 pb-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-600 mb-3 font-medium">Try asking me about:</p>
            <div className="flex flex-wrap gap-2">
              {conversationStarters.map((starter, index) => (
                <button
                  key={index}
                  onClick={() => handleStarterClick(starter)}
                  className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-full text-sm hover:bg-purple-50 transition-colors shadow-sm"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Responses */}
      {!showStarters && quickResponses.length > 0 && !isLoading && (
        <div className="px-4 pb-2">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {quickResponses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(response)}
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
                >
                  {response}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Zap anything about your health journey..."
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 bottom-2 p-2 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Zap is powered by AI and here to motivate you! <Heart className="w-3 h-3 inline text-pink-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;