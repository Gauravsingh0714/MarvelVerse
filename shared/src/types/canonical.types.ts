/**
 * MarvelVerse Canonical Entity Contracts
 * Stage 2.6 — Provider-Independent Domain Models
 */

export type VerificationStatus =
  'unverified' | 'verified' | 'rejected' | 'needs-review';

export interface VerificationMetadata {
  status: VerificationStatus;
  method?: 'manual-review' | 'curated-pipeline' | 'automated-check';
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface CanonicalExternalIds {
  tmdb?: number;
  imdb?: string;
  [key: string]: unknown;
}

export interface CanonicalProvenance {
  provider: string;
  sourceId: number;
  acquiredAt?: string;
}

export interface CanonicalUniverse {
  id: string;
  name: string;
  description?: string;
}

export interface CanonicalSaga {
  id: string;
  name: string;
  order: number;
}

export interface CanonicalPhase {
  id: string;
  name: string;
  number: number;
  sagaId: string;
}

export interface CanonicalMovie {
  canonicalId: string;
  title: string;
  originalTitle?: string;
  releaseDate: string;
  releaseOrder: number;
  runtime?: number | null;
  overview: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  genres: string[];
  universeId: string;
  sagaId: string;
  phaseId: string;
  externalIds: CanonicalExternalIds;
  provenance: CanonicalProvenance;
  verification: VerificationMetadata;
}

export interface CanonicalTvSeries {
  canonicalId: string;
  title: string;
  originalTitle?: string;
  firstAirDate: string;
  lastAirDate?: string | null;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  overview: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  genres: string[];
  universeId: string;
  sagaId: string;
  phaseId: string;
  externalIds: CanonicalExternalIds;
  provenance: CanonicalProvenance;
  verification: VerificationMetadata;
}

export interface CanonicalEpisode {
  id: number;
  episodeNumber: number;
  title: string;
  overview: string;
  airDate?: string | null;
  runtime?: number | null;
  stillPath?: string | null;
}

export interface CanonicalSeason {
  canonicalId: string;
  tvCanonicalId: string;
  seasonNumber: number;
  title: string;
  overview: string;
  airDate?: string | null;
  episodeCount: number;
  episodes: CanonicalEpisode[];
  provenance: CanonicalProvenance;
  verification: VerificationMetadata;
}

export interface CanonicalCharacter {
  canonicalId: string;
  name: string;
  realName?: string;
  aliases?: string[];
  species?: string;
  overview?: string;
  externalIds: CanonicalExternalIds;
  provenance?: CanonicalProvenance;
  verification: VerificationMetadata;
}

export interface CanonicalAppearance {
  canonicalId: string;
  characterId: string;
  mediaType: 'movie' | 'tv';
  mediaCanonicalId: string;
  roleName: string;
  isUncredited?: boolean;
  verification: VerificationMetadata;
}
