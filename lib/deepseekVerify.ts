/**
 * Verification utility to check DeepSeek API configuration
 */

export const verifyDeepSeekConfig = () => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  
  console.group('🔍 DeepSeek Configuration Check');
  console.log('API Key Present:', !!apiKey);
  console.log('API Key Length:', apiKey?.length || 0);
  console.log('API Key Preview:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'NOT FOUND');
  console.log('Environment:', import.meta.env.MODE);
  console.groupEnd();
  
  return {
    isConfigured: !!apiKey && apiKey !== 'your_deepseek_api_key_here',
    apiKey,
    preview: apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND'
  };
};