import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import { ThemeMode, ThemeState } from '../../types/theme.types.js';
import { ThemeManager } from './theme-manager.js';
import { ThemeStateContext, ThemeActionsContext } from './theme-context.js';
import { useSystemThemeObserver } from '../../hooks/internal/useSystemThemeObserver.js';
import { applyThemeToDOM } from '../../utils/dom-theme.utils.js';

/**
 * Lightweight Theme Provider Component
 * MarvelVerse Design System - Stage 1.2
 */

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode,
}) => {
  const manager = useMemo(() => new ThemeManager(defaultMode), [defaultMode]);
  const [state, setState] = useState<ThemeState>(() => manager.getState());

  // Synchronize DOM attribute before first browser layout paint
  useIsomorphicLayoutEffect(() => {
    applyThemeToDOM(state.resolvedMode);
  }, [state.resolvedMode]);

  const handleSystemChange = useCallback(() => {
    const nextState = manager.getState();
    applyThemeToDOM(nextState.resolvedMode);
    setState(nextState);
  }, [manager]);

  useSystemThemeObserver(state.mode, handleSystemChange);

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      const nextState = manager.setMode(newMode);
      setState(nextState);
    },
    [manager]
  );

  const toggleMode = useCallback(() => {
    const nextMode = manager.getNextMode();
    const nextState = manager.setMode(nextMode);
    setState(nextState);
  }, [manager]);

  const resetToSystem = useCallback(() => {
    const nextState = manager.setMode('system');
    setState(nextState);
  }, [manager]);

  const actionsValue = useMemo(
    () => ({
      setMode,
      toggleMode,
      resetToSystem,
    }),
    [setMode, toggleMode, resetToSystem]
  );

  return (
    <ThemeStateContext.Provider value={state}>
      <ThemeActionsContext.Provider value={actionsValue}>
        {children}
      </ThemeActionsContext.Provider>
    </ThemeStateContext.Provider>
  );
};
