import { MediaAssetType, MediaSize } from '@marvelverse/shared';
import { MediaProviderAdapter } from './provider-adapter.interface.js';

export interface TmdbMediaAdapterOptions {
  imageBaseUrl?: string;
}

export class TmdbMediaAdapter implements MediaProviderAdapter {
  public readonly providerName = 'tmdb';
  private readonly imageBaseUrl: string;

  constructor(options: TmdbMediaAdapterOptions | string = {}) {
    const envBase = process.env.TMDB_IMAGE_BASE_URL;
    const baseCandidate =
      typeof options === 'string' ? options : options.imageBaseUrl;
    this.imageBaseUrl = (
      baseCandidate ||
      envBase ||
      'https://image.tmdb.org/t/p'
    ).replace(/\/+$/, '');
  }

  public supports(provider: string): boolean {
    return provider.toLowerCase() === 'tmdb';
  }

  public resolveUrl(
    rawPath: string,
    mediaType: MediaAssetType,
    size: MediaSize = 'medium'
  ): string | null {
    if (!rawPath || typeof rawPath !== 'string') return null;

    const trimmed = rawPath.trim();
    if (!trimmed) return null;

    // Security sanitization: block path traversal, protocol injection, and control characters
    if (
      trimmed.includes('..') ||
      trimmed.includes('://') ||
      trimmed.startsWith('//') ||
      /[\0\r\n\t]/.test(trimmed)
    ) {
      return null;
    }

    const cleanPath = trimmed.replace(/^\/+/, '');
    // Ensure clean alphanumeric/hyphen/underscore path with typical image extension
    if (!/^[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+$/.test(cleanPath)) {
      return null;
    }

    const dimension = this.mapDimension(mediaType, size);
    return `${this.imageBaseUrl}/${dimension}/${cleanPath}`;
  }

  public getAttribution(_path?: string, _mediaType?: MediaAssetType): string {
    return 'The Movie Database (TMDB)';
  }

  private mapDimension(mediaType: MediaAssetType, size: MediaSize): string {
    switch (mediaType) {
      case 'poster':
        switch (size) {
          case 'small':
            return 'w185';
          case 'medium':
            return 'w342';
          case 'large':
            return 'w780';
          case 'original':
            return 'original';
        }
        break;

      case 'backdrop':
        switch (size) {
          case 'small':
            return 'w300';
          case 'medium':
            return 'w780';
          case 'large':
            return 'w1280';
          case 'original':
            return 'original';
        }
        break;

      case 'avatar':
        switch (size) {
          case 'small':
            return 'w45';
          case 'medium':
            return 'w185';
          case 'large':
            return 'h632';
          case 'original':
            return 'original';
        }
        break;

      case 'still':
        switch (size) {
          case 'small':
            return 'w185';
          case 'medium':
            return 'w300';
          case 'large':
          case 'original':
            return 'original';
        }
        break;

      default:
        switch (size) {
          case 'small':
            return 'w185';
          case 'medium':
            return 'w500';
          case 'large':
          case 'original':
            return 'original';
        }
    }
  }
}
