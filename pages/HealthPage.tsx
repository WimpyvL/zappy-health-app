
import React, { useContext } from 'react';
import Header from '../components/layout/Header';
import { ToastContext } from '../App';
import { RECENT_MESSAGES_DATA, TREATMENT_CATEGORIES_DATA, PencilIcon, ChevronRightIcon } from '../constants';
import { Message, TreatmentCategory, Treatment } from '../types';

const MessageCard: React.FC<Message> = ({ doctorName, specialty, timeAgo, dateTime, content, isUnread, themeColor, avatarIcon: AvatarIcon }) => {
  const toastContext = useContext(ToastContext);
  const handleClick = () => {
    toastContext?.addToast(`Opening message from ${doctorName}`, 'info');
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

const TreatmentCard: React.FC<Treatment> = ({ name, description, themeClass, icon: TreatmentIcon, tag }) => {
 const toastContext = useContext(ToastContext);
  const handleClick = () => {
    toastContext?.addToast(`Exploring ${name}`, 'info');
  };

  return (
    <article 
        className={`program-card-small ${themeClass}`} 
        style={{ minWidth: '180px', flexShrink: 0 }} 
        tabIndex={0} role="button" 
        aria-label={`${name} - ${description}`}
        onClick={handleClick}
    >
      {tag && <div className={`absolute top-4 right-4 ${tag === 'New' ? 'tag-new' : 'tag-popular'}`}>{tag}</div>}
      <div className="icon-bg">
        <TreatmentIcon className="w-5 h-5" />
      </div>
      <div>
        <h4>{name}</h4>
        <p>{description}</p>
      </div>
    </article>
  );
};


const HealthPage: React.FC = () => {
  const toastContext = useContext(ToastContext);

  const handleComposeMessage = () => {
    toastContext?.addToast('Opening new message composer...', 'info');
  };

  const handleViewAllMessages = () => {
    toastContext?.addToast('Viewing all messages...', 'info');
  };

  const handleViewAllCategory = (categoryTitle: string) => {
    toastContext?.addToast(`Viewing all ${categoryTitle.toLowerCase()} treatments...`, 'info');
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
              {RECENT_MESSAGES_DATA.map(msg => <MessageCard key={msg.id} {...msg} />)}
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
