
import React, { useState } from 'react';
import { ShoppingCart as ShoppingCartIconLucide } from 'lucide-react';
import ShoppingCart from '../components/cart/ShoppingCart';
import Header from '../components/layout/Header';
import { ProductDataForShop, ShopCategoryMainCardData, ShopPageCategorySectionData, CartItem } from '../types';
import { ICON_MAP } from '../constants';
import { useCart } from '../contexts/CartContext'; // Import the actual useCart hook
import { useShopCatalog } from '../hooks/useShopCatalog';

// --- Sub-Components for ShopPage ---

const RxTagComponent: React.FC = () => (
  <div className="rx-tag">Rx</div>
);

interface ProductTeaserCardProps {
  teaserData: ProductDataForShop;
  themeClass: string;
  onAddToCart: (product: ProductDataForShop) => void;
}

const ProductTeaserCard: React.FC<ProductTeaserCardProps> = ({ teaserData, themeClass, onAddToCart }) => {
  const IconComponent = ICON_MAP[teaserData.iconName] || ICON_MAP['SparklesIcon']; 

  return (
    <div 
      className={`program-card-small product-teaser-card ${themeClass} w-64 sm:w-72 h-[360px] flex-shrink-0`} 
      onClick={() => onAddToCart(teaserData)}
      role="button"
      tabIndex={0}
      aria-label={`Add ${teaserData.name} to cart`}
    >
      {teaserData.requiresPrescription && <RxTagComponent />}
      <div className={`icon-bg`}> 
        <IconComponent className="w-5 h-5" /> 
      </div>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-100 mt-2 mb-1 text-center">{teaserData.name}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center flex-grow">{teaserData.subtitle}</p>
      <p className="mt-auto text-sm font-bold text-orange-500 dark:text-orange-400 pt-2">{teaserData.priceText}</p>
    </div>
  );
};

interface MainCategoryDisplayCardProps {
  cardData: ShopCategoryMainCardData;
   onClick?: () => void;
}

const MainCategoryDisplayCard: React.FC<MainCategoryDisplayCardProps> = ({ cardData, onClick }) => {
  return (
    <div
      className="category-showcase-card w-64 sm:w-72 h-[360px] flex-shrink-0" 
      style={{ backgroundImage: `url(${cardData.imageUrl})` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${cardData.title}`}
    >
      <div className="overlay-content">
        <h3 className="overlay-title">{cardData.title}</h3>
        <p className="overlay-subtitle">{cardData.productCountText}</p>
      </div>
    </div>
  );
};

interface CategorySectionDisplayProps {
  section: ShopPageCategorySectionData;
  onAddToCart: (product: ProductDataForShop) => void;
   onCategoryClick: (categoryTitle: string) => void;
}

const CategorySectionDisplay: React.FC<CategorySectionDisplayProps> = ({ section, onAddToCart, onCategoryClick }) => {
  return (
    <section className="mb-10 md:mb-12" aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`} className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">{section.sectionTitle}</h2>
      <div className="flex overflow-x-auto space-x-4 md:space-x-6 py-4 scrollbar-hide"> 
        <MainCategoryDisplayCard cardData={section.mainCard} onClick={() => onCategoryClick(section.sectionTitle)} />
        {section.productTeasers.map((teaser) => (
          <ProductTeaserCard 
            key={teaser.id} 
            teaserData={teaser} 
            themeClass={section.themeClass} 
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

// --- ShopPage Component ---
const ShopPage: React.FC = () => {
  const { addItemToCart, getCartItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const currentCartItemCount = getCartItemCount();
  const { featuredProducts, sections, loading, error } = useShopCatalog();

  const handleProductTeaserAddToCart = (product: ProductDataForShop) => {
    const cartItem: CartItem = {
      doseId: product.doseId,
      productName: product.productName,
      price: product.price,
      quantity: 1, // When adding from the shop page, quantity is always 1 initially
      requiresPrescription: product.requiresPrescription,
      imageUrl: product.imageUrl,
    };
    addItemToCart(cartItem);
    console.log(`${product.name} added to cart via ShopPage handler.`);
  };

  const handleCategoryCardClick = (categoryTitle: string) => {
    console.log(`Category ${categoryTitle} main card clicked.`);
  };

  return (
    <div className="flex flex-col flex-grow">
      <Header title="Shop" subtitle="Find the right treatment for you" />

      <main className="px-4 sm:px-6 pt-5 pb-36 flex-grow" role="main">
        <div className="flex justify-end items-center mb-6">
            <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            aria-label={`Open shopping cart, ${currentCartItemCount} items`}
          >
            <ShoppingCartIconLucide className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            {currentCartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-white dark:ring-slate-800">
                {currentCartItemCount}
              </span>
            )}
          </button>
        </div>

        <div className="space-y-10">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <section className="mb-10 md:mb-12" aria-labelledby="top-picks-title">
            <h2 id="top-picks-title" className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Top Picks</h2>
            {loading && featuredProducts.length === 0 ? (
              <div className="flex space-x-4 py-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-[360px] w-64 animate-pulse rounded-2xl bg-gray-100" />
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="flex overflow-x-auto space-x-4 md:space-x-6 py-4 scrollbar-hide">
                {featuredProducts.map(product => (
                  <ProductTeaserCard
                    key={product.id}
                    teaserData={product}
                    themeClass={product.themeClass || 'theme-peptides'}
                    onAddToCart={handleProductTeaserAddToCart}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">We&apos;re curating featured products. Check back soon.</p>
            )}
          </section>

          {loading && sections.length === 0 ? (
            <div className="space-y-6">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="h-[360px] w-full animate-pulse rounded-2xl bg-gray-100" />
              ))}
            </div>
          ) : sections.length > 0 ? (
            sections.map(section => (
              <CategorySectionDisplay
                key={section.id}
                section={section}
                onAddToCart={handleProductTeaserAddToCart}
                onCategoryClick={handleCategoryCardClick}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-gray-200 p-6 text-center text-sm text-gray-600">
              <p className="font-medium text-gray-700">Our catalog is coming soon</p>
              <p className="mt-1">We&apos;re finalizing product inventory. Please check back shortly.</p>
            </div>
          )}
        </div>
      </main>
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default ShopPage;
