import React from 'react';

interface Category {
  id: string;
  name: string;
}

interface TreatmentFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  sortBy: 'name' | 'category' | 'popular';
  onSortChange: (sortBy: 'name' | 'category' | 'popular') => void;
}

export const TreatmentFilter: React.FC<TreatmentFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Category Filter */}
      <div className="flex-1">
        <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Filter */}
      <div className="flex-1">
        <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">
          Sort by
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'name' | 'category' | 'popular')}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="popular">Most Popular</option>
          <option value="name">Name (A-Z)</option>
          <option value="category">Category</option>
        </select>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2 sm:flex-col sm:justify-end">
        <span className="text-sm font-medium text-gray-700 hidden sm:block mb-2">Quick filters</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('Weight Loss')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === 'Weight Loss'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Weight Loss
          </button>
          <button
            onClick={() => onCategoryChange('Anti-Aging')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === 'Anti-Aging'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Anti-Aging
          </button>
          <button
            onClick={() => onCategoryChange('Hair & Skin')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === 'Hair & Skin'
                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Hair & Skin
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentFilter;
