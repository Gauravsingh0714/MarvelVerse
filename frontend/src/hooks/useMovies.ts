import { useCallback } from 'react';
import { CanonicalMovie, CanonicalAppearance } from '@marvelverse/shared';
import { movieService, MovieFilters } from '../services/movie.service.js';
import { useApiQuery, ApiQueryResult } from './useApiQuery.js';

export function useMovies(
  filters: MovieFilters = {}
): ApiQueryResult<CanonicalMovie[]> {
  const queryFn = useCallback(
    () => movieService.getMovies(filters),
    [filters.universeId, filters.sagaId, filters.phaseId, filters.sort]
  );

  return useApiQuery<CanonicalMovie[]>(queryFn, [
    filters.universeId,
    filters.sagaId,
    filters.phaseId,
    filters.sort,
  ]);
}

export function useMovie(
  canonicalId: string | null
): ApiQueryResult<CanonicalMovie> {
  const queryFn = useCallback(() => {
    if (!canonicalId)
      return Promise.reject(new Error('No canonical ID provided'));
    return movieService.getMovieByCanonicalId(canonicalId);
  }, [canonicalId]);

  return useApiQuery<CanonicalMovie>(queryFn, [canonicalId]);
}

export function useMovieAppearances(
  movieId: string | null
): ApiQueryResult<CanonicalAppearance[]> {
  const queryFn = useCallback(() => {
    if (!movieId) return Promise.reject(new Error('No movie ID provided'));
    return movieService.getMovieAppearances(movieId);
  }, [movieId]);

  return useApiQuery<CanonicalAppearance[]>(queryFn, [movieId]);
}
