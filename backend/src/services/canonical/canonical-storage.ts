import fs from 'node:fs';
import path from 'node:path';
import {
  CanonicalUniverse,
  CanonicalSaga,
  CanonicalPhase,
  CanonicalMovie,
  CanonicalTvSeries,
  CanonicalCharacter,
  CanonicalAppearance,
} from '@marvelverse/shared';

export class CanonicalStorage {
  private readonly rootDir: string;
  private readonly verifiedDir: string;

  constructor(baseWorkspaceDir?: string) {
    const cwd = baseWorkspaceDir ?? process.cwd();
    const normalizedCwd = path.normalize(cwd);
    const isSubdir =
      normalizedCwd.endsWith('backend') ||
      normalizedCwd.endsWith('frontend') ||
      normalizedCwd.endsWith('shared');

    this.rootDir = isSubdir ? path.resolve(normalizedCwd, '..') : normalizedCwd;
    this.verifiedDir = path.resolve(this.rootDir, 'data', 'verified');
  }

  private ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  public loadUniverses(): CanonicalUniverse[] {
    const filePath = path.join(this.verifiedDir, 'universes.json');
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as CanonicalUniverse[];
  }

  public loadSagas(): CanonicalSaga[] {
    const filePath = path.join(this.verifiedDir, 'sagas.json');
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as CanonicalSaga[];
  }

  public loadPhases(): CanonicalPhase[] {
    const filePath = path.join(this.verifiedDir, 'phases.json');
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as CanonicalPhase[];
  }

  public loadMovies(): CanonicalMovie[] {
    const moviesFolder = path.join(this.verifiedDir, 'movies');
    if (!fs.existsSync(moviesFolder)) return [];
    const files = fs
      .readdirSync(moviesFolder)
      .filter((f) => f.endsWith('.json'));
    return files.map(
      (file) =>
        JSON.parse(
          fs.readFileSync(path.join(moviesFolder, file), 'utf8')
        ) as CanonicalMovie
    );
  }

  public saveMovie(movie: CanonicalMovie): string {
    const folder = path.join(this.verifiedDir, 'movies');
    this.ensureDir(folder);
    const filePath = path.join(folder, `${movie.canonicalId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(movie, null, 2), 'utf8');
    return filePath;
  }

  public loadTvSeries(): CanonicalTvSeries[] {
    const tvFolder = path.join(this.verifiedDir, 'tv');
    if (!fs.existsSync(tvFolder)) return [];
    const files = fs.readdirSync(tvFolder).filter((f) => f.endsWith('.json'));
    return files.map(
      (file) =>
        JSON.parse(
          fs.readFileSync(path.join(tvFolder, file), 'utf8')
        ) as CanonicalTvSeries
    );
  }

  public saveTvSeries(tv: CanonicalTvSeries): string {
    const folder = path.join(this.verifiedDir, 'tv');
    this.ensureDir(folder);
    const filePath = path.join(folder, `${tv.canonicalId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(tv, null, 2), 'utf8');
    return filePath;
  }

  public loadCharacters(): CanonicalCharacter[] {
    const folder = path.join(this.verifiedDir, 'characters');
    if (!fs.existsSync(folder)) return [];
    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));
    return files.map(
      (file) =>
        JSON.parse(
          fs.readFileSync(path.join(folder, file), 'utf8')
        ) as CanonicalCharacter
    );
  }

  public saveCharacter(character: CanonicalCharacter): string {
    const folder = path.join(this.verifiedDir, 'characters');
    this.ensureDir(folder);
    const filePath = path.join(folder, `${character.canonicalId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(character, null, 2), 'utf8');
    return filePath;
  }

  public loadAppearances(): CanonicalAppearance[] {
    const folder = path.join(this.verifiedDir, 'relationships');
    if (!fs.existsSync(folder)) return [];
    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.json'));
    return files.map(
      (file) =>
        JSON.parse(
          fs.readFileSync(path.join(folder, file), 'utf8')
        ) as CanonicalAppearance
    );
  }

  public saveAppearance(appearance: CanonicalAppearance): string {
    const folder = path.join(this.verifiedDir, 'relationships');
    this.ensureDir(folder);
    const filePath = path.join(folder, `${appearance.canonicalId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(appearance, null, 2), 'utf8');
    return filePath;
  }
}
