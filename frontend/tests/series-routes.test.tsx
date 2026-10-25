import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Series from '../src/app/routes/Series.js';
import SeriesDetail from '../src/app/routes/SeriesDetail.js';
import { queryKeys } from '../src/hooks/queryKeys.js';

test('Series route - renders series catalog with DD-MM-YYYY premiere date and season metadata', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockSeriesList = [
    {
      canonicalId: 'mv-series-loki',
      title: 'Loki',
      firstAirDate: '2021-06-09',
      lastAirDate: '2023-11-09',
      numberOfSeasons: 2,
      numberOfEpisodes: 12,
      overview:
        'After stealing the Tesseract, an alternate version of Loki is brought to the TVA.',
      posterPath: '/loki-poster.jpg',
      backdropPath: '/loki-backdrop.jpg',
      genres: ['Drama', 'Sci-Fi & Fantasy'],
      universeId: 'earth-616',
      sagaId: 'multiverse-saga',
      phaseId: 'phase-4',
    },
    {
      canonicalId: 'mv-series-daredevil',
      title: 'Daredevil',
      firstAirDate: '2015-04-10',
      lastAirDate: '2018-10-19',
      numberOfSeasons: 3,
      numberOfEpisodes: 39,
      overview:
        'A blind lawyer by day, Matt Murdock uses his heightened senses to fight crime.',
      posterPath: null,
      backdropPath: null,
      genres: ['Action', 'Crime', 'Drama'],
      universeId: 'earth-616',
      sagaId: 'infinity-saga',
      phaseId: 'phase-2',
    },
  ];

  queryClient.setQueryData(
    queryKeys.series.list({ phaseId: undefined, sort: 'releaseOrder' }),
    mockSeriesList
  );

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/series'] },
          React.createElement(Series)
        )
      )
    );
  });

  const cleanHtml = html.replace(/<!--.*?-->/g, '');
  assert.equal(cleanHtml.includes('Marvel Television &amp; Series'), true);
  assert.equal(cleanHtml.includes('Loki'), true);
  assert.equal(cleanHtml.includes('Daredevil'), true);
  // Verify date formatting is DD-MM-YYYY (09-06-2021 for Loki, 10-04-2015 for Daredevil)
  assert.equal(cleanHtml.includes('09-06-2021'), true);
  assert.equal(cleanHtml.includes('10-04-2015'), true);
  // Verify seasons/episodes counts
  assert.equal(cleanHtml.includes('2 Seasons • 12 Episodes'), true);
  assert.equal(cleanHtml.includes('3 Seasons • 39 Episodes'), true);
});

test('SeriesDetail route - renders Loki details, both seasons, and all 12 episodes with DD-MM-YYYY dates', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockLokiEpisodesS1 = [
    {
      id: 1,
      canonicalId: 'mv-episode-loki-s1e1',
      episodeNumber: 1,
      title: 'Glorious Purpose',
      airDate: '2021-06-09',
      runtime: 51,
      overview: 'Loki faces the TVA.',
    },
    {
      id: 2,
      canonicalId: 'mv-episode-loki-s1e2',
      episodeNumber: 2,
      title: 'The Variant',
      airDate: '2021-06-16',
      runtime: 54,
      overview: 'Mobius puts Loki to work.',
    },
    {
      id: 3,
      canonicalId: 'mv-episode-loki-s1e3',
      episodeNumber: 3,
      title: 'Lamentis',
      airDate: '2021-06-23',
      runtime: 42,
      overview: 'Loki investigates the Variant.',
    },
    {
      id: 4,
      canonicalId: 'mv-episode-loki-s1e4',
      episodeNumber: 4,
      title: 'The Nexus Event',
      airDate: '2021-06-30',
      runtime: 48,
      overview: 'Frayed nerves and paranoia.',
    },
    {
      id: 5,
      canonicalId: 'mv-episode-loki-s1e5',
      episodeNumber: 5,
      title: 'Journey Into Mystery',
      airDate: '2021-07-07',
      runtime: 49,
      overview: 'Loki tries to escape The Void.',
    },
    {
      id: 6,
      canonicalId: 'mv-episode-loki-s1e6',
      episodeNumber: 6,
      title: 'For All Time. Always.',
      airDate: '2021-07-14',
      runtime: 54,
      overview: 'The season finale.',
    },
  ];

  const mockLokiEpisodesS2 = [
    {
      id: 7,
      canonicalId: 'mv-episode-loki-s2e1',
      episodeNumber: 1,
      title: 'Ouroboros',
      airDate: '2023-10-05',
      runtime: 47,
      overview: 'Loki finds himself slipping through time.',
    },
    {
      id: 8,
      canonicalId: 'mv-episode-loki-s2e2',
      episodeNumber: 2,
      title: 'Breaking Brad',
      airDate: '2023-10-12',
      runtime: 49,
      overview: 'Loki and Mobius search for Sylvie.',
    },
    {
      id: 9,
      canonicalId: 'mv-episode-loki-s2e3',
      episodeNumber: 3,
      title: '1893',
      airDate: '2023-10-19',
      runtime: 53,
      overview: 'Loki and Mobius pursue Ravonna Renslayer.',
    },
    {
      id: 10,
      canonicalId: 'mv-episode-loki-s2e4',
      episodeNumber: 4,
      title: 'Heart of the TVA',
      airDate: '2023-10-26',
      runtime: 49,
      overview: 'The Temporal Loom approaches meltdown.',
    },
    {
      id: 11,
      canonicalId: 'mv-episode-loki-s2e5',
      episodeNumber: 5,
      title: 'Science/Fiction',
      airDate: '2023-11-02',
      runtime: 45,
      overview: 'Loki time-slips through timeline wreckage.',
    },
    {
      id: 12,
      canonicalId: 'mv-episode-loki-s2e6',
      episodeNumber: 6,
      title: 'Glorious Purpose',
      airDate: '2023-11-09',
      runtime: 56,
      overview: 'Loki learns what it truly takes.',
    },
  ];

  const mockLokiDetail = {
    canonicalId: 'mv-series-loki',
    title: 'Loki',
    firstAirDate: '2021-06-09',
    lastAirDate: '2023-11-09',
    numberOfSeasons: 2,
    numberOfEpisodes: 12,
    overview:
      'After stealing the Tesseract, an alternate version of Loki is brought to the TVA.',
    genres: ['Drama', 'Sci-Fi & Fantasy'],
    universeId: 'earth-616',
    sagaId: 'multiverse-saga',
    phaseId: 'phase-4',
    externalIds: { tmdb: 84958, imdb: 'tt9140560' },
    verification: { status: 'verified' },
    seasons: [
      {
        canonicalId: 'mv-season-loki-s1',
        tvCanonicalId: 'mv-series-loki',
        seasonNumber: 1,
        title: 'Season 1',
        overview: 'Loki explores the Time Variance Authority.',
        airDate: '2021-06-09',
        episodeCount: 6,
        episodes: mockLokiEpisodesS1,
      },
      {
        canonicalId: 'mv-season-loki-s2',
        tvCanonicalId: 'mv-series-loki',
        seasonNumber: 2,
        title: 'Season 2',
        overview:
          'Loki navigates an ever-expanding and increasingly dangerous multiverse.',
        airDate: '2023-10-05',
        episodeCount: 6,
        episodes: mockLokiEpisodesS2,
      },
    ],
  };

  queryClient.setQueryData(
    queryKeys.series.detail('mv-series-loki'),
    mockLokiDetail
  );

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/series/mv-series-loki'] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/series/:canonicalId',
              element: React.createElement(SeriesDetail),
            })
          )
        )
      )
    );
  });

  const cleanHtml = html.replace(/<!--.*?-->/g, '');
  assert.equal(cleanHtml.includes('Loki'), true);
  assert.equal(cleanHtml.includes('09-06-2021'), true);
  assert.equal(cleanHtml.includes('09-11-2023'), true);
  // Season 1 is selected by default
  assert.equal(cleanHtml.includes('Season 1 (6 Ep)'), true);
  assert.equal(cleanHtml.includes('Season 2 (6 Ep)'), true);
  assert.equal(cleanHtml.includes('Glorious Purpose'), true);
  assert.equal(cleanHtml.includes('Loki faces the TVA.'), true);
  assert.equal(cleanHtml.includes('Episode 1'), true);
  assert.equal(cleanHtml.includes('mv-episode-loki-s1e1'), true);
});

test('SeriesDetail route - renders safe 404 alert when series does not exist', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  queryClient.setQueryData(
    queryKeys.series.detail('mv-series-nonexistent'),
    null
  );

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/series/mv-series-nonexistent'] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/series/:canonicalId',
              element: React.createElement(SeriesDetail),
            })
          )
        )
      )
    );
  });

  assert.equal(html.includes('TV Series Not Found'), true);
  assert.equal(html.includes('Back to TV Series'), true);
});
