import { CanonicalAppearance } from '@marvelverse/shared';
import { CanonicalDataLoader } from './canonical-data-loader.js';
import { CanonicalCache } from './canonical-cache.js';

export class RelationshipRepository {
  private readonly loader: CanonicalDataLoader;
  private readonly cache: CanonicalCache;

  constructor(loader?: CanonicalDataLoader, cache?: CanonicalCache) {
    this.loader = loader ?? new CanonicalDataLoader();
    this.cache = cache ?? new CanonicalCache();
  }

  private clone<T>(data: T): T {
    return structuredClone(data);
  }

  private getAllInternal(): CanonicalAppearance[] {
    return this.cache.getOrLoad('appearances', () => {
      const appearances = this.loader.loadAppearances();
      return appearances.sort((a, b) =>
        a.canonicalId.localeCompare(b.canonicalId)
      );
    });
  }

  public getAppearances(): CanonicalAppearance[] {
    const appearances = this.getAllInternal();
    return this.clone(appearances);
  }

  public getAppearanceById(canonicalId: string): CanonicalAppearance | null {
    const appearances = this.getAllInternal();
    const found = appearances.find((a) => a.canonicalId === canonicalId);
    return found ? this.clone(found) : null;
  }

  public getAppearancesByCharacter(characterId: string): CanonicalAppearance[] {
    const appearances = this.getAllInternal();
    const filtered = appearances.filter((a) => a.characterId === characterId);
    return this.clone(filtered);
  }

  public getAppearancesByMedia(
    mediaCanonicalId: string
  ): CanonicalAppearance[] {
    const appearances = this.getAllInternal();
    const filtered = appearances.filter(
      (a) => a.mediaCanonicalId === mediaCanonicalId
    );
    return this.clone(filtered);
  }
}
