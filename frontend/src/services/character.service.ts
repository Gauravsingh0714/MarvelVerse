import { CanonicalCharacter, CanonicalAppearance } from '@marvelverse/shared';
import { apiClient, ApiClient } from '../api/client.js';
import { ApiSuccessResponse, ApiCollectionResponse } from '../api/types.js';

export class CharacterService {
  constructor(private client: ApiClient = apiClient) {}

  public async getCharacters(): Promise<CanonicalCharacter[]> {
    const res =
      await this.client.get<ApiCollectionResponse<CanonicalCharacter>>(
        '/characters'
      );
    return res.data;
  }

  public async getCharacterByCanonicalId(
    canonicalId: string
  ): Promise<CanonicalCharacter> {
    const res = await this.client.get<ApiSuccessResponse<CanonicalCharacter>>(
      `/characters/${encodeURIComponent(canonicalId)}`
    );
    return res.data;
  }

  public async getCharacterByTmdbId(
    tmdbId: number
  ): Promise<CanonicalCharacter> {
    const res = await this.client.get<ApiSuccessResponse<CanonicalCharacter>>(
      `/characters/tmdb/${tmdbId}`
    );
    return res.data;
  }

  public async getCharacterAppearances(
    characterId: string
  ): Promise<CanonicalAppearance[]> {
    const res = await this.client.get<
      ApiCollectionResponse<CanonicalAppearance>
    >(`/characters/${encodeURIComponent(characterId)}/appearances`);
    return res.data;
  }
}

export const characterService = new CharacterService();
