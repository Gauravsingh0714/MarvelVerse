import {
  ThemeMode,
  ResolvedThemeMode,
  ThemeState,
} from '../../types/theme.types.js';
import { THEME_CONFIG } from '../../config/theme.config.js';
import { themeStorage } from './storage-adapter.js';
import { applyThemeToDOM } from '../../utils/dom-theme.utils.js';

/**
 * Dedicated Theme Runtime Orchestrator
 * MarvelVerse Design System - Stage 1.2
 */

export class ThemeManager {
  private mode: ThemeMode;

  constructor(initialMode?: ThemeMode) {
    this.mode = initialMode ?? this.loadStoredMode();
  }

  private loadStoredMode(): ThemeMode {
    const stored = themeStorage.getItem(THEME_CONFIG.storageKey);
    if (stored && THEME_CONFIG.supportedModes.includes(stored)) {
      return stored;
    }
    return THEME_CONFIG.defaultMode;
  }

  public getMode(): ThemeMode {
    return this.mode;
  }

  public setMode(newMode: ThemeMode): ThemeState {
    if (!THEME_CONFIG.supportedModes.includes(newMode)) {
      newMode = THEME_CONFIG.defaultMode;
    }

    this.mode = newMode;
    themeStorage.setItem(THEME_CONFIG.storageKey, newMode);

    const resolvedMode = this.resolveMode(newMode);
    applyThemeToDOM(resolvedMode);

    return {
      mode: this.mode,
      resolvedMode,
      isSystem: this.mode === 'system',
    };
  }

  public resolveMode(mode: ThemeMode = this.mode): ResolvedThemeMode {
    if (mode !== 'system') {
      return mode;
    }

    if (typeof window === 'undefined') {
      return 'dark';
    }

    const highContrastQuery = window.matchMedia('(prefers-contrast: more)');
    if (highContrastQuery.matches) {
      return 'high-contrast';
    }

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return darkQuery.matches ? 'dark' : 'light';
  }

  public getState(): ThemeState {
    const resolvedMode = this.resolveMode(this.mode);
    return {
      mode: this.mode,
      resolvedMode,
      isSystem: this.mode === 'system',
    };
  }

  public getNextMode(): ThemeMode {
    const sequence: ThemeMode[] = ['dark', 'light', 'high-contrast', 'system'];
    const currentIndex = sequence.indexOf(this.mode);
    const nextIndex = (currentIndex + 1) % sequence.length;
    return sequence[nextIndex];
  }
}
