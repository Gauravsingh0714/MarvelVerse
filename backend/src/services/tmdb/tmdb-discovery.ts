import { TmdbSearchMovieResult, TmdbSearchTvResult } from '@marvelverse/shared';
import { TmdbClient } from './tmdb-client.js';

export interface DiscoveredCandidateItem {
  id: number;
  mediaType: 'movie' | 'tv';
  titleOrName: string;
  originalTitleOrName: string;
  releaseOrAirDate: string | null;
  overview: string;
  posterPath: string | null;
  popularity: number;
}

export interface DiscoverySearchResult {
  query: string;
  mediaType: 'movie' | 'tv';
  page: number;
  totalPages: number;
  totalResults: number;
  candidates: DiscoveredCandidateItem[];
}

export class TmdbDiscovery {
  private readonly client: TmdbClient;

  constructor(client?: TmdbClient) {
    this.client = client ?? new TmdbClient();
  }

  public async discoverMovies(
    query: string,
    page = 1
  ): Promise<DiscoverySearchResult> {
    const response = await this.client.searchMovies(query, page);
    const candidates: DiscoveredCandidateItem[] = (response.results || []).map(
      (item: TmdbSearchMovieResult) => ({
        id: item.id,
        mediaType: 'movie',
        titleOrName: item.title || '',
        originalTitleOrName: item.original_title || '',
        releaseOrAirDate: item.release_date ? item.release_date : null,
        overview: item.overview || '',
        posterPath: item.poster_path || null,
        popularity: item.popularity || 0,
      })
    );

    return {
      query,
      mediaType: 'movie',
      page: response.page || page,
      totalPages: response.total_pages || 1,
      totalResults: response.total_results || candidates.length,
      candidates,
    };
  }

  public async discoverTvSeries(
    query: string,
    page = 1
  ): Promise<DiscoverySearchResult> {
    const response = await this.client.searchTvSeries(query, page);
    const candidates: DiscoveredCandidateItem[] = (response.results || []).map(
      (item: TmdbSearchTvResult) => ({
        id: item.id,
        mediaType: 'tv',
        titleOrName: item.name || '',
        originalTitleOrName: item.original_name || '',
        releaseOrAirDate: item.first_air_date ? item.first_air_date : null,
        overview: item.overview || '',
        posterPath: item.poster_path || null,
        popularity: item.popularity || 0,
      })
    );

    return {
      query,
      mediaType: 'tv',
      page: response.page || page,
      totalPages: response.total_pages || 1,
      totalResults: response.total_results || candidates.length,
      candidates,
    };
  }
}
