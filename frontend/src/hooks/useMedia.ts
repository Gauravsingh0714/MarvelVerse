import { useCallback } from 'react';
import { EntityMediaBundle, ResolvedMediaAsset } from '@marvelverse/shared';
import {
  mediaService,
  MediaResolveQuery,
  EntityMediaOptions,
} from '../services/media.service.js';
import { useApiQuery, ApiQueryResult } from './useApiQuery.js';
import { queryKeys } from './queryKeys.js';

export function useResolvedMedia(
  query: MediaResolveQuery | null
): ApiQueryResult<ResolvedMediaAsset> {
  const queryFn = useCallback(() => {
    if (!query || !query.provider || !query.path) {
      return Promise.reject(new Error('Invalid media resolve query'));
    }
    return mediaService.resolveMedia(query);
  }, [query?.provider, query?.path, query?.kind, query?.size, query?.altText]);

  return useApiQuery<ResolvedMediaAsset>(
    queryFn,
    [query?.provider, query?.path, query?.kind, query?.size, query?.altText],
    {
      enabled: Boolean(query && query.provider && query.path),
      queryKey: queryKeys.media.resolve(
        (query ?? {}) as Record<string, unknown>
      ),
    }
  );
}

export function useMovieMedia(
  canonicalId: string | null,
  options: EntityMediaOptions = {}
): ApiQueryResult<EntityMediaBundle> {
  const queryFn = useCallback(() => {
    if (!canonicalId) {
      return Promise.reject(new Error('No movie canonical ID provided'));
    }
    return mediaService.getMovieMedia(canonicalId, options);
  }, [canonicalId, options.posterSize, options.backdropSize]);

  return useApiQuery<EntityMediaBundle>(
    queryFn,
    [canonicalId, options.posterSize, options.backdropSize],
    {
      enabled: Boolean(canonicalId),
      queryKey: queryKeys.media.movie(
        canonicalId,
        options as Record<string, unknown>
      ),
    }
  );
}

export function useSeriesMedia(
  canonicalId: string | null,
  options: EntityMediaOptions = {}
): ApiQueryResult<EntityMediaBundle> {
  const queryFn = useCallback(() => {
    if (!canonicalId) {
      return Promise.reject(new Error('No series canonical ID provided'));
    }
    return mediaService.getSeriesMedia(canonicalId, options);
  }, [canonicalId, options.posterSize, options.backdropSize]);

  return useApiQuery<EntityMediaBundle>(
    queryFn,
    [canonicalId, options.posterSize, options.backdropSize],
    {
      enabled: Boolean(canonicalId),
      queryKey: queryKeys.media.series(
        canonicalId,
        options as Record<string, unknown>
      ),
    }
  );
}

export function useCharacterMedia(
  canonicalId: string | null,
  options: EntityMediaOptions = {}
): ApiQueryResult<EntityMediaBundle> {
  const queryFn = useCallback(() => {
    if (!canonicalId) {
      return Promise.reject(new Error('No character canonical ID provided'));
    }
    return mediaService.getCharacterMedia(canonicalId, options);
  }, [canonicalId, options.avatarSize]);

  return useApiQuery<EntityMediaBundle>(
    queryFn,
    [canonicalId, options.avatarSize],
    {
      enabled: Boolean(canonicalId),
      queryKey: queryKeys.media.character(
        canonicalId,
        options as Record<string, unknown>
      ),
    }
  );
}
