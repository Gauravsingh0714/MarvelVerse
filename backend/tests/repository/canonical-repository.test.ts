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
  assert.equal(allMovies.length, 42);

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
  assert.equal(earth616Movies.length, 42);

  const infinitySagaMovies = repo.movies.getMoviesBySaga('infinity-saga');
  assert.equal(infinitySagaMovies.length, 23);

  const phase1Movies = repo.movies.getMoviesByPhase('phase-1');
  assert.equal(phase1Movies.length, 6);

  const releaseOrdered = repo.movies.getMoviesByReleaseOrder();
  assert.equal(releaseOrdered[0].canonicalId, 'mv-movie-iron-man');
  assert.equal(releaseOrdered[5].canonicalId, 'mv-movie-the-avengers');
});

test('CharacterRepository queries characters by ID and TMDB ID', () => {
  const repo = createCanonicalRepository();

  const characters = repo.characters.getCharacters();
  assert.equal(characters.length, 49);

  const tony = repo.characters.getCharacterById('mv-character-tony-stark');
  assert.notEqual(tony, null);
  assert.equal(tony?.name, 'Tony Stark');

  const tonyTmdb = repo.characters.getCharacterByTmdbId(3223);
  assert.notEqual(tonyTmdb, null);
  assert.equal(tonyTmdb?.canonicalId, 'mv-character-tony-stark');

  assert.equal(repo.characters.getCharacterById('missing'), null);

  // Batch 12: Verify all 6 Guardians of the Galaxy characters load cleanly
  const guardiansIds = [
    'mv-character-rocket-raccoon',
    'mv-character-groot',
    'mv-character-gamora',
    'mv-character-drax-the-destroyer',
    'mv-character-nebula',
    'mv-character-mantis',
  ];
  for (const gid of guardiansIds) {
    const char = repo.characters.getCharacterById(gid);
    assert.ok(char, `Expected ${gid} to be retrievable`);
    assert.equal(char.canonicalId, gid);
    assert.ok(char.name.length > 0);
  }

  // Batch 13: Verify all 4 characters load cleanly
  const batch13Ids = [
    'mv-character-james-rhodes',
    'mv-character-wong',
    'mv-character-agatha-harkness',
    'mv-character-jane-foster',
  ];
  for (const cid of batch13Ids) {
    const char = repo.characters.getCharacterById(cid);
    assert.ok(char, `Expected ${cid} to be retrievable`);
    assert.equal(char.canonicalId, cid);
    assert.ok(char.name.length > 0);
  }

  // Batch 14: Verify all 4 characters load cleanly
  const batch14Ids = [
    'mv-character-peggy-carter',
    'mv-character-maria-hill',
    'mv-character-sharon-carter',
    'mv-character-yelena-belova',
  ];
  for (const cid of batch14Ids) {
    const char = repo.characters.getCharacterById(cid);
    assert.ok(char, `Expected ${cid} to be retrievable`);
    assert.equal(char.canonicalId, cid);
    assert.ok(char.name.length > 0);
  }
});

test('RelationshipRepository queries appearance relationships by character and media', () => {
  const repo = createCanonicalRepository();

  const appearances = repo.relationships.getAppearances();
  assert.equal(appearances.length, 226);

  const app = repo.relationships.getAppearanceById(
    'mv-app-tony-stark-iron-man'
  );
  assert.notEqual(app, null);
  assert.equal(app?.roleName, 'Tony Stark / Iron Man');

  const tonyApps = repo.relationships.getAppearancesByCharacter(
    'mv-character-tony-stark'
  );
  assert.equal(tonyApps.length, 9);

  const ironManApps =
    repo.relationships.getAppearancesByMedia('mv-movie-iron-man');
  assert.equal(ironManApps.length, 3);
  assert.equal(
    ironManApps.some((a) => a.characterId === 'mv-character-tony-stark'),
    true
  );

  assert.equal(
    repo.relationships.getAppearancesByCharacter('unknown').length,
    0
  );

  // Batch 12: Verify Peter Quill backfilled appearances (7 total)
  const quillApps = repo.relationships.getAppearancesByCharacter(
    'mv-character-peter-quill'
  );
  assert.equal(quillApps.length, 7);
  assert.ok(
    quillApps.some((a) => a.mediaCanonicalId === 'mv-movie-avengers-endgame'),
    'Expected Peter Quill appearance in Avengers: Endgame'
  );
  assert.ok(
    quillApps.some(
      (a) => a.mediaCanonicalId === 'mv-movie-thor-love-and-thunder'
    ),
    'Expected Peter Quill appearance in Thor: Love and Thunder'
  );

  // Batch 12: Verify Gamora Option A distinct roleName values
  const gamoraApps = repo.relationships.getAppearancesByCharacter(
    'mv-character-gamora'
  );
  assert.equal(gamoraApps.length, 5);
  const endgameGamora = gamoraApps.find(
    (a) => a.mediaCanonicalId === 'mv-movie-avengers-endgame'
  );
  assert.equal(endgameGamora?.roleName, 'Gamora (2014 Alternate)');
  const gotg3Gamora = gamoraApps.find(
    (a) => a.mediaCanonicalId === 'mv-movie-guardians-of-the-galaxy-vol-3'
  );
  assert.equal(gotg3Gamora?.roleName, 'Gamora (Ravager / 2014 Alternate)');

  // Batch 13: Verify James Rhodes appearances and Secret Invasion impersonation modeling
  const rhodesApps = repo.relationships.getAppearancesByCharacter(
    'mv-character-james-rhodes'
  );
  assert.equal(rhodesApps.length, 9);
  const siRhodes = rhodesApps.find(
    (a) => a.mediaCanonicalId === 'mv-series-secret-invasion'
  );
  assert.equal(
    siRhodes?.roleName,
    'Colonel James Rhodes (Impersonated by Skrull Raava)'
  );

  // Batch 13: Verify Jane Foster Mighty Thor appearance
  const janeApps = repo.relationships.getAppearancesByCharacter(
    'mv-character-jane-foster'
  );
  assert.equal(janeApps.length, 4);
  const loveJane = janeApps.find(
    (a) => a.mediaCanonicalId === 'mv-movie-thor-love-and-thunder'
  );
  assert.equal(loveJane?.roleName, 'Dr. Jane Foster / Mighty Thor');

  // Batch 14: Verify Espionage & Strategic Defense characters and appearances
  const peggyApps = repo.relationships.getAppearancesByCharacter(
    'mv-character-peggy-carter'
  );
  assert.equal(peggyApps.length, 6);

  const mariaApps = repo.relationships.getAppearancesByCharacter(
    'mv-character-maria-hill'
  );
  assert.equal(mariaApps.length, 5);
  const siMaria = mariaApps.find(
    (a) => a.mediaCanonicalId === 'mv-series-secret-invasion'
  );
  assert.equal(siMaria?.roleName, 'Maria Hill (killed by Gravik)');

  const sharonApps = repo.relationships.getAppearancesByCharacter(
    'mv-character-sharon-carter'
  );
  assert.equal(sharonApps.length, 3);
  const tfatwsSharon = sharonApps.find(
    (a) => a.mediaCanonicalId === 'mv-series-the-falcon-and-the-winter-soldier'
  );
  assert.equal(tfatwsSharon?.roleName, 'Sharon Carter / The Power Broker');

  const yelenaApps = repo.relationships.getAppearancesByCharacter(
    'mv-character-yelena-belova'
  );
  assert.equal(yelenaApps.length, 3);

  const furyApps = repo.relationships.getAppearancesByCharacter(
    'mv-character-nick-fury'
  );
  assert.equal(furyApps.length, 7);
  const furyWs = furyApps.find(
    (a) => a.mediaCanonicalId === 'mv-movie-captain-america-the-winter-soldier'
  );
  assert.equal(furyWs?.roleName, 'Director Nick Fury');
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
