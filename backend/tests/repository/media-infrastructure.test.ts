import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MediaResolver,
  TmdbMediaAdapter,
  CustomCdnAdapter,
} from '../../src/services/media/index.js';
import { CanonicalRepository } from '../../src/services/repository/index.js';
import { MediaAsset } from '@marvelverse/shared';

test('MediaResolver: A. Valid TMDB media references across asset types and sizes', () => {
  const resolver = new MediaResolver();

  // Poster resolution
  const posterAsset: MediaAsset = {
    id: 'asset-poster-1',
    provider: 'tmdb',
    mediaType: 'poster',
    path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    altText: 'Iron Man poster',
  };

  const resolvedSmall = resolver.resolveAsset(posterAsset, { size: 'small' });
  assert.equal(resolvedSmall.availability, 'available');
  assert.equal(resolvedSmall.isFallback, false);
  assert.equal(
    resolvedSmall.resolvedUrl,
    'https://image.tmdb.org/t/p/w185/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg'
  );
  assert.equal(resolvedSmall.size, 'small');

  const resolvedLarge = resolver.resolveAsset(posterAsset, { size: 'large' });
  assert.equal(
    resolvedLarge.resolvedUrl,
    'https://image.tmdb.org/t/p/w780/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg'
  );

  const resolvedOriginal = resolver.resolveAsset(posterAsset, {
    size: 'original',
  });
  assert.equal(
    resolvedOriginal.resolvedUrl,
    'https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg'
  );

  // Backdrop resolution
  const backdropAsset: MediaAsset = {
    id: 'asset-backdrop-1',
    provider: 'tmdb',
    mediaType: 'backdrop',
    path: '/cyecB7QI070dgdaHRndioipBCPf.jpg',
    altText: 'Iron Man backdrop',
  };

  const resolvedBackdrop = resolver.resolveAsset(backdropAsset, {
    size: 'medium',
  });
  assert.equal(resolvedBackdrop.availability, 'available');
  assert.equal(
    resolvedBackdrop.resolvedUrl,
    'https://image.tmdb.org/t/p/w780/cyecB7QI070dgdaHRndioipBCPf.jpg'
  );

  // Avatar / Profile resolution
  const avatarAsset: MediaAsset = {
    id: 'asset-avatar-1',
    provider: 'tmdb',
    mediaType: 'avatar',
    path: '/1YjdSym1jM7wscwkWc600Iq54W3.jpg',
    altText: 'Tony Stark avatar',
  };

  const resolvedAvatar = resolver.resolveAsset(avatarAsset, { size: 'medium' });
  assert.equal(resolvedAvatar.availability, 'available');
  assert.equal(
    resolvedAvatar.resolvedUrl,
    'https://image.tmdb.org/t/p/w185/1YjdSym1jM7wscwkWc600Iq54W3.jpg'
  );
});

test('MediaResolver: B & C. Missing poster and missing backdrop return safe fallbacks', () => {
  const resolver = new MediaResolver();

  const missingPoster = resolver.resolve({
    assetId: 'poster-missing',
    provider: 'tmdb',
    path: null,
    mediaType: 'poster',
    altText: 'Missing poster',
  });

  assert.equal(missingPoster.availability, 'missing');
  assert.equal(missingPoster.isFallback, true);
  assert.equal(
    missingPoster.resolvedUrl,
    '/placeholders/poster-placeholder.svg'
  );
  assert.equal(
    missingPoster.fallbackUrl,
    '/placeholders/poster-placeholder.svg'
  );

  const missingBackdrop = resolver.resolve({
    assetId: 'backdrop-missing',
    provider: 'tmdb',
    path: '',
    mediaType: 'backdrop',
    altText: 'Missing backdrop',
  });

  assert.equal(missingBackdrop.availability, 'missing');
  assert.equal(missingBackdrop.isFallback, true);
  assert.equal(
    missingBackdrop.resolvedUrl,
    '/placeholders/backdrop-placeholder.svg'
  );
});

test('MediaResolver: D. Missing media asset handles null/undefined gracefully', () => {
  const resolver = new MediaResolver();

  const resolved = resolver.resolveAsset(null);
  assert.equal(resolved.availability, 'missing');
  assert.equal(resolved.isFallback, true);
  assert.equal(resolved.rawPath, null);
  assert.equal(resolved.resolvedUrl, '/placeholders/poster-placeholder.svg');
});

test('MediaResolver: E. Invalid provider / security traversal returns safe unavailable state', () => {
  const resolver = new MediaResolver();

  // Unsupported provider
  const unknownProvider = resolver.resolve({
    assetId: 'asset-unknown',
    provider: 'unknown-cdn',
    path: '/image.jpg',
    mediaType: 'poster',
    altText: 'Unknown',
  });

  assert.equal(unknownProvider.availability, 'unavailable');
  assert.equal(unknownProvider.isFallback, true);
  assert.equal(
    unknownProvider.resolvedUrl,
    '/placeholders/poster-placeholder.svg'
  );

  // Security: path traversal attempt
  const traversalAsset = resolver.resolve({
    assetId: 'asset-traversal',
    provider: 'tmdb',
    path: '/../../../etc/passwd',
    mediaType: 'poster',
    altText: 'Exploit attempt',
  });

  assert.equal(traversalAsset.availability, 'unavailable');
  assert.equal(traversalAsset.isFallback, true);

  // Security: protocol injection attempt
  const protocolInjection = resolver.resolve({
    assetId: 'asset-proto',
    provider: 'tmdb',
    path: 'https://evil.com/fake.jpg',
    mediaType: 'poster',
    altText: 'Injection attempt',
  });

  assert.equal(protocolInjection.availability, 'unavailable');
  assert.equal(protocolInjection.isFallback, true);
});

test('MediaResolver: F & G. Provider configuration supports custom TMDB and CDN base URLs', () => {
  const customTmdb = new TmdbMediaAdapter(
    'https://custom-tmdb-mirror.internal'
  );
  const customResolver = new MediaResolver([
    customTmdb,
    new CustomCdnAdapter('https://cdn.marvelverse.internal'),
  ]);

  const tmdbResolved = customResolver.resolve({
    assetId: 'custom-tmdb',
    provider: 'tmdb',
    path: '/custom.jpg',
    mediaType: 'poster',
  });

  assert.equal(
    tmdbResolved.resolvedUrl,
    'https://custom-tmdb-mirror.internal/w342/custom.jpg'
  );

  const cdnResolved = customResolver.resolve({
    assetId: 'custom-cdn',
    provider: 'custom-cdn',
    path: '/assets/banner.png',
    mediaType: 'banner',
  });

  assert.equal(
    cdnResolved.resolvedUrl,
    'https://cdn.marvelverse.internal/assets/banner.png'
  );
});

test('MediaResolver: H. Provenance preservation passes source metadata through', () => {
  const resolver = new MediaResolver();

  const provenance = {
    provider: 'tmdb',
    sourceId: 1726,
    sourceUri: 'https://www.themoviedb.org/movie/1726',
    method: 'curated-pipeline',
    acquiredAt: '2026-10-14T20:00:00.000Z',
  };

  const resolved = resolver.resolve({
    assetId: 'asset-prov',
    provider: 'tmdb',
    path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    mediaType: 'poster',
    provenance,
  });

  assert.deepEqual(resolved.provenance, provenance);
});

test('MediaRepository: I. Entity media bundle resolution and integrity validation', () => {
  const repo = new CanonicalRepository();

  // Movie media bundle
  const ironManMedia = repo.media.getMovieMedia('mv-movie-iron-man', {
    posterSize: 'large',
    backdropSize: 'original',
  });

  assert.notEqual(ironManMedia, null);
  assert.equal(ironManMedia?.entityType, 'movie');
  assert.equal(ironManMedia?.entityCanonicalId, 'mv-movie-iron-man');
  assert.equal(ironManMedia?.primaryPoster?.availability, 'available');
  assert.equal(ironManMedia?.primaryPoster?.size, 'large');
  assert.equal(
    ironManMedia?.primaryPoster?.resolvedUrl?.includes('w780'),
    true
  );
  assert.equal(ironManMedia?.primaryBackdrop?.availability, 'available');
  assert.equal(ironManMedia?.primaryBackdrop?.size, 'original');
  assert.equal(
    ironManMedia?.primaryBackdrop?.resolvedUrl?.includes('original'),
    true
  );

  // Series media bundle
  const lokiMedia = repo.media.getSeriesMedia('mv-series-loki');
  assert.notEqual(lokiMedia, null);
  assert.equal(lokiMedia?.entityType, 'series');
  assert.equal(lokiMedia?.primaryPoster?.availability, 'available');
  assert.equal(lokiMedia?.primaryBackdrop?.availability, 'available');

  // Character media bundle
  const tonyMedia = repo.media.getCharacterMedia('mv-character-tony-stark');
  assert.notEqual(tonyMedia, null);
  assert.equal(tonyMedia?.entityType, 'character');
  assert.equal(tonyMedia?.primaryAvatar?.availability, 'missing');
  assert.equal(tonyMedia?.primaryAvatar?.isFallback, true);

  // Unknown entity returns null
  assert.equal(repo.media.getMovieMedia('mv-non-existent'), null);
  assert.equal(repo.media.getSeriesMedia('mv-non-existent'), null);
  assert.equal(repo.media.getCharacterMedia('mv-character-non-existent'), null);

  // Media integrity audit
  const audit = repo.media.validateMediaIntegrity();
  assert.equal(audit.isValid, true);
  assert.equal(audit.errors.length, 0);
  assert.equal(audit.totalChecked >= 15, true);
  assert.equal(audit.availableCount >= 10, true);
});

test('CanonicalRepository: K. Existing canonical entities continue to load with 100% integrity', () => {
  const repo = new CanonicalRepository();

  const universes = repo.foundation.getUniverses();
  const sagas = repo.foundation.getSagas();
  const phases = repo.foundation.getPhases();
  const movies = repo.movies.getMovies();
  const characters = repo.characters.getCharacters();
  const appearances = repo.relationships.getAppearances();

  assert.equal(universes.length, 4);
  assert.equal(sagas.length, 2);
  assert.equal(phases.length, 6);
  assert.equal(movies.length, 42);
  assert.equal(characters.length, 35);
  assert.equal(appearances.length, 134);

  // Verify that movies still contain valid posterPath / backdropPath
  for (const movie of movies) {
    assert.equal(typeof movie.title, 'string');
    assert.equal(
      typeof movie.posterPath === 'string' || movie.posterPath === null,
      true
    );
  }
});
