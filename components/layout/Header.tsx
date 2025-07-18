
import React, { useContext } from 'react';
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
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showProfileImage = true,
  showNotificationBell = false,
  userName
}) => {
  const programContext = useContext(ProgramContext);
  const { displayName, isProfileLoading } = useProfile();
  
  // If context is not available, or if no specific theme for header, use a default
  const headerThemeClass = programContext?.activeProgram?.themeClass || 'theme-weight';

  // Use profile name, fallback to prop
  const finalDisplayName = displayName || userName;

  return (
    <header className={`header-gradient pt-8 pb-5 px-6 ${headerThemeClass}`} role="banner">
      <div className="flex justify-between items-center relative z-10">
        <div>
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
        <div className="flex items-center gap-3">
          {showNotificationBell && (
            <button
              className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center hover:bg-white/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm border border-white/20"
              aria-label="View notifications"
            >
              <BellIcon className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold flex items-center justify-center">2</span>
              <span className="sr-only">2 unread notifications</span>
            </button>
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
