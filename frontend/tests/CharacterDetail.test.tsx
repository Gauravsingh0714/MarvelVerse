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
