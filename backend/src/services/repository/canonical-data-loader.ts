import fs from 'node:fs';
import path from 'node:path';
import {
  CanonicalMovie,
  CanonicalTvSeries,
  CanonicalSeason,
  CanonicalEpisode,
  CanonicalCharacter,
  CanonicalVariant,
  CanonicalAppearance,
  CanonicalUniverse,
  CanonicalContinuity,
  CanonicalSaga,
  CanonicalPhase,
  WatchGuide,
  canonicalMovieSchema,
  canonicalTvSeriesSchema,
  canonicalSeasonSchema,
  canonicalEpisodeSchema,
  canonicalCharacterSchema,
  canonicalVariantSchema,
  canonicalAppearanceSchema,
  canonicalUniverseSchema,
  canonicalContinuitySchema,
  canonicalSagaSchema,
  canonicalPhaseSchema,
  watchGuideSchema,
} from '@marvelverse/shared';

export class CanonicalDataLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CanonicalDataLoadError';
  }
}

export class CanonicalDataValidationError extends Error {
  public readonly errors: string[];

  constructor(message: string, errors: string[]) {
    super(message);
    this.name = 'CanonicalDataValidationError';
    this.errors = errors;
  }
}

export interface ReferenceIntegrityReport {
  isValid: boolean;
  errors: string[];
}

export class CanonicalDataLoader {
  private readonly verifiedDir: string;

  constructor(baseWorkspaceDir?: string) {
    const cwd = baseWorkspaceDir ?? process.cwd();
    const normalizedCwd = path.normalize(cwd);
    const isSubdir =
      normalizedCwd.endsWith('backend') ||
      normalizedCwd.endsWith('frontend') ||
      normalizedCwd.endsWith('shared');

    const rootDir = isSubdir
      ? path.resolve(normalizedCwd, '..')
      : normalizedCwd;
    this.verifiedDir = path.resolve(rootDir, 'data', 'verified');
  }

  public getVerifiedDir(): string {
    return this.verifiedDir;
  }

  private readJson<T>(filePath: string): T {
    if (!fs.existsSync(filePath)) {
      throw new CanonicalDataLoadError(
        `Canonical data file missing at: ${filePath}`
      );
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content) as T;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new CanonicalDataLoadError(
        `Failed to parse JSON file [${filePath}]: ${msg}`
      );
    }
  }

  private assertNoDuplicates<T>(
    items: T[],
    idSelector: (item: T) => string,
    collectionName: string
  ): void {
    const seen = new Set<string>();
    for (const item of items) {
      const id = idSelector(item);
      if (seen.has(id)) {
        throw new CanonicalDataValidationError(
          `Duplicate identifier detected in ${collectionName}: "${id}"`,
          [`Duplicate identifier "${id}" in collection "${collectionName}"`]
        );
      }
      seen.add(id);
    }
  }

  public loadUniverses(): CanonicalUniverse[] {
    const filePath = path.join(this.verifiedDir, 'universes.json');
    if (!fs.existsSync(filePath)) return [];

    const raw = this.readJson<unknown[]>(filePath);
    const universes = raw.map((item, idx) => {
      const res = canonicalUniverseSchema.safeParse(item);
      if (!res.success) {
        throw new CanonicalDataValidationError(
          `Invalid universe record at index ${idx} in universes.json`,
          res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
        );
      }
      return res.data as CanonicalUniverse;
    });

    this.assertNoDuplicates(universes, (u) => u.id, 'universes');
    return universes;
  }

  public loadContinuities(): CanonicalContinuity[] {
    const filePath = path.join(this.verifiedDir, 'continuities.json');
    if (fs.existsSync(filePath)) {
      const raw = this.readJson<unknown[]>(filePath);
      const continuities = raw.map((item, idx) => {
        const res = canonicalContinuitySchema.safeParse(item);
        if (!res.success) {
          throw new CanonicalDataValidationError(
            `Invalid continuity record at index ${idx} in continuities.json`,
            res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
          );
        }
        return res.data as CanonicalContinuity;
      });
      this.assertNoDuplicates(continuities, (c) => c.id, 'continuities');
      return continuities;
    }

    const folder = path.join(this.verifiedDir, 'continuities');
    if (!fs.existsSync(folder)) return [];

    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));
    const continuities = files.map((file) => {
      const raw = this.readJson<unknown>(path.join(folder, file));
      const res = canonicalContinuitySchema.safeParse(raw);
      if (!res.success) {
        throw new CanonicalDataValidationError(
          `Invalid continuity entity in file ${file}`,
          res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
        );
      }
      return res.data as CanonicalContinuity;
    });

    this.assertNoDuplicates(continuities, (c) => c.id, 'continuities');
    return continuities;
  }

  public loadSagas(): CanonicalSaga[] {
    const filePath = path.join(this.verifiedDir, 'sagas.json');
    if (!fs.existsSync(filePath)) return [];

    const raw = this.readJson<unknown[]>(filePath);
    const sagas = raw.map((item, idx) => {
      const res = canonicalSagaSchema.safeParse(item);
      if (!res.success) {
        throw new CanonicalDataValidationError(
          `Invalid saga record at index ${idx} in sagas.json`,
          res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
        );
      }
      return res.data as CanonicalSaga;
    });

    this.assertNoDuplicates(sagas, (s) => s.id, 'sagas');
    return sagas;
  }

  public loadPhases(): CanonicalPhase[] {
    const filePath = path.join(this.verifiedDir, 'phases.json');
    if (!fs.existsSync(filePath)) return [];

    const raw = this.readJson<unknown[]>(filePath);
    const phases = raw.map((item, idx) => {
      const res = canonicalPhaseSchema.safeParse(item);
      if (!res.success) {
        throw new CanonicalDataValidationError(
          `Invalid phase record at index ${idx} in phases.json`,
          res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
        );
      }
      return res.data as CanonicalPhase;
    });

    this.assertNoDuplicates(phases, (p) => p.id, 'phases');
    return phases;
  }

  public loadMovies(): CanonicalMovie[] {
    const folder = path.join(this.verifiedDir, 'movies');
    if (!fs.existsSync(folder)) return [];
    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));

    const movies = files.map((file) => {
      const filePath = path.join(folder, file);
      const raw = this.readJson<unknown>(filePath);
      const res = canonicalMovieSchema.safeParse(raw);
      if (!res.success) {
        throw new CanonicalDataValidationError(
          `Invalid movie entity in file ${file}`,
          res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
        );
      }
      return res.data as CanonicalMovie;
    });

    this.assertNoDuplicates(movies, (m) => m.canonicalId, 'movies');
    return movies;
  }

  public loadTvSeries(): CanonicalTvSeries[] {
    const seriesList: CanonicalTvSeries[] = [];
    const filePath = path.join(this.verifiedDir, 'tv.json');
    if (fs.existsSync(filePath)) {
      const raw = this.readJson<unknown[]>(filePath);
      for (let idx = 0; idx < raw.length; idx++) {
        const res = canonicalTvSeriesSchema.safeParse(raw[idx]);
        if (!res.success) {
          throw new CanonicalDataValidationError(
            `Invalid TV series record at index ${idx} in tv.json`,
            res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
          );
        }
        seriesList.push(res.data as CanonicalTvSeries);
      }
    }

    const folder = path.join(this.verifiedDir, 'tv');
    if (fs.existsSync(folder)) {
      const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const raw = this.readJson<unknown>(path.join(folder, file));
        const res = canonicalTvSeriesSchema.safeParse(raw);
        if (!res.success) {
          throw new CanonicalDataValidationError(
            `Invalid TV series entity in file ${file}`,
            res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
          );
        }
        seriesList.push(res.data as CanonicalTvSeries);
      }
    }

    this.assertNoDuplicates(seriesList, (s) => s.canonicalId, 'tv-series');
    return seriesList;
  }

  public loadSeasons(): CanonicalSeason[] {
    const seasonList: CanonicalSeason[] = [];
    const filePath = path.join(this.verifiedDir, 'seasons.json');
    if (fs.existsSync(filePath)) {
      const raw = this.readJson<unknown[]>(filePath);
      for (let idx = 0; idx < raw.length; idx++) {
        const res = canonicalSeasonSchema.safeParse(raw[idx]);
        if (!res.success) {
          throw new CanonicalDataValidationError(
            `Invalid season record at index ${idx} in seasons.json`,
            res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
          );
        }
        seasonList.push(res.data as CanonicalSeason);
      }
    }

    const folder = path.join(this.verifiedDir, 'seasons');
    if (fs.existsSync(folder)) {
      const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const raw = this.readJson<unknown>(path.join(folder, file));
        const res = canonicalSeasonSchema.safeParse(raw);
        if (!res.success) {
          throw new CanonicalDataValidationError(
            `Invalid season entity in file ${file}`,
            res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
          );
        }
        seasonList.push(res.data as CanonicalSeason);
      }
    }

    this.assertNoDuplicates(seasonList, (s) => s.canonicalId, 'seasons');
    return seasonList;
  }

  public loadEpisodes(): CanonicalEpisode[] {
    // 1. Gather all episodes embedded inside loaded seasons
    const seasons = this.loadSeasons();
    const episodes: CanonicalEpisode[] = [];

    for (const s of seasons) {
      if (Array.isArray(s.episodes)) {
        episodes.push(...s.episodes);
      }
    }

    // 2. Check for optional standalone episodes.json
    const filePath = path.join(this.verifiedDir, 'episodes.json');
    if (fs.existsSync(filePath)) {
      const raw = this.readJson<unknown[]>(filePath);
      for (let idx = 0; idx < raw.length; idx++) {
        const res = canonicalEpisodeSchema.safeParse(raw[idx]);
        if (!res.success) {
          throw new CanonicalDataValidationError(
            `Invalid episode record at index ${idx} in episodes.json`,
            res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
          );
        }
        episodes.push(res.data as CanonicalEpisode);
      }
    }

    return episodes;
  }

  public loadCharacters(): CanonicalCharacter[] {
    const folder = path.join(this.verifiedDir, 'characters');
    if (!fs.existsSync(folder)) return [];
    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));

    const characters = files.map((file) => {
      const filePath = path.join(folder, file);
      const raw = this.readJson<unknown>(filePath);
      const res = canonicalCharacterSchema.safeParse(raw);
      if (!res.success) {
        throw new CanonicalDataValidationError(
          `Invalid character entity in file ${file}`,
          res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
        );
      }
      return res.data as CanonicalCharacter;
    });

    this.assertNoDuplicates(characters, (c) => c.canonicalId, 'characters');
    return characters;
  }

  public loadVariants(): CanonicalVariant[] {
    const variantList: CanonicalVariant[] = [];
    const filePath = path.join(this.verifiedDir, 'variants.json');
    if (fs.existsSync(filePath)) {
      const raw = this.readJson<unknown[]>(filePath);
      for (let idx = 0; idx < raw.length; idx++) {
        const res = canonicalVariantSchema.safeParse(raw[idx]);
        if (!res.success) {
          throw new CanonicalDataValidationError(
            `Invalid variant record at index ${idx} in variants.json`,
            res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
          );
        }
        variantList.push(res.data as CanonicalVariant);
      }
    }

    const folder = path.join(this.verifiedDir, 'variants');
    if (fs.existsSync(folder)) {
      const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const raw = this.readJson<unknown>(path.join(folder, file));
        const res = canonicalVariantSchema.safeParse(raw);
        if (!res.success) {
          throw new CanonicalDataValidationError(
            `Invalid variant entity in file ${file}`,
            res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
          );
        }
        variantList.push(res.data as CanonicalVariant);
      }
    }

    this.assertNoDuplicates(variantList, (v) => v.canonicalId, 'variants');
    return variantList;
  }

  public loadAppearances(): CanonicalAppearance[] {
    const folder = path.join(this.verifiedDir, 'relationships');
    if (!fs.existsSync(folder)) return [];
    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));

    const appearances = files.map((file) => {
      const filePath = path.join(folder, file);
      const raw = this.readJson<unknown>(filePath);
      const res = canonicalAppearanceSchema.safeParse(raw);
      if (!res.success) {
        throw new CanonicalDataValidationError(
          `Invalid appearance entity in file ${file}`,
          res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
        );
      }
      return res.data as CanonicalAppearance;
    });

    this.assertNoDuplicates(appearances, (a) => a.canonicalId, 'appearances');
    return appearances;
  }

  public loadWatchGuides(): WatchGuide[] {
    const guideList: WatchGuide[] = [];
    const filePath = path.join(this.verifiedDir, 'watch-guides.json');
    if (fs.existsSync(filePath)) {
      const raw = this.readJson<unknown[]>(filePath);
      for (let idx = 0; idx < raw.length; idx++) {
        const res = watchGuideSchema.safeParse(raw[idx]);
        if (!res.success) {
          throw new CanonicalDataValidationError(
            `Invalid watch guide record at index ${idx} in watch-guides.json`,
            res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
          );
        }
        guideList.push(res.data as WatchGuide);
      }
    }

    const folder = path.join(this.verifiedDir, 'watch-guides');
    if (fs.existsSync(folder)) {
      const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const raw = this.readJson<unknown>(path.join(folder, file));
        const res = watchGuideSchema.safeParse(raw);
        if (!res.success) {
          throw new CanonicalDataValidationError(
            `Invalid watch guide entity in file ${file}`,
            res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
          );
        }
        guideList.push(res.data as WatchGuide);
      }
    }

    this.assertNoDuplicates(guideList, (g) => g.id, 'watch-guides');
    return guideList;
  }

  /**
   * Validates cross-entity reference integrity across all loaded canonical collections.
   */
  public validateReferenceIntegrity(): ReferenceIntegrityReport {
    const errors: string[] = [];

    const universes = this.loadUniverses();
    const sagas = this.loadSagas();
    const phases = this.loadPhases();
    const movies = this.loadMovies();
    const series = this.loadTvSeries();
    const seasons = this.loadSeasons();
    const characters = this.loadCharacters();
    const variants = this.loadVariants();
    const appearances = this.loadAppearances();
    const watchGuides = this.loadWatchGuides();

    const universeIds = new Set(universes.map((u) => u.id));
    const sagaIds = new Set(sagas.map((s) => s.id));
    const phaseMap = new Map(phases.map((p) => [p.id, p]));
    const movieIds = new Set(movies.map((m) => m.canonicalId));
    const seriesIds = new Set(series.map((s) => s.canonicalId));
    const characterIds = new Set(characters.map((c) => c.canonicalId));
    const variantIds = new Set(variants.map((v) => v.canonicalId));

    // 1. Movie references
    for (const m of movies) {
      if (universeIds.size > 0 && !universeIds.has(m.universeId)) {
        errors.push(
          `Movie [${m.canonicalId}] references unknown universeId "${m.universeId}"`
        );
      }
      if (sagaIds.size > 0 && !sagaIds.has(m.sagaId)) {
        errors.push(
          `Movie [${m.canonicalId}] references unknown sagaId "${m.sagaId}"`
        );
      }
      if (phaseMap.size > 0) {
        const phase = phaseMap.get(m.phaseId);
        if (!phase) {
          errors.push(
            `Movie [${m.canonicalId}] references unknown phaseId "${m.phaseId}"`
          );
        } else if (phase.sagaId !== m.sagaId) {
          errors.push(
            `Movie [${m.canonicalId}] phaseId "${m.phaseId}" belongs to saga "${phase.sagaId}", but movie specifies saga "${m.sagaId}"`
          );
        }
      }
    }

    // 2. Series references
    for (const s of series) {
      if (universeIds.size > 0 && !universeIds.has(s.universeId)) {
        errors.push(
          `Series [${s.canonicalId}] references unknown universeId "${s.universeId}"`
        );
      }
      if (sagaIds.size > 0 && !sagaIds.has(s.sagaId)) {
        errors.push(
          `Series [${s.canonicalId}] references unknown sagaId "${s.sagaId}"`
        );
      }
      if (phaseMap.size > 0) {
        const phase = phaseMap.get(s.phaseId);
        if (!phase) {
          errors.push(
            `Series [${s.canonicalId}] references unknown phaseId "${s.phaseId}"`
          );
        } else if (phase.sagaId !== s.sagaId) {
          errors.push(
            `Series [${s.canonicalId}] phaseId "${s.phaseId}" belongs to saga "${phase.sagaId}", but series specifies saga "${s.sagaId}"`
          );
        }
      }
    }

    // 3. Season references
    for (const season of seasons) {
      if (seriesIds.size > 0 && !seriesIds.has(season.tvCanonicalId)) {
        errors.push(
          `Season [${season.canonicalId}] references unknown tvCanonicalId "${season.tvCanonicalId}"`
        );
      }
    }

    // 4. Variant references
    for (const v of variants) {
      if (characterIds.size > 0 && !characterIds.has(v.baseCharacterId)) {
        errors.push(
          `Variant [${v.canonicalId}] references unknown baseCharacterId "${v.baseCharacterId}"`
        );
      }
      if (universeIds.size > 0 && !universeIds.has(v.universeId)) {
        errors.push(
          `Variant [${v.canonicalId}] references unknown universeId "${v.universeId}"`
        );
      }
    }

    // 5. Appearance references
    for (const a of appearances) {
      if (characterIds.size > 0 && !characterIds.has(a.characterId)) {
        errors.push(
          `Appearance [${a.canonicalId}] references unknown characterId "${a.characterId}"`
        );
      }
      if (
        a.mediaType === 'movie' &&
        movieIds.size > 0 &&
        !movieIds.has(a.mediaCanonicalId)
      ) {
        errors.push(
          `Appearance [${a.canonicalId}] references unknown movie "${a.mediaCanonicalId}"`
        );
      }
      if (
        (a.mediaType === 'series' || a.mediaType === 'tv') &&
        seriesIds.size > 0 &&
        !seriesIds.has(a.mediaCanonicalId)
      ) {
        errors.push(
          `Appearance [${a.canonicalId}] references unknown series "${a.mediaCanonicalId}"`
        );
      }
      if (
        a.characterVariantId &&
        variantIds.size > 0 &&
        !variantIds.has(a.characterVariantId)
      ) {
        errors.push(
          `Appearance [${a.canonicalId}] references unknown characterVariantId "${a.characterVariantId}"`
        );
      }
    }

    // 6. Watch Guide entry references
    for (const g of watchGuides) {
      for (const entry of g.entries) {
        if (
          entry.entityType === 'movie' &&
          movieIds.size > 0 &&
          !movieIds.has(entry.entityCanonicalId)
        ) {
          errors.push(
            `Watch guide entry [${entry.id}] in guide [${g.id}] references unknown movie "${entry.entityCanonicalId}"`
          );
        }
        if (
          entry.entityType === 'series' &&
          seriesIds.size > 0 &&
          !seriesIds.has(entry.entityCanonicalId)
        ) {
          errors.push(
            `Watch guide entry [${entry.id}] in guide [${g.id}] references unknown series "${entry.entityCanonicalId}"`
          );
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
