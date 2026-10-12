import { useCallback } from 'react';
import {
  CanonicalUniverse,
  CanonicalSaga,
  CanonicalPhase,
} from '@marvelverse/shared';
import { foundationService } from '../services/foundation.service.js';
import { useApiQuery, ApiQueryResult } from './useApiQuery.js';
import { queryKeys } from './queryKeys.js';

export function useUniverses(): ApiQueryResult<CanonicalUniverse[]> {
  const queryFn = useCallback(() => foundationService.getUniverses(), []);
  return useApiQuery<CanonicalUniverse[]>(queryFn, [], {
    queryKey: queryKeys.foundation.universes(),
  });
}

export function useSagas(): ApiQueryResult<CanonicalSaga[]> {
  const queryFn = useCallback(() => foundationService.getSagas(), []);
  return useApiQuery<CanonicalSaga[]>(queryFn, [], {
    queryKey: queryKeys.foundation.sagas(),
  });
}

export function usePhases(): ApiQueryResult<CanonicalPhase[]> {
  const queryFn = useCallback(() => foundationService.getPhases(), []);
  return useApiQuery<CanonicalPhase[]>(queryFn, [], {
    queryKey: queryKeys.foundation.phases(),
  });
}
