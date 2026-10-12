import { useCallback } from 'react';
import { CanonicalAppearance } from '@marvelverse/shared';
import { appearanceService } from '../services/appearance.service.js';
import { useApiQuery, ApiQueryResult } from './useApiQuery.js';
import { queryKeys } from './queryKeys.js';

export function useAppearances(): ApiQueryResult<CanonicalAppearance[]> {
  const queryFn = useCallback(() => appearanceService.getAppearances(), []);
  return useApiQuery<CanonicalAppearance[]>(queryFn, [], {
    queryKey: queryKeys.appearances.list(),
  });
}
