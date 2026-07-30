---
name: Cinematic Noir
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e7bdb8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ad8884'
  outline-variant: '#5d3f3c'
  surface-tint: '#ffb4ac'
  primary: '#ffb4ac'
  on-primary: '#690007'
  primary-container: '#e62429'
  on-primary-container: '#ffffff'
  inverse-primary: '#c00016'
  secondary: '#f0c03e'
  on-secondary: '#3e2e00'
  secondary-container: '#ba9000'
  on-secondary-container: '#3c2c00'
  tertiary: '#82cfff'
  on-tertiary: '#00344b'
  tertiary-container: '#007fb0'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#93000e'
  secondary-fixed: '#ffdf95'
  secondary-fixed-dim: '#f0c03e'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#594400'
  tertiary-fixed: '#c6e7ff'
  tertiary-fixed-dim: '#82cfff'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#004c6b'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Archivo Narrow
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 90px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: 0em
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0.02em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system is engineered for a premium, immersive exploration of the Marvel Cinematic Universe. The personality is "Quiet Authority"—it recedes to let high-resolution character art and cinematic posters command the user's attention. 

The aesthetic blends **Minimalism** with high-end **Glassmorphism**. It utilizes extreme whitespace (Apple-inspired) and a disciplined dark-mode density (Netflix-inspired). The emotional goal is to evoke the feeling of a private screening room: sophisticated, high-contrast, and expensive. Every element feels intentional, avoiding clutter to focus on the epic scale of the content.

## Colors

The palette is anchored in **Pure Black (#050505)** to ensure perfect black levels on OLED displays, creating a true cinematic backdrop. 

- **Marvel Red (#E62429)**: Reserved strictly for primary actions, critical highlights, and brand moments. It carries a subtle outer glow in interactive states.
- **Gold (#F5C542)**: Used exclusively for "Prestige" metadata, such as ratings, award wins, or Phase milestones.
- **Grayscale Tiering**: We use a three-tier surface system (#050505, #111111, #181818) to create depth without relying on traditional shadows.
- **Typography**: Primary text uses **Crisp White (#F5F5F5)** for maximum legibility against dark backgrounds, while secondary metadata uses a muted gray to maintain visual hierarchy.

## Typography

The typography system strikes a balance between "Impact" and "Utility." 

**Archivo Narrow** is used for headlines to mirror movie billing blocks and posters. It is intentionally condensed and always set in uppercase for high-impact titles. **Inter** provides a clean, systematic contrast for body copy and metadata. To maintain the premium feel, body text features generous tracking (+0.02em) and a comfortable line height (1.6x - 1.8x) to prevent eye fatigue during long reading sessions about lore and characters.

## Layout & Spacing

This design system employs a **Fluid Grid** with wide gutters and expansive margins to create an "Editorial" layout. 

- **Desktop**: A 12-column grid with 64px outer margins. Section vertical spacing is aggressive (120px) to allow content to "breathe."
- **Mobile**: A 4-column grid with 20px margins. Content cards often bleed to the edge or use a 16px inset to maximize screen real estate for imagery.
- **Alignment**: Elements are strictly aligned to an 8px baseline grid to ensure mathematical harmony across the UI.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Glassmorphism** rather than traditional elevation.

1.  **Background**: Pure Black (#050505).
2.  **Navigation/Overlays**: Uses a Backdrop Blur (20px to 40px) with a 10% opacity white tint to create a "Frosted Obsidian" effect.
3.  **Surfaces**: Cards use #181818 with a 1px inner border (Stroke: #FFFFFF, 8% opacity) to catch the light, simulating a chamfered edge.
4.  **Shadows**: Only used for interactive elements. A soft, expansive black shadow (Blur 30px, Y-10) is used to lift cards slightly on hover.

## Shapes

The shape language is "Soft Geometric." A base radius of **16px (rounded-lg)** is applied to all primary content cards and movie posters to soften the aggressive nature of the high-contrast dark theme. Small utility components like buttons and badges use a slightly smaller radius for a tighter, more functional appearance.

## Components

- **Buttons**:
    - *Primary*: Solid Marvel Red (#E62429) with white text. High-gloss finish. On hover, apply a 15px outer red glow.
    - *Secondary*: Ghost style. 1.5px white border at 40% opacity. Text in white.
- **Content Cards**: 16px corner radius. Feature a bottom-up linear gradient (Black 80% to Transparent) to ensure text legibility over character art.
- **Badges**: Small, pill-shaped with 4px radius. "Phase" badges use a subtle gray fill; "Status" or "Live" badges use a pulsating Red dot.
- **Inputs**: Underlined or subtly boxed with #181818. Focus state highlights the border in Marvel Red.
- **Poster Carousel**: Large-scale images with a "Scale-up" interaction on hover (1.05x) and a subtle increase in brightness.