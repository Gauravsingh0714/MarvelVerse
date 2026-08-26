import { useCallback } from 'react';
import { CanonicalCharacter, CanonicalAppearance } from '@marvelverse/shared';
import { characterService } from '../services/character.service.js';
import { useApiQuery, ApiQueryResult } from './useApiQuery.js';

export function useCharacters(): ApiQueryResult<CanonicalCharacter[]> {
  const queryFn = useCallback(() => characterService.getCharacters(), []);
  return useApiQuery<CanonicalCharacter[]>(queryFn, []);
}

export function useCharacter(
  canonicalId: string | null
): ApiQueryResult<CanonicalCharacter> {
  const queryFn = useCallback(() => {
    if (!canonicalId)
      return Promise.reject(new Error('No canonical ID provided'));
    return characterService.getCharacterByCanonicalId(canonicalId);
  }, [canonicalId]);

  return useApiQuery<CanonicalCharacter>(queryFn, [canonicalId]);
}

export function useCharacterAppearances(
  characterId: string | null
): ApiQueryResult<CanonicalAppearance[]> {
  const queryFn = useCallback(() => {
    if (!characterId)
      return Promise.reject(new Error('No character ID provided'));
    return characterService.getCharacterAppearances(characterId);
  }, [characterId]);

  return useApiQuery<CanonicalAppearance[]>(queryFn, [characterId]);
}
