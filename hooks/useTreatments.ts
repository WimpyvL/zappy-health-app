import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import { ICON_MAP } from '../constants';
import { apiFetch } from '../services/apiClient';
import type { TreatmentCategory, TreatmentDetailContent, TreatmentWithCategory } from '../types';

interface ApiTreatmentSummary {
  id: string;
  name: string;
  description?: string | null;
  icon_name?: string | null;
  icon?: string | null;
  theme_class?: string | null;
  tag?: string | null;
  price_per_month?: number | null;
  price?: number | null;
  duration?: string | null;
  duration_text?: string | null;
  frequency?: string | null;
  frequency_text?: string | null;
  is_available?: boolean | null;
  available?: boolean | null;
  availability?: string | null;
}

interface ApiTreatmentCategory {
  id?: string;
  title?: string;
  name?: string;
  view_all_label?: string | null;
  theme_class?: string | null;
  themeColorClass?: string | null;
  theme_color_class?: string | null;
  color_class?: string | null;
  color?: string | null;
  treatments?: ApiTreatmentSummary[] | null;
}

interface TreatmentsIndexResponse {
  categories?: ApiTreatmentCategory[];
  data?: ApiTreatmentCategory[];
  items?: ApiTreatmentCategory[];
  [key: string]: unknown;
}

interface TreatmentDetailResponse {
  id?: string;
  treatment?: Record<string, unknown> | null;
  overview?: string | null;
  description?: string | null;
  summary?: string | null;
  how_it_works?: unknown;
  howItWorks?: unknown;
  steps?: unknown;
  benefits?: unknown;
  side_effects?: unknown;
  sideEffects?: unknown;
  dosage?: string | null;
  instructions?: string | null;
  frequency?: string | null;
  frequency_text?: string | null;
  duration?: string | null;
  duration_text?: string | null;
  price_per_month?: number | null;
  price?: number | null;
  contraindications?: unknown;
  warnings?: unknown;
  is_available?: boolean | null;
  available?: boolean | null;
  [key: string]: unknown;
}

const FALLBACK_THEME_CLASSES = [
  'program-weight',
  'program-hair',
  'program-aging',
  'program-peptides',
  'program-ed',
  'program-women',
  'program-sleep',
];

const FALLBACK_COLOR_CLASSES = [
  'text-blue-600',
  'text-purple-600',
  'text-amber-600',
  'text-emerald-600',
  'text-red-600',
  'text-pink-600',
  'text-sky-600',
];

const FALLBACK_ICON: FC<{ className?: string }> = ICON_MAP['SparklesIcon'] || (() => null);

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

const toStringArray = (value: unknown): string[] | null => {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    const mapped = value
      .map(item => toStringSafe(item))
      .filter((item): item is string => Boolean(item));
    return mapped.length > 0 ? mapped : null;
  }

  const str = toStringSafe(value);
  if (str) {
    return str.split(/\r?\n|\./).map(part => part.trim()).filter(Boolean);
  }

  return null;
};

const resolveIcon = (iconName?: string | null) => {
  if (!iconName) {
    return FALLBACK_ICON;
  }

  const direct = ICON_MAP[iconName];
  if (direct) {
    return direct;
  }

  const normalized = iconName
    .replace(/[-_\s]+([a-z])/gi, (_, char: string) => char.toUpperCase())
    .replace(/^[a-z]/, char => char.toUpperCase());

  const withSuffix = normalized.endsWith('Icon') ? normalized : `${normalized}Icon`;
  return ICON_MAP[withSuffix] || FALLBACK_ICON;
};

const mapTag = (tag?: string | null): 'New' | 'Popular' | undefined => {
  if (!tag) {
    return undefined;
  }

  const normalized = tag.toLowerCase();
  if (normalized.includes('new')) {
    return 'New';
  }
  if (normalized.includes('popular') || normalized.includes('top') || normalized.includes('best')) {
    return 'Popular';
  }

  return undefined;
};

const pickColorClass = (category: ApiTreatmentCategory, index: number): string => {
  const candidates = [
    category.themeColorClass,
    category.theme_color_class,
    category.color_class,
    category.color,
  ].map(toStringSafe);

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    if (candidate.startsWith('text-')) {
      return candidate;
    }

    if (candidate.startsWith('bg-')) {
      return candidate.replace('bg-', 'text-');
    }
  }

  return FALLBACK_COLOR_CLASSES[index % FALLBACK_COLOR_CLASSES.length];
};

const pickThemeClass = (category: ApiTreatmentCategory, summary: ApiTreatmentSummary, index: number): string => {
  const candidates = [
    summary.theme_class,
    category.theme_class,
  ].map(toStringSafe);

  for (const candidate of candidates) {
    if (candidate) {
      return candidate;
    }
  }

  const slug = toStringSafe(category.id) || toStringSafe(category.name) || toStringSafe(category.title);
  if (slug) {
    return `program-${slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }

  return FALLBACK_THEME_CLASSES[index % FALLBACK_THEME_CLASSES.length];
};

const normalizeCategoryTitle = (category: ApiTreatmentCategory): string => {
  return (
    toStringSafe(category.title) ||
    toStringSafe(category.name) ||
    'Treatments'
  );
};

const normalizeViewAllLabel = (categoryTitle: string, explicit?: string | null): string => {
  const provided = toStringSafe(explicit);
  if (provided) {
    return provided;
  }

  return `View all ${categoryTitle.toLowerCase()}`;
};

const normalizePrice = (summary: ApiTreatmentSummary): number | null => {
  if (typeof summary.price_per_month === 'number') {
    return summary.price_per_month;
  }
  if (typeof summary.price === 'number') {
    return summary.price;
  }
  return null;
};

const normalizeBoolean = (value: unknown): boolean | null => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', 'yes', 'available', 'active'].includes(normalized)) {
      return true;
    }
    if (['false', 'no', 'unavailable', 'inactive'].includes(normalized)) {
      return false;
    }
  }
  return null;
};

const extractCategories = (response: TreatmentsIndexResponse | ApiTreatmentCategory[] | null | undefined): ApiTreatmentCategory[] => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.categories)) {
    return response.categories as ApiTreatmentCategory[];
  }

  if (Array.isArray(response.data)) {
    return response.data as ApiTreatmentCategory[];
  }

  if (Array.isArray(response.items)) {
    return response.items as ApiTreatmentCategory[];
  }

  return [];
};

const mapCategories = (rawCategories: ApiTreatmentCategory[]): TreatmentCategory[] => {
  return rawCategories.map((category, categoryIndex) => {
    const title = normalizeCategoryTitle(category);
    const themeColorClass = pickColorClass(category, categoryIndex);

    const treatments = (category.treatments ?? [])
      .filter((item): item is ApiTreatmentSummary => Boolean(item))
      .map((summary, treatmentIndex) => {
        const icon = resolveIcon(summary.icon_name || summary.icon);
        const themeClass = pickThemeClass(category, summary, treatmentIndex);

        return {
          id: String(summary.id ?? `${category.id ?? categoryIndex}-${treatmentIndex}`),
          name: toStringSafe(summary.name) || 'Treatment',
          description: toStringSafe(summary.description) || 'Personalized medical treatment',
          themeClass,
          icon,
          tag: mapTag(summary.tag),
          pricePerMonth: normalizePrice(summary),
          duration: toStringSafe(summary.duration) || toStringSafe(summary.duration_text),
          frequency: toStringSafe(summary.frequency) || toStringSafe(summary.frequency_text),
          isAvailable: normalizeBoolean(summary.is_available ?? summary.available ?? summary.availability),
        };
      });

    return {
      id: String(category.id ?? `category-${categoryIndex}`),
      title,
      viewAllLabel: normalizeViewAllLabel(title, category.view_all_label),
      themeColorClass,
      treatments,
    } satisfies TreatmentCategory;
  });
};

const mapDetailResponse = (raw: TreatmentDetailResponse | null | undefined, treatmentId: string): TreatmentDetailContent => {
  if (!raw || typeof raw !== 'object') {
    return { id: treatmentId };
  }

  const nested = raw.treatment && typeof raw.treatment === 'object' ? raw.treatment : null;
  const source = nested ?? raw;

  const pick = (...keys: string[]): string | null => {
    for (const key of keys) {
      if (key in source) {
        const value = toStringSafe((source as Record<string, unknown>)[key]);
        if (value) {
          return value;
        }
      }
      if (nested && key in nested) {
        const value = toStringSafe((nested as Record<string, unknown>)[key]);
        if (value) {
          return value;
        }
      }
    }
    return null;
  };

  const pickArray = (...keys: string[]): string[] | null => {
    for (const key of keys) {
      if (key in (raw as Record<string, unknown>)) {
        const value = toStringArray((raw as Record<string, unknown>)[key]);
        if (value) {
          return value;
        }
      }
      if (nested && key in nested) {
        const value = toStringArray((nested as Record<string, unknown>)[key]);
        if (value) {
          return value;
        }
      }
    }
    return null;
  };

  const id = toStringSafe((source as Record<string, unknown>).id) || treatmentId;
  const price =
    typeof (raw as Record<string, unknown>).price_per_month === 'number'
      ? (raw as Record<string, unknown>).price_per_month
      : typeof (source as Record<string, unknown>).price_per_month === 'number'
        ? (source as Record<string, unknown>).price_per_month
        : typeof (raw as Record<string, unknown>).price === 'number'
          ? (raw as Record<string, unknown>).price
          : typeof (source as Record<string, unknown>).price === 'number'
            ? (source as Record<string, unknown>).price
            : null;

  const isAvailable = normalizeBoolean(
    (raw as Record<string, unknown>).is_available ??
    (raw as Record<string, unknown>).available ??
    (source as Record<string, unknown>).is_available ??
    (source as Record<string, unknown>).available
  );

  return {
    id,
    overview: pick('overview', 'description', 'summary'),
    howItWorks: pickArray('how_it_works', 'howItWorks', 'steps'),
    benefits: pickArray('benefits', 'highlights'),
    sideEffects: pickArray('side_effects', 'sideEffects', 'risks'),
    dosage: pick('dosage', 'instructions'),
    frequency: pick('frequency', 'frequency_text'),
    duration: pick('duration', 'duration_text'),
    pricePerMonth: price,
    contraindications: pickArray('contraindications', 'warnings'),
    isAvailable,
  } satisfies TreatmentDetailContent;
};

export interface UseTreatmentsResult {
  categories: TreatmentCategory[];
  treatments: TreatmentWithCategory[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  detailById: Record<string, TreatmentDetailContent>;
  detailLoading: Record<string, boolean>;
  detailErrors: Record<string, string>;
  fetchDetail: (treatmentId: string, options?: { force?: boolean }) => Promise<TreatmentDetailContent | null>;
}

export const useTreatments = (): UseTreatmentsResult => {
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [detailById, setDetailById] = useState<Record<string, TreatmentDetailContent>>({});
  const [detailLoading, setDetailLoading] = useState<Record<string, boolean>>({});
  const [detailErrors, setDetailErrors] = useState<Record<string, string>>({});

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<TreatmentsIndexResponse | ApiTreatmentCategory[]>('/treatments');
      const rawCategories = extractCategories(response ?? undefined);
      const mapped = mapCategories(rawCategories);
      setCategories(mapped);
    } catch (err) {
      console.error('Failed to load treatments:', err);
      setCategories([]);
      setError(err instanceof Error ? err.message : 'Failed to load treatments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const treatments = useMemo(() => {
    return categories.flatMap(category =>
      category.treatments.map(treatment => ({
        ...treatment,
        category: category.title,
        categoryColor: category.themeColorClass,
      }))
    );
  }, [categories]);

  const fetchDetail = useCallback<UseTreatmentsResult['fetchDetail']>(async (treatmentId, options) => {
    if (!treatmentId) {
      return null;
    }

    if (!options?.force && detailById[treatmentId]) {
      return detailById[treatmentId];
    }

    setDetailLoading(prev => ({ ...prev, [treatmentId]: true }));
    setDetailErrors(prev => {
      const next = { ...prev };
      delete next[treatmentId];
      return next;
    });

    try {
      const response = await apiFetch<TreatmentDetailResponse>(`/treatments/${treatmentId}`);
      const mapped = mapDetailResponse(response, treatmentId);
      setDetailById(prev => ({ ...prev, [treatmentId]: mapped }));
      return mapped;
    } catch (err) {
      console.error(`Failed to load treatment detail for ${treatmentId}:`, err);
      const message = err instanceof Error ? err.message : 'Failed to load treatment details';
      setDetailErrors(prev => ({ ...prev, [treatmentId]: message }));
      return null;
    } finally {
      setDetailLoading(prev => ({ ...prev, [treatmentId]: false }));
    }
  }, [detailById]);

  return {
    categories,
    treatments,
    loading,
    error,
    refresh: fetchCategories,
    detailById,
    detailLoading,
    detailErrors,
    fetchDetail,
  };
};

export default useTreatments;
