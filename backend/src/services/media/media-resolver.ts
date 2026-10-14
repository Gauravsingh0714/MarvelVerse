import {
  MediaAsset,
  MediaAssetType,
  MediaSize,
  ResolvedMediaAsset,
  MediaResolveOptions,
  CanonicalProvenance,
  MediaAspectRatio,
} from '@marvelverse/shared';
import { MediaProviderAdapter } from './provider-adapter.interface.js';
import { TmdbMediaAdapter } from './tmdb-media-adapter.js';
import { CustomCdnAdapter } from './custom-cdn-adapter.js';

export interface RawMediaInput {
  assetId?: string;
  provider: string;
  path?: string | null;
  mediaType: MediaAssetType;
  altText?: string;
  width?: number | null;
  height?: number | null;
  aspectRatio?: MediaAspectRatio;
  provenance?: CanonicalProvenance;
}

export class MediaResolver {
  private readonly adapters: MediaProviderAdapter[] = [];

  constructor(adapters?: MediaProviderAdapter[]) {
    if (adapters && adapters.length > 0) {
      this.adapters.push(...adapters);
    } else {
      this.adapters.push(new TmdbMediaAdapter(), new CustomCdnAdapter());
    }
  }

  public registerAdapter(adapter: MediaProviderAdapter): void {
    this.adapters.unshift(adapter);
  }

  public getAdapter(provider: string): MediaProviderAdapter | undefined {
    return this.adapters.find((a) => a.supports(provider));
  }

  /**
   * Authoritative resolution of any media reference into a ResolvedMediaAsset.
   */
  public resolve(
    input: RawMediaInput,
    options: MediaResolveOptions = {}
  ): ResolvedMediaAsset {
    const size: MediaSize = options.size ?? 'medium';
    const fallbackEnabled = options.fallback !== false;
    const mediaType = input.mediaType;
    const fallbackUrl = this.getFallbackUrl(mediaType);
    const assetId =
      input.assetId ||
      `mv-media-${input.provider}-${mediaType}-${input.path?.replace(/[^a-zA-Z0-9]/g, '') || 'empty'}`;

    const altText =
      options.altText ||
      input.altText ||
      `MarvelVerse ${mediaType} asset (${input.provider})`;

    // Case 1: Missing reference (null or empty path)
    if (!input.path || input.path.trim() === '') {
      return {
        assetId,
        provider: input.provider,
        mediaType,
        rawPath: null,
        resolvedUrl: fallbackEnabled ? fallbackUrl : null,
        size,
        width: input.width ?? null,
        height: input.height ?? null,
        aspectRatio: input.aspectRatio,
        altText,
        attribution: null,
        availability: 'missing',
        fallbackUrl,
        isFallback: fallbackEnabled,
        provenance: input.provenance,
      };
    }

    const adapter = this.getAdapter(input.provider);

    // Case 2: Unavailable (unsupported provider)
    if (!adapter) {
      return {
        assetId,
        provider: input.provider,
        mediaType,
        rawPath: input.path,
        resolvedUrl: fallbackEnabled ? fallbackUrl : null,
        size,
        width: input.width ?? null,
        height: input.height ?? null,
        aspectRatio: input.aspectRatio,
        altText,
        attribution: null,
        availability: 'unavailable',
        fallbackUrl,
        isFallback: fallbackEnabled,
        provenance: input.provenance,
      };
    }

    const resolved = adapter.resolveUrl(input.path, mediaType, size);

    // Case 3: Unavailable (invalid / malformed path)
    if (!resolved) {
      return {
        assetId,
        provider: input.provider,
        mediaType,
        rawPath: input.path,
        resolvedUrl: fallbackEnabled ? fallbackUrl : null,
        size,
        width: input.width ?? null,
        height: input.height ?? null,
        aspectRatio: input.aspectRatio,
        altText,
        attribution: adapter.getAttribution(input.path, mediaType),
        availability: 'unavailable',
        fallbackUrl,
        isFallback: fallbackEnabled,
        provenance: input.provenance,
      };
    }

    // Case 4: Available
    return {
      assetId,
      provider: input.provider,
      mediaType,
      rawPath: input.path,
      resolvedUrl: resolved,
      size,
      width: input.width ?? null,
      height: input.height ?? null,
      aspectRatio: input.aspectRatio,
      altText,
      attribution: adapter.getAttribution(input.path, mediaType),
      availability: 'available',
      fallbackUrl,
      isFallback: false,
      provenance: input.provenance,
    };
  }

  /**
   * Resolves a typed MediaAsset domain entity.
   */
  public resolveAsset(
    asset: MediaAsset | null | undefined,
    options: MediaResolveOptions = {}
  ): ResolvedMediaAsset {
    if (!asset) {
      return this.resolve(
        {
          assetId: 'unknown',
          provider: 'none',
          path: null,
          mediaType: 'poster',
          altText: options.altText || 'Media asset not available',
        },
        options
      );
    }

    return this.resolve(
      {
        assetId: asset.id,
        provider: asset.provider,
        path: asset.path,
        mediaType: asset.mediaType,
        altText: asset.altText,
        width: asset.width,
        height: asset.height,
        aspectRatio: asset.aspectRatio,
      },
      options
    );
  }

  /**
   * Deterministic fallback SVG URLs per media asset type.
   */
  public getFallbackUrl(mediaType: MediaAssetType): string {
    switch (mediaType) {
      case 'poster':
        return '/placeholders/poster-placeholder.svg';
      case 'backdrop':
        return '/placeholders/backdrop-placeholder.svg';
      case 'avatar':
        return '/placeholders/avatar-placeholder.svg';
      case 'still':
        return '/placeholders/still-placeholder.svg';
      default:
        return '/placeholders/generic-placeholder.svg';
    }
  }
}

let sharedResolverInstance: MediaResolver | null = null;

export function getMediaResolver(): MediaResolver {
  if (!sharedResolverInstance) {
    sharedResolverInstance = new MediaResolver();
  }
  return sharedResolverInstance;
}
