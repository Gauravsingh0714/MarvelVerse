import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  CanonicalDataLoader,
  CanonicalDataValidationError,
  createCanonicalRepository,
} from '../../src/services/repository/index.js';
import {
  CanonicalMovie,
  CanonicalTvSeries,
  CanonicalSeason,
  CanonicalVariant,
  CanonicalContinuity,
  WatchGuide,
  MediaAsset,
} from '@marvelverse/shared';

test('Batch 1 — Baseline Loading of Production Canonical Data', () => {
  const loader = new CanonicalDataLoader();

  const universes = loader.loadUniverses();
  assert.equal(universes.length, 4);
  assert.equal(
    universes.some((u) => u.id === 'earth-616'),
    true
  );

  const sagas = loader.loadSagas();
  assert.equal(sagas.length, 2);
  assert.equal(
    sagas.some((s) => s.id === 'infinity-saga'),
    true
  );

  const phases = loader.loadPhases();
  assert.equal(phases.length, 6);
  assert.equal(
    phases.some((p) => p.id === 'phase-1'),
    true
  );

  const movies = loader.loadMovies();
  assert.equal(movies.length, 14);
  assert.equal(
    movies.some((m) => m.canonicalId === 'mv-movie-iron-man'),
    true
  );

  const characters = loader.loadCharacters();
  assert.equal(characters.length, 16);
  assert.equal(
    characters.some((c) => c.canonicalId === 'mv-character-tony-stark'),
    true
  );

  const appearances = loader.loadAppearances();
  assert.equal(appearances.length, 29);
  assert.equal(
    appearances.some((a) => a.canonicalId === 'mv-app-tony-stark-iron-man'),
    true
  );
});

test('Batch 1 — Reference Integrity Passes on Verified Baseline', () => {
  const loader = new CanonicalDataLoader();
  const report = loader.validateReferenceIntegrity();

  assert.equal(report.isValid, true);
  assert.deepEqual(report.errors, []);
});

test('Batch 1 — Duplicate ID Rejection in CanonicalDataLoader', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-test-dup-'));
  try {
    const verifiedDir = path.join(tmpDir, 'data', 'verified');
    fs.mkdirSync(path.join(verifiedDir, 'movies'), { recursive: true });

    // Create two movie files with identical canonicalId
    const movie1 = {
      canonicalId: 'mv-movie-test-dup',
      title: 'Dup Movie 1',
      releaseDate: '2020-01-01',
      releaseOrder: 1,
      overview: 'Test overview',
      genres: ['Action'],
      universeId: 'earth-616',
      sagaId: 'infinity-saga',
      phaseId: 'phase-1',
      externalIds: { tmdb: 1111 },
      provenance: { provider: 'test', sourceId: 1111 },
      verification: { status: 'verified' },
    };

    const movie2 = {
      ...movie1,
      title: 'Dup Movie 2',
    };

    fs.writeFileSync(
      path.join(verifiedDir, 'movies', 'movie-1.json'),
      JSON.stringify(movie1)
    );
    fs.writeFileSync(
      path.join(verifiedDir, 'movies', 'movie-2.json'),
      JSON.stringify(movie2)
    );

    const loader = new CanonicalDataLoader(tmpDir);
    assert.throws(
      () => loader.loadMovies(),
      (err: unknown) => {
        return (
          err instanceof CanonicalDataValidationError &&
          err.message.includes(
            'Duplicate identifier detected in movies: "mv-movie-test-dup"'
          )
        );
      }
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('Batch 1 — Invalid Record Rejection with Structured Field Errors', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-test-invalid-'));
  try {
    const verifiedDir = path.join(tmpDir, 'data', 'verified');
    fs.mkdirSync(path.join(verifiedDir, 'movies'), { recursive: true });

    // Missing required title and bad canonicalId format
    const invalidMovie = {
      canonicalId: 'INVALID_ID_FORMAT',
      releaseDate: 'not-a-date',
      releaseOrder: -5,
      overview: 'Test overview',
      genres: ['Action'],
      universeId: 'earth-616',
      sagaId: 'infinity-saga',
      phaseId: 'phase-1',
      externalIds: {},
      provenance: { provider: 'test', sourceId: 123 },
      verification: { status: 'verified' },
    };

    fs.writeFileSync(
      path.join(verifiedDir, 'movies', 'bad-movie.json'),
      JSON.stringify(invalidMovie)
    );

    const loader = new CanonicalDataLoader(tmpDir);
    assert.throws(
      () => loader.loadMovies(),
      (err: unknown) => {
        return (
          err instanceof CanonicalDataValidationError && err.errors.length > 0
        );
      }
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('Batch 1 — Safe Handling of Optional / Nullable Canonical Data', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-test-nullable-'));
  try {
    const verifiedDir = path.join(tmpDir, 'data', 'verified');
    fs.mkdirSync(path.join(verifiedDir, 'movies'), { recursive: true });

    // Movie with explicitly null / omitted optional fields
    const nullableMovie: CanonicalMovie = {
      canonicalId: 'mv-movie-nullable-test',
      title: 'Nullable Test Movie',
      releaseDate: '2024-05-01',
      releaseOrder: 1,
      runtime: null,
      overview: 'Testing explicitly null runtime and poster',
      posterPath: null,
      backdropPath: null,
      poster: null,
      backdrop: null,
      chronology: {
        storyYear: null,
        storyDate: null,
        storyOrderIndex: null, // explicitly unknown narrative placement
        notes: 'Chronology unknown test fixture',
      },
      genres: ['Adventure'],
      universeId: 'earth-616',
      sagaId: 'multiverse-saga',
      phaseId: 'phase-5',
      externalIds: {},
      provenance: { provider: 'test', sourceId: 'custom-string-id' },
      verification: { status: 'verified' },
    };

    fs.writeFileSync(
      path.join(verifiedDir, 'movies', 'nullable-movie.json'),
      JSON.stringify(nullableMovie)
    );

    const loader = new CanonicalDataLoader(tmpDir);
    const loaded = loader.loadMovies();
    assert.equal(loaded.length, 1);
    assert.equal(loaded[0].runtime, null);
    assert.equal(loaded[0].posterPath, null);
    assert.equal(loaded[0].chronology?.storyOrderIndex, null);
    assert.equal(loaded[0].provenance.sourceId, 'custom-string-id');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('Batch 1 — Synthetic Fixture: TV Series, Season, and Episode Infrastructure', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-test-tv-'));
  try {
    const verifiedDir = path.join(tmpDir, 'data', 'verified');
    fs.mkdirSync(path.join(verifiedDir, 'tv'), { recursive: true });
    fs.mkdirSync(path.join(verifiedDir, 'seasons'), { recursive: true });

    const testSeries: CanonicalTvSeries = {
      canonicalId: 'mv-series-loki-test',
      title: 'Loki (Test Fixture)',
      firstAirDate: '2021-06-09',
      lastAirDate: '2023-11-09',
      numberOfSeasons: 2,
      numberOfEpisodes: 12,
      overview: 'Loki steps out of his brother shadow.',
      genres: ['Sci-Fi', 'Fantasy'],
      universeId: 'earth-616',
      sagaId: 'multiverse-saga',
      phaseId: 'phase-4',
      externalIds: { tmdb: 84958 },
      provenance: { provider: 'test', sourceId: 84958 },
      verification: { status: 'verified' },
    };

    const testSeason1: CanonicalSeason = {
      canonicalId: 'mv-season-loki-s1',
      tvCanonicalId: 'mv-series-loki-test',
      seasonNumber: 1,
      title: 'Season 1',
      overview: 'Glorious purpose.',
      episodeCount: 1,
      episodes: [
        {
          id: 101,
          canonicalId: 'mv-episode-loki-s1-e1',
          episodeNumber: 1,
          title: 'Glorious Purpose',
          overview: 'After stealing the Tesseract, Loki lands in the TVA.',
          airDate: '2021-06-09',
          runtime: 51,
        },
      ],
      provenance: { provider: 'test', sourceId: 101 },
      verification: { status: 'verified' },
    };

    fs.writeFileSync(
      path.join(verifiedDir, 'tv', 'loki.json'),
      JSON.stringify(testSeries)
    );
    fs.writeFileSync(
      path.join(verifiedDir, 'seasons', 'loki-s1.json'),
      JSON.stringify(testSeason1)
    );

    const repo = createCanonicalRepository({ baseWorkspaceDir: tmpDir });

    const series = repo.tv.getSeries();
    assert.equal(series.length, 1);
    assert.equal(series[0].canonicalId, 'mv-series-loki-test');

    const byId = repo.tv.getSeriesById('mv-series-loki-test');
    assert.equal(byId?.title, 'Loki (Test Fixture)');

    const seasons = repo.tv.getSeasons('mv-series-loki-test');
    assert.equal(seasons.length, 1);
    assert.equal(seasons[0].canonicalId, 'mv-season-loki-s1');

    const episodes = repo.tv.getEpisodes('mv-season-loki-s1');
    assert.equal(episodes.length, 1);
    assert.equal(episodes[0].title, 'Glorious Purpose');

    const episodeById = repo.tv.getEpisodeById(
      'mv-episode-loki-s1-e1',
      'mv-season-loki-s1'
    );
    assert.equal(episodeById?.title, 'Glorious Purpose');

    // Immutability check on TvRepository
    series[0].title = 'CORRUPTED TV TITLE';
    assert.equal(
      repo.tv.getSeriesById('mv-series-loki-test')?.title,
      'Loki (Test Fixture)'
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('Batch 1 — Synthetic Fixture: Character Variant Infrastructure', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-test-variant-'));
  try {
    const verifiedDir = path.join(tmpDir, 'data', 'verified');
    fs.mkdirSync(path.join(verifiedDir, 'variants'), { recursive: true });

    const testVariant: CanonicalVariant = {
      canonicalId: 'mv-variant-alligator-loki',
      baseCharacterId: 'mv-character-loki',
      name: 'Alligator Loki',
      variantDesignation: 'Alligator Loki',
      universeId: 'earth-void',
      overview: 'A reptilian variant of the God of Mischief.',
      verification: { status: 'verified' },
    };

    fs.writeFileSync(
      path.join(verifiedDir, 'variants', 'alligator-loki.json'),
      JSON.stringify(testVariant)
    );

    const repo = createCanonicalRepository({ baseWorkspaceDir: tmpDir });

    const variants = repo.characters.getVariants();
    assert.equal(variants.length, 1);
    assert.equal(variants[0].canonicalId, 'mv-variant-alligator-loki');

    const byId = repo.characters.getVariantById('mv-variant-alligator-loki');
    assert.equal(byId?.name, 'Alligator Loki');

    const byBase = repo.characters.getVariantsByCharacter('mv-character-loki');
    assert.equal(byBase.length, 1);

    const byUniverse = repo.characters.getVariantsByUniverse('earth-void');
    assert.equal(byUniverse.length, 1);

    // Immutability check on CharacterRepository variants
    variants[0].name = 'CORRUPTED VARIANT';
    assert.equal(
      repo.characters.getVariantById('mv-variant-alligator-loki')?.name,
      'Alligator Loki'
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('Batch 1 — Synthetic Fixture: CanonicalContinuity Infrastructure', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-test-continuity-'));
  try {
    const verifiedDir = path.join(tmpDir, 'data', 'verified');
    fs.mkdirSync(verifiedDir, { recursive: true });

    const continuities: CanonicalContinuity[] = [
      {
        id: 'cont-core-mcu',
        name: 'Core MCU',
        tier: 'core-mcu',
        description:
          'Sacred timeline and core Marvel Studios cinematic universe.',
      },
      {
        id: 'cont-connected-multiverse',
        name: 'Connected Multiverse',
        tier: 'connected-multiverse',
        description:
          'Alternative multiverse timelines interacting with Earth-616.',
      },
    ];

    fs.writeFileSync(
      path.join(verifiedDir, 'continuities.json'),
      JSON.stringify(continuities)
    );

    const repo = createCanonicalRepository({ baseWorkspaceDir: tmpDir });

    const loaded = repo.foundation.getContinuities();
    assert.equal(loaded.length, 2);

    const byId = repo.foundation.getContinuityById('cont-core-mcu');
    assert.equal(byId?.name, 'Core MCU');

    const byTier = repo.foundation.getContinuityByTier('connected-multiverse');
    assert.equal(byTier?.name, 'Connected Multiverse');

    // Immutability check
    loaded[0].name = 'MUTATED CONTINUITY';
    assert.equal(
      repo.foundation.getContinuityById('cont-core-mcu')?.name,
      'Core MCU'
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('Batch 1 — Synthetic Fixture: Curated Watch Guide & Tiers Infrastructure', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-test-guide-'));
  try {
    const verifiedDir = path.join(tmpDir, 'data', 'verified');
    fs.mkdirSync(path.join(verifiedDir, 'watch-guides'), { recursive: true });

    const testGuide: WatchGuide = {
      id: 'guide-road-to-doomsday',
      name: 'Road to Doomsday',
      slug: 'road-to-doomsday',
      description: 'Curated path toward Avengers: Doomsday.',
      version: '1.0.0',
      entries: [
        {
          id: 'guide-entry-1',
          entityType: 'movie',
          entityCanonicalId: 'mv-movie-iron-man',
          title: 'Iron Man',
          tier: 'tier-1-absolute-essentials',
          curatedOrder: 1,
          whyWatchThis:
            'Establishes the foundation of the MCU and Tony Stark character arc.',
          verification: { status: 'verified' },
        },
        {
          id: 'guide-entry-2',
          entityType: 'movie',
          entityCanonicalId: 'mv-movie-the-avengers',
          title: 'The Avengers',
          tier: 'tier-2-multiverse-foundation',
          curatedOrder: 2,
          whyWatchThis:
            'First major assembly of the heroes against cosmic threats.',
          verification: { status: 'verified' },
        },
      ],
    };

    fs.writeFileSync(
      path.join(verifiedDir, 'watch-guides', 'road-to-doomsday.json'),
      JSON.stringify(testGuide)
    );

    const repo = createCanonicalRepository({ baseWorkspaceDir: tmpDir });

    const guides = repo.watchGuides.getWatchGuides();
    assert.equal(guides.length, 1);
    assert.equal(guides[0].slug, 'road-to-doomsday');

    const bySlug = repo.watchGuides.getWatchGuideBySlug('road-to-doomsday');
    assert.equal(bySlug?.id, 'guide-road-to-doomsday');

    const entries = repo.watchGuides.getEntries('road-to-doomsday');
    assert.equal(entries.length, 2);
    assert.equal(entries[0].curatedOrder, 1);

    const tier1 = repo.watchGuides.getEntriesByTier(
      'tier-1-absolute-essentials',
      'road-to-doomsday'
    );
    assert.equal(tier1.length, 1);
    assert.equal(tier1[0].title, 'Iron Man');

    // Immutability check
    entries[0].title = 'CORRUPTED GUIDE TITLE';
    assert.equal(
      repo.watchGuides.getEntries('road-to-doomsday')[0].title,
      'Iron Man'
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('Batch 1 — Synthetic Fixture: MediaAsset-Bearing Records Pass Layer 2 Safely', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-test-media-'));
  try {
    const verifiedDir = path.join(tmpDir, 'data', 'verified');
    fs.mkdirSync(path.join(verifiedDir, 'movies'), { recursive: true });

    const posterAsset: MediaAsset = {
      id: 'mv-media-poster-iron-man',
      provider: 'custom-cdn',
      mediaType: 'poster',
      path: '/posters/iron-man.webp',
      aspectRatio: 'poster',
      width: 2000,
      height: 3000,
      altText: 'Official Iron Man theatrical poster',
      attribution: 'Marvel Studios / Photographed by Studio',
      entityType: 'movie',
      entityId: 'mv-movie-iron-man-media',
    };

    const mediaMovie: CanonicalMovie = {
      canonicalId: 'mv-movie-iron-man-media',
      title: 'Iron Man with Media',
      releaseDate: '2008-05-02',
      releaseOrder: 1,
      overview: 'Billionaire engineer Tony Stark.',
      genres: ['Action', 'Sci-Fi'],
      universeId: 'earth-616',
      sagaId: 'infinity-saga',
      phaseId: 'phase-1',
      poster: posterAsset,
      externalIds: { tmdb: 1726 },
      provenance: { provider: 'test', sourceId: 1726 },
      verification: { status: 'verified' },
    };

    fs.writeFileSync(
      path.join(verifiedDir, 'movies', 'iron-man-media.json'),
      JSON.stringify(mediaMovie)
    );

    const repo = createCanonicalRepository({ baseWorkspaceDir: tmpDir });
    const loaded = repo.movies.getMovieById('mv-movie-iron-man-media');

    assert.notEqual(loaded, null);
    assert.equal(loaded?.poster?.id, 'mv-media-poster-iron-man');
    assert.equal(loaded?.poster?.provider, 'custom-cdn');
    assert.equal(loaded?.poster?.aspectRatio, 'poster');
    assert.equal(loaded?.poster?.width, 2000);
    assert.equal(loaded?.poster?.height, 3000);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
