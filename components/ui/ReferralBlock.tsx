import React, { useState } from 'react';
import { Users, Share2, Heart, Star } from 'lucide-react';


type ToastType = 'success' | 'error' | 'info' | 'warning';
interface ToastMessage {
  message: string;
  type: ToastType;
}

interface ReferralBlockProps {
  onToast?: (message: string, type?: ToastType) => void;
  className?: string;
}

const ReferralBlock: React.FC<ReferralBlockProps> = ({ 
  onToast,
  className = ""
}) => {
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  // Handle copy referral code
  const handleCopyCode = () => {
    navigator.clipboard.writeText('MICHEL2024').then(() => {
      const message = 'Referral code copied to clipboard!';
      if (onToast) {
        onToast(message, 'success');
      } else {
        setToastMessage({ message, type: 'success' });
        setTimeout(() => setToastMessage(null), 3000);
      }
      
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }).catch(() => {
      const message = 'Failed to copy code';
      if (onToast) {
        onToast(message, 'error');
      } else {
        setToastMessage({ message, type: 'error' });
        setTimeout(() => setToastMessage(null), 3000);
      }
    });
  };

  return (
    <>
      {/* Desktop Referral Block */}
      <div className={`hidden lg:block ${className}`}>
        <div className="bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-indigo-500/20 backdrop-blur-3xl rounded-3xl p-8 border border-purple-300/30 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-indigo-400/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mr-6 shadow-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Refer Friends & Earn</h3>
                  <p className="text-lg text-gray-600">Help your friends start their health journey and earn rewards</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-purple-600 mb-1">$50</div>
                <p className="text-sm text-gray-600">per referral</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-200/40">
                <div className="w-12 h-12 bg-purple-100/80 rounded-2xl flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Share Your Code</h4>
                <p className="text-sm text-gray-600">Send your unique referral code to friends and family</p>
              </div>
              
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-200/40">
                <div className="w-12 h-12 bg-purple-100/80 rounded-2xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">They Get Care</h4>
                <p className="text-sm text-gray-600">Your friends receive personalized treatment plans</p>
              </div>
              
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-200/40">
                <div className="w-12 h-12 bg-purple-100/80 rounded-2xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">You Earn Rewards</h4>
                <p className="text-sm text-gray-600">Get $50 credit when they complete their first order</p>
              </div>
            </div>
            
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-200/40 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Your referral code</p>
                  <div className="flex items-center space-x-3">
                    <code className="bg-purple-100/80 text-purple-800 px-4 py-2 rounded-xl font-mono text-lg font-bold">MICHEL2024</code>
                    <button 
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors font-semibold"
                      onClick={handleCopyCode}
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Total earned</p>
                  <p className="text-2xl font-bold text-purple-600">$150</p>
                  <p className="text-xs text-gray-500">3 successful referrals</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Share with Friends
              </button>
              <button className="bg-white/40 backdrop-blur-xl text-purple-600 font-semibold py-4 px-6 rounded-2xl hover:bg-white/60 transition-colors border border-purple-200/40">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Referral Block */}
      <div className={`lg:hidden ${className}`}>
        <div className="bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-indigo-500/20 backdrop-blur-3xl rounded-3xl p-6 border border-purple-300/30 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-indigo-400/10"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Refer Friends & Earn</h3>
                <p className="text-sm text-gray-600">Help friends start their health journey</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">$50</div>
                <p className="text-xs text-gray-600">per referral</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-200/40 text-center">
                <div className="w-8 h-8 bg-purple-100/80 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Share2 className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Share</h4>
                <p className="text-xs text-gray-600">Your code</p>
              </div>
              
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-200/40 text-center">
                <div className="w-8 h-8 bg-purple-100/80 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Heart className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">They Join</h4>
                <p className="text-xs text-gray-600">Get care</p>
              </div>
              
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-200/40 text-center">
                <div className="w-8 h-8 bg-purple-100/80 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">You Earn</h4>
                <p className="text-xs text-gray-600">$50 credit</p>
              </div>
            </div>
            
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-purple-200/40 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-2">Your referral code</p>
                  <div className="flex items-center space-x-2">
                    <code className="bg-purple-100/80 text-purple-800 px-3 py-2 rounded-xl font-mono text-sm font-bold">MICHEL2024</code>
                    <button 
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-xl transition-colors text-xs font-semibold"
                      onClick={handleCopyCode}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-gray-600 mb-1">Total earned</p>
                  <p className="text-lg font-bold text-purple-600">$150</p>
                  <p className="text-xs text-gray-500">3 referrals</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg text-sm">
                Share with Friends
              </button>
              <button className="bg-white/40 backdrop-blur-xl text-purple-600 font-semibold py-3 px-4 rounded-2xl hover:bg-white/60 transition-colors border border-purple-200/40 text-sm">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Built-in Toast Notification (only if no external toast provided) */}
      {!onToast && toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-3xl max-w-sm ${
            toastMessage.type === 'success' ? 'bg-green-500/80 text-white border-green-400/50' :
            toastMessage.type === 'error' ? 'bg-red-500/80 text-white border-red-400/50' :
            'bg-blue-500/80 text-white border-blue-400/50'
          }`}>
            <div className="flex items-center text-sm font-semibold">
              <span>{toastMessage.message}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReferralBlock;
