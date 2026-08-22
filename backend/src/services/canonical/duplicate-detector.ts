import {
  CanonicalMovie,
  CanonicalTvSeries,
  CanonicalCharacter,
} from '@marvelverse/shared';

export interface ConflictReport {
  type: 'duplicate-canonical-id' | 'duplicate-tmdb-id' | 'duplicate-imdb-id';
  field: string;
  value: string | number;
  candidateId: string;
  conflictsWithId: string;
}

export class DuplicateDetector {
  public detectMovieConflicts(
    newMovie: CanonicalMovie,
    existingMovies: CanonicalMovie[],
    allowOverwrite = true
  ): ConflictReport[] {
    const conflicts: ConflictReport[] = [];

    for (const existing of existingMovies) {
      if (existing.canonicalId === newMovie.canonicalId) {
        if (!allowOverwrite) {
          conflicts.push({
            type: 'duplicate-canonical-id',
            field: 'canonicalId',
            value: newMovie.canonicalId,
            candidateId: newMovie.canonicalId,
            conflictsWithId: existing.canonicalId,
          });
        }
      } else {
        if (
          newMovie.externalIds?.tmdb &&
          existing.externalIds?.tmdb &&
          newMovie.externalIds.tmdb === existing.externalIds.tmdb
        ) {
          conflicts.push({
            type: 'duplicate-tmdb-id',
            field: 'externalIds.tmdb',
            value: newMovie.externalIds.tmdb,
            candidateId: newMovie.canonicalId,
            conflictsWithId: existing.canonicalId,
          });
        }

        if (
          newMovie.externalIds?.imdb &&
          existing.externalIds?.imdb &&
          newMovie.externalIds.imdb === existing.externalIds.imdb
        ) {
          conflicts.push({
            type: 'duplicate-imdb-id',
            field: 'externalIds.imdb',
            value: newMovie.externalIds.imdb,
            candidateId: newMovie.canonicalId,
            conflictsWithId: existing.canonicalId,
          });
        }
      }
    }

    return conflicts;
  }

  public detectTvConflicts(
    newTv: CanonicalTvSeries,
    existingTv: CanonicalTvSeries[],
    allowOverwrite = true
  ): ConflictReport[] {
    const conflicts: ConflictReport[] = [];

    for (const existing of existingTv) {
      if (existing.canonicalId === newTv.canonicalId) {
        if (!allowOverwrite) {
          conflicts.push({
            type: 'duplicate-canonical-id',
            field: 'canonicalId',
            value: newTv.canonicalId,
            candidateId: newTv.canonicalId,
            conflictsWithId: existing.canonicalId,
          });
        }
      } else if (
        newTv.externalIds?.tmdb &&
        existing.externalIds?.tmdb &&
        newTv.externalIds.tmdb === existing.externalIds.tmdb
      ) {
        conflicts.push({
          type: 'duplicate-tmdb-id',
          field: 'externalIds.tmdb',
          value: newTv.externalIds.tmdb,
          candidateId: newTv.canonicalId,
          conflictsWithId: existing.canonicalId,
        });
      }
    }

    return conflicts;
  }

  public detectCharacterConflicts(
    newChar: CanonicalCharacter,
    existingChars: CanonicalCharacter[],
    allowOverwrite = true
  ): ConflictReport[] {
    const conflicts: ConflictReport[] = [];

    for (const existing of existingChars) {
      if (existing.canonicalId === newChar.canonicalId) {
        if (!allowOverwrite) {
          conflicts.push({
            type: 'duplicate-canonical-id',
            field: 'canonicalId',
            value: newChar.canonicalId,
            candidateId: newChar.canonicalId,
            conflictsWithId: existing.canonicalId,
          });
        }
      } else if (
        newChar.externalIds?.tmdb &&
        existing.externalIds?.tmdb &&
        newChar.externalIds.tmdb === existing.externalIds.tmdb
      ) {
        conflicts.push({
          type: 'duplicate-tmdb-id',
          field: 'externalIds.tmdb',
          value: newChar.externalIds.tmdb,
          candidateId: newChar.canonicalId,
          conflictsWithId: existing.canonicalId,
        });
      }
    }

    return conflicts;
  }
}
