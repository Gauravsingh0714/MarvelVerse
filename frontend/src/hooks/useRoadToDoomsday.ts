import { useCallback } from 'react';
import { WatchGuideEntry } from '@marvelverse/shared';
import {
  curatedService,
  DoomsdayFilters,
} from '../services/curated.service.js';
import { useApiQuery, ApiQueryResult } from './useApiQuery.js';
import { queryKeys } from './queryKeys.js';

export function useRoadToDoomsday(
  filters: DoomsdayFilters = {}
): ApiQueryResult<WatchGuideEntry[]> {
  const queryFn = useCallback(
    () => curatedService.getRoadToDoomsday(filters),
    [filters.tier]
  );

  return useApiQuery<WatchGuideEntry[]>(queryFn, [filters.tier], {
    queryKey: queryKeys.curated.doomsday(filters),
  });
}
