/**
 * Tailwind CSS Preset Mapping to Static Design Tokens
 * MarvelVerse Design System - Stage 1.1
 */

export const tailwindPreset = {
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-bg-canvas)',
        surface: {
          DEFAULT: 'var(--color-bg-surface)',
          raised: 'var(--color-bg-surface-raised)',
          glass: 'var(--color-bg-surface-glass)',
        },
        content: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          accent: 'var(--color-text-accent)',
        },
        stroke: {
          DEFAULT: 'var(--color-border-default)',
          subtle: 'var(--color-border-subtle)',
          focus: 'var(--color-border-focus)',
        },
        stark: {
          DEFAULT: 'var(--color-stark-red)',
          hover: 'var(--color-stark-red-hover)',
        },
        vibranium: 'var(--color-vibranium-cyan)',
        infinity: 'var(--color-infinity-gold)',
        cosmic: 'var(--color-cosmic-purple)',
        tva: 'var(--color-tva-amber)',
      },
      fontFamily: {
        display: ['var(--font-family-display)'],
        heading: ['var(--font-family-heading)'],
        body: ['var(--font-family-body)'],
        code: ['var(--font-family-code)'],
      },
      borderRadius: {
        none: 'var(--radius-none)',
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      borderWidth: {
        none: 'var(--border-width-none)',
        hairline: 'var(--border-width-hairline)',
        thin: 'var(--border-width-thin)',
        medium: 'var(--border-width-medium)',
        thick: 'var(--border-width-thick)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        'glow-cyan': 'var(--shadow-glow-cyan)',
        'glow-red': 'var(--shadow-glow-red)',
        'glow-gold': 'var(--shadow-glow-gold)',
      },
      backdropBlur: {
        none: 'var(--blur-none)',
        sm: 'var(--blur-sm)',
        md: 'var(--blur-md)',
        lg: 'var(--blur-lg)',
        xl: 'var(--blur-xl)',
      },
      zIndex: {
        deep: 'var(--z-deep)',
        base: 'var(--z-base)',
        card: 'var(--z-card)',
        sticky: 'var(--z-sticky)',
        header: 'var(--z-header)',
        dropdown: 'var(--z-dropdown)',
        drawer: 'var(--z-drawer)',
        modal: 'var(--z-modal)',
        tooltip: 'var(--z-tooltip)',
        toast: 'var(--z-toast)',
        curtain: 'var(--z-curtain)',
      },
    },
  },
};
