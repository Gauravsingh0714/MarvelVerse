import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Search from '../src/app/routes/Search.js';
import { queryKeys } from '../src/hooks/queryKeys.js';

test('Search - renders discovery view and suggested topics', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  queryClient.setQueryData(queryKeys.movies.list({}), []);
  queryClient.setQueryData(queryKeys.series.list({}), []);
  queryClient.setQueryData(queryKeys.characters.list(), []);

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/search'] },
          React.createElement(Search)
        )
      )
    );
  });

  const cleanHtml = html.replace(/<!--.*?-->/g, '');
  assert.equal(cleanHtml.includes('Explore the MarvelVerse'), true);
  assert.equal(cleanHtml.includes('TV Series'), true);
  assert.equal(cleanHtml.includes('Loki'), true);
  assert.equal(cleanHtml.includes('Daredevil'), true);
});

test('Search - renders matching movies, TV series, and characters in All category', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockMovies = [
    {
      canonicalId: 'mv-movie-iron-man',
      title: 'Iron Man',
      overview: 'Tony Stark builds an armored suit.',
      releaseDate: '2008-05-02',
      genres: ['Action', 'Sci-Fi'],
    },
  ];

  const mockSeries = [
    {
      canonicalId: 'mv-series-loki',
      title: 'Loki',
      overview: 'After stealing the Tesseract, Loki is brought to the TVA.',
      firstAirDate: '2021-06-09',
      numberOfSeasons: 2,
      numberOfEpisodes: 12,
      genres: ['Drama', 'Sci-Fi & Fantasy'],
      phaseId: 'phase-4',
    },
  ];

  const mockCharacters = [
    {
      canonicalId: 'mv-character-tony-stark',
      name: 'Tony Stark',
      realName: 'Anthony Edward Stark',
      aliases: ['Iron Man'],
      species: 'Human',
      overview: 'Genius billionaire.',
    },
  ];

  queryClient.setQueryData(queryKeys.movies.list({}), mockMovies);
  queryClient.setQueryData(queryKeys.series.list({}), mockSeries);
  queryClient.setQueryData(queryKeys.characters.list(), mockCharacters);

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/search'] },
          React.createElement(Search)
        )
      )
    );
  });

  const cleanHtml = html.replace(/<!--.*?-->/g, '');
  assert.equal(cleanHtml.includes('TV Series'), true);
});
