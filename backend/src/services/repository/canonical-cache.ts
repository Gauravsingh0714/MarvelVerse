export class CanonicalCache {
  private readonly store = new Map<string, unknown>();

  public get<T>(key: string): T | undefined {
    return this.store.get(key) as T | undefined;
  }

  public set<T>(key: string, value: T): void {
    this.store.set(key, value);
  }

  public has(key: string): boolean {
    return this.store.has(key);
  }

  public getOrLoad<T>(key: string, loader: () => T): T {
    if (this.store.has(key)) {
      return this.store.get(key) as T;
    }
    const data = loader();
    this.store.set(key, data);
    return data;
  }

  public clear(): void {
    this.store.clear();
  }
}
