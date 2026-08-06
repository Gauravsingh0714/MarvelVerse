/**
 * Theme Runtime System Type Definitions
 * MarvelVerse Design System - Stage 1.2
 */

export type ThemeMode = 'system' | 'dark' | 'light' | 'high-contrast';
export type ResolvedThemeMode = 'dark' | 'light' | 'high-contrast';

export interface ThemeState {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  isSystem: boolean;
}

export interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  resetToSystem: () => void;
}

export type ThemeContextState = ThemeState;
export type ThemeContextActions = ThemeActions;

export interface ThemeConfig {
  defaultMode: ThemeMode;
  storageKey: string;
  supportedModes: ThemeMode[];
}

export interface ThemeStorageAdapter {
  getItem: (key: string) => ThemeMode | null;
  setItem: (key: string, value: ThemeMode) => void;
  removeItem: (key: string) => void;
}
