import { useCallback } from 'react';
import { CanonicalTvSeries, CanonicalSeason } from '@marvelverse/shared';
import { seriesService, SeriesFilters } from '../services/series.service.js';
import { useApiQuery, ApiQueryResult } from './useApiQuery.js';
import { queryKeys } from './queryKeys.js';

export function useSeries(
  filters: SeriesFilters = {}
): ApiQueryResult<CanonicalTvSeries[]> {
  const queryFn = useCallback(
    () => seriesService.getSeries(filters),
    [filters.universeId, filters.sagaId, filters.phaseId, filters.sort]
  );

  return useApiQuery<CanonicalTvSeries[]>(
    queryFn,
    [filters.universeId, filters.sagaId, filters.phaseId, filters.sort],
    {
      queryKey: queryKeys.series.list(filters),
    }
  );
}

export function useSeriesDetail(
  canonicalId: string | null
): ApiQueryResult<CanonicalTvSeries & { seasons?: CanonicalSeason[] }> {
  const isIdValid = Boolean(
    canonicalId && /^mv-series-[a-z0-9-]+$/.test(canonicalId)
  );

  const queryFn = useCallback(() => {
    if (!canonicalId) {
      return Promise.reject(new Error('No series canonical ID provided'));
    }
    return seriesService.getSeriesById(canonicalId);
  }, [canonicalId]);

  return useApiQuery<CanonicalTvSeries & { seasons?: CanonicalSeason[] }>(
    queryFn,
    [canonicalId],
    {
      enabled: isIdValid,
      queryKey: queryKeys.series.detail(canonicalId),
    }
  );
}
