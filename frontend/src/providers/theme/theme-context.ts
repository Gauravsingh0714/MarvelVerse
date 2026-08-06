import { createContext } from 'react';
import {
  ThemeContextState,
  ThemeContextActions,
} from '../../types/theme.types.js';

/**
 * Partitioned React Contexts (Internal to Theme Package)
 * MarvelVerse Design System - Stage 1.2
 */

export const ThemeStateContext = createContext<ThemeContextState | undefined>(
  undefined
);
export const ThemeActionsContext = createContext<
  ThemeContextActions | undefined
>(undefined);
