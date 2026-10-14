import {
  MediaAsset,
  MediaAssetType,
  MediaSize,
  ResolvedMediaAsset,
  EntityMediaBundle,
  MediaResolveOptions,
} from '@marvelverse/shared';
import { CanonicalDataLoader } from './canonical-data-loader.js';
import { CanonicalCache } from './canonical-cache.js';
import { MediaResolver, getMediaResolver } from '../media/index.js';

export interface MediaIntegrityReport {
  isValid: boolean;
  totalChecked: number;
  availableCount: number;
  missingCount: number;
  unavailableCount: number;
  errors: string[];
}

export class MediaRepository {
  public readonly resolver: MediaResolver;

  constructor(
    private readonly loader: CanonicalDataLoader,
    private readonly cache: CanonicalCache,
    resolver?: MediaResolver
  ) {
    this.resolver = resolver ?? getMediaResolver();
  }

  private getMovies() {
    return this.cache.getOrLoad('movies', () => this.loader.loadMovies());
  }

  private getSeries() {
    return this.cache.getOrLoad('tv-series', () => this.loader.loadTvSeries());
  }

  private getCharacters() {
    return this.cache.getOrLoad('characters', () =>
      this.loader.loadCharacters()
    );
  }

  /**
   * Resolves media bundle for a movie by canonicalId.
   */
  public getMovieMedia(
    movieId: string,
    options: MediaResolveOptions & {
      posterSize?: MediaSize;
      backdropSize?: MediaSize;
    } = {}
  ): EntityMediaBundle | null {
    const movies = this.getMovies();
    const movie = movies.find((m) => m.canonicalId === movieId);
    if (!movie) return null;

    const provider = movie.provenance?.provider || 'tmdb';
    const assets: ResolvedMediaAsset[] = [];

    const posterOpts: MediaResolveOptions = {
      ...options,
      size: options.posterSize ?? options.size,
    };
    const backdropOpts: MediaResolveOptions = {
      ...options,
      size: options.backdropSize ?? options.size,
    };

    // Resolve primary poster
    const primaryPoster = movie.poster
      ? this.resolver.resolveAsset(movie.poster, posterOpts)
      : this.resolver.resolve(
          {
            assetId: `mv-media-poster-${movie.canonicalId}`,
            provider,
            path: movie.posterPath,
            mediaType: 'poster',
            altText: `${movie.title} official poster`,
            provenance: movie.provenance,
          },
          posterOpts
        );
    assets.push(primaryPoster);

    // Resolve primary backdrop
    const primaryBackdrop = movie.backdrop
      ? this.resolver.resolveAsset(movie.backdrop, backdropOpts)
      : this.resolver.resolve(
          {
            assetId: `mv-media-backdrop-${movie.canonicalId}`,
            provider,
            path: movie.backdropPath,
            mediaType: 'backdrop',
            altText: `${movie.title} official backdrop`,
            provenance: movie.provenance,
          },
          backdropOpts
        );
    assets.push(primaryBackdrop);

    return {
      entityType: 'movie',
      entityCanonicalId: movie.canonicalId,
      primaryPoster,
      primaryBackdrop,
      assets,
    };
  }

  /**
   * Resolves media bundle for a TV series by canonicalId.
   */
  public getSeriesMedia(
    seriesId: string,
    options: MediaResolveOptions & {
      posterSize?: MediaSize;
      backdropSize?: MediaSize;
    } = {}
  ): EntityMediaBundle | null {
    const seriesList = this.getSeries();
    const series = seriesList.find((s) => s.canonicalId === seriesId);
    if (!series) return null;

    const provider = series.provenance?.provider || 'tmdb';
    const assets: ResolvedMediaAsset[] = [];

    const posterOpts: MediaResolveOptions = {
      ...options,
      size: options.posterSize ?? options.size,
    };
    const backdropOpts: MediaResolveOptions = {
      ...options,
      size: options.backdropSize ?? options.size,
    };

    // Resolve primary poster
    const primaryPoster = series.poster
      ? this.resolver.resolveAsset(series.poster, posterOpts)
      : this.resolver.resolve(
          {
            assetId: `mv-media-poster-${series.canonicalId}`,
            provider,
            path: series.posterPath,
            mediaType: 'poster',
            altText: `${series.title} official poster`,
            provenance: series.provenance,
          },
          posterOpts
        );
    assets.push(primaryPoster);

    // Resolve primary backdrop
    const primaryBackdrop = series.backdrop
      ? this.resolver.resolveAsset(series.backdrop, backdropOpts)
      : this.resolver.resolve(
          {
            assetId: `mv-media-backdrop-${series.canonicalId}`,
            provider,
            path: series.backdropPath,
            mediaType: 'backdrop',
            altText: `${series.title} official backdrop`,
            provenance: series.provenance,
          },
          backdropOpts
        );
    assets.push(primaryBackdrop);

    return {
      entityType: 'series',
      entityCanonicalId: series.canonicalId,
      primaryPoster,
      primaryBackdrop,
      assets,
    };
  }

  /**
   * Resolves media bundle for a character by canonicalId.
   */
  public getCharacterMedia(
    characterId: string,
    options: MediaResolveOptions & { avatarSize?: MediaSize } = {}
  ): EntityMediaBundle | null {
    const characters = this.getCharacters();
    const character = characters.find((c) => c.canonicalId === characterId);
    if (!character) return null;

    const assets: ResolvedMediaAsset[] = [];
    const avatarOpts: MediaResolveOptions = {
      ...options,
      size: options.avatarSize ?? options.size,
    };

    const primaryAvatar = character.avatar
      ? this.resolver.resolveAsset(character.avatar, avatarOpts)
      : this.resolver.resolve(
          {
            assetId: `mv-media-avatar-${character.canonicalId}`,
            provider: character.provenance?.provider || 'tmdb',
            path: null,
            mediaType: 'avatar',
            altText: `${character.name} avatar`,
            provenance: character.provenance,
          },
          avatarOpts
        );
    assets.push(primaryAvatar);

    return {
      entityType: 'character',
      entityCanonicalId: character.canonicalId,
      primaryAvatar,
      assets,
    };
  }

  /**
   * Resolves a single MediaAsset entity directly.
   */
  public resolveAsset(
    asset: MediaAsset,
    options: MediaResolveOptions = {}
  ): ResolvedMediaAsset {
    return this.resolver.resolveAsset(asset, options);
  }

  /**
   * Resolves raw provider and path parameters into a ResolvedMediaAsset.
   */
  public resolveRaw(
    provider: string,
    path: string | null | undefined,
    mediaType: MediaAssetType,
    options: MediaResolveOptions = {}
  ): ResolvedMediaAsset {
    return this.resolver.resolve(
      {
        provider,
        path,
        mediaType,
      },
      options
    );
  }

  /**
   * Audits all media references in the canonical repository.
   */
  public validateMediaIntegrity(): MediaIntegrityReport {
    const errors: string[] = [];
    let availableCount = 0;
    let missingCount = 0;
    let unavailableCount = 0;

    const movies = this.loader.loadMovies();
    for (const m of movies) {
      const bundle = this.getMovieMedia(m.canonicalId, { fallback: false });
      if (!bundle) continue;

      for (const asset of bundle.assets) {
        if (asset.availability === 'available') {
          availableCount++;
        } else if (asset.availability === 'missing') {
          missingCount++;
        } else {
          unavailableCount++;
          errors.push(
            `Movie [${m.canonicalId}] has unavailable media asset ${asset.mediaType}: path="${asset.rawPath}"`
          );
        }
      }
    }

    const seriesList = this.loader.loadTvSeries();
    for (const s of seriesList) {
      const bundle = this.getSeriesMedia(s.canonicalId, { fallback: false });
      if (!bundle) continue;

      for (const asset of bundle.assets) {
        if (asset.availability === 'available') {
          availableCount++;
        } else if (asset.availability === 'missing') {
          missingCount++;
        } else {
          unavailableCount++;
          errors.push(
            `Series [${s.canonicalId}] has unavailable media asset ${asset.mediaType}: path="${asset.rawPath}"`
          );
        }
      }
    }

    const totalChecked = availableCount + missingCount + unavailableCount;

    return {
      isValid: errors.length === 0,
      totalChecked,
      availableCount,
      missingCount,
      unavailableCount,
      errors,
    };
  }
}
