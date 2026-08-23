import fs from 'node:fs';
import path from 'node:path';
import {
  CanonicalMovie,
  CanonicalTvSeries,
  CanonicalCharacter,
  CanonicalAppearance,
  CanonicalUniverse,
  CanonicalSaga,
  CanonicalPhase,
  canonicalMovieSchema,
  canonicalTvSeriesSchema,
  canonicalCharacterSchema,
  canonicalAppearanceSchema,
  canonicalUniverseSchema,
  canonicalSagaSchema,
  canonicalPhaseSchema,
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

  public loadUniverses(): CanonicalUniverse[] {
    const filePath = path.join(this.verifiedDir, 'universes.json');
    const raw = this.readJson<unknown[]>(filePath);
    return raw.map((item, idx) => {
      const res = canonicalUniverseSchema.safeParse(item);
      if (!res.success) {
        throw new CanonicalDataValidationError(
          `Invalid universe record at index ${idx} in universes.json`,
          res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
        );
      }
      return res.data as CanonicalUniverse;
    });
  }

  public loadSagas(): CanonicalSaga[] {
    const filePath = path.join(this.verifiedDir, 'sagas.json');
    const raw = this.readJson<unknown[]>(filePath);
    return raw.map((item, idx) => {
      const res = canonicalSagaSchema.safeParse(item);
      if (!res.success) {
        throw new CanonicalDataValidationError(
          `Invalid saga record at index ${idx} in sagas.json`,
          res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
        );
      }
      return res.data as CanonicalSaga;
    });
  }

  public loadPhases(): CanonicalPhase[] {
    const filePath = path.join(this.verifiedDir, 'phases.json');
    const raw = this.readJson<unknown[]>(filePath);
    return raw.map((item, idx) => {
      const res = canonicalPhaseSchema.safeParse(item);
      if (!res.success) {
        throw new CanonicalDataValidationError(
          `Invalid phase record at index ${idx} in phases.json`,
          res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
        );
      }
      return res.data as CanonicalPhase;
    });
  }

  public loadMovies(): CanonicalMovie[] {
    const folder = path.join(this.verifiedDir, 'movies');
    if (!fs.existsSync(folder)) return [];
    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));

    return files.map((file) => {
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
  }

  public loadTvSeries(): CanonicalTvSeries[] {
    const folder = path.join(this.verifiedDir, 'tv');
    if (!fs.existsSync(folder)) return [];
    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));

    return files.map((file) => {
      const filePath = path.join(folder, file);
      const raw = this.readJson<unknown>(filePath);
      const res = canonicalTvSeriesSchema.safeParse(raw);
      if (!res.success) {
        throw new CanonicalDataValidationError(
          `Invalid TV series entity in file ${file}`,
          res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
        );
      }
      return res.data as CanonicalTvSeries;
    });
  }

  public loadCharacters(): CanonicalCharacter[] {
    const folder = path.join(this.verifiedDir, 'characters');
    if (!fs.existsSync(folder)) return [];
    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));

    return files.map((file) => {
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
  }

  public loadAppearances(): CanonicalAppearance[] {
    const folder = path.join(this.verifiedDir, 'relationships');
    if (!fs.existsSync(folder)) return [];
    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));

    return files.map((file) => {
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
  }
}
