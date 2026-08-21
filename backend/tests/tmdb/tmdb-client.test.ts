import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeSecrets,
  TmdbClientError,
} from '../../src/services/tmdb/tmdb-client.js';

test('TmdbClient sanitizeSecrets replaces tokens with [REDACTED_SECRET]', () => {
  const secretToken = 'mock_bearer_token_xyz_123456789';
  const secretKey = 'mock_secret_api_key_123456789';
  const rawErrorMessage = `Failed to connect with Bearer ${secretToken} and api_key=${secretKey}`;

  const sanitized = sanitizeSecrets(rawErrorMessage, [secretToken, secretKey]);

  assert.equal(sanitized.includes(secretToken), false);
  assert.equal(sanitized.includes(secretKey), false);
  assert.equal(
    sanitized,
    'Failed to connect with Bearer [REDACTED_SECRET] and api_key=[REDACTED_SECRET]'
  );
});

test('TmdbClientError preserves status and resource properties', () => {
  const err = new TmdbClientError('Resource not found', 404, '/movie/999999');
  assert.equal(err.name, 'TmdbClientError');
  assert.equal(err.status, 404);
  assert.equal(err.resource, '/movie/999999');
  assert.equal(err.message, 'Resource not found');
});
