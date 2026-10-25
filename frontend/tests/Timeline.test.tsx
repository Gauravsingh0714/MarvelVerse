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
  queryClient.setQueryData(queryKeys.series.list({}), []);

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

test('Timeline - integrates Movies and TV Series with chronological order, canonical phase grouping, and DD-MM-YYYY dates', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockUniverses = [{ id: 'earth-616', name: 'Earth-616' }];
  const mockSagas = [
    {
      id: 'infinity-saga',
      name: 'The Infinity Saga',
      universeId: 'earth-616',
      order: 1,
    },
    {
      id: 'multiverse-saga',
      name: 'The Multiverse Saga',
      universeId: 'earth-616',
      order: 2,
    },
  ];
  const mockPhases = [
    { id: 'phase-2', name: 'Phase 2', sagaId: 'infinity-saga', number: 2 },
    { id: 'phase-4', name: 'Phase 4', sagaId: 'multiverse-saga', number: 4 },
  ];

  const mockMovies = [
    {
      canonicalId: 'mv-movie-avengers-age-of-ultron',
      title: 'Avengers: Age of Ultron',
      phaseId: 'phase-2',
      sagaId: 'infinity-saga',
      universeId: 'earth-616',
      releaseDate: '2015-05-01',
      releaseOrder: 11,
      runtime: 141,
    },
    {
      canonicalId: 'mv-movie-black-widow',
      title: 'Black Widow',
      phaseId: 'phase-4',
      sagaId: 'multiverse-saga',
      universeId: 'earth-616',
      releaseDate: '2021-07-09',
      releaseOrder: 24,
      runtime: 134,
    },
  ];

  const mockSeries = [
    {
      canonicalId: 'mv-series-daredevil',
      title: 'Daredevil',
      phaseId: 'phase-2',
      sagaId: 'infinity-saga',
      universeId: 'earth-616',
      firstAirDate: '2015-04-10', // Aired BEFORE Age of Ultron (2015-05-01)
      numberOfSeasons: 3,
      numberOfEpisodes: 39,
    },
    {
      canonicalId: 'mv-series-loki',
      title: 'Loki',
      phaseId: 'phase-4',
      sagaId: 'multiverse-saga',
      universeId: 'earth-616',
      firstAirDate: '2021-06-09', // Premiered BEFORE Black Widow (2021-07-09)
      numberOfSeasons: 2,
      numberOfEpisodes: 12,
    },
  ];

  queryClient.setQueryData(queryKeys.foundation.universes(), mockUniverses);
  queryClient.setQueryData(queryKeys.foundation.sagas(), mockSagas);
  queryClient.setQueryData(queryKeys.foundation.phases(), mockPhases);
  queryClient.setQueryData(
    queryKeys.movies.list({ sort: 'releaseOrder' }),
    mockMovies
  );
  queryClient.setQueryData(queryKeys.series.list({}), mockSeries);

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

  const cleanHtml = html.replace(/<!--.*?-->/g, '');

  // Verify both movies and series rendered
  assert.equal(cleanHtml.includes('Daredevil'), true);
  assert.equal(cleanHtml.includes('Avengers: Age of Ultron'), true);
  assert.equal(cleanHtml.includes('Loki'), true);
  assert.equal(cleanHtml.includes('Black Widow'), true);

  // Verify chronological date presentation DD-MM-YYYY
  assert.equal(cleanHtml.includes('10-04-2015'), true); // Daredevil premiere
  assert.equal(cleanHtml.includes('01-05-2015'), true); // Age of Ultron release
  assert.equal(cleanHtml.includes('09-06-2021'), true); // Loki premiere
  assert.equal(cleanHtml.includes('09-07-2021'), true); // Black Widow release

  // Verify distinct media labels
  assert.equal(cleanHtml.includes('TV Series'), true);
  assert.equal(cleanHtml.includes('Release #11'), true);
  assert.equal(cleanHtml.includes('Release #24'), true);

  // Verify links to respective detail pages
  assert.equal(cleanHtml.includes('/series/mv-series-daredevil'), true);
  assert.equal(
    cleanHtml.includes('/movies/mv-movie-avengers-age-of-ultron'),
    true
  );
  assert.equal(cleanHtml.includes('/series/mv-series-loki'), true);
  assert.equal(cleanHtml.includes('/movies/mv-movie-black-widow'), true);

  // Verify chronological ordering in HTML: Daredevil (April 2015) appears before Ultron (May 2015)
  const daredevilIndex = cleanHtml.indexOf('Daredevil');
  const ultronIndex = cleanHtml.indexOf('Avengers: Age of Ultron');
  assert.equal(
    daredevilIndex < ultronIndex,
    true,
    'Daredevil must precede Age of Ultron chronologically in Phase 2'
  );

  // Verify Loki (June 2021) appears before Black Widow (July 2021) in Phase 4
  const lokiIndex = cleanHtml.indexOf('Loki');
  const blackWidowIndex = cleanHtml.indexOf('Black Widow');
  assert.equal(
    lokiIndex < blackWidowIndex,
    true,
    'Loki must precede Black Widow chronologically in Phase 4'
  );
});
