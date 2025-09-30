import React, { useState } from 'react';
import { TreatmentWithCategory, TreatmentDetailContent } from '../../types';
import type { Profile } from '../../types/api';

interface TreatmentDetailProps {
  treatment: TreatmentWithCategory;
  onBack: () => void;
  onStartTreatment: (treatment: TreatmentWithCategory) => void;
  onAddToCart: (treatment: TreatmentWithCategory) => void;
  userProfile: Profile | null;
  detail?: TreatmentDetailContent | null;
  isLoading?: boolean;
  errorMessage?: string;
}

const renderSkeleton = (rows = 3) => (
  <div className="space-y-4">
    {[...Array(rows)].map((_, index) => (
      <div key={index} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
    ))}
  </div>
);

const normalizeList = (items?: string[] | null) => (items ?? []).filter(Boolean);

export const TreatmentDetail: React.FC<TreatmentDetailProps> = ({
  treatment,
  onBack,
  onStartTreatment,
  onAddToCart,
  userProfile,
  detail,
  isLoading = false,
  errorMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'reviews'>('overview');
  const [quantity, setQuantity] = useState(1);

  const {
    name,
    description,
    themeClass,
    icon: TreatmentIcon,
    tag,
    category,
    categoryColor,
    pricePerMonth: summaryPrice,
    duration: summaryDuration,
    frequency: summaryFrequency,
    isAvailable: summaryAvailability,
  } = treatment;

  const overviewText = detail?.overview ?? description;
  const howItWorksList = normalizeList(detail?.howItWorks);
  const benefitsList = normalizeList(detail?.benefits);
  const sideEffectsList = normalizeList(detail?.sideEffects);
  const contraindicationsList = normalizeList(detail?.contraindications);
  const dosageText = detail?.dosage ?? 'As prescribed by your healthcare provider';
  const frequencyText = detail?.frequency ?? summaryFrequency ?? 'Follow your personalized schedule';
  const durationText = detail?.duration ?? summaryDuration ?? 'Personalized timeline';
  const availability = detail?.isAvailable ?? summaryAvailability;
  const priceValue = detail?.pricePerMonth ?? summaryPrice ?? null;

  const priceLabel = typeof priceValue === 'number' ? `$${priceValue}` : 'Custom pricing';
  const priceSuffix = typeof priceValue === 'number' ? '/month' : '';
  const totalPrice = typeof priceValue === 'number' ? priceValue * quantity : null;
  const totalPriceLabel = totalPrice != null ? `$${totalPrice.toFixed(2)}` : 'Consultation required';
  const availabilityLabel = availability === false ? 'Currently waitlisted' : 'Available now';
  const availabilityClass = availability === false ? 'bg-gray-400' : availability === true ? 'bg-green-500' : 'bg-gray-300';

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'details' as const, label: 'Details' },
    { id: 'reviews' as const, label: 'Reviews' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-gray-600 transition-colors hover:text-gray-900"
        aria-label="Back to treatments list"
      >
        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to treatments
      </button>

      {errorMessage && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className={`treatment-detail-header ${themeClass} mb-6 rounded-2xl p-6`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="icon-bg">
              <TreatmentIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="mb-2 flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                {tag && (
                  <span className={`px-2 py-1 text-xs font-medium ${tag === 'New' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'} rounded-full`}>
                    {tag}
                  </span>
                )}
              </div>
              <p className="mb-3 text-gray-600">{description}</p>
              <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${categoryColor.replace('text-', 'bg-').replace('-600', '-100')} ${categoryColor}`}>
                {category}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-1 text-3xl font-bold text-gray-900">
              {priceLabel}
              {priceSuffix && <span className="text-sm font-normal text-gray-600">{priceSuffix}</span>}
            </div>
            <p className="text-sm text-gray-600">{durationText}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {isLoading && !detail ? (
                renderSkeleton(3)
              ) : (
                <>
                  <div>
                    <h2 className="mb-3 text-xl font-semibold text-gray-900">About this treatment</h2>
                    <p className="leading-relaxed text-gray-600">{overviewText}</p>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">How it works</h3>
                    {howItWorksList.length > 0 ? (
                      <ul className="space-y-2">
                        {howItWorksList.map((step, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                              {index + 1}
                            </span>
                            <span className="text-gray-600">{step}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">We&apos;ll walk you through each step during your consultation.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Benefits</h3>
                    {benefitsList.length > 0 ? (
                      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {benefitsList.map((benefit, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">Your care team will outline personalized benefits after reviewing your health history.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {isLoading && !detail ? (
                renderSkeleton(4)
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">Dosage &amp; Frequency</h3>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="mb-2 text-sm text-gray-600"><strong>Dosage:</strong> {dosageText}</p>
                        <p className="text-sm text-gray-600"><strong>Frequency:</strong> {frequencyText}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">Treatment Duration</h3>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">{durationText}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Important Information</h3>
                    {contraindicationsList.length > 0 ? (
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <ul className="space-y-1 text-sm text-yellow-800">
                          {contraindicationsList.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                        We&apos;ll review important considerations with you before starting treatment.
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Possible Side Effects</h3>
                    {sideEffectsList.length > 0 ? (
                      <ul className="space-y-2">
                        {sideEffectsList.map((effect, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <svg className="mt-0.5 h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-gray-600">{effect}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">Your provider will discuss potential side effects that are specific to your treatment plan.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="py-12 text-center">
                <svg className="mx-auto mb-4 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
                </svg>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Reviews coming soon</h3>
                <p className="text-gray-600">Patient reviews and testimonials will be available here.</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Start your treatment</h3>

              <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div className="flex items-center space-x-2">
                  <span className={`h-2 w-2 rounded-full ${availabilityClass}`} />
                  <span className="text-sm text-gray-600">{availabilityLabel}</span>
                </div>
                <span className="text-xs text-gray-500">Personalized for you</span>
              </div>

              {typeof priceValue === 'number' ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-gray-700">
                      Duration
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 6, 12].map(num => (
                        <option key={num} value={num}>
                          {num} month{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {totalPriceLabel}
                    </div>
                    <p className="text-sm text-gray-600">
                      {totalPrice != null ? (quantity === 1 ? 'Per month' : `For ${quantity} months`) : 'We’ll personalize your cost after reviewing your health history.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                  Pricing will be personalized during your consultation.
                </div>
              )}

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => onStartTreatment(treatment)}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Start consultation
                </button>

                <button
                  onClick={() => onAddToCart(treatment)}
                  className="w-full rounded-lg bg-gray-100 px-4 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Add to cart
                </button>
              </div>
            </div>

            {userProfile && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="mb-2 text-sm font-medium text-gray-900">Hello, {userProfile.full_name || 'Patient'}</h4>
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
