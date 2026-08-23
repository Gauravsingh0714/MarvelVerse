import test from 'node:test';
import assert from 'node:assert/strict';
import { createCanonicalRepository } from '../../src/services/repository/index.js';

test('FoundationRepository retrieves universes, sagas, and phases cleanly', () => {
  const repo = createCanonicalRepository();

  const universes = repo.foundation.getUniverses();
  assert.equal(Array.isArray(universes), true);
  assert.equal(universes.length > 0, true);

  const e616 = repo.foundation.getUniverseById('earth-616');
  assert.notEqual(e616, null);
  assert.equal(e616?.name, 'Earth-616');

  assert.equal(repo.foundation.getUniverseById('non-existent'), null);

  const sagas = repo.foundation.getSagas();
  assert.equal(sagas.length > 0, true);
  const infinitySaga = repo.foundation.getSagaById('infinity-saga');
  assert.notEqual(infinitySaga, null);
  assert.equal(infinitySaga?.name, 'Infinity Saga');

  const phases = repo.foundation.getPhases();
  assert.equal(phases.length > 0, true);
  const phase1 = repo.foundation.getPhaseById('phase-1');
  assert.notEqual(phase1, null);
  assert.equal(phase1?.name, 'Phase One');
});

test('MovieRepository queries canonical movies, filters, and supports TMDB lookup', () => {
  const repo = createCanonicalRepository();

  const allMovies = repo.movies.getMovies();
  assert.equal(allMovies.length, 6);

  const ironMan = repo.movies.getMovieById('mv-movie-iron-man');
  assert.notEqual(ironMan, null);
  assert.equal(ironMan?.title, 'Iron Man');
  assert.equal(ironMan?.releaseOrder, 1);

  assert.equal(repo.movies.getMovieById('mv-movie-non-existent'), null);

  const ironManTmdb = repo.movies.getMovieByTmdbId(1726);
  assert.notEqual(ironManTmdb, null);
  assert.equal(ironManTmdb?.canonicalId, 'mv-movie-iron-man');

  assert.equal(repo.movies.getMovieByTmdbId(9999999), null);

  const earth616Movies = repo.movies.getMoviesByUniverse('earth-616');
  assert.equal(earth616Movies.length, 6);

  const infinitySagaMovies = repo.movies.getMoviesBySaga('infinity-saga');
  assert.equal(infinitySagaMovies.length, 6);

  const phase1Movies = repo.movies.getMoviesByPhase('phase-1');
  assert.equal(phase1Movies.length, 6);

  const releaseOrdered = repo.movies.getMoviesByReleaseOrder();
  assert.equal(releaseOrdered[0].canonicalId, 'mv-movie-iron-man');
  assert.equal(releaseOrdered[5].canonicalId, 'mv-movie-the-avengers');
});

test('CharacterRepository queries characters by ID and TMDB ID', () => {
  const repo = createCanonicalRepository();

  const characters = repo.characters.getCharacters();
  assert.equal(characters.length, 5);

  const tony = repo.characters.getCharacterById('mv-character-tony-stark');
  assert.notEqual(tony, null);
  assert.equal(tony?.name, 'Tony Stark');

  const tonyTmdb = repo.characters.getCharacterByTmdbId(3223);
  assert.notEqual(tonyTmdb, null);
  assert.equal(tonyTmdb?.canonicalId, 'mv-character-tony-stark');

  assert.equal(repo.characters.getCharacterById('missing'), null);
});

test('RelationshipRepository queries appearance relationships by character and media', () => {
  const repo = createCanonicalRepository();

  const appearances = repo.relationships.getAppearances();
  assert.equal(appearances.length, 6);

  const app = repo.relationships.getAppearanceById(
    'mv-app-tony-stark-iron-man'
  );
  assert.notEqual(app, null);
  assert.equal(app?.roleName, 'Tony Stark / Iron Man');

  const tonyApps = repo.relationships.getAppearancesByCharacter(
    'mv-character-tony-stark'
  );
  assert.equal(tonyApps.length, 3);

  const ironManApps =
    repo.relationships.getAppearancesByMedia('mv-movie-iron-man');
  assert.equal(ironManApps.length, 1);
  assert.equal(ironManApps[0].characterId, 'mv-character-tony-stark');

  assert.equal(
    repo.relationships.getAppearancesByCharacter('unknown').length,
    0
  );
});

test('CanonicalCache caches records in memory and supports clearCache()', () => {
  const repo = createCanonicalRepository();

  const movies1 = repo.movies.getMovies();
  assert.equal(repo.cache.has('movies'), true);

  repo.clearCache();
  assert.equal(repo.cache.has('movies'), false);

  const movies2 = repo.movies.getMovies();
  assert.equal(movies2.length, movies1.length);
});

test('Data Immutability ensures consumer mutations do NOT alter cached canonical data', () => {
  const repo = createCanonicalRepository();

  const movies = repo.movies.getMovies();
  movies.reverse();
  movies[0].title = 'CORRUPTED TITLE';
  movies[0].genres.push('INVALID GENRE MUTATION');

  const freshMovie = repo.movies.getMovieById('mv-movie-iron-man');
  assert.equal(freshMovie?.title, 'Iron Man');
  assert.equal(freshMovie?.releaseOrder, 1);
  assert.equal(freshMovie?.genres.includes('INVALID GENRE MUTATION'), false);

  const freshList = repo.movies.getMovies();
  assert.equal(freshList[0].canonicalId, 'mv-movie-iron-man');
});
