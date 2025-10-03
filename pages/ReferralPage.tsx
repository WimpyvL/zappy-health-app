import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Users, Share2, Copy, Mail, MessageSquare, Check } from 'lucide-react';

const ReferralPage: React.FC = () => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Mock referral data
  const referralCode = 'ZAPPY2025';
  const referralLink = 'https://zappyhealth.com/ref/ZAPPY2025';
  const referralStats = {
    totalReferrals: 5,
    successfulReferrals: 3,
    pendingReferrals: 2,
    totalEarned: 150
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent('Try Zappy Health - Get $50 off!');
    const body = encodeURIComponent(
      `I've been using Zappy Health and think you'd love it too! Use my referral code ${referralCode} or click this link to get $50 off your first order: ${referralLink}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareViaSMS = () => {
    const message = encodeURIComponent(
      `Check out Zappy Health! Use code ${referralCode} for $50 off: ${referralLink}`
    );
    window.location.href = `sms:?body=${message}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Custom Header with Back Button */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 pt-8 pb-5 px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center hover:bg-white/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm border border-white/20"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Refer & Earn</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-10 h-10" />
            <div>
              <h2 className="text-2xl font-bold">Give $50, Get $50</h2>
              <p className="text-green-100">Share the health, share the savings</p>
            </div>
          </div>
          <p className="text-green-50 mb-6">
            Invite your friends to Zappy Health. They get $50 off their first order, and you earn $50 in credits
            when they complete their purchase!
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <p className="text-3xl font-bold">{referralStats.totalReferrals}</p>
              <p className="text-sm text-green-100 mt-1">Total Referrals</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <p className="text-3xl font-bold">{referralStats.successfulReferrals}</p>
              <p className="text-sm text-green-100 mt-1">Successful</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <p className="text-3xl font-bold">${referralStats.totalEarned}</p>
              <p className="text-sm text-green-100 mt-1">Earned</p>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Referral Code</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 font-mono text-xl font-bold text-green-600 text-center">
              {referralCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              {copiedCode ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Share this code with friends so they can enter it at checkout
          </p>
        </div>

        {/* Referral Link Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Referral Link</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 overflow-x-auto">
              {referralLink}
            </div>
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              {copiedLink ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Share this personalized link and your friend's discount will be automatically applied
          </p>

          {/* Share Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleShareViaEmail}
              className="flex-1 bg-blue-50 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email
            </button>
            <button
              onClick={handleShareViaSMS}
              className="flex-1 bg-green-50 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              SMS
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Try Zappy Health',
                    text: `Get $50 off with code ${referralCode}`,
                    url: referralLink
                  });
                }
              }}
              className="flex-1 bg-purple-50 text-purple-700 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              More
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Share your code or link</h4>
                <p className="text-sm text-gray-600">
                  Send your unique referral code or link to friends and family
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">They get $50 off</h4>
                <p className="text-sm text-gray-600">
                  Your friend uses your code or link and gets $50 off their first order
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">You earn $50</h4>
                <p className="text-sm text-gray-600">
                  Once they complete their purchase, you receive $50 in credits
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral History */}
        {referralStats.totalReferrals > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Referral Activity</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {/* Mock referral items */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Completed • 3 days ago</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+$50</p>
                  <p className="text-sm text-gray-500">Earned</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Mike Chen</p>
                  <p className="text-sm text-gray-500">Completed • 1 week ago</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+$50</p>
                  <p className="text-sm text-gray-500">Earned</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Emily Davis</p>
                  <p className="text-sm text-gray-500">Completed • 2 weeks ago</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+$50</p>
                  <p className="text-sm text-gray-500">Earned</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Alex Martinez</p>
                  <p className="text-sm text-amber-600">Pending • Signed up 2 days ago</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-400">$50</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Jamie Wilson</p>
                  <p className="text-sm text-amber-600">Pending • Signed up 5 days ago</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-400">$50</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Terms & Conditions</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Referral credits are applied after the referred friend completes their first purchase</li>
            <li>• Both you and your friend must be new or existing Zappy Health customers</li>
            <li>• Credits expire 12 months from the date they are issued</li>
            <li>• Referral credits cannot be redeemed for cash</li>
            <li>• Zappy Health reserves the right to modify or cancel this program at any time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;