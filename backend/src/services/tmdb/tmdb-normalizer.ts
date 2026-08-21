import {
  TmdbMovieResponse,
  TmdbTvResponse,
  TmdbCreditsResponse,
  TmdbSeasonResponse,
  RawSnapshotEnvelope,
  MovieCandidate,
  TvCandidate,
  CreditsCandidate,
  SeasonCandidate,
} from '@marvelverse/shared';
import { TmdbStorage } from './tmdb-storage.js';

export class TmdbNormalizer {
  private readonly storage: TmdbStorage;

  constructor(storage?: TmdbStorage) {
    this.storage = storage ?? new TmdbStorage();
  }

  public normalizeMovie(envelope: RawSnapshotEnvelope<TmdbMovieResponse>): {
    candidate: MovieCandidate;
    filePath: string;
  } {
    const raw = envelope.payload;
    const candidate: MovieCandidate = {
      source: 'tmdb',
      sourceId: envelope.tmdbId,
      acquiredAt: envelope.acquiredAt,
      candidateId: `tmdb-movie-${envelope.tmdbId}`,
      title: raw.title || '',
      originalTitle: raw.original_title || '',
      overview: raw.overview || '',
      releaseDate: raw.release_date ? raw.release_date : null,
      runtime: typeof raw.runtime === 'number' ? raw.runtime : null,
      genres: Array.isArray(raw.genres) ? raw.genres.map((g) => g.name) : [],
      popularity: typeof raw.popularity === 'number' ? raw.popularity : 0,
      voteAverage: typeof raw.vote_average === 'number' ? raw.vote_average : 0,
      voteCount: typeof raw.vote_count === 'number' ? raw.vote_count : 0,
      posterPath: raw.poster_path || null,
      backdropPath: raw.backdrop_path || null,
      originalLanguage: raw.original_language || 'en',
      adult: Boolean(raw.adult),
      externalIds: {
        imdbId: raw.imdb_id || null,
      },
    };

    const filePath = this.storage.saveNormalizedCandidate(candidate);
    return { candidate, filePath };
  }

  public normalizeTvSeries(envelope: RawSnapshotEnvelope<TmdbTvResponse>): {
    candidate: TvCandidate;
    filePath: string;
  } {
    const raw = envelope.payload;
    const candidate: TvCandidate = {
      source: 'tmdb',
      sourceId: envelope.tmdbId,
      acquiredAt: envelope.acquiredAt,
      candidateId: `tmdb-tv-${envelope.tmdbId}`,
      name: raw.name || '',
      originalName: raw.original_name || '',
      overview: raw.overview || '',
      firstAirDate: raw.first_air_date ? raw.first_air_date : null,
      lastAirDate: raw.last_air_date ? raw.last_air_date : null,
      genres: Array.isArray(raw.genres) ? raw.genres.map((g) => g.name) : [],
      numberOfSeasons:
        typeof raw.number_of_seasons === 'number' ? raw.number_of_seasons : 0,
      numberOfEpisodes:
        typeof raw.number_of_episodes === 'number' ? raw.number_of_episodes : 0,
      posterPath: raw.poster_path || null,
      backdropPath: raw.backdrop_path || null,
      originalLanguage: raw.original_language || 'en',
      popularity: typeof raw.popularity === 'number' ? raw.popularity : 0,
      voteAverage: typeof raw.vote_average === 'number' ? raw.vote_average : 0,
      voteCount: typeof raw.vote_count === 'number' ? raw.vote_count : 0,
    };

    const filePath = this.storage.saveNormalizedCandidate(candidate);
    return { candidate, filePath };
  }

  public normalizeCredits(
    envelope: RawSnapshotEnvelope<TmdbCreditsResponse>,
    mediaType: 'movie' | 'tv'
  ): { candidate: CreditsCandidate; filePath: string } {
    const raw = envelope.payload;
    const candidate: CreditsCandidate = {
      source: 'tmdb',
      sourceId: envelope.tmdbId,
      acquiredAt: envelope.acquiredAt,
      candidateId: `tmdb-credits-${mediaType}-${envelope.tmdbId}`,
      mediaType,
      cast: (raw.cast || []).map((member) => ({
        id: member.id,
        name: member.name || '',
        originalName: member.original_name || member.name || '',
        character: member.character || '',
        order: typeof member.order === 'number' ? member.order : 0,
        profilePath: member.profile_path || null,
      })),
      crew: (raw.crew || []).map((member) => ({
        id: member.id,
        name: member.name || '',
        originalName: member.original_name || member.name || '',
        department: member.department || '',
        job: member.job || '',
        profilePath: member.profile_path || null,
      })),
    };

    const filePath = this.storage.saveNormalizedCandidate(candidate);
    return { candidate, filePath };
  }

  public normalizeSeason(
    envelope: RawSnapshotEnvelope<TmdbSeasonResponse>,
    tvSourceId: number
  ): { candidate: SeasonCandidate; filePath: string } {
    const raw = envelope.payload;
    const candidate: SeasonCandidate = {
      source: 'tmdb',
      sourceId: raw.id || envelope.tmdbId,
      tvSourceId,
      seasonNumber:
        typeof raw.season_number === 'number'
          ? raw.season_number
          : (envelope.seasonNumber ?? 1),
      acquiredAt: envelope.acquiredAt,
      candidateId: `tmdb-season-${tvSourceId}-${envelope.seasonNumber ?? raw.season_number}`,
      seasonName: raw.name || '',
      overview: raw.overview || '',
      airDate: raw.air_date ? raw.air_date : null,
      episodeCount: (raw.episodes || []).length,
      episodes: (raw.episodes || []).map((ep) => ({
        id: ep.id,
        episodeNumber: ep.episode_number,
        name: ep.name || '',
        overview: ep.overview || '',
        airDate: ep.air_date ? ep.air_date : null,
        runtime: typeof ep.runtime === 'number' ? ep.runtime : null,
        stillPath: ep.still_path || null,
        voteAverage: typeof ep.vote_average === 'number' ? ep.vote_average : 0,
      })),
    };

    const filePath = this.storage.saveNormalizedCandidate(candidate);
    return { candidate, filePath };
  }
}
