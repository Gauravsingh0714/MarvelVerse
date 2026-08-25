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

test('GET /api/v1/universes returns universes collection', async () => {
  const res = await fetch(`${baseUrl}/universes`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as any;
  assert.equal(Array.isArray(body.data), true);
  assert.equal(body.meta.count, body.data.length);
  assert.equal(
    body.data.some((u: any) => u.id === 'earth-616'),
    true
  );
});

test('GET /api/v1/universes/:universeId returns universe by ID or 404', async () => {
  const resValid = await fetch(`${baseUrl}/universes/earth-616`);
  assert.equal(resValid.status, 200);
  const bodyValid = (await resValid.json()) as any;
  assert.equal(bodyValid.data.id, 'earth-616');

  const resInvalid = await fetch(`${baseUrl}/universes/unknown-universe`);
  assert.equal(resInvalid.status, 404);
  const bodyInvalid = (await resInvalid.json()) as any;
  assert.equal(bodyInvalid.error.code, 'NOT_FOUND');
});

test('GET /api/v1/sagas and /api/v1/phases return foundation collections', async () => {
  const resSagas = await fetch(`${baseUrl}/sagas`);
  assert.equal(resSagas.status, 200);
  const sagasBody = (await resSagas.json()) as any;
  assert.equal(sagasBody.data.length > 0, true);

  const resPhases = await fetch(`${baseUrl}/phases`);
  assert.equal(resPhases.status, 200);
  const phasesBody = (await resPhases.json()) as any;
  assert.equal(phasesBody.data.length > 0, true);
});

test('GET /api/v1/movies supports filtering, sorting, and error on unknown query params', async () => {
  const resAll = await fetch(`${baseUrl}/movies`);
  assert.equal(resAll.status, 200);
  const allBody = (await resAll.json()) as any;
  assert.equal(allBody.data.length, 6);

  const resFiltered = await fetch(
    `${baseUrl}/movies?universeId=earth-616&sagaId=infinity-saga&phaseId=phase-1`
  );
  assert.equal(resFiltered.status, 200);
  const filteredBody = (await resFiltered.json()) as any;
  assert.equal(filteredBody.data.length, 6);

  const resSort = await fetch(`${baseUrl}/movies?sort=releaseOrder`);
  assert.equal(resSort.status, 200);
  const sortBody = (await resSort.json()) as any;
  assert.equal(sortBody.data[0].canonicalId, 'mv-movie-iron-man');

  const resBadQuery = await fetch(`${baseUrl}/movies?unknownParam=bad`);
  assert.equal(resBadQuery.status, 400);
  const badBody = (await resBadQuery.json()) as any;
  assert.equal(badBody.error.code, 'VALIDATION_ERROR');
});

test('GET /api/v1/movies/:canonicalId and /api/v1/movies/tmdb/:tmdbId', async () => {
  const resId = await fetch(`${baseUrl}/movies/mv-movie-iron-man`);
  assert.equal(resId.status, 200);
  const idBody = (await resId.json()) as any;
  assert.equal(idBody.data.canonicalId, 'mv-movie-iron-man');

  const resTmdb = await fetch(`${baseUrl}/movies/tmdb/1726`);
  assert.equal(resTmdb.status, 200);
  const tmdbBody = (await resTmdb.json()) as any;
  assert.equal(tmdbBody.data.canonicalId, 'mv-movie-iron-man');

  const resBadTmdb = await fetch(`${baseUrl}/movies/tmdb/abc`);
  assert.equal(resBadTmdb.status, 400);
  const badTmdbBody = (await resBadTmdb.json()) as any;
  assert.equal(badTmdbBody.error.code, 'VALIDATION_ERROR');

  const resUnknownMovie = await fetch(
    `${baseUrl}/movies/mv-movie-non-existent`
  );
  assert.equal(resUnknownMovie.status, 404);
});

test('GET /api/v1/characters endpoints and TMDB route ordering', async () => {
  const resChars = await fetch(`${baseUrl}/characters`);
  assert.equal(resChars.status, 200);
  const charsBody = (await resChars.json()) as any;
  assert.equal(charsBody.data.length, 5);

  const resTony = await fetch(`${baseUrl}/characters/mv-character-tony-stark`);
  assert.equal(resTony.status, 200);
  const tonyBody = (await resTony.json()) as any;
  assert.equal(tonyBody.data.name, 'Tony Stark');

  const resTonyTmdb = await fetch(`${baseUrl}/characters/tmdb/3223`);
  assert.equal(resTonyTmdb.status, 200);
  const tmdbBody = (await resTonyTmdb.json()) as any;
  assert.equal(tmdbBody.data.canonicalId, 'mv-character-tony-stark');

  const resBadTmdb = await fetch(`${baseUrl}/characters/tmdb/invalid`);
  assert.equal(resBadTmdb.status, 400);
});

test('GET /api/v1/appearances and nested character/movie appearance routes', async () => {
  const resApps = await fetch(`${baseUrl}/appearances`);
  assert.equal(resApps.status, 200);
  const appsBody = (await resApps.json()) as any;
  assert.equal(appsBody.data.length, 6);

  const resTonyApps = await fetch(
    `${baseUrl}/characters/mv-character-tony-stark/appearances`
  );
  assert.equal(resTonyApps.status, 200);
  const tonyAppsBody = (await resTonyApps.json()) as any;
  assert.equal(tonyAppsBody.data.length, 3);

  const resIronManApps = await fetch(
    `${baseUrl}/movies/mv-movie-iron-man/appearances`
  );
  assert.equal(resIronManApps.status, 200);
  const ironManAppsBody = (await resIronManApps.json()) as any;
  assert.equal(ironManAppsBody.data.length, 1);

  const resMissingCharApps = await fetch(
    `${baseUrl}/characters/mv-character-non-existent/appearances`
  );
  assert.equal(resMissingCharApps.status, 404);
});

test('API error handling for unknown route', async () => {
  const res = await fetch(`${baseUrl}/does-not-exist`);
  assert.equal(res.status, 404);
  const body = (await res.json()) as any;
  assert.equal(body.error.code, 'NOT_FOUND');
  assert.equal(body.error.message, 'Route not found');
});

test('Response Immutability verifies repeated API queries return stable data', async () => {
  const res1 = await fetch(`${baseUrl}/movies`);
  const body1 = (await res1.json()) as any;
  body1.data[0].title = 'MUTATED IN CLIENT';

  const res2 = await fetch(`${baseUrl}/movies`);
  const body2 = (await res2.json()) as any;
  assert.equal(body2.data[0].title, 'Iron Man');
});
