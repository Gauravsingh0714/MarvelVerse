import {
  CanonicalUniverse,
  CanonicalSaga,
  CanonicalPhase,
} from '@marvelverse/shared';
import { apiClient, ApiClient } from '../api/client.js';
import { ApiSuccessResponse, ApiCollectionResponse } from '../api/types.js';

export class FoundationService {
  constructor(private client: ApiClient = apiClient) {}

  public async getUniverses(): Promise<CanonicalUniverse[]> {
    const res =
      await this.client.get<ApiCollectionResponse<CanonicalUniverse>>(
        '/universes'
      );
    return res.data;
  }

  public async getUniverseById(universeId: string): Promise<CanonicalUniverse> {
    const res = await this.client.get<ApiSuccessResponse<CanonicalUniverse>>(
      `/universes/${encodeURIComponent(universeId)}`
    );
    return res.data;
  }

  public async getSagas(): Promise<CanonicalSaga[]> {
    const res =
      await this.client.get<ApiCollectionResponse<CanonicalSaga>>('/sagas');
    return res.data;
  }

  public async getSagaById(sagaId: string): Promise<CanonicalSaga> {
    const res = await this.client.get<ApiSuccessResponse<CanonicalSaga>>(
      `/sagas/${encodeURIComponent(sagaId)}`
    );
    return res.data;
  }

  public async getPhases(): Promise<CanonicalPhase[]> {
    const res =
      await this.client.get<ApiCollectionResponse<CanonicalPhase>>('/phases');
    return res.data;
  }

  public async getPhaseById(phaseId: string): Promise<CanonicalPhase> {
    const res = await this.client.get<ApiSuccessResponse<CanonicalPhase>>(
      `/phases/${encodeURIComponent(phaseId)}`
    );
    return res.data;
  }
}

export const foundationService = new FoundationService();
