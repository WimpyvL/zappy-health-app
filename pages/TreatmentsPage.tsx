import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { 
  TreatmentList, 
  TreatmentDetail, 
  TreatmentFilter, 
  TreatmentSearch 
} from '../components/treatments';
import { useProfile } from '../hooks/useProfile';
import { TREATMENT_CATEGORIES_DATA } from '../constants';
import { TreatmentWithCategory } from '../types';
import { ToastContext } from '../App';

const TreatmentsPage: React.FC = () => {
  const { profile, isLoggedIn } = useProfile();
  const toastContext = useContext(ToastContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get('category');
  const treatmentFromUrl = searchParams.get('treatment');
  
  // State management
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentWithCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'popular'>('popular');

  // Flatten all treatments with category information (memoized to prevent infinite loops)
  const allTreatments: TreatmentWithCategory[] = useMemo(() => 
    TREATMENT_CATEGORIES_DATA.flatMap(category =>
      category.treatments.map(treatment => ({
        ...treatment,
        category: category.title,
        categoryColor: category.themeColorClass
      }))
    ), []
  );

  // Update category and treatment when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (treatmentFromUrl) {
      const treatment = allTreatments.find(t => t.id === treatmentFromUrl);
      if (treatment) {
        setSelectedTreatment(treatment);
      }
    }
  }, [categoryFromUrl, treatmentFromUrl, allTreatments]);

  // Filter and sort treatments
  const filteredTreatments = allTreatments
    .filter(treatment => {
      const matchesCategory = selectedCategory === 'all' || treatment.category === selectedCategory;
      const matchesSearch = treatment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           treatment.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'popular':
          // Prioritize treatments with tags
          if (a.tag && !b.tag) return -1;
          if (!a.tag && b.tag) return 1;
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleTreatmentSelect = (treatment: TreatmentWithCategory) => {
    setSelectedTreatment(treatment);
  };

  const handleBackToList = () => {
    setSelectedTreatment(null);
    navigate('/treatments');
  };

  const handleStartTreatment = (treatment: TreatmentWithCategory) => {
    if (!isLoggedIn) {
      toastContext?.addToast('Please log in to start a treatment', 'warning');
      return;
    }
    
    toastContext?.addToast(`Starting consultation for ${treatment.name}...`, 'success');
    // Here you would navigate to consultation flow or add to cart
  };

  const handleAddToCart = (treatment: TreatmentWithCategory) => {
    if (!isLoggedIn) {
      toastContext?.addToast('Please log in to add treatments to cart', 'warning');
      return;
    }
    
    toastContext?.addToast(`${treatment.name} added to cart`, 'success');
    // Here you would add to shopping cart
  };

  // Get categories for filter
  const categories = [
    { id: 'all', name: 'All Treatments' },
    ...TREATMENT_CATEGORIES_DATA.map(cat => ({ id: cat.title, name: cat.title }))
  ];

  return (
    <div className="flex flex-col flex-grow bg-gray-50">
      <Header 
        title="Treatments" 
        subtitle={selectedTreatment ? selectedTreatment.name : "Find the right treatment for you"}
        showNotificationBell={true} 
      />
      
      <main className="px-6 pt-5 pb-36 flex-grow" role="main">
        {selectedTreatment ? (
          <TreatmentDetail
            treatment={selectedTreatment}
            onBack={handleBackToList}
            onStartTreatment={handleStartTreatment}
            onAddToCart={handleAddToCart}
            userProfile={profile}
          />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <TreatmentSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder="Search treatments..."
              />
              
              <TreatmentFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            {/* Results Summary */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {filteredTreatments.length} treatment{filteredTreatments.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </p>
            </div>

            {/* Treatment List */}
            <TreatmentList
              treatments={filteredTreatments}
              onTreatmentSelect={handleTreatmentSelect}
              searchQuery={searchQuery}
            />

            {/* Empty State */}
            {filteredTreatments.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No treatments found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default TreatmentsPage;
