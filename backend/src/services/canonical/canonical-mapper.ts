import {
  MovieCandidate,
  TvCandidate,
  CanonicalMovie,
  CanonicalTvSeries,
  VerificationMetadata,
} from '@marvelverse/shared';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface MovieMappingConfig {
  slug?: string;
  releaseOrder: number;
  universeId: string;
  sagaId: string;
  phaseId: string;
  verification: VerificationMetadata;
}

export interface TvMappingConfig {
  slug?: string;
  universeId: string;
  sagaId: string;
  phaseId: string;
  verification: VerificationMetadata;
}

export class CanonicalMapper {
  public mapMovieCandidateToCanonical(
    candidate: MovieCandidate,
    config: MovieMappingConfig
  ): CanonicalMovie {
    const slug = config.slug || slugify(candidate.title);
    const canonicalId = `mv-movie-${slug}`;

    return {
      canonicalId,
      title: candidate.title,
      originalTitle:
        candidate.originalTitle !== candidate.title
          ? candidate.originalTitle
          : undefined,
      releaseDate: candidate.releaseDate || '1970-01-01',
      releaseOrder: config.releaseOrder,
      runtime: candidate.runtime,
      overview: candidate.overview,
      posterPath: candidate.posterPath,
      backdropPath: candidate.backdropPath,
      genres: candidate.genres,
      universeId: config.universeId,
      sagaId: config.sagaId,
      phaseId: config.phaseId,
      externalIds: {
        tmdb: candidate.sourceId,
        imdb: (candidate.externalIds?.imdbId as string) || undefined,
      },
      provenance: {
        provider: candidate.source,
        sourceId: candidate.sourceId,
        acquiredAt: candidate.acquiredAt,
      },
      verification: config.verification,
    };
  }

  public mapTvCandidateToCanonical(
    candidate: TvCandidate,
    config: TvMappingConfig
  ): CanonicalTvSeries {
    const slug = config.slug || slugify(candidate.name);
    const canonicalId = `mv-series-${slug}`;

    return {
      canonicalId,
      title: candidate.name,
      originalTitle:
        candidate.originalName !== candidate.name
          ? candidate.originalName
          : undefined,
      firstAirDate: candidate.firstAirDate || '1970-01-01',
      lastAirDate: candidate.lastAirDate,
      numberOfSeasons: candidate.numberOfSeasons,
      numberOfEpisodes: candidate.numberOfEpisodes,
      overview: candidate.overview,
      posterPath: candidate.posterPath,
      backdropPath: candidate.backdropPath,
      genres: candidate.genres,
      universeId: config.universeId,
      sagaId: config.sagaId,
      phaseId: config.phaseId,
      externalIds: {
        tmdb: candidate.sourceId,
      },
      provenance: {
        provider: candidate.source,
        sourceId: candidate.sourceId,
        acquiredAt: candidate.acquiredAt,
      },
      verification: config.verification,
    };
  }
}
