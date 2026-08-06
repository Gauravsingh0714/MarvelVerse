import { useEffect } from 'react';
import { ThemeMode } from '../../types/theme.types.js';

/**
 * Internal System Theme Media Query Observer Hook
 * MarvelVerse Design System - Stage 1.2
 */

export const useSystemThemeObserver = (
  mode: ThemeMode,
  onSystemThemeChange: () => void
): void => {
  useEffect(() => {
    if (mode !== 'system' || typeof window === 'undefined') {
      return;
    }

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');

    const handleChange = () => {
      onSystemThemeChange();
    };

    try {
      darkQuery.addEventListener('change', handleChange);
      contrastQuery.addEventListener('change', handleChange);
    } catch {
      darkQuery.addListener(handleChange);
      contrastQuery.addListener(handleChange);
    }

    return () => {
      try {
        darkQuery.removeEventListener('change', handleChange);
        contrastQuery.removeEventListener('change', handleChange);
      } catch {
        darkQuery.removeListener(handleChange);
        contrastQuery.removeListener(handleChange);
      }
    };
  }, [mode, onSystemThemeChange]);
};
