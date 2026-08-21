import {
  TmdbMovieResponse,
  TmdbTvResponse,
  TmdbCreditsResponse,
  TmdbSeasonResponse,
  RawSnapshotEnvelope,
} from '@marvelverse/shared';
import { TmdbClient } from './tmdb-client.js';
import { TmdbStorage } from './tmdb-storage.js';

export interface AcquisitionResult<T> {
  envelope: RawSnapshotEnvelope<T>;
  filePath: string;
}

export class TmdbAcquirer {
  private readonly client: TmdbClient;
  private readonly storage: TmdbStorage;

  constructor(client?: TmdbClient, storage?: TmdbStorage) {
    this.client = client ?? new TmdbClient();
    this.storage = storage ?? new TmdbStorage();
  }

  public async acquireMovie(
    movieId: number
  ): Promise<AcquisitionResult<TmdbMovieResponse>> {
    const payload = await this.client.getMovie(movieId);
    const envelope: RawSnapshotEnvelope<TmdbMovieResponse> = {
      provider: 'tmdb',
      resourceType: 'movie',
      tmdbId: movieId,
      acquiredAt: new Date().toISOString(),
      payload,
    };
    const filePath = this.storage.saveRawSnapshot(envelope);
    return { envelope, filePath };
  }

  public async acquireTvSeries(
    tvId: number
  ): Promise<AcquisitionResult<TmdbTvResponse>> {
    const payload = await this.client.getTvSeries(tvId);
    const envelope: RawSnapshotEnvelope<TmdbTvResponse> = {
      provider: 'tmdb',
      resourceType: 'tv',
      tmdbId: tvId,
      acquiredAt: new Date().toISOString(),
      payload,
    };
    const filePath = this.storage.saveRawSnapshot(envelope);
    return { envelope, filePath };
  }

  public async acquireMovieCredits(
    movieId: number
  ): Promise<AcquisitionResult<TmdbCreditsResponse>> {
    const payload = await this.client.getMovieCredits(movieId);
    const envelope: RawSnapshotEnvelope<TmdbCreditsResponse> = {
      provider: 'tmdb',
      resourceType: 'movie_credits',
      tmdbId: movieId,
      acquiredAt: new Date().toISOString(),
      payload,
    };
    const filePath = this.storage.saveRawSnapshot(envelope);
    return { envelope, filePath };
  }

  public async acquireTvCredits(
    tvId: number
  ): Promise<AcquisitionResult<TmdbCreditsResponse>> {
    const payload = await this.client.getTvCredits(tvId);
    const envelope: RawSnapshotEnvelope<TmdbCreditsResponse> = {
      provider: 'tmdb',
      resourceType: 'tv_credits',
      tmdbId: tvId,
      acquiredAt: new Date().toISOString(),
      payload,
    };
    const filePath = this.storage.saveRawSnapshot(envelope);
    return { envelope, filePath };
  }

  public async acquireTvSeason(
    tvId: number,
    seasonNumber: number
  ): Promise<AcquisitionResult<TmdbSeasonResponse>> {
    const payload = await this.client.getTvSeason(tvId, seasonNumber);
    const envelope: RawSnapshotEnvelope<TmdbSeasonResponse> = {
      provider: 'tmdb',
      resourceType: 'tv_season',
      tmdbId: tvId,
      seasonNumber,
      acquiredAt: new Date().toISOString(),
      payload,
    };
    const filePath = this.storage.saveRawSnapshot(envelope);
    return { envelope, filePath };
  }
}
