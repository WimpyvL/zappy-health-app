
import React, { useContext, useState, useRef, useEffect } from 'react';
import { ProgramContext } from '../../App';
import { BellIcon } from '../../constants'; // Assuming BellIcon is in constants
import { AuthButton } from '../auth/AuthButton';
import { useProfile } from '../../hooks/useProfile';

interface HeaderProps {
  title?: string;
  subtitle?: string; // For Home page: "Good morning, Michel"
  showProfileImage?: boolean;
  showNotificationBell?: boolean;
  userName?: string; // For Home page greeting (fallback if profile not loaded)
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showProfileImage = true,
  showNotificationBell = false,
  userName,
  showBackButton = false,
  onBackClick
}) => {
  const programContext = useContext(ProgramContext);
  const { displayName, isProfileLoading } = useProfile();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [dragCurrentY, setDragCurrentY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  // If context is not available, or if no specific theme for header, use a default
  const headerThemeClass = programContext?.activeProgram?.themeClass || 'theme-weight';

  // Use profile name, fallback to prop
  const finalDisplayName = displayName || userName;

  // Close notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Handle drag to close
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - dragStartY;

    // Only allow dragging down
    if (diff > 0) {
      setDragCurrentY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    // If dragged down more than 100px, close the menu
    if (dragCurrentY > 100) {
      setIsNotificationOpen(false);
    }

    // Reset drag state
    setIsDragging(false);
    setDragCurrentY(0);
    setDragStartY(0);
  };

  const dragTransform = isDragging ? `translateY(${dragCurrentY}px)` : 'translateY(0)';

  return (
    <header className={`header-gradient pt-8 pb-5 px-6 ${headerThemeClass}`} role="banner">
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3 flex-1">
          {showBackButton && (
            <button
              onClick={onBackClick}
              className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center hover:bg-white/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm border border-white/20 flex-shrink-0"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex-1">
            {title && <h1 className="text-2xl font-bold text-white leading-tight">{title}</h1>}
            {finalDisplayName && (
               <h1 className="text-xl font-bold text-white leading-tight">
                Good morning, <span className="block font-light text-lg opacity-95">
                  {isProfileLoading ? (
                    <span className="inline-flex items-center">
                      <div className="animate-pulse bg-white/20 h-4 w-16 rounded"></div>
                    </span>
                  ) : (
                    finalDisplayName
                  )}
                </span>
              </h1>
            )}
            {subtitle && <p className={`text-base mt-1 ${finalDisplayName ? 'text-white/90' : 'text-white/85'}`}>{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showNotificationBell && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center hover:bg-white/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm border border-white/20"
                aria-label="View notifications"
                aria-expanded={isNotificationOpen}
              >
                <BellIcon className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold flex items-center justify-center">2</span>
                <span className="sr-only">2 unread notifications</span>
              </button>

              {/* Notification Menu */}
              <div
                className={`fixed left-0 right-0 bg-white rounded-t-3xl shadow-2xl ease-out ${
                  isNotificationOpen
                    ? 'bottom-0 opacity-100'
                    : 'bottom-0 translate-y-full opacity-0 pointer-events-none'
                } ${!isDragging && 'transition-all duration-300'}`}
                style={{
                  top: '20vh',
                  zIndex: 50,
                  transform: isNotificationOpen ? dragTransform : 'translateY(100%)'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                  <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

                {/* Menu Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                    <span className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors">
                      Mark all read
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">2 unread notifications</p>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
                  <div className="divide-y divide-gray-50">
                    {/* Sample Notification 1 - Medication Reminder */}
                    <div className="px-6 py-4 hover:bg-blue-50 transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 bg-blue-25 notification-item">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="notification-title">Medication Reminder</p>
                              <p className="notification-content">Time to take your Semaglutide injection. Don't forget to rotate injection sites for optimal absorption.</p>
                              <div className="flex items-center justify-between mt-3">
                                <p className="notification-timestamp">30 minutes ago</p>
                                <span className="notification-badge bg-blue-600 text-white">
                                  Mark as taken
                                </span>
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 ml-3 flex-shrink-0"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sample Notification 2 - Appointment */}
                    <div className="px-6 py-4 hover:bg-green-50 transition-all duration-200 cursor-pointer border-l-4 border-l-green-500 bg-green-25 notification-item">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="notification-title">Upcoming Appointment</p>
                              <p className="notification-content">Your follow-up consultation with Dr. Smith is confirmed for tomorrow at 2:00 PM.</p>
                              <div className="flex items-center justify-between mt-3">
                                <p className="notification-timestamp">2 hours ago</p>
                                <span className="notification-badge bg-green-600 text-white">
                                  View details
                                </span>
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-1 ml-3 flex-shrink-0"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sample Notification 3 - Message */}
                    <div className="px-6 py-4 hover:bg-purple-50 transition-all duration-200 cursor-pointer notification-item">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="notification-title">New Message from Dr. Smith</p>
                              <p className="notification-content">I've reviewed your recent blood work results. Overall, everything looks great and you're making excellent progress.</p>
                              <div className="flex items-center justify-between mt-3">
                                <p className="notification-timestamp">4 hours ago</p>
                                <span className="notification-badge text-purple-600 font-medium">
                                  Read message
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sample Notification 4 - Weekly Check-in */}
                    <div className="px-6 py-4 hover:bg-orange-50 transition-all duration-200 cursor-pointer notification-item">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="notification-title">Weekly Health Check-in</p>
                              <p className="notification-content">How are you feeling this week? Please complete your weekly health assessment to help us track your progress.</p>
                              <div className="flex items-center justify-between mt-3">
                                <p className="notification-timestamp">6 hours ago</p>
                                <span className="notification-badge text-orange-600 font-medium">
                                  Complete survey
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Empty state - shown when no notifications */}
                    {/* <div className="px-6 py-12 text-center">
                      <p className="text-gray-500">No new notifications</p>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Backdrop */}
              {isNotificationOpen && (
                <div
                  className="fixed inset-0 bg-black/40 notification-menu-backdrop transition-opacity duration-300"
                  style={{ zIndex: 40 }}
                  onClick={() => setIsNotificationOpen(false)}
                ></div>
              )}
            </div>
          )}
          {showProfileImage && (
            <div className="bg-white/10 rounded-full p-1 backdrop-blur-sm border border-white/20">
              <AuthButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
