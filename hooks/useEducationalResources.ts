import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../services/apiClient';
import type { EducationalResource } from '../types/api';

interface EducationalResourcesResponse {
  resources?: EducationalResource[];
  data?: EducationalResource[];
  items?: EducationalResource[];
  [key: string]: unknown;
}

const extractResources = (response: EducationalResourcesResponse | EducationalResource[] | null | undefined): EducationalResource[] => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.resources)) {
    return response.resources as EducationalResource[];
  }

  if (Array.isArray(response.data)) {
    return response.data as EducationalResource[];
  }

  if (Array.isArray(response.items)) {
    return response.items as EducationalResource[];
  }

  return [];
};

export interface UseEducationalResourcesResult {
  resources: EducationalResource[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useEducationalResources = (): UseEducationalResourcesResult => {
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<EducationalResourcesResponse | EducationalResource[]>('/resources/featured');
      const mapped = extractResources(response ?? undefined);
      setResources(mapped);
    } catch (err) {
      console.error('Failed to load educational resources:', err);
      setResources([]);
      setError(err instanceof Error ? err.message : 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchResources();
  }, [fetchResources]);

  return {
    resources,
    loading,
    error,
    refresh: fetchResources,
  };
};

export default useEducationalResources;
