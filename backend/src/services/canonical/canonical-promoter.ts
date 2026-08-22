import {
  CanonicalMovie,
  CanonicalTvSeries,
  CanonicalCharacter,
  CanonicalAppearance,
} from '@marvelverse/shared';
import { CanonicalStorage } from './canonical-storage.js';
import { CanonicalValidator } from './canonical-validator.js';
import { DuplicateDetector, ConflictReport } from './duplicate-detector.js';

export class PromotionError extends Error {
  public readonly conflicts?: ConflictReport[];
  public readonly validationErrors?: string[];

  constructor(
    message: string,
    conflicts?: ConflictReport[],
    validationErrors?: string[]
  ) {
    super(message);
    this.name = 'PromotionError';
    this.conflicts = conflicts;
    this.validationErrors = validationErrors;
  }
}

export class CanonicalPromoter {
  private readonly storage: CanonicalStorage;
  private readonly validator: CanonicalValidator;
  private readonly detector: DuplicateDetector;

  constructor(
    storage?: CanonicalStorage,
    validator?: CanonicalValidator,
    detector?: DuplicateDetector
  ) {
    this.storage = storage ?? new CanonicalStorage();
    const universes = this.storage.loadUniverses();
    const sagas = this.storage.loadSagas();
    const phases = this.storage.loadPhases();

    this.validator =
      validator ?? new CanonicalValidator(universes, sagas, phases);
    this.detector = detector ?? new DuplicateDetector();
  }

  public promoteMovie(movie: CanonicalMovie): string {
    // 1. Verification Status Safeguard
    if (movie.verification.status !== 'verified') {
      throw new PromotionError(
        `Cannot promote movie [${movie.canonicalId}]: verificationStatus is "${movie.verification.status}", but only "verified" records may be promoted.`
      );
    }

    // 2. Schema & Relationship Validation
    const valReport = this.validator.validateMovie(movie);
    if (!valReport.isValid) {
      throw new PromotionError(
        `Validation failed for movie [${movie.canonicalId}]: ${valReport.errors.join('; ')}`,
        undefined,
        valReport.errors
      );
    }

    // 3. Duplicate Detection
    const existingMovies = this.storage.loadMovies();
    const conflicts = this.detector.detectMovieConflicts(movie, existingMovies);
    if (conflicts.length > 0) {
      const conflictMsgs = conflicts
        .map((c) => `${c.type} on field "${c.field}"`)
        .join(', ');
      throw new PromotionError(
        `Duplicate conflict detected promoting movie [${movie.canonicalId}]: ${conflictMsgs}`,
        conflicts
      );
    }

    // 4. Save to data/verified/movies/
    return this.storage.saveMovie(movie);
  }

  public promoteTvSeries(tv: CanonicalTvSeries): string {
    if (tv.verification.status !== 'verified') {
      throw new PromotionError(
        `Cannot promote TV series [${tv.canonicalId}]: verificationStatus is "${tv.verification.status}", but only "verified" records may be promoted.`
      );
    }

    const valReport = this.validator.validateTvSeries(tv);
    if (!valReport.isValid) {
      throw new PromotionError(
        `Validation failed for TV series [${tv.canonicalId}]: ${valReport.errors.join('; ')}`,
        undefined,
        valReport.errors
      );
    }

    const existingTv = this.storage.loadTvSeries();
    const conflicts = this.detector.detectTvConflicts(tv, existingTv);
    if (conflicts.length > 0) {
      const conflictMsgs = conflicts
        .map((c) => `${c.type} on field "${c.field}"`)
        .join(', ');
      throw new PromotionError(
        `Duplicate conflict detected promoting TV series [${tv.canonicalId}]: ${conflictMsgs}`,
        conflicts
      );
    }

    return this.storage.saveTvSeries(tv);
  }

  public promoteCharacter(character: CanonicalCharacter): string {
    if (character.verification.status !== 'verified') {
      throw new PromotionError(
        `Cannot promote character [${character.canonicalId}]: verificationStatus is "${character.verification.status}", but only "verified" records may be promoted.`
      );
    }

    const valReport = this.validator.validateCharacter(character);
    if (!valReport.isValid) {
      throw new PromotionError(
        `Validation failed for character [${character.canonicalId}]: ${valReport.errors.join('; ')}`,
        undefined,
        valReport.errors
      );
    }

    const existingChars = this.storage.loadCharacters();
    const conflicts = this.detector.detectCharacterConflicts(
      character,
      existingChars
    );
    if (conflicts.length > 0) {
      const conflictMsgs = conflicts
        .map((c) => `${c.type} on field "${c.field}"`)
        .join(', ');
      throw new PromotionError(
        `Duplicate conflict detected promoting character [${character.canonicalId}]: ${conflictMsgs}`,
        conflicts
      );
    }

    return this.storage.saveCharacter(character);
  }

  public promoteAppearance(
    appearance: CanonicalAppearance,
    existingCharacterIds?: Set<string>,
    existingMediaIds?: Set<string>
  ): string {
    if (appearance.verification.status !== 'verified') {
      throw new PromotionError(
        `Cannot promote appearance [${appearance.canonicalId}]: verificationStatus is "${appearance.verification.status}", but only "verified" records may be promoted.`
      );
    }

    const charIds =
      existingCharacterIds ??
      new Set(this.storage.loadCharacters().map((c) => c.canonicalId));
    const mediaIds =
      existingMediaIds ??
      new Set([
        ...this.storage.loadMovies().map((m) => m.canonicalId),
        ...this.storage.loadTvSeries().map((t) => t.canonicalId),
      ]);

    const valReport = this.validator.validateAppearance(
      appearance,
      charIds,
      mediaIds
    );
    if (!valReport.isValid) {
      throw new PromotionError(
        `Validation failed for appearance [${appearance.canonicalId}]: ${valReport.errors.join('; ')}`,
        undefined,
        valReport.errors
      );
    }

    return this.storage.saveAppearance(appearance);
  }
}
