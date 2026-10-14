import type { MovieFilters } from '../services/movie.service.js';

export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    list: (filters: MovieFilters | Record<string, unknown> = {}) =>
      ['movies', 'list', filters] as const,
    detail: (canonicalId: string | null) =>
      ['movies', 'detail', canonicalId] as const,
    appearances: (movieId: string | null) =>
      ['movies', 'appearances', movieId] as const,
  },
  characters: {
    all: ['characters'] as const,
    list: () => ['characters', 'list'] as const,
    detail: (canonicalId: string | null) =>
      ['characters', 'detail', canonicalId] as const,
    appearances: (characterId: string | null) =>
      ['characters', 'appearances', characterId] as const,
  },
  appearances: {
    all: ['appearances'] as const,
    list: () => ['appearances', 'list'] as const,
  },
  foundation: {
    all: ['foundation'] as const,
    universes: () => ['foundation', 'universes'] as const,
    sagas: () => ['foundation', 'sagas'] as const,
    phases: () => ['foundation', 'phases'] as const,
  },
  media: {
    all: ['media'] as const,
    resolve: (query: Record<string, unknown> = {}) =>
      ['media', 'resolve', query] as const,
    movie: (
      canonicalId: string | null,
      options: Record<string, unknown> = {}
    ) => ['media', 'movie', canonicalId, options] as const,
    series: (
      canonicalId: string | null,
      options: Record<string, unknown> = {}
    ) => ['media', 'series', canonicalId, options] as const,
    character: (
      canonicalId: string | null,
      options: Record<string, unknown> = {}
    ) => ['media', 'character', canonicalId, options] as const,
  },
};
