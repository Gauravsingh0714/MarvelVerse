/**
 * Primitive Color Palette
 * MarvelVerse Design System - Stage 1.1
 */

export const colors = {
  // Neutrals (Obsidian Space Scale)
  obsidian: {
    950: '#07090E',
    900: '#0B0E14',
    850: '#10141D',
    800: '#161B26',
    700: '#202736',
    600: '#2D364A',
    500: '#44516B',
    400: '#687899',
    300: '#94A3C7',
    200: '#CBD5E1',
    100: '#F8FAFC',
  },

  // Heroic Accents
  starkRed: {
    DEFAULT: '#E50914',
    hover: '#C10711',
    alpha: 'rgba(229, 9, 20, 0.4)',
  },
  vibraniumCyan: {
    DEFAULT: '#00F2FE',
    hover: '#00D8E4',
    alpha: 'rgba(0, 242, 254, 0.35)',
  },
  infinityGold: {
    DEFAULT: '#FFD700',
    hover: '#E5C100',
    alpha: 'rgba(255, 215, 0, 0.35)',
  },
  cosmicPurple: {
    DEFAULT: '#8A2BE2',
    hover: '#7622C7',
    alpha: 'rgba(138, 43, 226, 0.35)',
  },
  tvaAmber: {
    DEFAULT: '#FF9F1C',
    hover: '#E58B0E',
    alpha: 'rgba(255, 159, 28, 0.35)',
  },

  // Status / Feedback
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;
