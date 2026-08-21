/**
 * Normalized Candidate Records Contracts
 * MarvelVerse - Stage 2.5
 */

export interface CandidateSourceProvenance {
  source: 'tmdb';
  sourceId: number;
  acquiredAt: string;
}

export interface MovieCandidate extends CandidateSourceProvenance {
  candidateId: string;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string | null;
  runtime: number | null;
  genres: string[];
  popularity: number;
  voteAverage: number;
  voteCount: number;
  posterPath: string | null;
  backdropPath: string | null;
  originalLanguage: string;
  adult: boolean;
  externalIds: {
    imdbId?: string | null;
    [key: string]: unknown;
  };
}

export interface TvCandidate extends CandidateSourceProvenance {
  candidateId: string;
  name: string;
  originalName: string;
  overview: string;
  firstAirDate: string | null;
  lastAirDate: string | null;
  genres: string[];
  numberOfSeasons: number;
  numberOfEpisodes: number;
  posterPath: string | null;
  backdropPath: string | null;
  originalLanguage: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
}

export interface CastCandidateMember {
  id: number;
  name: string;
  originalName: string;
  character: string;
  order: number;
  profilePath: string | null;
}

export interface CrewCandidateMember {
  id: number;
  name: string;
  originalName: string;
  department: string;
  job: string;
  profilePath: string | null;
}

export interface CreditsCandidate extends CandidateSourceProvenance {
  candidateId: string;
  mediaType: 'movie' | 'tv';
  cast: CastCandidateMember[];
  crew: CrewCandidateMember[];
}

export interface EpisodeCandidate {
  id: number;
  episodeNumber: number;
  name: string;
  overview: string;
  airDate: string | null;
  runtime: number | null;
  stillPath: string | null;
  voteAverage: number;
}

export interface SeasonCandidate extends CandidateSourceProvenance {
  candidateId: string;
  tvSourceId: number;
  seasonNumber: number;
  seasonName: string;
  overview: string;
  airDate: string | null;
  episodeCount: number;
  episodes: EpisodeCandidate[];
}

export type NormalizedCandidate =
  MovieCandidate | TvCandidate | CreditsCandidate | SeasonCandidate;
