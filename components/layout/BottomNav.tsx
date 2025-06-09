
import React from 'react';
import { Link } from 'react-router-dom';
import { NavItemType, Page } from '../../types';
import { NAVIGATION_ITEMS, PlusIcon } from '../../constants';

interface BottomNavProps {
  activePage: Page;
  isFabActive: boolean;
  onFabClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, isFabActive, onFabClick }) => {
  const leftItems = NAVIGATION_ITEMS.slice(0, 2); // Home, Health
  const rightItems = NAVIGATION_ITEMS.slice(2); // Learn, Shop
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bottom-nav-with-fab z-40" role="navigation" aria-label="Main navigation"> {/* Ensure z-index is appropriate */}
      <div className="bottom-nav flex h-[72px]"> {/* Fixed height for consistency */}
        {leftItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-item flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 ${activePage === item.id ? 'active' : ''}`}
            role="button"
            aria-label={`${item.ariaLabel}${activePage === item.id ? ' - Current page' : ''}`}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className={`text-xs ${activePage === item.id ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
          </Link>
        ))}
        
        <div className="flex-1 relative">
          {/* Spacer for FAB. FAB is positioned absolutely on top of this. */}
        </div>
        
        {rightItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-item flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 ${activePage === item.id ? 'active' : ''}`}
            role="button"
            aria-label={`${item.ariaLabel}${activePage === item.id ? ' - Current page' : ''}`}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className={`text-xs ${activePage === item.id ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
          </Link>
        ))}
      </div>
      
      <button 
        className={`nav-fab flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isFabActive ? 'active' : ''}`} 
        id="navFab" 
        onClick={onFabClick}
        aria-label="Quick actions menu" 
        aria-expanded={isFabActive} 
        aria-haspopup="true"
      >
        <PlusIcon className={`w-6 h-6 text-white transition-transform duration-300 ${isFabActive ? 'rotate-45 scale-110' : 'rotate-0 scale-100'}`} />
      </button>
    </nav>
  );
};

export default BottomNav;
