import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart as ShoppingCartIconLucide, Search, ArrowRight } from 'lucide-react';
import ShoppingCart from '../components/cart/ShoppingCart';
import Header from '../components/layout/Header';
import { Treatment } from '../types';
import { TREATMENT_CATEGORIES_DATA } from '../constants';
import { useCart } from '../contexts/CartContext';

// TreatmentCard component - Enhanced for better UX
const TreatmentCard: React.FC<Treatment & { onClick: () => void }> = ({ 
  name, 
  description, 
  themeClass, 
  icon: TreatmentIcon, 
  tag, 
  onClick 
}) => {
  return (
    <article
      className={`${themeClass} relative rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-current`}
      tabIndex={0}
      role="button"
      aria-label={`View ${name} - ${description}`}
      onClick={onClick}
    >
      {tag && (
        <div className={`absolute top-4 right-4 ${tag === 'New' ? 'tag-new' : 'tag-popular'}`}>
          {tag}
        </div>
      )}
      
      <div className="flex items-start space-x-4 mb-4">
        <div className="icon-bg flex-shrink-0">
          <TreatmentIcon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 mb-2 text-lg">{name}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between group">
          <span className="text-sm font-medium text-gray-700">Learn more</span>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </article>
  );
};

// Category Header Component
interface CategoryHeaderProps {
  title: string;
  description: string;
  themeColor: string;
  onViewAll: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, description, themeColor, onViewAll }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={onViewAll}
        className={`${themeColor} px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-all flex items-center space-x-2`}
      >
        <span>View All</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// --- ShopPage Component ---
const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentCartItemCount = getCartItemCount();

  const handleTreatmentClick = (treatmentId: string) => {
    navigate(`/treatments?treatment=${encodeURIComponent(treatmentId)}`);
  };

  const handleViewAllCategory = (categoryTitle: string) => {
    navigate(`/treatments?category=${encodeURIComponent(categoryTitle)}`);
  };

  // Get category descriptions
  const getCategoryDescription = (categoryTitle: string): string => {
    const descriptions: Record<string, string> = {
      'Weight Loss': 'Medically supervised programs designed to help you reach your goals',
      'Anti-Aging': 'Advanced treatments to help you look and feel your best',
      'Hair & Skin': 'Clinically proven solutions for healthy hair and radiant skin',
      "Women's Health": 'Comprehensive care tailored for women at every stage',
      'Sexual Health': 'Confidential treatments to improve intimacy and wellness'
    };
    return descriptions[categoryTitle] || 'Browse our selection of treatments';
  };

  return (
    <div className="flex flex-col flex-grow bg-gradient-to-b from-gray-50 to-white">
      <Header title="Treatment Programs" subtitle="Expert care, personalized for you" />
      
      <main className="px-4 sm:px-6 lg:px-8 pt-6 pb-36 flex-grow max-w-7xl mx-auto w-full" role="main">
        {/* Search and Filter Bar */}
        <div className="mb-8 sticky top-0 bg-white/80 backdrop-blur-lg z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--primary)] focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--secondary)] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
              aria-label={`Open shopping cart, ${currentCartItemCount} items`}
            >
              <ShoppingCartIconLucide className="h-6 w-6" />
              {currentCartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 block h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                  {currentCartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Treatment Categories */}
        <div className="space-y-12">
          {TREATMENT_CATEGORIES_DATA.map(category => (
            <section key={category.id} className="scroll-mt-24">
              <CategoryHeader
                title={category.title}
                description={getCategoryDescription(category.title)}
                themeColor={category.themeColorClass}
                onViewAll={() => handleViewAllCategory(category.title)}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.treatments.map(treatment => (
                  <TreatmentCard
                    key={treatment.id}
                    {...treatment}
                    onClick={() => handleTreatmentClick(treatment.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Help Section */}
        <section className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-100">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Need help choosing?</h3>
            <p className="text-gray-600 mb-6">
              Our healthcare providers are here to guide you through finding the right treatment for your needs.
            </p>
            <button
              onClick={() => navigate('/messages')}
              className="bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--secondary)] transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Talk to a Provider</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>
      
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default ShopPage;
