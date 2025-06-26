
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { RECENT_MESSAGES_DATA, TREATMENT_CATEGORIES_DATA, PencilIcon, ChevronRightIcon } from '../constants';
import { Message, Treatment } from '../types';
import { useMessaging } from '../hooks/useMessaging';
import { MessagingService } from '../services/messaging';

const MessageCard: React.FC<Message> = ({ id, doctorName, specialty, timeAgo, dateTime, content, isUnread, themeColor, avatarIcon: AvatarIcon }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/messages?conversation=${encodeURIComponent(id)}`);
  };

  return (
    <article
      className={`message-card p-4 relative ${themeColor === 'blue' ? 'message-blue' : 'message-purple'}`}
      tabIndex={0}
      role="button"
      aria-label={`Message from ${doctorName} about ${content.substring(0, 30)}...`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`w-8 h-8 bg-${themeColor}-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
            <AvatarIcon className={`w-4 h-4 text-${themeColor}-600`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{doctorName}</h3>
            <p className="text-xs text-gray-600">{specialty}</p>
          </div>
        </div>
        <div className="flex items-center">
          <time className="text-xs text-gray-500 mr-2" dateTime={dateTime}>{timeAgo}</time>
          {isUnread && <div className={`w-3 h-3 bg-${themeColor}-500 rounded-full flex-shrink-0`} aria-label="Unread message"></div>}
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
    </article>
  );
};

const TreatmentCard: React.FC<Treatment> = ({ id, name, description, themeClass, icon: TreatmentIcon, tag }) => {
  const navigate = useNavigate();
  
  // Get treatment details for enhanced display
  const getTreatmentDetails = (treatmentId: string) => {
    const defaultDetails = {
      price: 99,
      duration: "3-6 months",
      frequency: "As prescribed",
      isAvailable: true
    };

    // Customize based on treatment type
    if (treatmentId.startsWith('wl')) {
      return {
        ...defaultDetails,
        price: 149,
        frequency: "Weekly",
        duration: "6-12 months"
      };
    } else if (treatmentId.startsWith('aa')) {
      return {
        ...defaultDetails,
        price: 79,
        frequency: "Daily",
        duration: "3-6 months"
      };
    } else if (treatmentId.startsWith('hs')) {
      return {
        ...defaultDetails,
        price: 89,
        frequency: "Twice daily",
        duration: "4-8 months"
      };
    }

    return defaultDetails;
  };

  const details = getTreatmentDetails(id);
  
  const handleClick = () => {
    // Navigate to treatments page and potentially pre-select this treatment
    navigate(`/treatments?treatment=${encodeURIComponent(id)}`);
  };

  return (
    <article 
        className={`program-card-small ${themeClass} relative min-w-[220px] flex-shrink-0`} 
        tabIndex={0} role="button" 
        aria-label={`${name} - ${description} - $${details.price}/month`}
        onClick={handleClick}
    >
      {tag && <div className={`absolute top-4 right-4 ${tag === 'New' ? 'tag-new' : 'tag-popular'}`}>{tag}</div>}
      
      <div className="icon-bg">
        <TreatmentIcon className="w-5 h-5" />
      </div>
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        {/* Enhanced details section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Price</span>
            <span className="text-sm font-semibold text-gray-900">${details.price}/mo</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Duration</span>
            <span className="text-xs text-gray-700">{details.duration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Frequency</span>
            <span className="text-xs text-gray-700">{details.frequency}</span>
          </div>
        </div>
        
        {/* Availability indicator */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${details.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs text-gray-600">
                {details.isAvailable ? 'Available now' : 'Waitlist'}
              </span>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
};


const HealthPage: React.FC = () => {
  const navigate = useNavigate();
  const { conversations } = useMessaging();

  // Convert database conversations to display format
  const recentMessages: Message[] = conversations.slice(0, 2).map(conv => ({
    id: conv.id,
    doctorName: conv.doctor.full_name,
    specialty: conv.doctor.specialty,
    timeAgo: MessagingService.formatMessageTime(conv.last_message_at),
    dateTime: conv.last_message_at,
    content: conv.lastMessage?.content || 'Start a conversation...',
    isUnread: (conv.unreadCount || 0) > 0,
    themeColor: conv.doctor.theme_color,
    avatarIcon: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  }));

  // Fallback to mock data if no real conversations exist
  const messagesToShow = recentMessages.length > 0 ? recentMessages : RECENT_MESSAGES_DATA;

  const handleComposeMessage = () => {
    navigate('/messages');
  };

  const handleViewAllMessages = () => {
    navigate('/messages');
  };

  const handleViewAllCategory = (categoryTitle: string) => {
    // Navigate to treatments page with category filter
    navigate(`/treatments?category=${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <div className="flex flex-col flex-grow">
      <Header title="Health" subtitle="The support you need, when you need it." />
      
      <main className="px-6 pt-5 pb-36 flex-grow" role="main">
        <section className="care-card mb-8" aria-label="Recent messages from healthcare providers">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
              <button 
                onClick={handleComposeMessage}
                className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center hover:bg-[var(--secondary)] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2" 
                aria-label="Compose new message"
              >
                <PencilIcon className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="space-y-4">
              {messagesToShow.map(msg => <MessageCard key={msg.id} {...msg} />)}
            </div>
            
            <button 
              onClick={handleViewAllMessages}
              className="w-full text-center text-[var(--primary)] text-sm font-semibold mt-4 py-3 hover:bg-[var(--light)] rounded-xl transition-colors" 
              aria-label="View all messages"
            >
              View all messages
              <ChevronRightIcon className="w-4 h-4 inline-block ml-1" />
            </button>
          </div>
        </section>
        
        <section aria-label="Explore available treatments">
          <div className="mb-8">
            <h2 className="section-title">Explore treatments</h2>
            <p className="section-subtitle">Our most popular programs</p>
            
            {TREATMENT_CATEGORIES_DATA.map(category => (
              <div key={category.id} className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="category-title">{category.title}</h3>
                  <button 
                    onClick={() => handleViewAllCategory(category.title)}
                    className={`text-sm font-medium ${category.themeColorClass} hover:opacity-80 transition-colors`} 
                    aria-label={category.viewAllLabel}
                  >
                    View All
                  </button>
                </div>
                <div className="program-grid overflow-x-auto" data-category={category.id}>
                  {category.treatments.map(treatment => <TreatmentCard key={treatment.id} {...treatment} />)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HealthPage;
