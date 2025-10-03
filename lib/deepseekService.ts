/**
 * DeepSeek AI Service
 * Handles all interactions with the DeepSeek API for the Zap AI Assistant
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

/**
 * System prompt that defines Zap's personality and knowledge
 */
const ZAP_SYSTEM_PROMPT = `You are Zap, an enthusiastic and motivational AI health assistant for Zappy Health. Your mission is to help users achieve their health goals, stay motivated, and build a supportive community.

# Your Personality:
- Friendly, encouraging, and genuinely excited about users' health journeys
- Use emojis naturally (🎯, 💪, 🌟, ✨, 🎉) to add warmth
- Celebrate every win, no matter how small
- Always end conversations with encouragement

# Your Knowledge - Zappy Health Products & Programs:

## Weight Loss Program (GLP-1 Treatment)
- **Semaglutide injections**: Weekly subcutaneous injections that reduce appetite and increase satiety
- **Tirzepatide**: Dual-action GLP-1/GIP therapy for enhanced weight loss
- **Expected results**: 10-15% body weight loss over 6 months
- **Side effects**: Nausea, constipation (usually mild and temporary)
- **Best practices**: Stay hydrated, eat protein-rich meals, log weight weekly

## Hair Loss Treatment
- **Minoxidil**: Topical solution applied twice daily to affected areas
- **Finasteride**: Oral medication to block DHT hormone
- **Hair supplements**: Biotin, collagen, vitamins for hair health
- **Timeline**: 3-6 months to see visible results
- **Application**: Apply to dry scalp, don't wash for 4 hours

## Anti-Aging Protocol
- **Retinol serum**: Apply at night, start with 2-3 times/week
- **Vitamin C**: Morning application for brightening
- **Sunscreen**: SPF 50+ daily, reapply every 2 hours
- **Moisturizer**: Hyaluronic acid for hydration
- **Progress photos**: Take monthly to track improvements

## Peptide Therapy
- **BPC-157**: Healing and recovery support
- **CJC-1295**: Growth hormone optimization
- **Ipamorelin**: Fat loss and muscle building
- **Administration**: Subcutaneous injection, rotate injection sites

## ED Treatment
- **Sildenafil (generic Viagra)**: Take 30-60 minutes before activity
- **Tadalafil (generic Cialis)**: Longer-lasting, take 30 minutes before
- **Hard Mints**: Fast-dissolving, discreet option
- **Lifestyle factors**: Exercise, reduce stress, limit alcohol

## Women's Health
- **Birth control**: Daily hormonal contraception
- **Hormone support**: Balance during menopause
- **Fertility support**: Prenatal vitamins, cycle tracking
- **UTI prevention**: D-Mannose, cranberry supplements

## Sleep Optimization
- **Melatonin**: 30 minutes before bed
- **Sleep hygiene**: Cool room (65-68°F), dark environment
- **Routine**: Consistent bedtime, limit screens 1 hour before
- **Supplements**: Magnesium, L-theanine for relaxation

# Your Goals:
1. **Motivate**: Keep users excited about their health journey
2. **Educate**: Share product info, usage tips, and best practices
3. **Community**: Encourage sharing success stories and connecting with others
4. **Support**: Answer questions, celebrate wins, help overcome obstacles
5. **Share**: Inspire users to share their journey on social media

# Communication Style:
- Be conversational and warm, like a supportive friend
- Ask questions to understand their needs
- Provide specific, actionable advice
- Celebrate progress frequently
- Remind them they're not alone in their journey
- Encourage community engagement and sharing

# Important Reminders:
- Always prioritize user safety - recommend consulting healthcare provider for serious concerns
- Never diagnose medical conditions
- Emphasize consistency and patience for results
- Build confidence through positive reinforcement
- Make sharing their journey fun and rewarding

Remember: You're here to be their biggest cheerleader, trusted guide, and friend on their health transformation journey! 🌟`;

/**
 * Send a message to DeepSeek API
 */
export const sendMessage = async (
  messages: ChatMessage[]
): Promise<ChatResponse> => {
  // Debug: Log API key status
  console.log('DeepSeek API Key loaded:', !!DEEPSEEK_API_KEY);
  console.log('API Key length:', DEEPSEEK_API_KEY?.length);
  
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your_deepseek_api_key_here') {
    console.warn('DeepSeek API key not configured or invalid');
    return {
      message: "Hi! I'm Zap, your health assistant! 🌟 To enable me, please add your DeepSeek API key to the .env file. In the meantime, I'm here in demo mode to help you get started with Zappy Health! What would you like to know about our programs?",
      error: 'API key not configured'
    };
  }

  try {
    console.log('Sending request to DeepSeek API...');
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // DeepSeek v3
        messages: [
          { role: 'system', content: ZAP_SYSTEM_PROMPT },
          ...messages.map(msg => ({ role: msg.role, content: msg.content }))
        ],
        temperature: 0.8, // Slightly higher for more personality
        max_tokens: 800, // More tokens for detailed responses
        top_p: 0.95,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stream: false
      })
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response received:', data);
    const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I had trouble understanding that. Could you rephrase?';

    return {
      message: assistantMessage
    };
  } catch (error) {
    console.error('DeepSeek API error details:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    return {
      message: getDemoResponse(messages[messages.length - 1]?.content || ''),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Demo responses when API is not available
 */
const getDemoResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('weight') || lowerMessage.includes('loss') || lowerMessage.includes('semaglutide')) {
    return "Hey there! 🎯 I see you're interested in our Weight Loss program! Zappy's GLP-1 treatments like Semaglutide are game-changers - users typically see 10-15% body weight loss over 6 months. The weekly injection is super easy, and our team supports you every step of the way! Want to know more about how it works or getting started?";
  }

  if (lowerMessage.includes('hair') || lowerMessage.includes('minoxidil')) {
    return "Great question about hair loss! 💪 Our Hair Loss treatment combines Minoxidil (applied twice daily) with supplements to promote regrowth. Most people start seeing results in 3-6 months. Consistency is key! Are you just starting your hair journey or looking for tips to maximize results?";
  }

  if (lowerMessage.includes('share') || lowerMessage.includes('community') || lowerMessage.includes('post')) {
    return "I LOVE that you want to share your journey! 🌟 Sharing your progress inspires others and keeps you motivated! We have an amazing Share feature where you can post to Facebook, Instagram, Twitter, and more. Your story could be the spark someone needs to start their own transformation! What milestone would you like to celebrate?";
  }

  if (lowerMessage.includes('peptide')) {
    return "Peptides are incredible for performance optimization! 🚀 We offer BPC-157 for recovery, CJC-1295 for growth hormone support, and Ipamorelin for body composition. They're administered via simple subcutaneous injections. What are your main goals - recovery, performance, or body recomposition?";
  }

  if (lowerMessage.includes('anti-aging') || lowerMessage.includes('skin') || lowerMessage.includes('retinol')) {
    return "Anti-aging is one of my favorite topics! ✨ Our protocol includes Retinol for cell turnover, Vitamin C for brightening, and daily SPF 50+ (non-negotiable!). Start retinol slow (2-3x/week) and build up. Your future self will thank you! Want specific product recommendations or a routine schedule?";
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('start') || lowerMessage.includes('begin')) {
    return "Welcome to Zappy Health! 🎉 I'm Zap, and I'm here to support your health journey every day! We offer programs for Weight Loss, Hair Growth, Anti-Aging, Sexual Health, Sleep, and more. Each program includes personalized treatment, expert support, and a community cheering you on! What health goal excites you most?";
  }

  return "Hey! 👋 I'm Zap, your personal health cheerleader! I know everything about Zappy's products - from weight loss injections to hair treatments to anti-aging protocols. I'm also here to keep you motivated and help you build amazing habits! What can I help you with today? 💪";
};

/**
 * Get suggested conversation starters
 */
export const getConversationStarters = (): string[] => {
  return [
    "How does the weight loss program work? 🎯",
    "Tell me about hair loss treatment options 💇",
    "What are your best anti-aging tips? ✨",
    "How can I share my progress with others? 📱",
    "I need motivation to stay consistent! 💪"
  ];
};

/**
 * Get quick response suggestions based on context
 */
export const getQuickResponses = (context: string): string[] => {
  const lower = context.toLowerCase();

  if (lower.includes('weight') || lower.includes('loss')) {
    return [
      "How do I start?",
      "What are the side effects?",
      "How much weight can I lose?",
      "Tell me about injections"
    ];
  }

  if (lower.includes('share') || lower.includes('progress')) {
    return [
      "Show me how to share",
      "What should I post?",
      "How do I inspire others?",
      "Share my milestone!"
    ];
  }

  return [
    "Tell me more",
    "That sounds great!",
    "What else should I know?",
    "How do I get started?"
  ];
};

/**
 * Save conversation to local storage
 */
export const saveConversation = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem('zap_conversation', JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save conversation:', error);
  }
};

/**
 * Load conversation from local storage
 */
export const loadConversation = (): ChatMessage[] => {
  try {
    const saved = localStorage.getItem('zap_conversation');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load conversation:', error);
    return [];
  }
};

/**
 * Clear conversation history
 */
export const clearConversation = (): void => {
  try {
    localStorage.removeItem('zap_conversation');
  } catch (error) {
    console.error('Failed to clear conversation:', error);
  }
};

export default {
  sendMessage,
  getConversationStarters,
  getQuickResponses,
  saveConversation,
  loadConversation,
  clearConversation
};