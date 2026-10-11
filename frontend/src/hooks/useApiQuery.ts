import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiClientError } from '../api/types.js';

export interface ApiQueryResult<T> {
  data: T | null;
  error: ApiClientError | Error | null;
  isLoading: boolean;
  refetch: () => void;
}

export interface UseApiQueryOptions {
  enabled?: boolean;
}

/**
 * Thin adapter over TanStack useQuery that preserves the existing call-site
 * contract: `useApiQuery(queryFn, deps, options)`.
 *
 * The deps array is used as the query key so TanStack can deduplicate and
 * cache requests. Every value that queryFn closes over must be listed in deps
 * (same rule as useCallback / useEffect).
 */
export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = [],
  options: UseApiQueryOptions = {}
): ApiQueryResult<T> {
  // Stable queryFn reference — callers already memoize this with useCallback.
  // We wrap it in useCallback here as a safety net.
  const stableQueryFn = useCallback(queryFn, deps); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, error, isLoading, refetch } = useQuery<
    T,
    ApiClientError | Error
  >({
    // Prefix with 'api-query' to namespace away from any other query keys.
    queryKey: ['api-query', ...deps],
    queryFn: stableQueryFn,
    enabled: options.enabled ?? true,
    // Propagate errors through the error field rather than throwing to an
    // ErrorBoundary, preserving the existing per-page error handling.
    throwOnError: false,
  });

  const refetchCallback = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    data: data ?? null,
    error: error ?? null,
    isLoading,
    refetch: refetchCallback,
  };
}
