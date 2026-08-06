import { ThemeMode, ThemeStorageAdapter } from '../../types/theme.types.js';

/**
 * Exception-Proof Theme Storage Adapter
 * MarvelVerse Design System - Stage 1.2
 */

class MemoryStorageAdapter implements ThemeStorageAdapter {
  private memoryMap = new Map<string, ThemeMode>();

  getItem(key: string): ThemeMode | null {
    return this.memoryMap.get(key) ?? null;
  }

  setItem(key: string, value: ThemeMode): void {
    this.memoryMap.set(key, value);
  }

  removeItem(key: string): void {
    this.memoryMap.delete(key);
  }
}

class SafeLocalStorageAdapter implements ThemeStorageAdapter {
  private fallback = new MemoryStorageAdapter();

  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__marvelverse_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key: string): ThemeMode | null {
    if (!this.isLocalStorageAvailable()) {
      return this.fallback.getItem(key);
    }
    try {
      const val = window.localStorage.getItem(key);
      return val as ThemeMode | null;
    } catch {
      return this.fallback.getItem(key);
    }
  }

  setItem(key: string, value: ThemeMode): void {
    if (!this.isLocalStorageAvailable()) {
      this.fallback.setItem(key, value);
      return;
    }
    try {
      window.localStorage.setItem(key, value);
    } catch {
      this.fallback.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (!this.isLocalStorageAvailable()) {
      this.fallback.removeItem(key);
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch {
      this.fallback.removeItem(key);
    }
  }
}

export const themeStorage: ThemeStorageAdapter = new SafeLocalStorageAdapter();
