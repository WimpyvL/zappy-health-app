/**
 * Social Media Sharing Utilities
 * Provides functions to generate share URLs and handle social media sharing
 */

export interface ShareData {
  title?: string;
  text: string;
  url: string;
  hashtags?: string[];
}

export interface SocialPlatform {
  id: string;
  name: string;
  generateUrl: (data: ShareData) => string;
  icon: string;
  color: string;
}

/**
 * Generate Facebook share URL
 */
export const generateFacebookUrl = (data: ShareData): string => {
  const params = new URLSearchParams({
    u: data.url,
    quote: data.text
  });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
};

/**
 * Generate Twitter/X share URL
 */
export const generateTwitterUrl = (data: ShareData): string => {
  const params = new URLSearchParams({
    text: data.text,
    url: data.url
  });
  if (data.hashtags && data.hashtags.length > 0) {
    params.append('hashtags', data.hashtags.join(','));
  }
  return `https://twitter.com/intent/tweet?${params.toString()}`;
};

/**
 * Generate LinkedIn share URL
 */
export const generateLinkedInUrl = (data: ShareData): string => {
  const params = new URLSearchParams({
    url: data.url
  });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
};

/**
 * Generate WhatsApp share URL
 */
export const generateWhatsAppUrl = (data: ShareData): string => {
  const text = `${data.text} ${data.url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

/**
 * Generate Telegram share URL
 */
export const generateTelegramUrl = (data: ShareData): string => {
  const params = new URLSearchParams({
    url: data.url,
    text: data.text
  });
  return `https://t.me/share/url?${params.toString()}`;
};

/**
 * Generate Pinterest share URL
 */
export const generatePinterestUrl = (data: ShareData): string => {
  const params = new URLSearchParams({
    url: data.url,
    description: data.text
  });
  return `https://pinterest.com/pin/create/button/?${params.toString()}`;
};

/**
 * Generate Email share URL
 */
export const generateEmailUrl = (data: ShareData): string => {
  const subject = data.title || 'My Health Journey';
  const body = `${data.text}\n\n${data.url}`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Check if native share is available
 */
export const isNativeShareAvailable = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

/**
 * Share using native share API
 */
export const shareNative = async (data: ShareData): Promise<boolean> => {
  if (!isNativeShareAvailable()) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url
    });
    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.error('Error sharing:', error);
    return false;
  }
};

/**
 * Open share URL in a popup window
 */
export const openSharePopup = (url: string, width = 600, height = 400): void => {
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  
  window.open(
    url,
    'share',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no`
  );
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (fallbackError) {
      console.error('Failed to copy to clipboard:', fallbackError);
      return false;
    }
  }
};

/**
 * Generate shareable message with patient progress
 */
export const generateProgressMessage = (
  programName: string,
  weekNumber: number,
  achievement?: string
): string => {
  const achievements = achievement 
    ? `${achievement}! ` 
    : '';
    
  return `${achievements}I'm on week ${weekNumber} of my ${programName} journey and feeling amazing! 🎯 #HealthJourney #${programName.replace(/\s+/g, '')} #Wellness`;
};

/**
 * Generate milestone message
 */
export const generateMilestoneMessage = (milestone: string): string => {
  return `Just hit a major milestone: ${milestone}! Grateful for this journey and excited for what's next. 💪 #HealthGoals #MilestoneAchieved #Progress`;
};

/**
 * Add UTM parameters to URL for tracking
 */
export const addUtmParameters = (
  url: string,
  source: string,
  medium: string = 'social',
  campaign: string = 'patient_share'
): string => {
  const urlObj = new URL(url);
  urlObj.searchParams.set('utm_source', source);
  urlObj.searchParams.set('utm_medium', medium);
  urlObj.searchParams.set('utm_campaign', campaign);
  return urlObj.toString();
};

/**
 * Track share event (to be integrated with analytics)
 */
export const trackShareEvent = (platform: string, content: string): void => {
  // This would integrate with your analytics platform
  // For now, just log it
  console.log('Share tracked:', { platform, content, timestamp: new Date().toISOString() });
  
  // Example integration with Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'share', {
      method: platform,
      content_type: 'health_journey',
      item_id: content.substring(0, 50)
    });
  }
};

/**
 * Popular health journey hashtags
 */
export const HEALTH_HASHTAGS = [
  'HealthJourney',
  'WellnessGoals',
  'HealthTransformation',
  'FitnessMotivation',
  'HealthyLiving',
  'SelfCare',
  'WeightLossJourney',
  'HealthyLifestyle',
  'WellnessWarrior',
  'TransformationTuesday'
];

/**
 * Get recommended hashtags based on program type
 */
export const getRecommendedHashtags = (programType: string): string[] => {
  const baseHashtags = ['HealthJourney', 'Wellness'];
  
  const programHashtags: { [key: string]: string[] } = {
    weight: ['WeightLoss', 'FitnessGoals', 'HealthyEating'],
    hair: ['HairGrowth', 'HairCare', 'BeautyJourney'],
    aging: ['AntiAging', 'SkinCare', 'AgingGracefully'],
    peptides: ['Peptides', 'Performance', 'Biohacking'],
    ed: ['MensHealth', 'Wellness', 'HealthyLiving'],
    sleep: ['SleepBetter', 'RestAndRecovery', 'SleepHealth'],
    women: ['WomensHealth', 'SelfCare', 'HealthyWoman']
  };
  
  return [...baseHashtags, ...(programHashtags[programType] || [])];
};

export default {
  generateFacebookUrl,
  generateTwitterUrl,
  generateLinkedInUrl,
  generateWhatsAppUrl,
  generateTelegramUrl,
  generatePinterestUrl,
  generateEmailUrl,
  isNativeShareAvailable,
  shareNative,
  openSharePopup,
  copyToClipboard,
  generateProgressMessage,
  generateMilestoneMessage,
  addUtmParameters,
  trackShareEvent,
  getRecommendedHashtags,
  HEALTH_HASHTAGS
};