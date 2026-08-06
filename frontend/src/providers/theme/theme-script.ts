import { THEME_CONFIG } from '../../config/theme.config.js';

/**
 * Framework-Agnostic Anti-Flash Head Initialization Script
 * MarvelVerse Design System - Stage 1.2
 */

export const getThemeInitializationScript = (): string => {
  const { storageKey, defaultMode } = THEME_CONFIG;

  return `(function() {
    try {
      var key = '${storageKey}';
      var defaultMode = '${defaultMode}';
      var stored = localStorage.getItem(key);
      var mode = stored || defaultMode;
      var resolved = mode;

      if (mode === 'system') {
        var mql = window.matchMedia('(prefers-color-scheme: dark)');
        var highContrast = window.matchMedia('(prefers-contrast: more)');
        if (highContrast.matches) {
          resolved = 'high-contrast';
        } else {
          resolved = mql.matches ? 'dark' : 'light';
        }
      }

      document.documentElement.setAttribute('data-theme', resolved);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();`;
};
