import {
  WatchGuide,
  WatchGuideEntry,
  RoadToDoomsdayTier,
} from '@marvelverse/shared';
import { CanonicalDataLoader } from './canonical-data-loader.js';
import { CanonicalCache } from './canonical-cache.js';

export class WatchGuideRepository {
  private readonly loader: CanonicalDataLoader;
  private readonly cache: CanonicalCache;

  constructor(loader?: CanonicalDataLoader, cache?: CanonicalCache) {
    this.loader = loader ?? new CanonicalDataLoader();
    this.cache = cache ?? new CanonicalCache();
  }

  private clone<T>(data: T): T {
    return structuredClone(data);
  }

  private getGuidesInternal(): WatchGuide[] {
    return this.cache.getOrLoad('watch_guides', () => {
      const guides = this.loader.loadWatchGuides();
      return guides.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  public getWatchGuides(): WatchGuide[] {
    const guides = this.getGuidesInternal();
    return this.clone(guides);
  }

  public getWatchGuideById(id: string): WatchGuide | null {
    const guides = this.getGuidesInternal();
    const found = guides.find((g) => g.id === id);
    return found ? this.clone(found) : null;
  }

  public getWatchGuideBySlug(slug: string): WatchGuide | null {
    const guides = this.getGuidesInternal();
    const found = guides.find((g) => g.slug === slug);
    return found ? this.clone(found) : null;
  }

  public getEntries(guideIdOrSlug?: string): WatchGuideEntry[] {
    const guides = this.getGuidesInternal();
    if (guideIdOrSlug) {
      const guide = guides.find(
        (g) => g.id === guideIdOrSlug || g.slug === guideIdOrSlug
      );
      if (!guide) return [];
      const sorted = [...guide.entries].sort(
        (a, b) => a.curatedOrder - b.curatedOrder
      );
      return this.clone(sorted);
    }

    const allEntries: WatchGuideEntry[] = [];
    for (const g of guides) {
      allEntries.push(...g.entries);
    }
    allEntries.sort((a, b) => a.curatedOrder - b.curatedOrder);
    return this.clone(allEntries);
  }

  public getEntriesByTier(
    tier: RoadToDoomsdayTier,
    guideIdOrSlug?: string
  ): WatchGuideEntry[] {
    const entries = this.getEntries(guideIdOrSlug);
    const filtered = entries.filter((e) => e.tier === tier);
    return this.clone(filtered);
  }
}
