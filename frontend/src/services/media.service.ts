import {
  EntityMediaBundle,
  ResolvedMediaAsset,
  MediaProvider,
  MediaAssetKind,
  MediaSize,
} from '@marvelverse/shared';
import { apiClient, ApiClient } from '../api/client.js';
import { ApiSuccessResponse } from '../api/types.js';

export interface MediaResolveQuery {
  provider: MediaProvider;
  path: string;
  kind?: MediaAssetKind;
  size?: MediaSize;
  altText?: string;
}

export interface EntityMediaOptions {
  posterSize?: MediaSize;
  backdropSize?: MediaSize;
  avatarSize?: MediaSize;
}

export class MediaService {
  constructor(private client: ApiClient = apiClient) {}

  public async resolveMedia(
    query: MediaResolveQuery
  ): Promise<ResolvedMediaAsset> {
    const params = new URLSearchParams();
    params.append('provider', query.provider);
    params.append('path', query.path);
    if (query.kind) params.append('kind', query.kind);
    if (query.size) params.append('size', query.size);
    if (query.altText) params.append('altText', query.altText);

    const res = await this.client.get<ApiSuccessResponse<ResolvedMediaAsset>>(
      `/media/resolve?${params.toString()}`
    );
    return res.data;
  }

  public async getMovieMedia(
    canonicalId: string,
    options: EntityMediaOptions = {}
  ): Promise<EntityMediaBundle> {
    const params = new URLSearchParams();
    if (options.posterSize) params.append('posterSize', options.posterSize);
    if (options.backdropSize)
      params.append('backdropSize', options.backdropSize);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/media/movies/${encodeURIComponent(canonicalId)}?${queryString}`
      : `/media/movies/${encodeURIComponent(canonicalId)}`;

    const res =
      await this.client.get<ApiSuccessResponse<EntityMediaBundle>>(endpoint);
    return res.data;
  }

  public async getSeriesMedia(
    canonicalId: string,
    options: EntityMediaOptions = {}
  ): Promise<EntityMediaBundle> {
    const params = new URLSearchParams();
    if (options.posterSize) params.append('posterSize', options.posterSize);
    if (options.backdropSize)
      params.append('backdropSize', options.backdropSize);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/media/series/${encodeURIComponent(canonicalId)}?${queryString}`
      : `/media/series/${encodeURIComponent(canonicalId)}`;

    const res =
      await this.client.get<ApiSuccessResponse<EntityMediaBundle>>(endpoint);
    return res.data;
  }

  public async getCharacterMedia(
    canonicalId: string,
    options: EntityMediaOptions = {}
  ): Promise<EntityMediaBundle> {
    const params = new URLSearchParams();
    if (options.avatarSize) params.append('avatarSize', options.avatarSize);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/media/characters/${encodeURIComponent(canonicalId)}?${queryString}`
      : `/media/characters/${encodeURIComponent(canonicalId)}`;

    const res =
      await this.client.get<ApiSuccessResponse<EntityMediaBundle>>(endpoint);
    return res.data;
  }
}

export const mediaService = new MediaService();
