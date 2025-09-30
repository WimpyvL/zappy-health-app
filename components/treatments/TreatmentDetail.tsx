import React, { useState } from 'react';
import { TreatmentWithCategory } from '../../types';
import type { Profile } from '../../types/api';

interface TreatmentDetailProps {
  treatment: TreatmentWithCategory;
  onBack: () => void;
  onStartTreatment: (treatment: TreatmentWithCategory) => void;
  onAddToCart: (treatment: TreatmentWithCategory) => void;
  userProfile: Profile | null;
}

interface TreatmentDetailData {
  overview: string;
  howItWorks: string[];
  benefits: string[];
  sideEffects: string[];
  dosage: string;
  frequency: string;
  price: number;
  duration: string;
  contraindications: string[];
  isAvailable: boolean;
}

// Mock treatment detail data - in a real app, this would come from the database
const getTreatmentDetails = (treatmentId: string): TreatmentDetailData => {
  const defaultDetails: TreatmentDetailData = {
    overview: "A comprehensive treatment designed to help you achieve your health goals safely and effectively.",
    howItWorks: [
      "Initial consultation with our medical team",
      "Personalized treatment plan creation",
      "Regular monitoring and adjustments",
      "Ongoing support throughout your journey"
    ],
    benefits: [
      "Clinically proven effectiveness",
      "Personalized approach",
      "Expert medical supervision",
      "Convenient at-home treatment"
    ],
    sideEffects: [
      "Mild side effects may occur",
      "Most side effects are temporary",
      "Our team monitors for any reactions",
      "24/7 support available"
    ],
    dosage: "As prescribed by your healthcare provider",
    frequency: "Follow your personalized schedule",
    price: 99,
    duration: "3-6 months typical duration",
    contraindications: [
      "Not suitable for pregnant or breastfeeding women",
      "Consult if you have existing medical conditions",
      "Inform us of all current medications"
    ],
    isAvailable: true
  };

  // Customize based on treatment type
  if (treatmentId.startsWith('wl')) {
    return {
      ...defaultDetails,
      overview: "Evidence-based weight loss treatment that helps you achieve sustainable results through personalized medication and lifestyle support.",
      price: 149,
      frequency: "Weekly injections",
      duration: "6-12 months for optimal results"
    };
  } else if (treatmentId.startsWith('aa')) {
    return {
      ...defaultDetails,
      overview: "Advanced anti-aging treatment using clinically proven ingredients to reduce signs of aging and improve skin health.",
      price: 79,
      frequency: "Daily application",
      duration: "3-6 months for visible results"
    };
  } else if (treatmentId.startsWith('hs')) {
    return {
      ...defaultDetails,
      overview: "Comprehensive hair and skin treatment targeting the root causes of hair loss and skin concerns.",
      price: 89,
      frequency: "Twice daily application",
      duration: "4-8 months for optimal results"
    };
  }

  return defaultDetails;
};

export const TreatmentDetail: React.FC<TreatmentDetailProps> = ({
  treatment,
  onBack,
  onStartTreatment,
  onAddToCart,
  userProfile
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'reviews'>('overview');
  const [quantity, setQuantity] = useState(1);
  
  const details = getTreatmentDetails(treatment.id);
  const { name, description, themeClass, icon: TreatmentIcon, tag, category, categoryColor } = treatment;

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'details' as const, label: 'Details' },
    { id: 'reviews' as const, label: 'Reviews' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        aria-label="Back to treatments list"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to treatments
      </button>

      {/* Treatment Header */}
      <div className={`treatment-detail-header ${themeClass} rounded-2xl p-6 mb-6`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="icon-bg">
              <TreatmentIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                {tag && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${tag === 'New' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {tag}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-3">{description}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColor.replace('text-', 'bg-').replace('-600', '-100')} ${categoryColor}`}>
                {category}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${details.price}
              <span className="text-sm font-normal text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-600">{details.duration}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About this treatment</h2>
                <p className="text-gray-600 leading-relaxed">{details.overview}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How it works</h3>
                <ul className="space-y-2">
                  {details.howItWorks.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {details.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Dosage & Frequency</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2"><strong>Dosage:</strong> {details.dosage}</p>
                    <p className="text-sm text-gray-600"><strong>Frequency:</strong> {details.frequency}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Treatment Duration</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{details.duration}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Information</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <ul className="space-y-1">
                    {details.contraindications.map((item, index) => (
                      <li key={index} className="text-sm text-yellow-800">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Possible Side Effects</h3>
                <ul className="space-y-2">
                  {details.sideEffects.map((effect, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-600">{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews coming soon</h3>
                <p className="text-gray-600">Patient reviews and testimonials will be available here.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Start your treatment</h3>
              
              {details.isAvailable ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 6, 12].map(num => (
                        <option key={num} value={num}>
                          {num} month{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      ${details.price * quantity}
                    </div>
                    <p className="text-sm text-gray-600">
                      {quantity === 1 ? 'Per month' : `For ${quantity} months`}
                    </p>
                  </div>

                  <button
                    onClick={() => onStartTreatment(treatment)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Start consultation
                  </button>

                  <button
                    onClick={() => onAddToCart(treatment)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Add to cart
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-red-600 mb-4">Currently unavailable</p>
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                  >
                    Notify when available
                  </button>
                </div>
              )}
            </div>

            {userProfile && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Hello, {userProfile.full_name || 'Patient'}</h4>
                <p className="text-xs text-gray-600">
                  This treatment will be personalized for your health profile.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentDetail;
