import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Timeline from '../src/app/routes/Timeline.js';
import { queryKeys } from '../src/hooks/queryKeys.js';

test('Timeline - renders universes, sagas, phases, and releases without cache collision', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockUniverses = [{ id: 'earth-616', name: 'Earth-616' }];
  const mockSagas = [
    {
      id: 'infinity-saga',
      name: 'The Infinity Saga',
      universeId: 'earth-616',
      order: 1,
    },
  ];
  const mockPhases = [
    { id: 'phase-1', name: 'Phase 1', sagaId: 'infinity-saga', number: 1 },
  ];
  const mockMovies = [
    {
      canonicalId: 'mv-movie-iron-man',
      title: 'Iron Man',
      phaseId: 'phase-1',
      sagaId: 'infinity-saga',
      universeId: 'earth-616',
      releaseDate: '2008-05-02',
    },
  ];

  // Seed cache with distinct foundation query keys
  queryClient.setQueryData(queryKeys.foundation.universes(), mockUniverses);
  queryClient.setQueryData(queryKeys.foundation.sagas(), mockSagas);
  queryClient.setQueryData(queryKeys.foundation.phases(), mockPhases);
  queryClient.setQueryData(
    queryKeys.movies.list({ sort: 'releaseOrder' }),
    mockMovies
  );

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/timeline'] },
          React.createElement(Timeline)
        )
      )
    );
  });

  // Verify sagas and phases rendered correctly
  assert.equal(html.includes('The Infinity Saga'), true);
  assert.equal(html.includes('Phase 1'), true);
  assert.equal(html.includes('Iron Man'), true);

  // Verify that the queries did not collapse onto each other
  assert.notDeepEqual(
    queryClient.getQueryData(queryKeys.foundation.universes()),
    queryClient.getQueryData(queryKeys.foundation.sagas())
  );
  assert.notDeepEqual(
    queryClient.getQueryData(queryKeys.foundation.sagas()),
    queryClient.getQueryData(queryKeys.foundation.phases())
  );
});
