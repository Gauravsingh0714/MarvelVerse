import { colors } from '../primitives/colors.js';
import { SemanticColors } from '../types/tokens.types.js';

/**
 * Semantic Color Maps (Dark Default, Light Variant, High-Contrast Variant)
 * MarvelVerse Design System - Stage 1.1
 */

export const darkSemanticColors: SemanticColors = {
  bgCanvas: colors.obsidian[900],
  bgSurface: colors.obsidian[850],
  bgSurfaceRaised: colors.obsidian[800],
  bgSurfaceGlass: 'rgba(16, 20, 29, 0.7)',
  textPrimary: colors.obsidian[100],
  textSecondary: colors.obsidian[300],
  textMuted: colors.obsidian[400],
  textAccent: colors.vibraniumCyan.DEFAULT,
  borderDefault: colors.obsidian[700],
  borderSubtle: colors.obsidian[800],
  borderFocus: colors.vibraniumCyan.DEFAULT,
  interactivePrimary: colors.starkRed.DEFAULT,
  interactiveHover: colors.starkRed.hover,
  statusSuccess: colors.status.success,
  statusWarning: colors.status.warning,
  statusError: colors.status.error,
  statusInfo: colors.status.info,
};

export const lightSemanticColors: SemanticColors = {
  bgCanvas: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSurfaceRaised: '#F1F5F9',
  bgSurfaceGlass: 'rgba(255, 255, 255, 0.85)',
  textPrimary: colors.obsidian[950],
  textSecondary: colors.obsidian[700],
  textMuted: colors.obsidian[500],
  textAccent: '#00838F',
  borderDefault: '#E2E8F0',
  borderSubtle: '#F1F5F9',
  borderFocus: '#00838F',
  interactivePrimary: colors.starkRed.DEFAULT,
  interactiveHover: colors.starkRed.hover,
  statusSuccess: colors.status.success,
  statusWarning: colors.status.warning,
  statusError: colors.status.error,
  statusInfo: colors.status.info,
};

export const highContrastSemanticColors: SemanticColors = {
  bgCanvas: '#000000',
  bgSurface: '#000000',
  bgSurfaceRaised: '#121212',
  bgSurfaceGlass: '#000000',
  textPrimary: '#FFFFFF',
  textSecondary: '#FFFF00',
  textMuted: '#E0E0E0',
  textAccent: '#00FFFF',
  borderDefault: '#FFFFFF',
  borderSubtle: '#FFFFFF',
  borderFocus: '#00FFFF',
  interactivePrimary: '#FF0000',
  interactiveHover: '#CC0000',
  statusSuccess: '#00FF00',
  statusWarning: '#FFFF00',
  statusError: '#FF0000',
  statusInfo: '#00FFFF',
};
