import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MediaImage } from '../src/components/ui/MediaImage/MediaImage.js';
import { Avatar } from '../src/components/ui/Avatar/Avatar.js';
import { queryKeys } from '../src/hooks/queryKeys.js';
import { EntityMediaBundle } from '@marvelverse/shared';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

test('Media UI 1 & 2: Movie poster renders when media exists with meaningful alt text', () => {
  const queryClient = createTestQueryClient();

  const mockMovieBundle: EntityMediaBundle = {
    entityType: 'movie',
    entityCanonicalId: 'mv-movie-iron-man',
    primaryPoster: {
      assetId: 'mv-media-poster-mv-movie-iron-man',
      provider: 'tmdb',
      mediaType: 'poster',
      rawPath: '/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
      resolvedUrl:
        'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
      size: 'medium',
      altText: 'Iron Man official poster',
      availability: 'available',
      fallbackUrl: '/placeholders/poster-placeholder.svg',
      isFallback: false,
    },
    primaryBackdrop: null,
    assets: [],
  };

  queryClient.setQueryData(
    queryKeys.media.movie('mv-movie-iron-man', { posterSize: 'medium' }),
    mockMovieBundle
  );

  const html = renderToString(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(MediaImage, {
        canonicalId: 'mv-movie-iron-man',
        entityType: 'movie',
        mediaKind: 'poster',
        alt: 'Poster for Iron Man',
        aspectRatio: 'poster',
      })
    )
  );

  assert.equal(
    html.includes(
      'src="https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg"'
    ),
    true
  );
  assert.equal(html.includes('alt="Poster for Iron Man"'), true);
  assert.equal(html.includes('aria-label="Poster for Iron Man"'), true);
  assert.equal(html.includes('aspect-[2/3]'), true);
});

test('Media UI 3: Movie missing media renders fallback view without broken image', () => {
  const queryClient = createTestQueryClient();

  const mockMissingBundle: EntityMediaBundle = {
    entityType: 'movie',
    entityCanonicalId: 'mv-movie-missing',
    primaryPoster: {
      assetId: 'mv-media-poster-missing',
      provider: 'tmdb',
      mediaType: 'poster',
      rawPath: null,
      resolvedUrl: '/placeholders/poster-placeholder.svg',
      size: 'medium',
      altText: 'Missing poster',
      availability: 'missing',
      fallbackUrl: '/placeholders/poster-placeholder.svg',
      isFallback: true,
    },
    primaryBackdrop: null,
    assets: [],
  };

  queryClient.setQueryData(
    queryKeys.media.movie('mv-movie-missing', { posterSize: 'medium' }),
    mockMissingBundle
  );

  const html = renderToString(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(MediaImage, {
        canonicalId: 'mv-movie-missing',
        entityType: 'movie',
        mediaKind: 'poster',
        alt: 'Poster for Missing Movie',
        fallbackText: 'Missing Movie Title',
      })
    )
  );

  // Does not render broken <img>
  assert.equal(html.includes('<img'), false);
  // Renders accessible container with fallback text and aria-label
  assert.equal(html.includes('aria-label="Poster for Missing Movie"'), true);
  assert.equal(html.includes('Missing Movie Title'), true);
});

test('Media UI 4 & 9: Media component does not break when media/src is null and renders fallback', () => {
  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(MediaImage, {
        src: null,
        alt: 'Null Media Reference',
        fallbackText: 'Media Unavailable',
      })
    );
  });

  assert.equal(html.includes('<img'), false);
  assert.equal(html.includes('Media Unavailable'), true);
  assert.equal(html.includes('aria-label="Null Media Reference"'), true);
});

test('Media UI 5: Movie detail backdrop renders correctly with large size', () => {
  const queryClient = createTestQueryClient();

  const mockMovieBundle: EntityMediaBundle = {
    entityType: 'movie',
    entityCanonicalId: 'mv-movie-iron-man',
    primaryPoster: null,
    primaryBackdrop: {
      assetId: 'mv-media-backdrop-mv-movie-iron-man',
      provider: 'tmdb',
      mediaType: 'backdrop',
      rawPath: '/cKvDv2LpwVEqbdXWoQl4XgGN6le.jpg',
      resolvedUrl:
        'https://image.tmdb.org/t/p/w1280/cKvDv2LpwVEqbdXWoQl4XgGN6le.jpg',
      size: 'large',
      altText: 'Iron Man official backdrop',
      availability: 'available',
      fallbackUrl: '/placeholders/backdrop-placeholder.svg',
      isFallback: false,
    },
    assets: [],
  };

  queryClient.setQueryData(
    queryKeys.media.movie('mv-movie-iron-man', { backdropSize: 'large' }),
    mockMovieBundle
  );

  const html = renderToString(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(MediaImage, {
        canonicalId: 'mv-movie-iron-man',
        entityType: 'movie',
        mediaKind: 'backdrop',
        size: 'large',
        alt: 'Backdrop for Iron Man',
        aspectRatio: 'backdrop',
      })
    )
  );

  assert.equal(
    html.includes(
      'src="https://image.tmdb.org/t/p/w1280/cKvDv2LpwVEqbdXWoQl4XgGN6le.jpg"'
    ),
    true
  );
  assert.equal(html.includes('alt="Backdrop for Iron Man"'), true);
  assert.equal(html.includes('aspect-[16/9]'), true);
});

test('Media UI 6: Character avatar renders when canonical avatar exists', () => {
  const queryClient = createTestQueryClient();

  const mockCharBundle: EntityMediaBundle = {
    entityType: 'character',
    entityCanonicalId: 'mv-character-tony-stark',
    primaryAvatar: {
      assetId: 'mv-media-avatar-mv-character-tony-stark',
      provider: 'tmdb',
      mediaType: 'avatar',
      rawPath: '/tony.jpg',
      resolvedUrl: 'https://image.tmdb.org/t/p/w185/tony.jpg',
      size: 'medium',
      altText: 'Tony Stark portrait',
      availability: 'available',
      fallbackUrl: '/placeholders/avatar-placeholder.svg',
      isFallback: false,
    },
    assets: [],
  };

  queryClient.setQueryData(
    queryKeys.media.character('mv-character-tony-stark', {}),
    mockCharBundle
  );

  const html = renderToString(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(Avatar, {
        canonicalId: 'mv-character-tony-stark',
        name: 'Tony Stark',
        size: 'md',
      })
    )
  );

  assert.equal(
    html.includes('src="https://image.tmdb.org/t/p/w185/tony.jpg"'),
    true
  );
  assert.equal(html.includes('alt="Portrait of Tony Stark"'), true);
});

test('Media UI 7: Character missing avatar renders textual initials fallback', () => {
  const queryClient = createTestQueryClient();

  const mockCharMissingBundle: EntityMediaBundle = {
    entityType: 'character',
    entityCanonicalId: 'mv-character-tony-stark',
    primaryAvatar: {
      assetId: 'mv-media-avatar-mv-character-tony-stark',
      provider: 'tmdb',
      mediaType: 'avatar',
      rawPath: null,
      resolvedUrl: '/placeholders/avatar-placeholder.svg',
      size: 'medium',
      altText: 'Tony Stark avatar',
      availability: 'missing',
      fallbackUrl: '/placeholders/avatar-placeholder.svg',
      isFallback: true,
    },
    assets: [],
  };

  queryClient.setQueryData(
    queryKeys.media.character('mv-character-tony-stark', {}),
    mockCharMissingBundle
  );

  const html = renderToString(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(Avatar, {
        canonicalId: 'mv-character-tony-stark',
        name: 'Tony Stark',
        size: 'md',
      })
    )
  );

  // Image tag is not rendered
  assert.equal(html.includes('<img'), false);
  // Textual initials "TS" are preserved
  assert.equal(html.includes('<span>TS</span>'), true);
  assert.equal(html.includes('aria-label="Portrait of Tony Stark"'), true);
});

test('Media UI 8: BaseAvatar renders purely without QueryClientProvider when no canonicalId is given', () => {
  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(
      React.createElement(Avatar, {
        name: 'Steve Rogers',
        size: 'lg',
      })
    );
  });

  assert.equal(html.includes('<span>SR</span>'), true);
  assert.equal(html.includes('aria-label="Portrait of Steve Rogers"'), true);
});

test('Media UI 10: Reduced-motion behavior remains intact in MediaImage and card classes', () => {
  const html = renderToString(
    React.createElement(MediaImage, {
      src: 'https://example.com/test.jpg',
      alt: 'Test Reduced Motion',
    })
  );

  assert.equal(html.includes('motion-reduce:transition-none'), true);
});
