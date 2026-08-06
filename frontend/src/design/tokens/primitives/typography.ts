import { TypographyTokens } from '../types/tokens.types.js';

/**
 * Primitive Typography Tokens
 * MarvelVerse Design System - Stage 1.1
 */

export const typography: TypographyTokens = {
  families: {
    display:
      "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading:
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    code: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace",
  },
  styles: {
    displayHero: {
      fontSize: '4.5rem', // 72px
      lineHeight: '1.05',
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    displayXl: {
      fontSize: '3.5rem', // 56px
      lineHeight: '1.1',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    headingH1: {
      fontSize: '2.5rem', // 40px
      lineHeight: '1.2',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    headingH2: {
      fontSize: '2.0rem', // 32px
      lineHeight: '1.25',
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    headingH3: {
      fontSize: '1.5rem', // 24px
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    bodyLg: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.6',
      fontWeight: 400,
      letterSpacing: '0.0em',
    },
    bodyMd: {
      fontSize: '1.0rem', // 16px
      lineHeight: '1.5',
      fontWeight: 400,
      letterSpacing: '0.0em',
    },
    bodySm: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.4',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1.33',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    code: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.4',
      fontWeight: 400,
      letterSpacing: '0.0em',
    },
  },
};
