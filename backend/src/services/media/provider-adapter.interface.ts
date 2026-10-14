import { MediaAssetType, MediaSize } from '@marvelverse/shared';

/**
 * Contract for provider-specific media resolution adapters.
 * Ensures URL construction is isolated per provider (e.g., TMDB, Custom CDN).
 */
export interface MediaProviderAdapter {
  readonly providerName: string;

  /**
   * Checks if this adapter handles the specified provider key.
   */
  supports(provider: string): boolean;

  /**
   * Resolves a relative provider path into a fully qualified asset URL.
   * Returns null if the path is invalid or unresolvable.
   */
  resolveUrl(
    path: string,
    mediaType: MediaAssetType,
    size?: MediaSize
  ): string | null;

  /**
   * Returns the canonical provider attribution for assets resolved by this adapter.
   */
  getAttribution(path?: string, mediaType?: MediaAssetType): string;
}
