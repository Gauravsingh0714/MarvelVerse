import test from 'node:test';
import assert from 'node:assert/strict';
import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '../src/hooks/queryKeys.js';

test('useApiQuery - query keys are deterministic and isolated', () => {
  const movieDetailKey = queryKeys.movies.detail('mv-movie-iron-man');
  const movieAppearancesKey = queryKeys.movies.appearances('mv-movie-iron-man');

  assert.deepEqual(movieDetailKey, ['movies', 'detail', 'mv-movie-iron-man']);
  assert.deepEqual(movieAppearancesKey, [
    'movies',
    'appearances',
    'mv-movie-iron-man',
  ]);
  assert.notDeepEqual(movieDetailKey, movieAppearancesKey);
});

test('useApiQuery - character detail and appearance keys are isolated', () => {
  const charDetailKey = queryKeys.characters.detail('mv-character-tony-stark');
  const charAppearancesKey = queryKeys.characters.appearances(
    'mv-character-tony-stark'
  );

  assert.deepEqual(charDetailKey, [
    'characters',
    'detail',
    'mv-character-tony-stark',
  ]);
  assert.deepEqual(charAppearancesKey, [
    'characters',
    'appearances',
    'mv-character-tony-stark',
  ]);
  assert.notDeepEqual(charDetailKey, charAppearancesKey);
});

test('useApiQuery - cache data does not collide between detail and appearance queries', async () => {
  const client = new QueryClient();

  const mockMovie = {
    canonicalId: 'mv-movie-iron-man',
    title: 'Iron Man',
    phaseId: 'phase-1',
  };

  const mockAppearances = [
    {
      id: 'app-1',
      characterId: 'mv-character-tony-stark',
      movieId: 'mv-movie-iron-man',
    },
  ];

  // Populate cache under distinct isolated keys
  client.setQueryData(queryKeys.movies.detail('mv-movie-iron-man'), mockMovie);
  client.setQueryData(
    queryKeys.movies.appearances('mv-movie-iron-man'),
    mockAppearances
  );

  const cachedMovie = client.getQueryData(
    queryKeys.movies.detail('mv-movie-iron-man')
  );
  const cachedAppearances = client.getQueryData<any[]>(
    queryKeys.movies.appearances('mv-movie-iron-man')
  );

  // Assert no cache collision occurred
  assert.deepEqual(cachedMovie, mockMovie);
  assert.deepEqual(cachedAppearances, mockAppearances);
  assert.equal(Array.isArray(cachedAppearances), true);
  assert.equal(
    typeof cachedMovie === 'object' && !Array.isArray(cachedMovie),
    true
  );
});

test('useApiQuery - list queries with different filters maintain isolated cache entries', () => {
  const client = new QueryClient();

  const phase1Key = queryKeys.movies.list({ phaseId: 'phase-1' });
  const phase2Key = queryKeys.movies.list({ phaseId: 'phase-2' });

  assert.notDeepEqual(phase1Key, phase2Key);

  client.setQueryData(phase1Key, [{ id: 'm1' }]);
  client.setQueryData(phase2Key, [{ id: 'm2' }]);

  assert.deepEqual(client.getQueryData(phase1Key), [{ id: 'm1' }]);
  assert.deepEqual(client.getQueryData(phase2Key), [{ id: 'm2' }]);
});
