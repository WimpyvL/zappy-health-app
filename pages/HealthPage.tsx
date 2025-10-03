
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Heart, Calendar, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import { RECENT_MESSAGES_DATA, PencilIcon, ChevronRightIcon } from '../constants';
import { Message } from '../types';
import { useMessaging } from '../hooks/useMessaging';
import { MessagingService } from '../services/messaging';
import { ProgramContext } from '../App';

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
// Health Metric Card Component
interface HealthMetricProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  unit: string;
  status: 'good' | 'warning' | 'alert';
  lastUpdated: string;
}

const HealthMetricCard: React.FC<HealthMetricProps> = ({ icon: Icon, title, value, unit, status, lastUpdated }) => {
  const statusColors = {
    good: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    alert: 'bg-red-50 border-red-200'
  };

  const statusIconColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    alert: 'text-red-600'
  };

  return (
    <div className={`rounded-xl border-2 ${statusColors[status]} p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${statusColors[status]} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${statusIconColors[status]}`} />
        </div>
        <div className={`text-xs ${statusIconColors[status]} font-medium`}>
          {status === 'good' ? '✓ Normal' : status === 'warning' ? '⚠ Monitor' : '⚠ Alert'}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-600">{unit}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">Updated {lastUpdated}</p>
    </div>
  );
};

// Upcoming Appointment Card Component
interface AppointmentProps {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
}

const AppointmentCard: React.FC<AppointmentProps> = ({ doctorName, specialty, date, time, type }) => {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 p-4 hover:border-blue-200 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{doctorName}</h4>
            <p className="text-xs text-gray-600">{specialty}</p>
          </div>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
          {type}
        </span>
      </div>
      <div className="flex items-center space-x-4 text-sm text-gray-700">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1 text-gray-500" />
          <span>{date}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-gray-500" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};



const HealthPage: React.FC = () => {
  const navigate = useNavigate();
  const { conversations } = useMessaging();
  const programContext = useContext(ProgramContext);

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

  // Sample health data (in a real app, this would come from the backend)
  const healthMetrics = [
    { icon: Heart, title: 'Heart Rate', value: '72', unit: 'bpm', status: 'good' as const, lastUpdated: '2 hours ago' },
    { icon: Activity, title: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'good' as const, lastUpdated: '1 day ago' },
    { icon: TrendingUp, title: 'Weight', value: '165', unit: 'lbs', status: 'good' as const, lastUpdated: '3 days ago' },
    { icon: AlertCircle, title: 'Blood Glucose', value: '95', unit: 'mg/dL', status: 'good' as const, lastUpdated: '5 hours ago' }
  ];

  const upcomingAppointments = [
    {
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Primary Care',
      date: 'Oct 15, 2025',
      time: '10:00 AM',
      type: 'Follow-up'
    },
    {
      doctorName: 'Dr. Michael Chen',
      specialty: 'Specialist',
      date: 'Oct 22, 2025',
      time: '2:30 PM',
      type: 'Consultation'
    }
  ];

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

        {/* Health Metrics Section */}
        <section className="mb-8" aria-label="Your health metrics">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Health Metrics</h2>
            <button
              onClick={() => navigate('/profile')}
              className="text-sm text-[var(--primary)] font-medium hover:opacity-80 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {healthMetrics.map((metric, index) => (
              <HealthMetricCard key={index} {...metric} />
            ))}
          </div>
        </section>

        {/* Upcoming Appointments Section */}
        <section className="mb-8" aria-label="Upcoming appointments">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <button
              onClick={() => navigate('/schedule')}
              className="text-sm text-[var(--primary)] font-medium hover:opacity-80 transition-colors"
            >
              Schedule New
            </button>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <AppointmentCard key={index} {...appointment} />
            ))}
          </div>
        </section>

        {/* Health Goals Section */}
        <section className="mb-8" aria-label="Your health goals">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Goals</h2>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Weight Management Program</h3>
                <p className="text-sm text-gray-600">Target: Lose 15 lbs by December 2025</p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-gray-900">8 lbs lost (53%)</span>
              </div>
              <div className="w-full bg-white rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '53%' }}></div>
              </div>
            </div>
            <button
              onClick={() => {
                programContext?.setActiveProgramById('weight');
                navigate('/');
              }}
              className="w-full mt-4 bg-white text-purple-600 font-medium py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors"
            >
              View Details
            </button>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section aria-label="Quick actions">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/shop')}
              className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[var(--primary)] transition-all group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 text-center">Order Treatments</p>
            </button>
            <button
              onClick={() => navigate('/messages')}
              className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[var(--primary)] transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 text-center">Ask a Doctor</p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HealthPage;
