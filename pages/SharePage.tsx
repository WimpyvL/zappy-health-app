import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { ProgramContext, ToastContext } from '../App';
import { 
  ShareIcon, 
  ChevronRightIcon, 
  HeartIcon, 
  CheckCircleIcon,
  FireIcon,
  SparklesIcon,
  UserCircleIcon
} from '../constants';

// Social Media Platform Configurations
const SOCIAL_PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    color: 'bg-[#1877F2]',
    hoverColor: 'hover:bg-[#1664D4]',
    description: 'Share with friends & family',
    shareUrl: (text: string, url: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: '𝕏',
    color: 'bg-black',
    hoverColor: 'hover:bg-gray-800',
    description: 'Post your update',
    shareUrl: (text: string, url: string) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-[#0A66C2]',
    hoverColor: 'hover:bg-[#004182]',
    description: 'Share professionally',
    shareUrl: (text: string, url: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400',
    hoverColor: 'hover:opacity-90',
    description: 'Share to your story',
    shareUrl: (text: string, url: string) => 
      `https://www.instagram.com/` // Instagram requires native app
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: '💬',
    color: 'bg-[#25D366]',
    hoverColor: 'hover:bg-[#1DA851]',
    description: 'Send to contacts',
    shareUrl: (text: string, url: string) => 
      `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: '✈️',
    color: 'bg-[#0088cc]',
    hoverColor: 'hover:bg-[#006699]',
    description: 'Share instantly',
    shareUrl: (text: string, url: string) => 
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    color: 'bg-[#E60023]',
    hoverColor: 'hover:bg-[#B7001A]',
    description: 'Pin your journey',
    shareUrl: (text: string, url: string) => 
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`
  },
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    color: 'bg-gray-600',
    hoverColor: 'hover:bg-gray-700',
    description: 'Send via email',
    shareUrl: (text: string, url: string) => 
      `mailto:?subject=${encodeURIComponent('My Health Journey')}&body=${encodeURIComponent(text + '\n\n' + url)}`
  }
];

// Pre-written success story templates
const STORY_TEMPLATES = [
  {
    id: 'weight-loss',
    title: 'Weight Loss Achievement',
    emoji: '🎯',
    template: "I've lost [X] pounds on my health journey! Feeling stronger and more confident every day. #HealthJourney #WeightLoss #Wellness"
  },
  {
    id: 'milestone',
    title: 'Milestone Reached',
    emoji: '🏆',
    template: "Just hit a major milestone in my health journey! Grateful for the support and excited for what's next. #HealthGoals #Progress"
  },
  {
    id: 'general',
    title: 'General Update',
    emoji: '💪',
    template: "Taking control of my health has been life-changing. Every step forward counts! #HealthJourney #SelfCare #Wellness"
  },
  {
    id: 'inspiration',
    title: 'Inspire Others',
    emoji: '✨',
    template: "If you're thinking about starting your health journey, this is your sign! You've got this. #Motivation #HealthTransformation"
  },
  {
    id: 'gratitude',
    title: 'Gratitude Post',
    emoji: '🙏',
    template: "Grateful for this journey and the positive changes in my life. Thank you to everyone who's supported me! #Grateful #HealthJourney"
  }
];

const SharePage: React.FC = () => {
  const navigate = useNavigate();
  const programContext = useContext(ProgramContext);
  const toastContext = useContext(ToastContext);
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [shareStats, setShareStats] = useState({
    totalShares: 0,
    thisWeek: 0,
    engagement: 0
  });

  useEffect(() => {
    // Set default share URL to the app's URL or a landing page
    setShareUrl(window.location.origin);
    
    // Load share stats (would come from backend in production)
    setShareStats({
      totalShares: 12,
      thisWeek: 3,
      engagement: 85
    });
  }, []);

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setCustomMessage(template);
  };

  const handleShare = (platform: typeof SOCIAL_PLATFORMS[0]) => {
    const messageToShare = customMessage || "Check out my health journey progress!";
    const url = platform.shareUrl(messageToShare, shareUrl);
    
    if (platform.id === 'instagram') {
      toastContext?.addToast('Instagram sharing opens in the Instagram app. Copy your message and paste it there!', 'info');
      handleCopyMessage();
    } else if (platform.id === 'email') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'width=600,height=400');
    }
    
    toastContext?.addToast(`Opening ${platform.name}...`, 'success');
    
    // Track share (would be sent to backend in production)
    setShareStats(prev => ({
      ...prev,
      totalShares: prev.totalShares + 1,
      thisWeek: prev.thisWeek + 1
    }));
  };

  const handleCopyMessage = () => {
    const messageToCopy = customMessage || "Check out my health journey!";
    navigator.clipboard.writeText(messageToCopy).then(() => {
      setCopied(true);
      toastContext?.addToast('Message copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toastContext?.addToast('Link copied to clipboard!', 'success');
    });
  };

  if (!programContext) {
    return <div>Loading...</div>;
  }

  const { activeProgram } = programContext;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Share Your Journey" showProfileImage={true} />
      
      {/* Back Button */}
      <div className="px-6 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>
      </div>
      
      <main className="flex-grow px-6 py-4 pb-24">
        {/* Hero Section */}
        <div className={`${activeProgram.themeClass} bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl p-8 mb-6 text-white shadow-lg`}>
          <div className="flex items-center mb-4">
            <ShareIcon className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">Share Your Journey</h1>
          </div>
          <p className="text-white/90 text-lg mb-6">
            Inspire others by sharing your health transformation story across your favorite platforms
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{shareStats.totalShares}</div>
              <div className="text-sm text-white/80">Total Shares</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{shareStats.thisWeek}</div>
              <div className="text-sm text-white/80">This Week</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{shareStats.engagement}%</div>
              <div className="text-sm text-white/80">Engagement</div>
            </div>
          </div>
        </div>

        {/* Story Templates Section */}
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <SparklesIcon className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Choose Your Story</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {STORY_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.template)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  customMessage === template.template
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{template.emoji}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{template.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">{template.template}</div>
                    </div>
                  </div>
                  {customMessage === template.template && (
                    <CheckCircleIcon className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Custom Message Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FireIcon className="w-6 h-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Your Message</h2>
            </div>
            <button
              onClick={handleCopyMessage}
              className="text-sm text-purple-600 font-medium hover:text-purple-700"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write your own message or select a template above..."
              className="w-full min-h-[120px] resize-none focus:outline-none text-gray-900"
              maxLength={280}
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                {customMessage.length}/280 characters
              </span>
              <button
                onClick={() => setCustomMessage('')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Social Platforms Section */}
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <HeartIcon className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Share On</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SOCIAL_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform)}
                className={`${platform.color} ${platform.hoverColor} text-white rounded-xl p-4 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-4xl mb-2">{platform.icon}</span>
                  <div className="font-semibold text-sm mb-1">{platform.name}</div>
                  <div className="text-xs opacity-90">{platform.description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Share Link Section */}
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <ChevronRightIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Share Link</h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="text-sm text-gray-500 mb-1">Your unique share link</div>
                <div className="text-sm text-gray-900 font-mono truncate">{shareUrl}</div>
              </div>
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0"
              >
                Copy Link
              </button>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start">
              <UserCircleIcon className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Sharing Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Be authentic - share your real journey and experiences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Use hashtags to reach a wider audience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Include specific milestones and achievements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Encourage others who are on their own journey</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Notice */}
        <section className="text-center text-sm text-gray-500 px-4">
          <p>Your privacy is important. Share only what you're comfortable with. All sharing is done through external platforms.</p>
        </section>
      </main>
    </div>
  );
};

export default SharePage;