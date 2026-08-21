import fs from 'node:fs';
import path from 'node:path';
import { RawSnapshotEnvelope, NormalizedCandidate } from '@marvelverse/shared';

export interface StoragePaths {
  rootDir: string;
  rawDir: string;
  processedDir: string;
}

export class TmdbStorage {
  private readonly rootDir: string;
  private readonly rawDir: string;
  private readonly processedDir: string;

  constructor(baseWorkspaceDir?: string) {
    const cwd = baseWorkspaceDir ?? process.cwd();
    const normalizedCwd = path.normalize(cwd);
    const isSubdir =
      normalizedCwd.endsWith('backend') ||
      normalizedCwd.endsWith('frontend') ||
      normalizedCwd.endsWith('shared');

    this.rootDir = isSubdir ? path.resolve(normalizedCwd, '..') : normalizedCwd;
    this.rawDir = path.resolve(this.rootDir, 'data', 'raw', 'tmdb');
    this.processedDir = path.resolve(this.rootDir, 'data', 'processed', 'tmdb');
  }

  private ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  public saveRawSnapshot<T>(envelope: RawSnapshotEnvelope<T>): string {
    let subfolder = 'movies';
    let filename = `movie-${envelope.tmdbId}.json`;

    switch (envelope.resourceType) {
      case 'movie':
        subfolder = 'movies';
        filename = `movie-${envelope.tmdbId}.json`;
        break;
      case 'tv':
        subfolder = 'tv';
        filename = `tv-${envelope.tmdbId}.json`;
        break;
      case 'movie_credits':
        subfolder = 'credits';
        filename = `movie-credits-${envelope.tmdbId}.json`;
        break;
      case 'tv_credits':
        subfolder = 'credits';
        filename = `tv-credits-${envelope.tmdbId}.json`;
        break;
      case 'tv_season':
        subfolder = 'seasons';
        filename = `tv-season-${envelope.tmdbId}-${envelope.seasonNumber ?? 1}.json`;
        break;
    }

    const targetFolder = path.join(this.rawDir, subfolder);
    this.ensureDir(targetFolder);

    const filePath = path.join(targetFolder, filename);
    fs.writeFileSync(filePath, JSON.stringify(envelope, null, 2), 'utf8');

    return filePath;
  }

  public saveNormalizedCandidate(candidate: NormalizedCandidate): string {
    let subfolder = 'movies';
    let filename = `${candidate.candidateId}.json`;

    if ('releaseDate' in candidate) {
      subfolder = 'movies';
      filename = `movie-${candidate.sourceId}.json`;
    } else if ('numberOfSeasons' in candidate) {
      subfolder = 'tv';
      filename = `tv-${candidate.sourceId}.json`;
    } else if ('mediaType' in candidate) {
      subfolder = 'credits';
      filename = `credits-${candidate.mediaType}-${candidate.sourceId}.json`;
    } else if ('tvSourceId' in candidate) {
      subfolder = 'seasons';
      filename = `season-${candidate.tvSourceId}-${candidate.seasonNumber}.json`;
    }

    const targetFolder = path.join(this.processedDir, subfolder);
    this.ensureDir(targetFolder);

    const filePath = path.join(targetFolder, filename);
    fs.writeFileSync(filePath, JSON.stringify(candidate, null, 2), 'utf8');

    return filePath;
  }

  public getRawSnapshot<T>(
    resourceType: RawSnapshotEnvelope['resourceType'],
    tmdbId: number,
    seasonNumber?: number
  ): RawSnapshotEnvelope<T> | null {
    let subfolder = 'movies';
    let filename = `movie-${tmdbId}.json`;

    switch (resourceType) {
      case 'movie':
        subfolder = 'movies';
        filename = `movie-${tmdbId}.json`;
        break;
      case 'tv':
        subfolder = 'tv';
        filename = `tv-${tmdbId}.json`;
        break;
      case 'movie_credits':
        subfolder = 'credits';
        filename = `movie-credits-${tmdbId}.json`;
        break;
      case 'tv_credits':
        subfolder = 'credits';
        filename = `tv-credits-${tmdbId}.json`;
        break;
      case 'tv_season':
        subfolder = 'seasons';
        filename = `tv-season-${tmdbId}-${seasonNumber ?? 1}.json`;
        break;
    }

    const filePath = path.join(this.rawDir, subfolder, filename);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content) as RawSnapshotEnvelope<T>;
  }
}
