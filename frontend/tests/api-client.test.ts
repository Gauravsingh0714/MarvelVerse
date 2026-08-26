import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../src/api/client.js';
import { ApiClientError } from '../src/api/types.js';
import { MovieService } from '../src/services/movie.service.js';
import { CharacterService } from '../src/services/character.service.js';
import { FoundationService } from '../src/services/foundation.service.js';

test('ApiClient formats endpoints and parses JSON responses', async () => {
  const mockFetch: typeof fetch = async (input, init) => {
    const urlStr = String(input);
    assert.equal(urlStr, 'http://localhost:3000/api/v1/movies');
    assert.equal(init?.method, 'GET');

    return new Response(
      JSON.stringify({
        data: [{ canonicalId: 'mv-movie-iron-man', title: 'Iron Man' }],
        meta: { count: 1 },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const client = new ApiClient('http://localhost:3000/api/v1');
  // Override fetch globally for test or test via service mocking
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch;

  try {
    const res = await client.get<{ data: any[]; meta: { count: number } }>(
      '/movies'
    );
    assert.equal(res.data.length, 1);
    assert.equal(res.data[0].title, 'Iron Man');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('ApiClient normalizes HTTP 400 and 404 API error responses', async () => {
  const mockFetch: typeof fetch = async () => {
    return new Response(
      JSON.stringify({
        error: {
          code: 'NOT_FOUND',
          message: 'Movie not found',
        },
      }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const client = new ApiClient('http://localhost:3000/api/v1');
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch;

  try {
    await client.get('/movies/unknown');
    assert.fail('Should have thrown ApiClientError');
  } catch (err: any) {
    assert.equal(err instanceof ApiClientError, true);
    assert.equal(err.code, 'NOT_FOUND');
    assert.equal(err.status, 404);
    assert.equal(err.message, 'Movie not found');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('ApiClient handles network failures safely', async () => {
  const mockFetch: typeof fetch = async () => {
    throw new TypeError('Failed to fetch');
  };

  const client = new ApiClient('http://localhost:3000/api/v1');
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch;

  try {
    await client.get('/movies');
    assert.fail('Should have thrown ApiClientError');
  } catch (err: any) {
    assert.equal(err instanceof ApiClientError, true);
    assert.equal(err.code, 'NETWORK_ERROR');
    assert.equal(err.status, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('MovieService constructs endpoint query strings correctly', async () => {
  let capturedUrl = '';
  const mockClient = {
    get: async <T>(endpoint: string): Promise<T> => {
      capturedUrl = endpoint;
      return { data: [], meta: { count: 0 } } as unknown as T;
    },
  } as any;

  const service = new MovieService(mockClient);

  await service.getMovies({ phaseId: 'phase-1', sort: 'releaseOrder' });
  assert.equal(capturedUrl, '/movies?phaseId=phase-1&sort=releaseOrder');

  await service.getMovieByCanonicalId('mv-movie-iron-man');
  assert.equal(capturedUrl, '/movies/mv-movie-iron-man');

  await service.getMovieByTmdbId(1726);
  assert.equal(capturedUrl, '/movies/tmdb/1726');
});

test('CharacterService & FoundationService construct endpoints correctly', async () => {
  let capturedUrl = '';
  const mockClient = {
    get: async <T>(endpoint: string): Promise<T> => {
      capturedUrl = endpoint;
      return { data: [] } as unknown as T;
    },
  } as any;

  const charService = new CharacterService(mockClient);
  await charService.getCharacterByCanonicalId('mv-character-tony-stark');
  assert.equal(capturedUrl, '/characters/mv-character-tony-stark');

  const foundService = new FoundationService(mockClient);
  await foundService.getPhases();
  assert.equal(capturedUrl, '/phases');
});
