
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { PencilIcon, ChevronRightIcon } from '../constants';
import { Message, Treatment } from '../types';
import { useMessaging } from '../hooks/useMessaging';
import { MessagingService } from '../services/messaging';
import { useTreatments } from '../hooks/useTreatments';

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

const TreatmentCard: React.FC<Treatment> = ({
  id,
  name,
  description,
  themeClass,
  icon: TreatmentIcon,
  tag,
  pricePerMonth,
  duration,
  frequency,
  isAvailable,
}) => {
  const navigate = useNavigate();
  const monthlyPriceLabel = typeof pricePerMonth === 'number' ? `$${pricePerMonth}/mo` : 'See details';
  const durationLabel = duration || 'Personalized plan';
  const frequencyLabel = frequency || 'Custom schedule';
  const availabilityLabel = isAvailable === false ? 'Waitlist' : 'Available now';
  const availabilityClass = isAvailable === false ? 'bg-gray-400' : isAvailable === true ? 'bg-green-500' : 'bg-gray-300';

  const handleClick = () => {
    // Navigate to treatments page and potentially pre-select this treatment
    navigate(`/treatments?treatment=${encodeURIComponent(id)}`);
  };

  return (
    <article 
        className={`program-card-small ${themeClass} relative min-w-[220px] flex-shrink-0`} 
        tabIndex={0} role="button" 
        aria-label={`${name} - ${description} - ${monthlyPriceLabel}`}
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
            <span className="text-sm font-semibold text-gray-900">{monthlyPriceLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Duration</span>
            <span className="text-xs text-gray-700">{durationLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Frequency</span>
            <span className="text-xs text-gray-700">{frequencyLabel}</span>
          </div>
        </div>

        {/* Availability indicator */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${availabilityClass}`}></div>
              <span className="text-xs text-gray-600">
                {availabilityLabel}
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
  const { categories, loading: treatmentsLoading, error: treatmentsError } = useTreatments();

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

  const hasMessages = recentMessages.length > 0;

  const categoriesWithTreatments = categories.filter(category => category.treatments.length > 0);

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
              {hasMessages ? (
                recentMessages.map(msg => <MessageCard key={msg.id} {...msg} />)
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                  <p className="font-medium text-gray-700">No messages yet</p>
                  <p className="mt-1">When you start a consultation, your care team will reach out here.</p>
                </div>
              )}
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

            {treatmentsError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {treatmentsError}
              </div>
            )}

            {treatmentsLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
                ))}
              </div>
            ) : categoriesWithTreatments.length > 0 ? (
              categoriesWithTreatments.map(category => (
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
                    {category.treatments.map(treatment => (
                      <TreatmentCard key={treatment.id} {...treatment} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-gray-200 p-6 text-center text-sm text-gray-600">
                <p className="font-medium text-gray-700">We&apos;re adding new treatments</p>
                <p className="mt-1">Check back soon for personalized programs tailored to your goals.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HealthPage;
