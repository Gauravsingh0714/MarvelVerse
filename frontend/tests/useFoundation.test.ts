import test from 'node:test';
import assert from 'node:assert/strict';
import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '../src/hooks/queryKeys.js';

test('useFoundation - universes, sagas, and phases query keys are distinct', () => {
  const universesKey = queryKeys.foundation.universes();
  const sagasKey = queryKeys.foundation.sagas();
  const phasesKey = queryKeys.foundation.phases();

  assert.deepEqual(universesKey, ['foundation', 'universes']);
  assert.deepEqual(sagasKey, ['foundation', 'sagas']);
  assert.deepEqual(phasesKey, ['foundation', 'phases']);

  assert.notDeepEqual(universesKey, sagasKey);
  assert.notDeepEqual(universesKey, phasesKey);
  assert.notDeepEqual(sagasKey, phasesKey);
});

test('useFoundation - independent caching prevents cross-entity pollution', () => {
  const client = new QueryClient();

  const mockUniverses = [{ id: 'earth-616', name: 'Earth-616' }];
  const mockSagas = [{ id: 'infinity-saga', name: 'The Infinity Saga' }];
  const mockPhases = [{ id: 'phase-1', name: 'Phase 1' }];

  client.setQueryData(queryKeys.foundation.universes(), mockUniverses);
  client.setQueryData(queryKeys.foundation.sagas(), mockSagas);
  client.setQueryData(queryKeys.foundation.phases(), mockPhases);

  const cachedUniverses = client.getQueryData(queryKeys.foundation.universes());
  const cachedSagas = client.getQueryData(queryKeys.foundation.sagas());
  const cachedPhases = client.getQueryData(queryKeys.foundation.phases());

  assert.deepEqual(cachedUniverses, mockUniverses);
  assert.deepEqual(cachedSagas, mockSagas);
  assert.deepEqual(cachedPhases, mockPhases);

  // Cross-entity contamination checks
  assert.notDeepEqual(cachedUniverses, cachedSagas);
  assert.notDeepEqual(cachedUniverses, cachedPhases);
  assert.notDeepEqual(cachedSagas, cachedPhases);
});
