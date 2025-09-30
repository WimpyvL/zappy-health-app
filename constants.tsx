import React from 'react';
import { NavItemType, Page, Program, QuickAction } from './types';

// SVG Icons (as functional components)
export const HomeIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
  </svg>
);

export const HealthIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
  </svg>
);

export const LearnIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
  </svg>
);

export const ShopIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>
  </svg>
);

export const PlusIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
  </svg>
);

export const BellIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
  </svg>
);

export const PackageIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
  </svg>
);

export const CheckCircleIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

export const ExclamationCircleIcon = ({ className }: { className?: string }): React.ReactNode => (
 <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

export const ChevronRightIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
  </svg>
);

export const ArrowTrendingDownIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7-7m0 0l-7 7m7-7v18"></path>
  </svg>
);

export const CalendarIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

export const RefillIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
  </svg>
);

export const InformationCircleIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

export const CheckIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

export const FireIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
  </svg>
);

// Quick Actions Icons
export const SupportIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
  </svg>
);
export const ReferIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121L15.5 15.5l-2.5-2.5c-.779-.779-2.049-.779-2.828 0L8.5 14.5l-1.304-1.379A3 3 0 002 15v2h5.5"></path>
  </svg>
);
export const ShareIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
  </svg>
);
export const AssistantIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
  </svg>
);

export const PencilIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
  </svg>
);

export const UserCircleIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
  </svg>
);

// Health Page & Shop Page Common Icons
export const SyringeIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
  </svg>
);
export const ClipboardListIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
  </svg>
);
export const LightningBoltIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
  </svg>
);
export const StarIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
);
export const UserIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);
export const SunIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);
export const HeartIcon = ({ className }: { className?: string }): React.ReactNode => HealthIcon({ className }); 

export const SparklesIcon = ({ className }: { className?: string }): React.ReactNode => ( // Specific Sparkles
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 2.47a.75.75 0 011.06 0l1.5 1.5a.75.75 0 010 1.06l-1.5 1.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 010-1.06l1.5-1.5zM5 10.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm13.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm-4.509 7.03a.75.75 0 011.06 0l1.5 1.5a.75.75 0 010 1.06l-1.5 1.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 010-1.06l1.5-1.5zM12 4.5a.75.75 0 01.75-.75h.01a.75.75 0 010 1.5h-.01a.75.75 0 01-.75-.75zm0 15a.75.75 0 01.75-.75h.01a.75.75 0 010 1.5h-.01a.75.75 0 01-.75-.75z" />
    </svg>
);

export const HairIcon = ({ className }: { className?: string }): React.ReactNode => (
 <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l4 4m-4-4l4-4m6 1h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4a2 2 0 012-2z"></path>
  </svg>
);

export const ClockIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

export const ArrowUpIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
  </svg>
);

export const PillBottleIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5l-2.25-2.25H5.25L3 10.5m18 0V19.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5V10.5m18 0h-2.25m-13.5 0H3M12 3v5.25m0 0H9.75M12 8.25H14.25M9 14.25h6M9 16.5h6" />
  </svg>
);


export const NAVIGATION_ITEMS: NavItemType[] = [
  { id: Page.Home, label: 'Home', path: '/', icon: HomeIcon, ariaLabel: 'Home' },
  { id: Page.Health, label: 'Health', path: '/health', icon: HealthIcon, ariaLabel: 'Health' },
  { id: Page.Learn, label: 'Learn', path: '/learn', icon: LearnIcon, ariaLabel: 'Learn' },
  { id: Page.Shop, label: 'Shop', path: '/shop', icon: ShopIcon, ariaLabel: 'Shop' },
];

export const PROGRAMS_DATA: Program[] = [
  {
    id: 'weight', name: 'Weight Loss', themeClass: 'program-weight', priorityText: 'Your Semaglutide injection is due today',
    colors: { primary: '#0ea5e9', lightBg: '#e0f2fe', darkText: '#0284c7', light: '#e0f2fe', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)', shadow: 'rgba(14, 165, 233, 0.15)', glow: 'rgba(14, 165, 233, 0.3)'}
  },
  {
    id: 'hair', name: 'Hair Loss', themeClass: 'program-hair', priorityText: 'Apply Minoxidil to affected areas',
    colors: { primary: '#8b5cf6', lightBg: '#f3e8ff', darkText: '#7c3aed', light: '#f3e8ff', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)', shadow: 'rgba(139, 92, 246, 0.15)', glow: 'rgba(139, 92, 246, 0.3)'}
  },
  {
    id: 'aging', name: 'Anti-Aging', themeClass: 'program-aging', priorityText: 'Apply retinol serum this evening',
    colors: { primary: '#f59e0b', lightBg: '#fef3c7', darkText: '#d97706', light: '#fef3c7', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)', shadow: 'rgba(245, 158, 11, 0.15)', glow: 'rgba(245, 158, 11, 0.3)'}
  },
  {
    id: 'peptides', name: 'Peptides', themeClass: 'program-peptides', priorityText: 'Administer your peptide supplement',
    colors: { primary: '#10b981', lightBg: '#ecfdf5', darkText: '#059669', light: '#ecfdf5', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.15)', glow: 'rgba(16, 185, 129, 0.3)'}
  },
  {
    id: 'ed', name: 'ED Treatment', themeClass: 'program-ed', priorityText: 'Take your ED medication as prescribed',
    colors: { primary: '#ef4444', lightBg: '#fef2f2', darkText: '#dc2626', light: '#fef2f2', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', shadow: 'rgba(239, 68, 68, 0.15)', glow: 'rgba(239, 68, 68, 0.3)'}
  },
   {
    id: 'sleep', name: 'Sleep', themeClass: 'program-sleep', priorityText: 'Prepare for restful sleep, take supplement if needed',
    colors: { primary: '#f97316', lightBg: '#fef7ed', darkText: '#ea580c', light: '#fef7ed', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', shadow: 'rgba(249, 115, 22, 0.15)', glow: 'rgba(249, 115, 22, 0.3)'}
  },
    {
    id: 'women', name: 'Women\'s Health', themeClass: 'program-women', priorityText: 'Take your daily supplement for women\'s health.',
    colors: { primary: '#ec4899', lightBg: '#fdf2f8', darkText: '#db2777', light: '#fdf2f8', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', shadow: 'rgba(236, 72, 153, 0.15)', glow: 'rgba(236, 72, 153, 0.3)'}
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'support', label: 'Support', icon: SupportIcon, actionColor: '#0ea5e9', ariaLabel: 'Contact support' },
  { id: 'refer', label: 'Refer', icon: ReferIcon, actionColor: '#10b981', ariaLabel: 'Refer friends' },
  { id: 'share', label: 'Share', icon: ShareIcon, actionColor: '#8b5cf6', ariaLabel: 'Share with friends' },
  { id: 'assistant', label: 'Assistant', icon: AssistantIcon, actionColor: '#f59e0b', ariaLabel: 'AI Assistant' },
];




export const DEFAULT_PROGRAM_ID = PROGRAMS_DATA[0].id;

// Shop Page Data
export const ICON_MAP: { [key: string]: React.FC<{ className?: string }> } = {
  ArrowUpIcon,
  HeartIcon,
  LightningBoltIcon,
  PillBottleIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  SunIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  HairIcon 
};








