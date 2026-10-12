import { useCallback } from 'react';
import { CanonicalCharacter, CanonicalAppearance } from '@marvelverse/shared';
import { characterService } from '../services/character.service.js';
import { useApiQuery, ApiQueryResult } from './useApiQuery.js';
import { queryKeys } from './queryKeys.js';

export function useCharacters(): ApiQueryResult<CanonicalCharacter[]> {
  const queryFn = useCallback(() => characterService.getCharacters(), []);
  return useApiQuery<CanonicalCharacter[]>(queryFn, [], {
    queryKey: queryKeys.characters.list(),
  });
}

export function useCharacter(
  canonicalId: string | null
): ApiQueryResult<CanonicalCharacter> {
  const queryFn = useCallback(() => {
    if (!canonicalId)
      return Promise.reject(new Error('No canonical ID provided'));
    return characterService.getCharacterByCanonicalId(canonicalId);
  }, [canonicalId]);

  return useApiQuery<CanonicalCharacter>(queryFn, [canonicalId], {
    enabled: Boolean(canonicalId),
    queryKey: queryKeys.characters.detail(canonicalId),
  });
}

export function useCharacterAppearances(
  characterId: string | null
): ApiQueryResult<CanonicalAppearance[]> {
  const queryFn = useCallback(() => {
    if (!characterId)
      return Promise.reject(new Error('No character ID provided'));
    return characterService.getCharacterAppearances(characterId);
  }, [characterId]);

  return useApiQuery<CanonicalAppearance[]>(queryFn, [characterId], {
    enabled: Boolean(characterId),
    queryKey: queryKeys.characters.appearances(characterId),
  });
}
