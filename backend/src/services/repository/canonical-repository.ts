import {
  CanonicalDataLoader,
  ReferenceIntegrityReport,
} from './canonical-data-loader.js';
import { CanonicalCache } from './canonical-cache.js';
import { FoundationRepository } from './foundation-repository.js';
import { MovieRepository } from './movie-repository.js';
import { TvRepository } from './tv-repository.js';
import { CharacterRepository } from './character-repository.js';
import { RelationshipRepository } from './relationship-repository.js';
import { WatchGuideRepository } from './watch-guide-repository.js';

export interface CanonicalRepositoryOptions {
  baseWorkspaceDir?: string;
  loader?: CanonicalDataLoader;
  cache?: CanonicalCache;
}

export class CanonicalRepository {
  public readonly foundation: FoundationRepository;
  public readonly movies: MovieRepository;
  public readonly tv: TvRepository;
  public readonly characters: CharacterRepository;
  public readonly relationships: RelationshipRepository;
  public readonly watchGuides: WatchGuideRepository;
  public readonly cache: CanonicalCache;
  public readonly loader: CanonicalDataLoader;

  constructor(options: CanonicalRepositoryOptions = {}) {
    this.cache = options.cache ?? new CanonicalCache();
    this.loader =
      options.loader ?? new CanonicalDataLoader(options.baseWorkspaceDir);

    this.foundation = new FoundationRepository(this.loader, this.cache);
    this.movies = new MovieRepository(this.loader, this.cache);
    this.tv = new TvRepository(this.loader, this.cache);
    this.characters = new CharacterRepository(this.loader, this.cache);
    this.relationships = new RelationshipRepository(this.loader, this.cache);
    this.watchGuides = new WatchGuideRepository(this.loader, this.cache);
  }

  public validateIntegrity(): ReferenceIntegrityReport {
    return this.loader.validateReferenceIntegrity();
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

let sharedRepositoryInstance: CanonicalRepository | null = null;

export function createCanonicalRepository(
  options: CanonicalRepositoryOptions = {}
): CanonicalRepository {
  return new CanonicalRepository(options);
}

export function getCanonicalRepository(
  options: CanonicalRepositoryOptions = {}
): CanonicalRepository {
  if (!sharedRepositoryInstance || Object.keys(options).length > 0) {
    const instance = createCanonicalRepository(options);
    if (Object.keys(options).length === 0) {
      sharedRepositoryInstance = instance;
    }
    return instance;
  }
  return sharedRepositoryInstance;
}
