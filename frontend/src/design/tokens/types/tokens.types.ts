/**
 * Design Tokens Type Definitions
 * MarvelVerse Design System - Stage 1.1
 */

export interface ColorPrimitive {
  [key: string]: string;
}

export interface TypographyScale {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing: string;
}

export interface TypographyTokens {
  families: {
    display: string;
    heading: string;
    body: string;
    code: string;
  };
  styles: {
    displayHero: TypographyScale;
    displayXl: TypographyScale;
    headingH1: TypographyScale;
    headingH2: TypographyScale;
    headingH3: TypographyScale;
    bodyLg: TypographyScale;
    bodyMd: TypographyScale;
    bodySm: TypographyScale;
    caption: TypographyScale;
    code: TypographyScale;
  };
}

export interface SpacingTokens {
  '0': string;
  '05': string;
  '1': string;
  '2': string;
  '3': string;
  '4': string;
  '6': string;
  '8': string;
  '12': string;
  '16': string;
  '24': string;
  '32': string;
}

export interface RadiusTokens {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface BorderWidthTokens {
  none: string;
  hairline: string;
  thin: string;
  medium: string;
  thick: string;
}

export interface IconSizeTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ShadowTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  glowCyan: string;
  glowRed: string;
  glowGold: string;
}

export interface MotionTokens {
  durations: {
    instant: string;
    fast: string;
    normal: string;
    slow: string;
    cinematic: string;
  };
  easings: {
    standard: string;
    in: string;
    out: string;
    cinematic: string;
    spring: string;
  };
}

export interface BlurTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface OpacityTokens {
  disabled: number;
  inactive: number;
  glass: number;
  hover: number;
  full: number;
}

export interface ZIndexTokens {
  deep: number;
  base: number;
  card: number;
  sticky: number;
  header: number;
  dropdown: number;
  drawer: number;
  modal: number;
  tooltip: number;
  toast: number;
  curtain: number;
}

export interface BreakpointTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface SemanticColors {
  bgCanvas: string;
  bgSurface: string;
  bgSurfaceRaised: string;
  bgSurfaceGlass: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;
  borderDefault: string;
  borderSubtle: string;
  borderFocus: string;
  interactivePrimary: string;
  interactiveHover: string;
  statusSuccess: string;
  statusWarning: string;
  statusError: string;
  statusInfo: string;
}
