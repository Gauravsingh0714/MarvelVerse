import { WatchGuideEntry, RoadToDoomsdayTier } from '@marvelverse/shared';
import { apiClient, ApiClient } from '../api/client.js';
import { ApiCollectionResponse } from '../api/types.js';

export interface DoomsdayFilters {
  tier?: RoadToDoomsdayTier;
}

export class CuratedService {
  constructor(private client: ApiClient = apiClient) {}

  public async getRoadToDoomsday(
    filters: DoomsdayFilters = {}
  ): Promise<WatchGuideEntry[]> {
    const params = new URLSearchParams();
    if (filters.tier) params.append('tier', filters.tier);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/curated/doomsday?${queryString}`
      : '/curated/doomsday';

    const res =
      await this.client.get<ApiCollectionResponse<WatchGuideEntry>>(endpoint);
    return res.data;
  }
}

export const curatedService = new CuratedService();
