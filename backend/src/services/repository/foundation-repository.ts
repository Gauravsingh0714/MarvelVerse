import {
  CanonicalUniverse,
  CanonicalSaga,
  CanonicalPhase,
} from '@marvelverse/shared';
import { CanonicalDataLoader } from './canonical-data-loader.js';
import { CanonicalCache } from './canonical-cache.js';

export class FoundationRepository {
  private readonly loader: CanonicalDataLoader;
  private readonly cache: CanonicalCache;

  constructor(loader?: CanonicalDataLoader, cache?: CanonicalCache) {
    this.loader = loader ?? new CanonicalDataLoader();
    this.cache = cache ?? new CanonicalCache();
  }

  private clone<T>(data: T): T {
    return structuredClone(data);
  }

  public getUniverses(): CanonicalUniverse[] {
    const universes = this.cache.getOrLoad('universes', () =>
      this.loader.loadUniverses()
    );
    return this.clone(universes);
  }

  public getUniverseById(universeId: string): CanonicalUniverse | null {
    const universes = this.cache.getOrLoad('universes', () =>
      this.loader.loadUniverses()
    );
    const found = universes.find((u) => u.id === universeId);
    return found ? this.clone(found) : null;
  }

  public getSagas(): CanonicalSaga[] {
    const sagas = this.cache.getOrLoad('sagas', () => this.loader.loadSagas());
    const sorted = [...sagas].sort((a, b) => a.order - b.order);
    return this.clone(sorted);
  }

  public getSagaById(sagaId: string): CanonicalSaga | null {
    const sagas = this.cache.getOrLoad('sagas', () => this.loader.loadSagas());
    const found = sagas.find((s) => s.id === sagaId);
    return found ? this.clone(found) : null;
  }

  public getPhases(): CanonicalPhase[] {
    const phases = this.cache.getOrLoad('phases', () =>
      this.loader.loadPhases()
    );
    const sorted = [...phases].sort((a, b) => a.number - b.number);
    return this.clone(sorted);
  }

  public getPhaseById(phaseId: string): CanonicalPhase | null {
    const phases = this.cache.getOrLoad('phases', () =>
      this.loader.loadPhases()
    );
    const found = phases.find((p) => p.id === phaseId);
    return found ? this.clone(found) : null;
  }
}
