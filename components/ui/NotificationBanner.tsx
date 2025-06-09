
import React from 'react';
import { ChevronRightIcon, ExclamationCircleIcon } from '../../constants';

interface NotificationBannerProps {
  text: string;
  subtext: string;
  actionText: string;
  onClick: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ text, subtext, actionText, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="notification-banner w-full text-left transition-all duration-400 cursor-pointer group"
      tabIndex={0}
      role="button"
      aria-label={`Priority task: ${text}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4">
            <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center">
              <ExclamationCircleIcon className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1 text-[var(--text-color-amber-800)]" id="priority-text">{text}</p>
            <p className="text-xs text-amber-700 opacity-75">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-full font-medium shadow-sm">{actionText}</span>
          <ChevronRightIcon className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </button>
  );
};

export default NotificationBanner;
