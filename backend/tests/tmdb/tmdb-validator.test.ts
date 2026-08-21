import test from 'node:test';
import assert from 'node:assert/strict';
import { TmdbValidator } from '../../src/services/tmdb/tmdb-validator.js';
import { MovieCandidate } from '@marvelverse/shared';

test('TmdbValidator approves valid MovieCandidate and rejects invalid MovieCandidate', () => {
  const validator = new TmdbValidator();

  const validMovie: MovieCandidate = {
    source: 'tmdb',
    sourceId: 1726,
    acquiredAt: '2026-08-20T20:00:00.000Z',
    candidateId: 'tmdb-movie-1726',
    title: 'Iron Man',
    originalTitle: 'Iron Man',
    overview: 'An engineering genius builds an armored suit.',
    releaseDate: '2008-04-30',
    runtime: 126,
    genres: ['Action', 'Sci-Fi'],
    popularity: 95.5,
    voteAverage: 7.6,
    voteCount: 25000,
    posterPath: '/poster.jpg',
    backdropPath: '/backdrop.jpg',
    originalLanguage: 'en',
    adult: false,
    externalIds: { imdbId: 'tt0371746' },
  };

  const validReport = validator.validateMovie(validMovie);
  assert.equal(validReport.isValid, true);
  assert.equal(validReport.errors.length, 0);

  const invalidMovie: MovieCandidate = {
    ...validMovie,
    title: '', // Empty title fails schema
    voteAverage: 15, // Invalid voteAverage > 10
  };

  const invalidReport = validator.validateMovie(invalidMovie);
  assert.equal(invalidReport.isValid, false);
  assert.equal(invalidReport.errors.length > 0, true);
});
