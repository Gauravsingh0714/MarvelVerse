import { useCallback } from 'react';
import { CanonicalAppearance } from '@marvelverse/shared';
import { appearanceService } from '../services/appearance.service.js';
import { useApiQuery, ApiQueryResult } from './useApiQuery.js';

export function useAppearances(): ApiQueryResult<CanonicalAppearance[]> {
  const queryFn = useCallback(() => appearanceService.getAppearances(), []);
  return useApiQuery<CanonicalAppearance[]>(queryFn, []);
}
