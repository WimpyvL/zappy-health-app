import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import {
  TreatmentList,
  TreatmentDetail,
  TreatmentFilter,
  TreatmentSearch
} from '../components/treatments';
import { useProfile } from '../hooks/useProfile';
import { TreatmentWithCategory } from '../types';
import { ToastContext } from '../App';
import { useTreatments } from '../hooks/useTreatments';

const TreatmentsPage: React.FC = () => {
  const { profile, isLoggedIn } = useProfile();
  const toastContext = useContext(ToastContext);
  const location = useLocation();
  
  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get('category');
  const treatmentFromUrl = searchParams.get('treatment');
  
  // State management
  const {
    categories,
    treatments,
    loading: treatmentsLoading,
    error: treatmentsError,
    fetchDetail,
    detailById,
    detailLoading,
    detailErrors,
  } = useTreatments();

  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(treatmentFromUrl);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'popular'>('popular');

  const selectedTreatment = selectedTreatmentId
    ? treatments.find(treatment => treatment.id === selectedTreatmentId) ?? null
    : null;

  // Update category and treatment when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    if (treatmentFromUrl) {
      setSelectedTreatmentId(treatmentFromUrl);
    }
  }, [treatmentFromUrl]);

  useEffect(() => {
    if (selectedTreatmentId) {
      void fetchDetail(selectedTreatmentId);
    }
  }, [selectedTreatmentId, fetchDetail]);

  // Filter and sort treatments
  const filteredTreatments = treatments
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
    setSelectedTreatmentId(treatment.id);
  };

  const handleBackToList = () => {
    setSelectedTreatmentId(null);
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
  const filterCategories = [
    { id: 'all', name: 'All Treatments' },
    ...categories.map(cat => ({ id: cat.title, name: cat.title }))
  ];

  const selectedTreatmentDetail = selectedTreatment ? detailById[selectedTreatment.id] : null;
  const selectedTreatmentDetailLoading = selectedTreatment ? detailLoading[selectedTreatment.id] : false;
  const selectedTreatmentDetailError = selectedTreatment ? detailErrors[selectedTreatment.id] : undefined;

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
            detail={selectedTreatmentDetail}
            isLoading={selectedTreatmentDetailLoading}
            errorMessage={selectedTreatmentDetailError}
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
                categories={filterCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            {treatmentsError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {treatmentsError}
              </div>
            )}

            {treatmentsLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
                ))}
              </div>
            ) : (
              <>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 01 14 0z" />
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
          </>
        )}
      </main>
    </div>
  );
};

export default TreatmentsPage;
