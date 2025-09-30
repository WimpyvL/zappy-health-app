import React from 'react';
import { TreatmentWithCategory } from '../../types';

interface TreatmentListProps {
  treatments: TreatmentWithCategory[];
  onTreatmentSelect: (treatment: TreatmentWithCategory) => void;
  searchQuery?: string;
}

const TreatmentCard: React.FC<{
  treatment: TreatmentWithCategory;
  onSelect: (treatment: TreatmentWithCategory) => void;
  searchQuery?: string;
}> = ({ treatment, onSelect, searchQuery }) => {
  const {
    name,
    description,
    themeClass,
    icon: TreatmentIcon,
    tag,
    category,
    categoryColor,
    pricePerMonth,
    duration,
    isAvailable,
  } = treatment;

  const priceLabel = typeof pricePerMonth === 'number' ? `$${pricePerMonth}/mo` : 'See details';
  const durationLabel = duration || 'Personalized plan';
  const availabilityLabel = isAvailable === false ? 'Waitlist' : 'Available';
  const availabilityClass = isAvailable === false ? 'text-orange-600' : 'text-green-600';

  // Highlight search terms
  const highlightText = (text: string, query?: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <article
      className={`program-card-small ${themeClass} relative cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg`}
      onClick={() => onSelect(treatment)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${name} - ${description}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(treatment);
        }
      }}
    >
      {tag && (
        <div className={`absolute top-4 right-4 ${tag === 'New' ? 'tag-new' : 'tag-popular'}`}>
          {tag}
        </div>
      )}
      
      <div className="icon-bg">
        <TreatmentIcon className="w-5 h-5" />
      </div>
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">
          {highlightText(name, searchQuery)}
        </h4>
        <p className="text-sm text-gray-600 mb-2">
          {highlightText(description, searchQuery)}
        </p>
        <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
          <span>{priceLabel}</span>
          <span>{durationLabel}</span>
        </div>
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColor.replace('text-', 'bg-').replace('-600', '-100')} ${categoryColor}`}>
          {category}
        </span>
      </div>

      <div className="flex items-center justify-center">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
      <div className={`absolute bottom-3 left-4 text-[10px] font-medium ${availabilityClass}`}>
        {availabilityLabel}
      </div>
    </article>
  );
};

export const TreatmentList: React.FC<TreatmentListProps> = ({
  treatments,
  onTreatmentSelect,
  searchQuery
}) => {
  if (treatments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Grid Layout for larger screens, Stack for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {treatments.map(treatment => (
          <TreatmentCard
            key={treatment.id}
            treatment={treatment}
            onSelect={onTreatmentSelect}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
};

export default TreatmentList;
