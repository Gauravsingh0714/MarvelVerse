import test from 'node:test';
import assert from 'node:assert/strict';
import { TmdbNormalizer } from '../../src/services/tmdb/tmdb-normalizer.js';
import { RawSnapshotEnvelope, TmdbMovieResponse } from '@marvelverse/shared';

test('TmdbNormalizer converts movie raw envelope to normalized MovieCandidate', () => {
  const normalizer = new TmdbNormalizer();
  const mockEnvelope: RawSnapshotEnvelope<TmdbMovieResponse> = {
    provider: 'tmdb',
    resourceType: 'movie',
    tmdbId: 1726,
    acquiredAt: '2026-08-20T20:00:00.000Z',
    payload: {
      id: 1726,
      title: 'Iron Man',
      original_title: 'Iron Man',
      overview: 'After being held captive in an Afghan cave...',
      release_date: '2008-04-30',
      runtime: 126,
      genres: [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 878, name: 'Science Fiction' },
      ],
      popularity: 95.4,
      vote_average: 7.6,
      vote_count: 25000,
      poster_path: '/78lPtwv72eTNqFW9y8PweWnL4tI.jpg',
      backdrop_path: '/cyEc1YfTGiXF2 mep.jpg',
      original_language: 'en',
      adult: false,
      imdb_id: 'tt0371746',
    },
  };

  const { candidate } = normalizer.normalizeMovie(mockEnvelope);

  assert.equal(candidate.candidateId, 'tmdb-movie-1726');
  assert.equal(candidate.source, 'tmdb');
  assert.equal(candidate.sourceId, 1726);
  assert.equal(candidate.title, 'Iron Man');
  assert.deepEqual(candidate.genres, [
    'Action',
    'Adventure',
    'Science Fiction',
  ]);
  assert.equal(candidate.externalIds.imdbId, 'tt0371746');
});
