import { CanonicalTvSeries, CanonicalSeason } from '@marvelverse/shared';
import { apiClient, ApiClient } from '../api/client.js';
import { ApiSuccessResponse, ApiCollectionResponse } from '../api/types.js';

export interface SeriesFilters {
  universeId?: string;
  sagaId?: string;
  phaseId?: string;
  sort?: 'title' | 'firstAirDate';
}

export class SeriesService {
  constructor(private client: ApiClient = apiClient) {}

  public async getSeries(
    filters: SeriesFilters = {}
  ): Promise<CanonicalTvSeries[]> {
    const params = new URLSearchParams();
    if (filters.universeId) params.append('universeId', filters.universeId);
    if (filters.sagaId) params.append('sagaId', filters.sagaId);
    if (filters.phaseId) params.append('phaseId', filters.phaseId);
    if (filters.sort) params.append('sort', filters.sort);

    const queryString = params.toString();
    const endpoint = queryString ? `/series?${queryString}` : '/series';

    const res =
      await this.client.get<ApiCollectionResponse<CanonicalTvSeries>>(endpoint);
    return res.data;
  }

  public async getSeriesById(
    canonicalId: string
  ): Promise<CanonicalTvSeries & { seasons?: CanonicalSeason[] }> {
    const res = await this.client.get<
      ApiSuccessResponse<CanonicalTvSeries & { seasons?: CanonicalSeason[] }>
    >(`/series/${encodeURIComponent(canonicalId)}`);
    return res.data;
  }
}

export const seriesService = new SeriesService();
