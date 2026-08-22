import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CanonicalMovie,
  CanonicalCharacter,
  CanonicalAppearance,
  MovieCandidate,
} from '@marvelverse/shared';
import {
  CanonicalMapper,
  CanonicalValidator,
  CanonicalPromoter,
  DuplicateDetector,
  PromotionError,
  slugify,
} from '../../src/services/canonical/index.js';

const mockUniverses = [{ id: 'earth-616', name: 'Earth-616' }];
const mockSagas = [{ id: 'infinity-saga', name: 'Infinity Saga', order: 1 }];
const mockPhases = [
  { id: 'phase-1', name: 'Phase One', number: 1, sagaId: 'infinity-saga' },
];

const validMovieCandidate: MovieCandidate = {
  source: 'tmdb',
  sourceId: 1726,
  acquiredAt: '2026-08-22T00:00:00.000Z',
  candidateId: 'tmdb-movie-1726',
  title: 'Iron Man',
  originalTitle: 'Iron Man',
  overview: 'Tony Stark builds an armored suit to fight evil.',
  releaseDate: '2008-04-30',
  runtime: 126,
  genres: ['Action', 'Sci-Fi'],
  popularity: 100,
  voteAverage: 7.6,
  voteCount: 25000,
  posterPath: '/ironman.jpg',
  backdropPath: '/ironman_bg.jpg',
  originalLanguage: 'en',
  adult: false,
  externalIds: { imdbId: 'tt0371746' },
};

test('slugify produces clean deterministic slugs', () => {
  assert.equal(slugify('Iron Man'), 'iron-man');
  assert.equal(
    slugify('Captain America: The First Avenger!'),
    'captain-america-the-first-avenger'
  );
});

test('CanonicalMapper maps MovieCandidate into CanonicalMovie with deterministic ID', () => {
  const mapper = new CanonicalMapper();
  const canonical = mapper.mapMovieCandidateToCanonical(validMovieCandidate, {
    releaseOrder: 1,
    universeId: 'earth-616',
    sagaId: 'infinity-saga',
    phaseId: 'phase-1',
    verification: { status: 'verified' },
  });

  assert.equal(canonical.canonicalId, 'mv-movie-iron-man');
  assert.equal(canonical.title, 'Iron Man');
  assert.equal(canonical.releaseOrder, 1);
  assert.equal(canonical.externalIds.tmdb, 1726);
  assert.equal(canonical.externalIds.imdb, 'tt0371746');
  assert.equal(canonical.provenance.provider, 'tmdb');
  assert.equal(canonical.provenance.sourceId, 1726);
});

test('CanonicalValidator approves valid movie and flags relationship/schema errors', () => {
  const validator = new CanonicalValidator(
    mockUniverses,
    mockSagas,
    mockPhases
  );
  const mapper = new CanonicalMapper();
  const validMovie = mapper.mapMovieCandidateToCanonical(validMovieCandidate, {
    releaseOrder: 1,
    universeId: 'earth-616',
    sagaId: 'infinity-saga',
    phaseId: 'phase-1',
    verification: { status: 'verified' },
  });

  const validRep = validator.validateMovie(validMovie);
  assert.equal(validRep.isValid, true);
  assert.equal(validRep.errors.length, 0);

  // Invalid Universe Reference
  const invalidUnivMovie = { ...validMovie, universeId: 'earth-invalid' };
  const repUniv = validator.validateMovie(invalidUnivMovie);
  assert.equal(repUniv.isValid, false);
  assert.equal(
    repUniv.errors.some((e) => e.includes('universeId')),
    true
  );

  // Invalid Saga Reference
  const invalidSagaMovie = { ...validMovie, sagaId: 'saga-invalid' };
  const repSaga = validator.validateMovie(invalidSagaMovie);
  assert.equal(repSaga.isValid, false);

  // Invalid Phase Reference
  const invalidPhaseMovie = { ...validMovie, phaseId: 'phase-invalid' };
  const repPhase = validator.validateMovie(invalidPhaseMovie);
  assert.equal(repPhase.isValid, false);
});

test('DuplicateDetector flags duplicate canonicalId, TMDB ID, and IMDb ID', () => {
  const detector = new DuplicateDetector();
  const mapper = new CanonicalMapper();
  const movie1 = mapper.mapMovieCandidateToCanonical(validMovieCandidate, {
    releaseOrder: 1,
    universeId: 'earth-616',
    sagaId: 'infinity-saga',
    phaseId: 'phase-1',
    verification: { status: 'verified' },
  });

  const duplicateIdMovie: CanonicalMovie = { ...movie1 };
  const conflicts1 = detector.detectMovieConflicts(
    duplicateIdMovie,
    [movie1],
    false
  );
  assert.equal(
    conflicts1.some((c) => c.type === 'duplicate-canonical-id'),
    true
  );

  const duplicateTmdbMovie: CanonicalMovie = {
    ...movie1,
    canonicalId: 'mv-movie-iron-man-remake',
  };
  const conflicts2 = detector.detectMovieConflicts(duplicateTmdbMovie, [
    movie1,
  ]);
  assert.equal(
    conflicts2.some((c) => c.type === 'duplicate-tmdb-id'),
    true
  );
});

test('CanonicalPromoter rejects unverified, rejected, and needs-review records', () => {
  const mapper = new CanonicalMapper();
  const promoter = new CanonicalPromoter();

  const statuses: Array<'unverified' | 'rejected' | 'needs-review'> = [
    'unverified',
    'rejected',
    'needs-review',
  ];

  for (const status of statuses) {
    const unverifiedMovie = mapper.mapMovieCandidateToCanonical(
      validMovieCandidate,
      {
        releaseOrder: 1,
        universeId: 'earth-616',
        sagaId: 'infinity-saga',
        phaseId: 'phase-1',
        verification: { status },
      }
    );

    assert.throws(
      () => promoter.promoteMovie(unverifiedMovie),
      (err: unknown) => {
        return err instanceof PromotionError && err.message.includes(status);
      }
    );
  }
});

test('Character and Appearance validation & relationship integrity', () => {
  const validator = new CanonicalValidator();

  const validChar: CanonicalCharacter = {
    canonicalId: 'mv-character-tony-stark',
    name: 'Tony Stark',
    externalIds: { tmdb: 3223 },
    verification: { status: 'verified' },
  };

  const charRep = validator.validateCharacter(validChar);
  assert.equal(charRep.isValid, true);

  const validApp: CanonicalAppearance = {
    canonicalId: 'mv-app-tony-stark-iron-man',
    characterId: 'mv-character-tony-stark',
    mediaType: 'movie',
    mediaCanonicalId: 'mv-movie-iron-man',
    roleName: 'Tony Stark / Iron Man',
    verification: { status: 'verified' },
  };

  const appRep = validator.validateAppearance(
    validApp,
    new Set(['mv-character-tony-stark']),
    new Set(['mv-movie-iron-man'])
  );
  assert.equal(appRep.isValid, true);

  // Orphan Appearance Test
  const orphanApp: CanonicalAppearance = {
    ...validApp,
    characterId: 'mv-character-non-existent',
  };
  const orphanRep = validator.validateAppearance(
    orphanApp,
    new Set(['mv-character-tony-stark']),
    new Set(['mv-movie-iron-man'])
  );
  assert.equal(orphanRep.isValid, false);
  assert.equal(
    orphanRep.errors.some((e) => e.includes('Orphan Appearance')),
    true
  );
});
