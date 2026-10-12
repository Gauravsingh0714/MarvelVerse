import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MovieDetail from '../src/app/routes/MovieDetail.js';
import { queryKeys } from '../src/hooks/queryKeys.js';

test('MovieDetail - renders movie data and appearances without .map crash', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockMovie = {
    canonicalId: 'mv-movie-iron-man',
    title: 'Iron Man',
    phaseId: 'phase-1',
    sagaId: 'infinity-saga',
    universeId: 'earth-616',
    releaseDate: '2008-05-02',
    runtimeMinutes: 126,
    overview:
      'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor.',
    tagline: 'Heroes are made, not born.',
    genres: ['Action', 'Sci-Fi'],
    status: 'released',
    credits: {
      directors: ['Jon Favreau'],
      writers: ['Mark Fergus', 'Hawk Ostby'],
      producers: ['Kevin Feige', 'Avi Arad'],
    },
    identifiers: {
      tmdbId: 1726,
      imdbId: 'tt0371746',
    },
  };

  const mockAppearances = [
    {
      canonicalId: 'app-tony-iron-man',
      characterId: 'mv-character-tony-stark',
      movieId: 'mv-movie-iron-man',
      roleName: 'Tony Stark / Iron Man',
    },
  ];

  const mockCharacters = [
    {
      canonicalId: 'mv-character-tony-stark',
      name: 'Tony Stark',
      alias: 'Iron Man',
      roles: ['hero', 'avenger'],
    },
  ];

  const mockPhases = [
    { id: 'phase-1', name: 'Phase 1', sagaId: 'infinity-saga' },
  ];
  const mockSagas = [{ id: 'infinity-saga', name: 'The Infinity Saga' }];
  const mockUniverses = [{ id: 'earth-616', name: 'Earth-616' }];

  // Seed cache using the isolated query keys
  queryClient.setQueryData(
    queryKeys.movies.detail('mv-movie-iron-man'),
    mockMovie
  );
  queryClient.setQueryData(
    queryKeys.movies.appearances('mv-movie-iron-man'),
    mockAppearances
  );
  queryClient.setQueryData(queryKeys.characters.list(), mockCharacters);
  queryClient.setQueryData(queryKeys.foundation.phases(), mockPhases);
  queryClient.setQueryData(queryKeys.foundation.sagas(), mockSagas);
  queryClient.setQueryData(queryKeys.foundation.universes(), mockUniverses);

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/movies/mv-movie-iron-man'] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/movies/:canonicalId',
              element: React.createElement(MovieDetail),
            })
          )
        )
      )
    );
  });

  // Verify movie info rendered
  assert.equal(html.includes('Iron Man'), true);
  // Verify appearance rendered
  assert.equal(html.includes('Tony Stark'), true);
  // Verify no crash occurred and cache entries remain separate
  assert.notDeepEqual(
    queryClient.getQueryData(queryKeys.movies.detail('mv-movie-iron-man')),
    queryClient.getQueryData(queryKeys.movies.appearances('mv-movie-iron-man'))
  );
});

test('MovieDetail - renders loading state without toUpperCase crash when cache is empty', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/movies/mv-movie-the-incredible-hulk'] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/movies/:canonicalId',
              element: React.createElement(MovieDetail),
            })
          )
        )
      )
    );
  });

  // Verify skeleton loading rendered rather than crashing with TypeError
  assert.equal(html.length > 0, true);
});

test('MovieDetail - renders other canonical movies (The Incredible Hulk, The Avengers)', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockHulkMovie = {
    canonicalId: 'mv-movie-the-incredible-hulk',
    title: 'The Incredible Hulk',
    phaseId: 'phase-1',
    sagaId: 'infinity-saga',
    universeId: 'earth-616',
    releaseDate: '2008-06-12',
    runtime: 114,
    overview: 'Scientist Bruce Banner scours the planet for an antidote.',
    genres: ['Science Fiction', 'Action'],
    externalIds: { tmdb: 1724 },
  };

  const mockHulkAppearances = [
    {
      canonicalId: 'mv-app-bruce-banner-hulk',
      characterId: 'mv-character-bruce-banner',
      mediaCanonicalId: 'mv-movie-the-incredible-hulk',
      roleName: 'Bruce Banner / The Hulk',
    },
  ];

  const mockCharacters = [
    {
      canonicalId: 'mv-character-bruce-banner',
      name: 'Bruce Banner',
    },
  ];

  queryClient.setQueryData(
    queryKeys.movies.detail('mv-movie-the-incredible-hulk'),
    mockHulkMovie
  );
  queryClient.setQueryData(
    queryKeys.movies.appearances('mv-movie-the-incredible-hulk'),
    mockHulkAppearances
  );
  queryClient.setQueryData(queryKeys.characters.list(), mockCharacters);
  queryClient.setQueryData(queryKeys.foundation.phases(), [
    { id: 'phase-1', name: 'Phase One' },
  ]);

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/movies/mv-movie-the-incredible-hulk'] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/movies/:canonicalId',
              element: React.createElement(MovieDetail),
            })
          )
        )
      )
    );
  });

  assert.equal(html.includes('The Incredible Hulk'), true);
  assert.equal(html.includes('Bruce Banner'), true);
});
