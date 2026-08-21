/**
 * Raw TMDB API Data Contracts
 * MarvelVerse - Stage 2.5
 */

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TmdbMovieResponse {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  runtime: number | null;
  genres: TmdbGenre[];
  popularity: number;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  backdrop_path: string | null;
  original_language: string;
  adult: boolean;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string | null;
  production_companies?: TmdbProductionCompany[];
  imdb_id?: string | null;
}

export interface TmdbTvResponse {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  last_air_date?: string;
  genres: TmdbGenre[];
  number_of_seasons: number;
  number_of_episodes: number;
  poster_path: string | null;
  backdrop_path: string | null;
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  status?: string;
  type?: string;
  tagline?: string | null;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  original_name: string;
  character: string;
  order: number;
  profile_path: string | null;
  cast_id?: number;
  credit_id?: string;
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  original_name: string;
  department: string;
  job: string;
  profile_path: string | null;
  credit_id?: string;
}

export interface TmdbCreditsResponse {
  id: number;
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

export interface TmdbEpisode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  air_date: string | null;
  runtime: number | null;
  still_path: string | null;
  vote_average: number;
  vote_count?: number;
}

export interface TmdbSeasonResponse {
  id: number;
  _id?: string;
  season_number: number;
  name: string;
  overview: string;
  air_date: string | null;
  poster_path: string | null;
  episodes: TmdbEpisode[];
}

export interface TmdbSearchMovieResult {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
}

export interface TmdbSearchMovieResponse {
  page: number;
  results: TmdbSearchMovieResult[];
  total_pages: number;
  total_results: number;
}

export interface TmdbSearchTvResult {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
}

export interface TmdbSearchTvResponse {
  page: number;
  results: TmdbSearchTvResult[];
  total_pages: number;
  total_results: number;
}

export interface RawSnapshotEnvelope<T = unknown> {
  provider: 'tmdb';
  resourceType: 'movie' | 'tv' | 'movie_credits' | 'tv_credits' | 'tv_season';
  tmdbId: number;
  seasonNumber?: number;
  acquiredAt: string;
  payload: T;
}
