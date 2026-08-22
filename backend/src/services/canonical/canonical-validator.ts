import {
  CanonicalUniverse,
  CanonicalSaga,
  CanonicalPhase,
  CanonicalMovie,
  CanonicalTvSeries,
  CanonicalCharacter,
  CanonicalAppearance,
  canonicalMovieSchema,
  canonicalTvSeriesSchema,
  canonicalCharacterSchema,
  canonicalAppearanceSchema,
} from '@marvelverse/shared';

export interface CanonicalValidationReport {
  isValid: boolean;
  canonicalId: string;
  entityType: 'movie' | 'tv' | 'character' | 'appearance';
  errors: string[];
}

export class CanonicalValidator {
  private readonly universes: Map<string, CanonicalUniverse>;
  private readonly sagas: Map<string, CanonicalSaga>;
  private readonly phases: Map<string, CanonicalPhase>;

  constructor(
    universes: CanonicalUniverse[] = [],
    sagas: CanonicalSaga[] = [],
    phases: CanonicalPhase[] = []
  ) {
    this.universes = new Map(universes.map((u) => [u.id, u]));
    this.sagas = new Map(sagas.map((s) => [s.id, s]));
    this.phases = new Map(phases.map((p) => [p.id, p]));
  }

  public validateMovie(movie: CanonicalMovie): CanonicalValidationReport {
    const errors: string[] = [];
    const parseResult = canonicalMovieSchema.safeParse(movie);

    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        errors.push(`Schema Error [${issue.path.join('.')}]: ${issue.message}`);
      });
    }

    // Relationship Integrity Checks
    if (this.universes.size > 0 && !this.universes.has(movie.universeId)) {
      errors.push(
        `Referenced universeId "${movie.universeId}" does not exist in universes.json`
      );
    }

    if (this.sagas.size > 0 && !this.sagas.has(movie.sagaId)) {
      errors.push(
        `Referenced sagaId "${movie.sagaId}" does not exist in sagas.json`
      );
    }

    if (this.phases.size > 0) {
      const phase = this.phases.get(movie.phaseId);
      if (!phase) {
        errors.push(
          `Referenced phaseId "${movie.phaseId}" does not exist in phases.json`
        );
      } else if (phase.sagaId !== movie.sagaId) {
        errors.push(
          `Phase/Saga Mismatch: phaseId "${movie.phaseId}" belongs to sagaId "${phase.sagaId}", but movie specifies sagaId "${movie.sagaId}"`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      canonicalId: movie.canonicalId,
      entityType: 'movie',
      errors,
    };
  }

  public validateTvSeries(tv: CanonicalTvSeries): CanonicalValidationReport {
    const errors: string[] = [];
    const parseResult = canonicalTvSeriesSchema.safeParse(tv);

    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        errors.push(`Schema Error [${issue.path.join('.')}]: ${issue.message}`);
      });
    }

    if (this.universes.size > 0 && !this.universes.has(tv.universeId)) {
      errors.push(
        `Referenced universeId "${tv.universeId}" does not exist in universes.json`
      );
    }

    if (this.sagas.size > 0 && !this.sagas.has(tv.sagaId)) {
      errors.push(
        `Referenced sagaId "${tv.sagaId}" does not exist in sagas.json`
      );
    }

    if (this.phases.size > 0) {
      const phase = this.phases.get(tv.phaseId);
      if (!phase) {
        errors.push(
          `Referenced phaseId "${tv.phaseId}" does not exist in phases.json`
        );
      } else if (phase.sagaId !== tv.sagaId) {
        errors.push(
          `Phase/Saga Mismatch: phaseId "${tv.phaseId}" belongs to sagaId "${phase.sagaId}", but series specifies sagaId "${tv.sagaId}"`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      canonicalId: tv.canonicalId,
      entityType: 'tv',
      errors,
    };
  }

  public validateCharacter(
    character: CanonicalCharacter
  ): CanonicalValidationReport {
    const errors: string[] = [];
    const parseResult = canonicalCharacterSchema.safeParse(character);

    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        errors.push(`Schema Error [${issue.path.join('.')}]: ${issue.message}`);
      });
    }

    return {
      isValid: errors.length === 0,
      canonicalId: character.canonicalId,
      entityType: 'character',
      errors,
    };
  }

  public validateAppearance(
    appearance: CanonicalAppearance,
    existingCharacterIds?: Set<string>,
    existingMediaIds?: Set<string>
  ): CanonicalValidationReport {
    const errors: string[] = [];
    const parseResult = canonicalAppearanceSchema.safeParse(appearance);

    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        errors.push(`Schema Error [${issue.path.join('.')}]: ${issue.message}`);
      });
    }

    if (
      existingCharacterIds &&
      !existingCharacterIds.has(appearance.characterId)
    ) {
      errors.push(
        `Orphan Appearance: referenced characterId "${appearance.characterId}" does not exist in canonical characters.`
      );
    }

    if (
      existingMediaIds &&
      !existingMediaIds.has(appearance.mediaCanonicalId)
    ) {
      errors.push(
        `Orphan Appearance: referenced mediaCanonicalId "${appearance.mediaCanonicalId}" does not exist in canonical media.`
      );
    }

    return {
      isValid: errors.length === 0,
      canonicalId: appearance.canonicalId,
      entityType: 'appearance',
      errors,
    };
  }
}
