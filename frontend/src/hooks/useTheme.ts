import { useContext } from 'react';
import {
  ThemeStateContext,
  ThemeActionsContext,
} from '../providers/theme/theme-context.js';
import { ThemeState, ThemeActions } from '../types/theme.types.js';

/**
 * Master Public Theme Hook
 * MarvelVerse Design System - Stage 1.2
 */

export interface UseThemeReturn extends ThemeState, ThemeActions {}

export const useTheme = (): UseThemeReturn => {
  const state = useContext(ThemeStateContext);
  const actions = useContext(ThemeActionsContext);

  if (!state || !actions) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. Wrap your app root with <ThemeProvider>.'
    );
  }

  return {
    ...state,
    ...actions,
  };
};
