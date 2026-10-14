import { MediaAssetType, MediaSize } from '@marvelverse/shared';
import { MediaProviderAdapter } from './provider-adapter.interface.js';

export interface CustomCdnAdapterOptions {
  cdnBaseUrl?: string;
}

export class CustomCdnAdapter implements MediaProviderAdapter {
  public readonly providerName = 'custom-cdn';
  private readonly cdnBaseUrl: string;

  constructor(options: CustomCdnAdapterOptions | string = {}) {
    const envBase = process.env.MEDIA_CDN_BASE_URL;
    const baseCandidate =
      typeof options === 'string' ? options : options.cdnBaseUrl;
    this.cdnBaseUrl = (baseCandidate || envBase || '/assets/media').replace(
      /\/+$/,
      ''
    );
  }

  public supports(provider: string): boolean {
    const p = provider.toLowerCase();
    return p === 'custom-cdn' || p === 'local' || p === 'internal';
  }

  public resolveUrl(
    rawPath: string,
    _mediaType: MediaAssetType,
    _size: MediaSize = 'medium'
  ): string | null {
    if (!rawPath || typeof rawPath !== 'string') return null;

    const trimmed = rawPath.trim();
    if (!trimmed) return null;

    // Security sanitization: block path traversal and protocol injection
    if (
      trimmed.includes('..') ||
      trimmed.includes('://') ||
      trimmed.startsWith('//') ||
      /[\0\r\n\t]/.test(trimmed)
    ) {
      return null;
    }

    const cleanPath = trimmed.replace(/^\/+/, '');
    if (!/^[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+$/.test(cleanPath)) {
      return null;
    }

    return `${this.cdnBaseUrl}/${cleanPath}`;
  }

  public getAttribution(_path?: string, _mediaType?: MediaAssetType): string {
    return 'MarvelVerse Canonical Media Archive';
  }
}
