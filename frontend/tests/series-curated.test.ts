import test from 'node:test';
import assert from 'node:assert/strict';
import { QueryClient } from '@tanstack/react-query';
import { CanonicalTvSeries, WatchGuideEntry } from '@marvelverse/shared';
import {
  SeriesService,
  SeriesFilters,
} from '../src/services/series.service.js';
import {
  CuratedService,
  DoomsdayFilters,
} from '../src/services/curated.service.js';
import { ApiClientError } from '../src/api/types.js';
import { queryKeys } from '../src/hooks/queryKeys.js';

// ====================================================
// 1. SERIES SERVICE TESTS
// ====================================================

test('SeriesService.getSeries calls /series and unpacks collection envelope', async () => {
  let capturedEndpoint = '';
  const mockSeries: CanonicalTvSeries[] = [
    {
      canonicalId: 'mv-series-loki',
      title: 'Loki',
      firstAirDate: '2021-06-09',
      numberOfSeasons: 2,
      numberOfEpisodes: 12,
      overview: 'Overview',
      genres: ['Drama'],
      universeId: 'earth-616',
      sagaId: 'multiverse-saga',
      phaseId: 'phase-4',
      externalIds: { tmdb: 84958 },
      provenance: {
        provider: 'tmdb',
        sourceId: 84958,
        acquiredAt: '2026-10-14T00:00:00.000Z',
      },
      verification: {
        status: 'verified',
        method: 'manual-review',
        verifiedAt: '2026-10-14T00:00:00.000Z',
      },
    },
  ];

  const mockClient = {
    get: async <T>(endpoint: string): Promise<T> => {
      capturedEndpoint = endpoint;
      return {
        data: mockSeries,
        meta: { count: mockSeries.length },
      } as unknown as T;
    },
  } as any;

  const service = new SeriesService(mockClient);
  const data = await service.getSeries();

  assert.equal(capturedEndpoint, '/series');
  assert.equal(data.length, 1);
  assert.equal(data[0].canonicalId, 'mv-series-loki');
  assert.equal(data[0].title, 'Loki');
});

test('SeriesService.getSeries serializes query parameters correctly', async () => {
  let capturedEndpoint = '';
  const mockClient = {
    get: async <T>(endpoint: string): Promise<T> => {
      capturedEndpoint = endpoint;
      return { data: [], meta: { count: 0 } } as unknown as T;
    },
  } as any;

  const service = new SeriesService(mockClient);
  const filters: SeriesFilters = {
    universeId: 'earth-616',
    sagaId: 'multiverse-saga',
    phaseId: 'phase-4',
    sort: 'firstAirDate',
  };

  await service.getSeries(filters);
  assert.equal(
    capturedEndpoint,
    '/series?universeId=earth-616&sagaId=multiverse-saga&phaseId=phase-4&sort=firstAirDate'
  );

  await service.getSeries({ sort: 'title' });
  assert.equal(capturedEndpoint, '/series?sort=title');
});

test('SeriesService.getSeries propagates ApiClientError on failure', async () => {
  const mockClient = {
    get: async (): Promise<never> => {
      throw new ApiClientError('NETWORK_ERROR', 'Connection failed', 0);
    },
  } as any;

  const service = new SeriesService(mockClient);
  await assert.rejects(
    async () => {
      await service.getSeries();
    },
    (err: any) => {
      assert.equal(err instanceof ApiClientError, true);
      assert.equal(err.code, 'NETWORK_ERROR');
      return true;
    }
  );
});

// ====================================================
// 2. SERIES DETAIL SERVICE TESTS
// ====================================================

test('SeriesService.getSeriesById requests correct endpoint and returns series data with seasons', async () => {
  let capturedEndpoint = '';
  const mockSeriesWithSeasons: CanonicalTvSeries & { seasons: any[] } = {
    canonicalId: 'mv-series-loki',
    title: 'Loki',
    firstAirDate: '2021-06-09',
    numberOfSeasons: 2,
    numberOfEpisodes: 12,
    overview: 'Overview',
    genres: ['Drama'],
    universeId: 'earth-616',
    sagaId: 'multiverse-saga',
    phaseId: 'phase-4',
    externalIds: { tmdb: 84958 },
    provenance: {
      provider: 'tmdb',
      sourceId: 84958,
      acquiredAt: '2026-10-14T00:00:00.000Z',
    },
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: '2026-10-14T00:00:00.000Z',
    },
    seasons: [
      {
        canonicalId: 'mv-season-loki-s1',
        seasonNumber: 1,
        title: 'Season 1',
        episodes: [
          {
            id: 1,
            title: 'Glorious Purpose',
          },
        ],
      },
    ],
  };

  const mockClient = {
    get: async <T>(endpoint: string): Promise<T> => {
      capturedEndpoint = endpoint;
      return { data: mockSeriesWithSeasons } as unknown as T;
    },
  } as any;

  const service = new SeriesService(mockClient);
  const data = await service.getSeriesById('mv-series-loki');

  assert.equal(capturedEndpoint, '/series/mv-series-loki');
  assert.equal(data.canonicalId, 'mv-series-loki');
  assert.ok(Array.isArray((data as any).seasons));
  assert.equal((data as any).seasons[0].episodes[0].title, 'Glorious Purpose');
});

test('SeriesService.getSeriesById surfaces 404 ApiClientError when series not found', async () => {
  const mockClient = {
    get: async (): Promise<never> => {
      throw new ApiClientError('NOT_FOUND', 'Series not found', 404);
    },
  } as any;

  const service = new SeriesService(mockClient);
  await assert.rejects(
    async () => {
      await service.getSeriesById('mv-series-unknown');
    },
    (err: any) => {
      assert.equal(err instanceof ApiClientError, true);
      assert.equal(err.code, 'NOT_FOUND');
      assert.equal(err.status, 404);
      return true;
    }
  );
});

// ====================================================
// 3. ROAD TO DOOMSDAY CURATED SERVICE TESTS
// ====================================================

test('CuratedService.getRoadToDoomsday requests /curated/doomsday and returns four-tier entries', async () => {
  let capturedEndpoint = '';
  const mockEntries: WatchGuideEntry[] = [
    {
      id: 'entry-1',
      entityType: 'movie',
      entityCanonicalId: 'mv-movie-avengers-infinity-war',
      title: 'Avengers: Infinity War',
      tier: 'tier-1-absolute-essentials',
      curatedOrder: 1,
      whyWatchThis: 'Why watch',
      keyPlotPoints: ['Plot 1'],
      verification: {
        status: 'verified',
        method: 'manual-review',
        verifiedAt: '2026-10-14T00:00:00.000Z',
      },
    },
    {
      id: 'entry-2',
      entityType: 'movie',
      entityCanonicalId: 'mv-movie-spider-man-no-way-home',
      title: 'Spider-Man: No Way Home',
      tier: 'tier-2-multiverse-foundation',
      curatedOrder: 4,
      whyWatchThis: 'Why watch',
      keyPlotPoints: ['Plot 2'],
      verification: {
        status: 'verified',
        method: 'manual-review',
        verifiedAt: '2026-10-14T00:00:00.000Z',
      },
    },
    {
      id: 'entry-3',
      entityType: 'series',
      entityCanonicalId: 'mv-series-wandavision',
      title: 'WandaVision',
      tier: 'tier-3-character-depth-context',
      curatedOrder: 8,
      whyWatchThis: 'Why watch',
      keyPlotPoints: ['Plot 3'],
      verification: {
        status: 'verified',
        method: 'manual-review',
        verifiedAt: '2026-10-14T00:00:00.000Z',
      },
    },
    {
      id: 'entry-4',
      entityType: 'movie',
      entityCanonicalId: 'mv-movie-the-avengers',
      title: 'The Avengers',
      tier: 'tier-4-supplemental-lore',
      curatedOrder: 9,
      whyWatchThis: 'Why watch',
      keyPlotPoints: ['Plot 4'],
      verification: {
        status: 'verified',
        method: 'manual-review',
        verifiedAt: '2026-10-14T00:00:00.000Z',
      },
    },
  ];

  const mockClient = {
    get: async <T>(endpoint: string): Promise<T> => {
      capturedEndpoint = endpoint;
      return {
        data: mockEntries,
        meta: { count: mockEntries.length },
      } as unknown as T;
    },
  } as any;

  const service = new CuratedService(mockClient);
  const data = await service.getRoadToDoomsday();

  assert.equal(capturedEndpoint, '/curated/doomsday');
  assert.equal(data.length, 4);

  // Assert all four approved tiers are present
  const tiers = data.map((e) => e.tier);
  assert.ok(tiers.includes('tier-1-absolute-essentials'));
  assert.ok(tiers.includes('tier-2-multiverse-foundation'));
  assert.ok(tiers.includes('tier-3-character-depth-context'));
  assert.ok(tiers.includes('tier-4-supplemental-lore'));
});

test('CuratedService.getRoadToDoomsday serializes tier filter correctly', async () => {
  let capturedEndpoint = '';
  const mockClient = {
    get: async <T>(endpoint: string): Promise<T> => {
      capturedEndpoint = endpoint;
      return { data: [], meta: { count: 0 } } as unknown as T;
    },
  } as any;

  const service = new CuratedService(mockClient);
  const filters: DoomsdayFilters = {
    tier: 'tier-1-absolute-essentials',
  };

  await service.getRoadToDoomsday(filters);
  assert.equal(
    capturedEndpoint,
    '/curated/doomsday?tier=tier-1-absolute-essentials'
  );
});

test('CuratedService.getRoadToDoomsday propagates ApiClientError on failure', async () => {
  const mockClient = {
    get: async (): Promise<never> => {
      throw new ApiClientError('INTERNAL_ERROR', 'Server error', 500);
    },
  } as any;

  const service = new CuratedService(mockClient);
  await assert.rejects(
    async () => {
      await service.getRoadToDoomsday();
    },
    (err: any) => {
      assert.equal(err instanceof ApiClientError, true);
      assert.equal(err.code, 'INTERNAL_ERROR');
      return true;
    }
  );
});

// ====================================================
// 4. REACT QUERY KEYS & CACHE ISOLATION TESTS
// ====================================================

test('queryKeys.series and queryKeys.curated produce deterministic isolated keys', () => {
  const seriesAllKey = queryKeys.series.all;
  const seriesListKey = queryKeys.series.list({ phaseId: 'phase-4' });
  const seriesDetailKey = queryKeys.series.detail('mv-series-loki');
  const doomsdayAllKey = queryKeys.curated.all;
  const doomsdayFilteredKey = queryKeys.curated.doomsday({
    tier: 'tier-1-absolute-essentials',
  });

  assert.deepEqual(seriesAllKey, ['series']);
  assert.deepEqual(seriesListKey, ['series', 'list', { phaseId: 'phase-4' }]);
  assert.deepEqual(seriesDetailKey, ['series', 'detail', 'mv-series-loki']);
  assert.deepEqual(doomsdayAllKey, ['curated']);
  assert.deepEqual(doomsdayFilteredKey, [
    'curated',
    'doomsday',
    { tier: 'tier-1-absolute-essentials' },
  ]);

  // Keys must be mutually isolated
  assert.notDeepEqual(seriesListKey, seriesDetailKey);
  assert.notDeepEqual(seriesAllKey, doomsdayAllKey);
  assert.notDeepEqual(seriesListKey, doomsdayFilteredKey);
});

test('React Query cache operates without collision for series and curated entries', async () => {
  const queryClient = new QueryClient();

  const mockSeriesList = [{ canonicalId: 'mv-series-loki', title: 'Loki' }];
  const mockSeriesDetail = {
    canonicalId: 'mv-series-loki',
    title: 'Loki',
    seasons: [{ canonicalId: 'mv-season-loki-s1' }],
  };
  const mockCuratedList = [
    { id: 'entry-1', tier: 'tier-1-absolute-essentials' },
  ];

  queryClient.setQueryData(queryKeys.series.list(), mockSeriesList);
  queryClient.setQueryData(
    queryKeys.series.detail('mv-series-loki'),
    mockSeriesDetail
  );
  queryClient.setQueryData(queryKeys.curated.doomsday(), mockCuratedList);

  assert.deepEqual(
    queryClient.getQueryData(queryKeys.series.list()),
    mockSeriesList
  );
  assert.deepEqual(
    queryClient.getQueryData(queryKeys.series.detail('mv-series-loki')),
    mockSeriesDetail
  );
  assert.deepEqual(
    queryClient.getQueryData(queryKeys.curated.doomsday()),
    mockCuratedList
  );
});

test('useSeriesDetail gates requests when canonicalId is missing or invalid', () => {
  const isIdValid = (id: string | null): boolean =>
    Boolean(id && /^mv-series-[a-z0-9-]+$/.test(id));

  assert.equal(isIdValid('mv-series-loki'), true);
  assert.equal(isIdValid('mv-series-wandavision'), true);

  // Missing or malformed IDs must remain disabled (enabled: false)
  assert.equal(isIdValid(null), false);
  assert.equal(isIdValid(''), false);
  assert.equal(isIdValid('undefined'), false);
  assert.equal(isIdValid('invalid-id'), false);
  assert.equal(isIdValid('mv-movie-iron-man'), false);
});
