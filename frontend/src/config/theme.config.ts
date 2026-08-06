import { ThemeConfig } from '../types/theme.types.js';

/**
 * Default Theme Runtime Configuration
 * MarvelVerse Design System - Stage 1.2
 */

export const THEME_CONFIG: ThemeConfig = {
  defaultMode: 'system',
  storageKey: 'marvelverse-theme-mode',
  supportedModes: ['system', 'dark', 'light', 'high-contrast'],
};
