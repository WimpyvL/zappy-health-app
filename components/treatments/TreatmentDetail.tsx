import React, { useState } from 'react';
import { TreatmentWithCategory } from '../../types';

interface UserProfile {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  [key: string]: unknown;
}

interface TreatmentDetailProps {
  treatment: TreatmentWithCategory;
  onBack: () => void;
  onStartTreatment: (treatment: TreatmentWithCategory) => void;
  onAddToCart: (treatment: TreatmentWithCategory) => void;
  userProfile: UserProfile | null;
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

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-4 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Overview</h2>
                <p className="text-gray-600">{details.overview}</p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">How It Works</h3>
                <ul className="space-y-3">
                  {details.howItWorks.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Benefits</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {details.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Dosage & Frequency</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Dosage</p>
                    <p className="text-gray-900 font-semibold">{details.dosage}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Frequency</p>
                    <p className="text-gray-900 font-semibold">{details.frequency}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Potential Side Effects</h3>
                <ul className="space-y-2 text-gray-600">
                  {details.sideEffects.map((effect, index) => (
                    <li key={index}>• {effect}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Contraindications</h3>
                <ul className="space-y-2 text-gray-600">
                  {details.contraindications.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Testimonials</h2>
              <p className="text-gray-600">
                We're gathering more feedback from patients currently on this treatment. Check back soon for updates!
              </p>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Starting at</p>
              <div className="text-3xl font-bold text-gray-900">
                ${details.price}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => onStartTreatment(treatment)}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Start Treatment
              </button>
              <button
                onClick={() => onAddToCart(treatment)}
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Add to Cart
              </button>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1" htmlFor="quantity">
                Monthly Supply
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {userProfile && (
              <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-1">Personalized for you</p>
                <p>
                  Based on your profile{userProfile.full_name ? `, ${userProfile.full_name}` : ''}, this treatment plan will be
                  tailored to your goals and medical history.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">What's Included</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Personalized treatment plan</li>
              <li>Regular check-ins with medical team</li>
              <li>24/7 support via secure messaging</li>
              <li>Flexible refill management</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TreatmentDetail;
