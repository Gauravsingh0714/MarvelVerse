import { ResolvedThemeMode } from '../types/theme.types.js';

/**
 * DOM Theme Synchronization Utilities
 * MarvelVerse Design System - Stage 1.2
 */

let transitionTimeout: ReturnType<typeof setTimeout> | null = null;

export const enableThemeTransitions = (durationMs = 250): void => {
  if (typeof document === 'undefined') return;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;

  const root = document.documentElement;
  root.classList.add('theme-transitioning');

  if (transitionTimeout) {
    clearTimeout(transitionTimeout);
  }

  transitionTimeout = setTimeout(() => {
    root.classList.remove('theme-transitioning');
    transitionTimeout = null;
  }, durationMs);
};

export const applyThemeToDOM = (resolvedMode: ResolvedThemeMode): void => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme');

  if (currentTheme !== resolvedMode) {
    enableThemeTransitions();
    root.setAttribute('data-theme', resolvedMode);
  }
};
