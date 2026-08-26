import { CanonicalAppearance } from '@marvelverse/shared';
import { apiClient, ApiClient } from '../api/client.js';
import { ApiSuccessResponse, ApiCollectionResponse } from '../api/types.js';

export class AppearanceService {
  constructor(private client: ApiClient = apiClient) {}

  public async getAppearances(): Promise<CanonicalAppearance[]> {
    const res =
      await this.client.get<ApiCollectionResponse<CanonicalAppearance>>(
        '/appearances'
      );
    return res.data;
  }

  public async getAppearanceByCanonicalId(
    canonicalId: string
  ): Promise<CanonicalAppearance> {
    const res = await this.client.get<ApiSuccessResponse<CanonicalAppearance>>(
      `/appearances/${encodeURIComponent(canonicalId)}`
    );
    return res.data;
  }
}

export const appearanceService = new AppearanceService();
