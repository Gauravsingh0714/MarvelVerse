/**
 * MarvelVerse Canonical Entity Contracts
 * Stage 2.6 / Batch 0 — Provider-Independent Domain Models & Extension Points
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
  sourceId: string | number;
  sourceUri?: string;
  method?: string;
  acquiredAt?: string;
}

// ----------------------------------------------------
// Media Architecture Contracts (Document 4 Section 5)
// Provider-independent media representation
// ----------------------------------------------------

export type MediaAssetType =
  'poster' | 'backdrop' | 'avatar' | 'still' | 'banner' | 'logo';

export type MediaAspectRatio =
  'poster' | 'backdrop' | 'square' | 'avatar' | 'wide' | string;

export interface MediaAsset {
  id: string;
  provider: string;
  mediaType: MediaAssetType;
  path: string;
  aspectRatio?: MediaAspectRatio;
  width?: number | null;
  height?: number | null;
  altText: string;
  attribution?: string | null;
  entityType?:
    'movie' | 'series' | 'season' | 'episode' | 'character' | 'variant';
  entityId?: string;
}

// ----------------------------------------------------
// Date & Chronology Contracts (Document 3 Section 7)
// Distinguishes release date facts from story chronology
// ----------------------------------------------------

export type CanonicalDateStatus =
  'exact' | 'approximate' | 'estimated' | 'unknown' | 'unreleased';

export type DatePrecision = 'day' | 'month' | 'year' | 'decade' | 'unknown';

export interface CanonicalDateRecord {
  rawDate: string | null;
  status: CanonicalDateStatus;
  precision: DatePrecision;
  source?: string;
}

export interface StoryChronology {
  storyYear?: number | null;
  storyDate?: string | null;
  precision?: DatePrecision;
  storyOrderIndex?: number | null;
  notes?: string;
}

// ----------------------------------------------------
// Universe & Continuity Contracts (Document 3 Section 4)
// ----------------------------------------------------

export type ContinuityTier =
  'core-mcu' | 'connected-multiverse' | 'legacy-adjacent' | 'future-verified';

export interface CanonicalContinuity {
  id: string;
  name: string;
  tier: ContinuityTier;
  description?: string;
}

export interface CanonicalUniverse {
  id: string;
  name: string;
  description?: string;
  continuityTier?: ContinuityTier;
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

// ----------------------------------------------------
// Canonical Media Entities
// ----------------------------------------------------

export interface CanonicalMovie {
  canonicalId: string;
  title: string;
  originalTitle?: string;
  releaseDate: string;
  releaseDateRecord?: CanonicalDateRecord;
  releaseOrder: number;
  chronology?: StoryChronology;
  runtime?: number | null;
  overview: string;
  posterPath?: string | null;
  poster?: MediaAsset | null;
  backdropPath?: string | null;
  backdrop?: MediaAsset | null;
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
  firstAirDateRecord?: CanonicalDateRecord;
  lastAirDate?: string | null;
  chronology?: StoryChronology;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  overview: string;
  posterPath?: string | null;
  poster?: MediaAsset | null;
  backdropPath?: string | null;
  backdrop?: MediaAsset | null;
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
  canonicalId?: string;
  episodeNumber: number;
  title: string;
  overview: string;
  airDate?: string | null;
  airDateRecord?: CanonicalDateRecord;
  runtime?: number | null;
  stillPath?: string | null;
  still?: MediaAsset | null;
}

export interface CanonicalSeason {
  canonicalId: string;
  tvCanonicalId: string;
  seasonNumber: number;
  title: string;
  overview: string;
  airDate?: string | null;
  airDateRecord?: CanonicalDateRecord;
  episodeCount: number;
  episodes: CanonicalEpisode[];
  provenance: CanonicalProvenance;
  verification: VerificationMetadata;
}

// ----------------------------------------------------
// Character & Variant Contracts (Document 3 Section 5)
// ----------------------------------------------------

export interface CanonicalCharacter {
  canonicalId: string;
  name: string;
  realName?: string;
  aliases?: string[];
  species?: string;
  overview?: string;
  avatar?: MediaAsset | null;
  externalIds: CanonicalExternalIds;
  provenance?: CanonicalProvenance;
  verification: VerificationMetadata;
}

export interface CanonicalVariant {
  canonicalId: string;
  baseCharacterId: string;
  name: string;
  variantDesignation?: string;
  universeId: string;
  overview?: string;
  avatar?: MediaAsset | null;
  externalIds?: CanonicalExternalIds;
  provenance?: CanonicalProvenance;
  verification: VerificationMetadata;
}

// ----------------------------------------------------
// Appearance & Relationship Contracts (Document 3 Section 6)
// ----------------------------------------------------

export type CanonicalMediaType =
  'movie' | 'tv' | 'series' | 'season' | 'episode';

export interface CanonicalAppearance {
  canonicalId: string;
  characterId: string;
  mediaType: CanonicalMediaType;
  mediaCanonicalId: string;
  roleName: string;
  isUncredited?: boolean;
  characterVariantId?: string;
  verification: VerificationMetadata;
}

// ----------------------------------------------------
// Curated Watch Guide Contracts (Document 3 Section 10)
// ----------------------------------------------------

export type RoadToDoomsdayTier =
  | 'tier-1-absolute-essentials'
  | 'tier-2-multiverse-foundation'
  | 'tier-3-character-depth-context'
  | 'tier-4-supplemental-lore';

export interface WatchGuideEntry {
  id: string;
  entityType: 'movie' | 'series';
  entityCanonicalId: string;
  title: string;
  tier: RoadToDoomsdayTier;
  curatedOrder: number;
  whyWatchThis: string;
  keyPlotPoints?: string[];
  verification: VerificationMetadata;
}

export interface WatchGuide {
  id: string;
  name: string;
  slug: string;
  description: string;
  entries: WatchGuideEntry[];
  version: string;
}
