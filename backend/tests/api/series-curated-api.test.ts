import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Server } from 'node:http';
import app from '../../src/app/index.js';
import { getCanonicalRepository } from '../../src/services/repository/index.js';

let server: Server;
let baseUrl: string;

before((_, done) => {
  server = app.listen(0, () => {
    const address = server.address();
    if (address && typeof address === 'object') {
      baseUrl = `http://localhost:${address.port}/api/v1`;
    }
    done();
  });
});

after((_, done) => {
  server.close(done);
});

// ====================================================
// SERIES COLLECTION TESTS
// ====================================================

test('GET /api/v1/series returns 200 and standard collection response envelope', async () => {
  const res = await fetch(`${baseUrl}/series`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(typeof body, 'object');
  assert.equal(Array.isArray(body.data), true);
  assert.equal(typeof body.meta, 'object');
  assert.equal(typeof body.meta.count, 'number');
  assert.equal(body.meta.count, body.data.length);
  assert.equal(body.data.length >= 2, true);

  // Verify canonical series records
  const loki = body.data.find((s: any) => s.canonicalId === 'mv-series-loki');
  const wandavision = body.data.find(
    (s: any) => s.canonicalId === 'mv-series-wandavision'
  );

  assert.ok(loki, 'Expected mv-series-loki in collection');
  assert.equal(loki.title, 'Loki');
  assert.equal(loki.numberOfSeasons, 2);

  assert.ok(wandavision, 'Expected mv-series-wandavision in collection');
  assert.equal(wandavision.title, 'WandaVision');
  assert.equal(wandavision.numberOfSeasons, 1);
});

test('GET /api/v1/series supports filtering and deterministic ordering', async () => {
  // Filter by phaseId
  const resPhase = await fetch(`${baseUrl}/series?phaseId=phase-4`);
  assert.equal(resPhase.status, 200);
  const phaseBody = (await resPhase.json()) as any;
  assert.equal(phaseBody.data.length >= 2, true);
  assert.ok(phaseBody.data.every((s: any) => s.phaseId === 'phase-4'));

  // Sort by firstAirDate
  const resSort = await fetch(`${baseUrl}/series?sort=firstAirDate`);
  assert.equal(resSort.status, 200);
  const sortBody = (await resSort.json()) as any;
  assert.equal(sortBody.data[0].canonicalId, 'mv-series-wandavision'); // WandaVision (Jan 2021) before Loki (Jun 2021)

  // Disallow unknown query parameters
  const resBadQuery = await fetch(`${baseUrl}/series?unknown=123`);
  assert.equal(resBadQuery.status, 400);
  const badBody = (await resBadQuery.json()) as any;
  assert.equal(badBody.error.code, 'VALIDATION_ERROR');
});

// ====================================================
// SERIES DETAIL TESTS
// ====================================================

test('GET /api/v1/series/:id returns 200 and standard single-resource envelope for valid canonical ID', async () => {
  const res = await fetch(`${baseUrl}/series/mv-series-loki`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(typeof body, 'object');
  assert.ok(body.data);
  assert.equal(body.data.canonicalId, 'mv-series-loki');
  assert.equal(body.data.title, 'Loki');
  assert.equal(body.data.externalIds?.tmdb, 84958);

  // Preserve canonical Series -> Season -> Episode relationships
  assert.ok(Array.isArray(body.data.seasons));
  assert.equal(body.data.seasons.length, 2);
  const s1 = body.data.seasons.find(
    (s: any) => s.canonicalId === 'mv-season-loki-s1'
  );
  assert.ok(s1);
  assert.ok(Array.isArray(s1.episodes));
  assert.equal(s1.episodes.length > 0, true);
});

test('GET /api/v1/series/:id returns 404 and correct error envelope for unknown canonical ID', async () => {
  const res = await fetch(`${baseUrl}/series/mv-series-non-existent`);
  assert.equal(res.status, 404);

  const body = (await res.json()) as any;
  assert.equal(body.error.code, 'NOT_FOUND');
  assert.equal(typeof body.error.message, 'string');
});

test('GET /api/v1/series/:id returns 400 for malformed canonical ID', async () => {
  const res = await fetch(`${baseUrl}/series/invalid-id-format`);
  assert.equal(res.status, 400);

  const body = (await res.json()) as any;
  assert.equal(body.error.code, 'VALIDATION_ERROR');
});

// ====================================================
// ROAD TO DOOMSDAY CURATED API TESTS
// ====================================================

test('GET /api/v1/curated/doomsday returns 200, standard collection envelope, and meta.count', async () => {
  const res = await fetch(`${baseUrl}/curated/doomsday`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(typeof body, 'object');
  assert.equal(Array.isArray(body.data), true);
  assert.equal(body.meta.count, 10);
  assert.equal(body.data.length, 10);

  // Verify sorted by curatedOrder
  for (let i = 0; i < body.data.length - 1; i++) {
    assert.ok(body.data[i].curatedOrder <= body.data[i + 1].curatedOrder);
  }
});

test('GET /api/v1/curated/doomsday preserves approved four-tier taxonomy', async () => {
  const res = await fetch(`${baseUrl}/curated/doomsday`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  const tiers = new Set(body.data.map((e: any) => e.tier));

  const approvedTiers = [
    'tier-1-absolute-essentials',
    'tier-2-multiverse-foundation',
    'tier-3-character-depth-context',
    'tier-4-supplemental-lore',
  ];

  for (const tier of approvedTiers) {
    assert.ok(tiers.has(tier), `Missing approved tier: ${tier}`);
  }

  // Ensure no unapproved tiers exist
  for (const tier of tiers) {
    assert.ok(
      approvedTiers.includes(tier as string),
      `Unexpected tier: ${tier}`
    );
  }
});

test('GET /api/v1/curated/doomsday entries reference valid canonical media', async () => {
  const res = await fetch(`${baseUrl}/curated/doomsday`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  const repository = getCanonicalRepository();

  for (const entry of body.data) {
    assert.ok(
      entry.entityType === 'movie' || entry.entityType === 'series',
      `Unexpected entityType: ${entry.entityType}`
    );

    if (entry.entityType === 'movie') {
      const movie = repository.movies.getMovieById(entry.entityCanonicalId);
      assert.ok(
        movie,
        `Watch guide references non-existent movie: ${entry.entityCanonicalId}`
      );
    } else if (entry.entityType === 'series') {
      const series = repository.tv.getSeriesById(entry.entityCanonicalId);
      assert.ok(
        series,
        `Watch guide references non-existent series: ${entry.entityCanonicalId}`
      );
    }
  }
});

test('GET /api/v1/curated/doomsday supports filtering by tier', async () => {
  const res = await fetch(
    `${baseUrl}/curated/doomsday?tier=tier-1-absolute-essentials`
  );
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.data.length, 3);
  assert.equal(body.meta.count, 3);
  assert.ok(
    body.data.every((e: any) => e.tier === 'tier-1-absolute-essentials')
  );

  // Invalid tier returns 400 VALIDATION_ERROR
  const resInvalidTier = await fetch(
    `${baseUrl}/curated/doomsday?tier=tier-99`
  );
  assert.equal(resInvalidTier.status, 400);
  const badBody = (await resInvalidTier.json()) as any;
  assert.equal(badBody.error.code, 'VALIDATION_ERROR');
});
