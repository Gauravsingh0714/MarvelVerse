import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Server } from 'node:http';
import app from '../../src/app/index.js';

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

test('GET /api/v1/media/resolve resolves valid TMDB poster query', async () => {
  const query = new URLSearchParams({
    provider: 'tmdb',
    path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    kind: 'poster',
    size: 'large',
    altText: 'Iron Man Test Poster',
  });

  const res = await fetch(`${baseUrl}/media/resolve?${query.toString()}`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.data.availability, 'available');
  assert.equal(body.data.size, 'large');
  assert.equal(
    body.data.resolvedUrl,
    'https://image.tmdb.org/t/p/w780/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg'
  );
  assert.equal(body.data.altText, 'Iron Man Test Poster');
  assert.equal(body.data.isFallback, false);
});

test('GET /api/v1/media/resolve rejects invalid/missing parameters with 400', async () => {
  // Missing provider
  const resMissingProvider = await fetch(
    `${baseUrl}/media/resolve?path=/test.jpg`
  );
  assert.equal(resMissingProvider.status, 400);
  const body1 = (await resMissingProvider.json()) as any;
  assert.equal(body1.error.code, 'VALIDATION_ERROR');

  // Missing path
  const resMissingPath = await fetch(`${baseUrl}/media/resolve?provider=tmdb`);
  assert.equal(resMissingPath.status, 400);
  const body2 = (await resMissingPath.json()) as any;
  assert.equal(body2.error.code, 'VALIDATION_ERROR');
});

test('GET /api/v1/media/movies/:canonicalId returns movie media bundle', async () => {
  const res = await fetch(
    `${baseUrl}/media/movies/mv-movie-iron-man?posterSize=medium&backdropSize=large`
  );
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.data.entityType, 'movie');
  assert.equal(body.data.entityCanonicalId, 'mv-movie-iron-man');
  assert.equal(body.data.primaryPoster.availability, 'available');
  assert.equal(body.data.primaryPoster.size, 'medium');
  assert.equal(
    body.data.primaryPoster.resolvedUrl,
    'https://image.tmdb.org/t/p/w342/78lPtwv72eTNqFW9COBYI0dWDJa.jpg'
  );
  assert.equal(body.data.primaryBackdrop.availability, 'available');
  assert.equal(body.data.primaryBackdrop.size, 'large');
  assert.equal(
    body.data.primaryBackdrop.resolvedUrl,
    'https://image.tmdb.org/t/p/w1280/cKvDv2LpwVEqbdXWoQl4XgGN6le.jpg'
  );
});

test('GET /api/v1/media/movies/:canonicalId returns 404 for unknown movie', async () => {
  const res = await fetch(`${baseUrl}/media/movies/mv-movie-non-existent`);
  assert.equal(res.status, 404);

  const body = (await res.json()) as any;
  assert.equal(body.error.code, 'NOT_FOUND');
});

test('GET /api/v1/media/series/:canonicalId returns series media bundle', async () => {
  const res = await fetch(`${baseUrl}/media/series/mv-series-loki`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.data.entityType, 'series');
  assert.equal(body.data.entityCanonicalId, 'mv-series-loki');
  assert.equal(body.data.primaryPoster.availability, 'available');
  assert.equal(body.data.primaryBackdrop.availability, 'available');
});

test('GET /api/v1/media/series/:canonicalId returns 404 for unknown series', async () => {
  const res = await fetch(`${baseUrl}/media/series/mv-series-non-existent`);
  assert.equal(res.status, 404);

  const body = (await res.json()) as any;
  assert.equal(body.error.code, 'NOT_FOUND');
});

test('GET /api/v1/media/characters/:canonicalId returns character media bundle', async () => {
  const res = await fetch(
    `${baseUrl}/media/characters/mv-character-tony-stark?avatarSize=large`
  );
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(body.data.entityType, 'character');
  assert.equal(body.data.entityCanonicalId, 'mv-character-tony-stark');
  assert.equal(body.data.primaryAvatar.availability, 'missing');
  assert.equal(body.data.primaryAvatar.size, 'large');
  assert.equal(body.data.primaryAvatar.isFallback, true);
  assert.equal(
    body.data.primaryAvatar.resolvedUrl,
    '/placeholders/avatar-placeholder.svg'
  );
});

test('GET /api/v1/media/characters/:canonicalId returns 404 for unknown character', async () => {
  const res = await fetch(
    `${baseUrl}/media/characters/mv-character-non-existent`
  );
  assert.equal(res.status, 404);

  const body = (await res.json()) as any;
  assert.equal(body.error.code, 'NOT_FOUND');
});
