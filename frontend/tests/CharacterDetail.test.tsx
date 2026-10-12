import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CharacterDetail from '../src/app/routes/CharacterDetail.js';
import { queryKeys } from '../src/hooks/queryKeys.js';

test('CharacterDetail - renders character data and appearances without .map crash', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockCharacter = {
    canonicalId: 'mv-character-tony-stark',
    name: 'Tony Stark',
    alias: 'Iron Man',
    species: 'Human',
    status: 'deceased',
    biography: 'Genius, billionaire, playboy, philanthropist.',
    roles: ['hero', 'avenger'],
    abilities: ['Genius intellect', 'Powered armor suits'],
    identifiers: {
      tmdbId: 1001,
    },
  };

  const mockAppearances = [
    {
      canonicalId: 'app-tony-iron-man',
      characterCanonicalId: 'mv-character-tony-stark',
      mediaCanonicalId: 'mv-movie-iron-man',
      roleName: 'Tony Stark / Iron Man',
    },
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

  // Seed cache using isolated query keys
  queryClient.setQueryData(
    queryKeys.characters.detail('mv-character-tony-stark'),
    mockCharacter
  );
  queryClient.setQueryData(
    queryKeys.characters.appearances('mv-character-tony-stark'),
    mockAppearances
  );
  queryClient.setQueryData(queryKeys.movies.list({}), mockMovies);

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/characters/mv-character-tony-stark'] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/characters/:canonicalId',
              element: React.createElement(CharacterDetail),
            })
          )
        )
      )
    );
  });

  // Verify character data rendered
  assert.equal(html.includes('Tony Stark'), true);
  assert.equal(html.includes('Iron Man'), true);
  // Verify appearance rendered
  assert.equal(html.includes('Tony Stark / Iron Man'), true);

  // Assert query keys are isolated and not colliding
  assert.notDeepEqual(
    queryClient.getQueryData(
      queryKeys.characters.detail('mv-character-tony-stark')
    ),
    queryClient.getQueryData(
      queryKeys.characters.appearances('mv-character-tony-stark')
    )
  );
});

test('CharacterDetail - renders loading state when cache is empty without crashing', () => {
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
          { initialEntries: ['/characters/mv-character-bruce-banner'] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/characters/:canonicalId',
              element: React.createElement(CharacterDetail),
            })
          )
        )
      )
    );
  });

  assert.equal(html.length > 0, true);
});

test('CharacterDetail - renders character with 0 appearances (Natasha Romanoff)', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockNatasha = {
    canonicalId: 'mv-character-natasha-romanoff',
    name: 'Natasha Romanoff',
    realName: 'Natalia Alianovna Romanova',
    aliases: ['Black Widow'],
    species: 'Human',
    overview: 'Master spy and elite martial artist operative of S.H.I.E.L.D.',
    verification: {
      status: 'verified',
    },
  };

  queryClient.setQueryData(
    queryKeys.characters.detail('mv-character-natasha-romanoff'),
    mockNatasha
  );
  queryClient.setQueryData(
    queryKeys.characters.appearances('mv-character-natasha-romanoff'),
    []
  );

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/characters/mv-character-natasha-romanoff'] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/characters/:canonicalId',
              element: React.createElement(CharacterDetail),
            })
          )
        )
      )
    );
  });

  assert.equal(html.includes('Natasha Romanoff'), true);
  assert.equal(html.includes('Black Widow'), true);
  assert.equal(
    html.includes('No movie appearance records currently verified'),
    true
  );
});

test('CharacterDetail - renders other characters (Steve Rogers)', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockCap = {
    canonicalId: 'mv-character-steve-rogers',
    name: 'Steve Rogers',
    realName: 'Steven Grant Rogers',
    aliases: ['Captain America', 'The First Avenger'],
    species: 'Human (Super Soldier)',
    verification: {
      status: 'verified',
    },
  };

  const mockCapAppearances = [
    {
      canonicalId: 'mv-app-steve-rogers-captain-america',
      characterId: 'mv-character-steve-rogers',
      mediaCanonicalId: 'mv-movie-captain-america-the-first-avenger',
      roleName: 'Steve Rogers / Captain America',
    },
  ];

  const mockMovies = [
    {
      canonicalId: 'mv-movie-captain-america-the-first-avenger',
      title: 'Captain America: The First Avenger',
    },
  ];

  queryClient.setQueryData(
    queryKeys.characters.detail('mv-character-steve-rogers'),
    mockCap
  );
  queryClient.setQueryData(
    queryKeys.characters.appearances('mv-character-steve-rogers'),
    mockCapAppearances
  );
  queryClient.setQueryData(queryKeys.movies.list({}), mockMovies);

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/characters/mv-character-steve-rogers'] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/characters/:canonicalId',
              element: React.createElement(CharacterDetail),
            })
          )
        )
      )
    );
  });

  assert.equal(html.includes('Steve Rogers'), true);
  assert.equal(html.includes('Captain America'), true);
  assert.equal(html.includes('Captain America: The First Avenger'), true);
});
