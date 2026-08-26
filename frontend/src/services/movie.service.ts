import { CanonicalMovie, CanonicalAppearance } from '@marvelverse/shared';
import { apiClient, ApiClient } from '../api/client.js';
import { ApiSuccessResponse, ApiCollectionResponse } from '../api/types.js';

export interface MovieFilters {
  universeId?: string;
  sagaId?: string;
  phaseId?: string;
  sort?: 'releaseOrder';
}

export class MovieService {
  constructor(private client: ApiClient = apiClient) {}

  public async getMovies(
    filters: MovieFilters = {}
  ): Promise<CanonicalMovie[]> {
    const params = new URLSearchParams();
    if (filters.universeId) params.append('universeId', filters.universeId);
    if (filters.sagaId) params.append('sagaId', filters.sagaId);
    if (filters.phaseId) params.append('phaseId', filters.phaseId);
    if (filters.sort) params.append('sort', filters.sort);

    const queryString = params.toString();
    const endpoint = queryString ? `/movies?${queryString}` : '/movies';

    const res =
      await this.client.get<ApiCollectionResponse<CanonicalMovie>>(endpoint);
    return res.data;
  }

  public async getMovieByCanonicalId(
    canonicalId: string
  ): Promise<CanonicalMovie> {
    const res = await this.client.get<ApiSuccessResponse<CanonicalMovie>>(
      `/movies/${encodeURIComponent(canonicalId)}`
    );
    return res.data;
  }

  public async getMovieByTmdbId(tmdbId: number): Promise<CanonicalMovie> {
    const res = await this.client.get<ApiSuccessResponse<CanonicalMovie>>(
      `/movies/tmdb/${tmdbId}`
    );
    return res.data;
  }

  public async getMovieAppearances(
    movieId: string
  ): Promise<CanonicalAppearance[]> {
    const res = await this.client.get<
      ApiCollectionResponse<CanonicalAppearance>
    >(`/movies/${encodeURIComponent(movieId)}/appearances`);
    return res.data;
  }
}

export const movieService = new MovieService();
