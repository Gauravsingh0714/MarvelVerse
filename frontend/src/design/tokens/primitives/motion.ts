import { MotionTokens } from '../types/tokens.types.js';

/**
 * Primitive Motion Tokens (Durations & Easings)
 * MarvelVerse Design System - Stage 1.1
 */

export const motion: MotionTokens = {
  durations: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    cinematic: '600ms',
  },
  easings: {
    standard: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
    in: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
    out: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};
