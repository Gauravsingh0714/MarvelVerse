import { useCallback } from 'react';
import { CanonicalMovie, CanonicalAppearance } from '@marvelverse/shared';
import { movieService, MovieFilters } from '../services/movie.service.js';
import { useApiQuery, ApiQueryResult } from './useApiQuery.js';
import { queryKeys } from './queryKeys.js';

export function useMovies(
  filters: MovieFilters = {}
): ApiQueryResult<CanonicalMovie[]> {
  const queryFn = useCallback(
    () => movieService.getMovies(filters),
    [filters.universeId, filters.sagaId, filters.phaseId, filters.sort]
  );

  return useApiQuery<CanonicalMovie[]>(
    queryFn,
    [filters.universeId, filters.sagaId, filters.phaseId, filters.sort],
    {
      queryKey: queryKeys.movies.list(filters),
    }
  );
}

export function useMovie(
  canonicalId: string | null
): ApiQueryResult<CanonicalMovie> {
  const queryFn = useCallback(() => {
    if (!canonicalId)
      return Promise.reject(new Error('No canonical ID provided'));
    return movieService.getMovieByCanonicalId(canonicalId);
  }, [canonicalId]);

  return useApiQuery<CanonicalMovie>(queryFn, [canonicalId], {
    enabled: Boolean(canonicalId),
    queryKey: queryKeys.movies.detail(canonicalId),
  });
}

export function useMovieAppearances(
  movieId: string | null
): ApiQueryResult<CanonicalAppearance[]> {
  const queryFn = useCallback(() => {
    if (!movieId) return Promise.reject(new Error('No movie ID provided'));
    return movieService.getMovieAppearances(movieId);
  }, [movieId]);

  return useApiQuery<CanonicalAppearance[]>(queryFn, [movieId], {
    enabled: Boolean(movieId),
    queryKey: queryKeys.movies.appearances(movieId),
  });
}
