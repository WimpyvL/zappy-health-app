import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../services/apiClient';
import type { ProductDataForShop, ShopPageCategorySectionData } from '../types';

interface ApiProduct {
  id: string;
  name?: string;
  product_name?: string;
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  price_per_month?: number | null;
  price?: number | null;
  price_text?: string | null;
  icon_name?: string | null;
  requires_prescription?: boolean | null;
  category?: string | null;
  category_id?: string | null;
  dose_id?: string | null;
  image_url?: string | null;
  theme_class?: string | null;
}

interface ApiSection {
  id?: string;
  section_id?: string;
  name?: string;
  title?: string;
  section_title?: string;
  theme_class?: string | null;
  theme?: string | null;
  image_url?: string | null;
  hero_image_url?: string | null;
  product_count_text?: string | null;
  products?: ApiProduct[] | null;
  main_card?: {
    title?: string;
    image_url?: string | null;
    product_count_text?: string | null;
  } | null;
}

interface ShopCatalogResponse {
  featured?: ApiProduct[];
  featured_products?: ApiProduct[];
  sections?: ApiSection[];
  categories?: ApiSection[];
  data?: ApiSection[];
  [key: string]: unknown;
}

const FALLBACK_THEMES = [
  'theme-weight',
  'theme-hair',
  'theme-aging',
  'theme-women',
  'theme-ed',
  'theme-sleep',
  'theme-peptides',
];

const FALLBACK_IMAGES = [
  'https://picsum.photos/seed/catalog-1/400/600',
  'https://picsum.photos/seed/catalog-2/400/600',
  'https://picsum.photos/seed/catalog-3/400/600',
  'https://picsum.photos/seed/catalog-4/400/600',
  'https://picsum.photos/seed/catalog-5/400/600',
];

const toStringSafe = (value: unknown): string | null => {
  if (value == null) {
    return null;
  }
  if (typeof value === 'string') {
    return value.trim() || null;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return null;
};

const normalizePrice = (product: ApiProduct): { value: number | null; label: string } => {
  const value = typeof product.price_per_month === 'number'
    ? product.price_per_month
    : typeof product.price === 'number'
      ? product.price
      : null;

  const label = toStringSafe(product.price_text) || (value != null ? `$${value}/month` : 'See details');

  return { value, label };
};

const mapProduct = (product: ApiProduct, section: ApiSection | null): ProductDataForShop => {
  const name = toStringSafe(product.name) || toStringSafe(product.product_name) || toStringSafe(product.title) || 'Treatment';
  const subtitle = toStringSafe(product.subtitle) || 'Personalized treatment';
  const description = toStringSafe(product.description) || subtitle;
  const category = toStringSafe(product.category) || toStringSafe(product.category_id) || toStringSafe(section?.title) || 'general';
  const themeClass = toStringSafe(product.theme_class) || toStringSafe(section?.theme_class) || FALLBACK_THEMES[0];
  const iconName = toStringSafe(product.icon_name) || 'SparklesIcon';
  const { value: price, label: priceText } = normalizePrice(product);
  const requiresPrescription = Boolean(product.requires_prescription);
  const doseId = toStringSafe(product.dose_id) || `${product.id}-default`;
  const imageUrl = toStringSafe(product.image_url) || toStringSafe(section?.image_url) || undefined;

  return {
    id: String(product.id),
    name,
    productName: name,
    subtitle,
    description,
    price: price ?? 0,
    priceText,
    doseId,
    iconName,
    requiresPrescription,
    category: category || 'general',
    imageUrl,
    themeClass: themeClass || undefined,
  } satisfies ProductDataForShop;
};

const mapSection = (section: ApiSection, index: number): ShopPageCategorySectionData => {
  const title = toStringSafe(section.section_title) || toStringSafe(section.title) || toStringSafe(section.name) || 'Treatments';
  const themeClass = toStringSafe(section.theme_class) || FALLBACK_THEMES[index % FALLBACK_THEMES.length];
  const mainCard = section.main_card ?? null;
  const imageUrl = toStringSafe(mainCard?.image_url) || toStringSafe(section.hero_image_url) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const productCountText = toStringSafe(mainCard?.product_count_text) || toStringSafe(section.product_count_text) || 'Explore';
  const sectionId = toStringSafe(section.id) || toStringSafe(section.section_id) || `section-${index}`;

  const products = (section.products ?? [])
    .filter((product): product is ApiProduct => Boolean(product))
    .map(product => mapProduct(product, section));

  return {
    id: sectionId,
    sectionTitle: title,
    themeClass: themeClass || FALLBACK_THEMES[index % FALLBACK_THEMES.length],
    mainCard: {
      title: title || 'Treatments',
      imageUrl,
      productCountText,
    },
    productTeasers: products,
  } satisfies ShopPageCategorySectionData;
};

const extractSections = (response: ShopCatalogResponse | ApiSection[] | null | undefined): ApiSection[] => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.sections)) {
    return response.sections as ApiSection[];
  }

  if (Array.isArray(response.categories)) {
    return response.categories as ApiSection[];
  }

  if (Array.isArray(response.data)) {
    return response.data as ApiSection[];
  }

  return [];
};

const extractFeatured = (response: ShopCatalogResponse | ApiProduct[] | null | undefined): ApiProduct[] => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.featured_products)) {
    return response.featured_products as ApiProduct[];
  }

  if (Array.isArray(response.featured)) {
    return response.featured as ApiProduct[];
  }

  return [];
};

export interface UseShopCatalogResult {
  featuredProducts: ProductDataForShop[];
  sections: ShopPageCategorySectionData[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useShopCatalog = (): UseShopCatalogResult => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductDataForShop[]>([]);
  const [sections, setSections] = useState<ShopPageCategorySectionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<ShopCatalogResponse | ApiSection[]>('/shop');
      const rawSections = extractSections(response ?? undefined);
      const rawFeatured = extractFeatured((response as ShopCatalogResponse) ?? undefined);

      const mappedSections = rawSections.map((section, index) => mapSection(section, index));
      const mappedFeatured = rawFeatured.map(product => mapProduct(product, null));

      setSections(mappedSections);
      setFeaturedProducts(mappedFeatured);
    } catch (err) {
      console.error('Failed to load shop catalog:', err);
      setSections([]);
      setFeaturedProducts([]);
      setError(err instanceof Error ? err.message : 'Failed to load shop catalog');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCatalog();
  }, [fetchCatalog]);

  return {
    featuredProducts,
    sections,
    loading,
    error,
    refresh: fetchCatalog,
  };
};

export default useShopCatalog;
