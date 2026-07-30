# **UI/UX Design System**

## **Project: MarvelVerse – Interactive Marvel Cinematic Universe Explorer**

**Version:** 1.0

---

# **1\. Design Philosophy**

MarvelVerse is not designed to imitate comic books.

Instead, the experience should evoke the feeling of exploring a premium cinematic universe.

### **Design Principles**

* Cinematic over cartoonish  
* Elegant over flashy  
* Immersive over decorative  
* Discoverable over cluttered  
* Content-first  
* Motion enhances, never distracts  
* Consistency across every page

---

# **2\. Brand Personality**

MarvelVerse should communicate:

* Premium  
* Mysterious  
* Futuristic  
* Confident  
* Immersive  
* Minimal  
* Cinematic

Avoid:

* Comic speech bubbles  
* Loud gradients  
* Excessive neon  
* Cartoon UI  
* Overuse of glassmorphism

---

# **3\. Visual Style**

**Primary Inspiration**

* Apple Product Pages  
* Netflix  
* Disney+  
* IMDb (information architecture only)  
* Awwwards-quality portfolio sites

Visual keywords:

* Dark  
* Spacious  
* Layered  
* Depth  
* Subtle glow  
* Cinematic lighting

---

# **4\. Color System**

## **Primary Palette**

| Token | Color | Usage |
| ----- | ----- | ----- |
| Background | `#050505` | Main background |
| Surface | `#111111` | Cards and panels |
| Elevated Surface | `#1A1A1A` | Hover states |
| Border | `rgba(255,255,255,0.08)` | Dividers |
| Primary | `#E62429` | Main CTA |
| Secondary | `#F0C03E` | Ratings, highlights |
| Text Primary | `#FFFFFF` | Headings |
| Text Secondary | `#CFCFCF` | Body |
| Text Muted | `#8A8A8A` | Metadata |
| Success | `#22C55E` | Positive states |
| Warning | `#F59E0B` | Alerts |
| Error | `#EF4444` | Errors |

### **Accessibility Rule**

* Minimum WCAG AA contrast.  
* Never rely on opacity alone for important text.

---

# **5\. Typography System**

## **Font Families**

### **Display**

* Archivo Narrow

Used for:

* Hero headings  
* Movie titles  
* Section titles

### **Body**

* Inter

Used for:

* Paragraphs  
* Metadata  
* Forms  
* Navigation

---

## **Type Scale**

| Style | Size | Weight |
| ----- | ----- | ----- |
| Hero | 72–84px | Bold |
| H1 | 48px | Bold |
| H2 | 36px | SemiBold |
| H3 | 28px | SemiBold |
| H4 | 22px | Medium |
| Body Large | 18px | Regular |
| Body | 16px | Regular |
| Small | 14px | Regular |
| Caption | 12px | Medium |

---

# **6\. Spacing System**

Base Unit: **8px**

Common spacing:

* 8  
* 16  
* 24  
* 32  
* 48  
* 64  
* 96  
* 120

Section spacing:

120px desktop

80px tablet

64px mobile

---

# **7\. Grid System**

Desktop

* 12-column grid  
* Max width: 1440px

Tablet

* 8-column grid

Mobile

* 4-column grid

Content should align consistently across all pages.

---

# **8\. Corner Radius**

| Component | Radius |
| ----- | ----- |
| Buttons | 12px |
| Cards | 16px |
| Inputs | 12px |
| Modals | 24px |
| Images | 20px |

---

# **9\. Shadows & Elevation**

Use subtle depth.

Avoid heavy shadows.

Preferred techniques:

* Border  
* Background separation  
* Blur  
* Ambient glow

---

# **10\. Iconography**

Library:

* Lucide Icons

Rules:

* Consistent stroke width  
* 20–24px size  
* Simple outlines  
* No mixed icon styles

---

# **11\. Component Library**

## **Buttons**

Variants:

* Primary  
* Secondary  
* Ghost  
* Icon  
* Text

States:

* Default  
* Hover  
* Active  
* Focus  
* Disabled  
* Loading

---

## **Cards**

Types:

* Movie Card  
* Character Card  
* Team Card  
* Timeline Card  
* Gallery Card  
* Statistic Card

Every card should include:

* Hover elevation  
* Smooth transition  
* Clear hierarchy  
* Optional accent glow

---

## **Inputs**

* Search  
* Text  
* Dropdown  
* Filters  
* Toggle

States:

* Empty  
* Focused  
* Error  
* Disabled

---

## **Navigation**

Desktop:

* Sticky navigation  
* Glass background  
* Active page indicator

Mobile:

* Full-screen drawer  
* Large touch targets  
* Accessible close action

---

## **Modals**

Used for:

* Trailers  
* Gallery  
* Confirmations  
* Future login

Features:

* Background blur  
* Escape key support  
* Focus trapping

---

# **12\. Motion Design Principles**

Motion should communicate meaning.

### **Timing**

Fast: 150–200ms

Standard: 250–350ms

Cinematic: 500–800ms

---

### **Easing**

Use natural easing curves.

Avoid linear animations except for loaders.

---

### **Examples**

Cards

* Lift  
* Scale  
* Glow

Buttons

* Soft press  
* Ripple (subtle)

Images

* Zoom  
* Parallax

Navigation

* Fade  
* Slide

Pages

* Fade \+ shared element transitions

---

# **13\. Hero Section Guidelines**

Each hero should include:

* Cinematic background  
* Gradient overlay  
* Title  
* Supporting text  
* Primary CTA  
* Secondary CTA  
* Scroll indicator

---

# **14\. Responsive Design Rules**

Desktop

* Full layouts  
* Side-by-side content

Tablet

* Reduced columns  
* Adjusted spacing

Mobile

* Single-column layouts  
* Thumb-friendly interactions  
* Swipe-friendly galleries

---

# **15\. Accessibility Guidelines**

Target:

WCAG AA

Requirements:

* Keyboard navigation  
* Visible focus indicators  
* Screen reader labels  
* Reduced-motion support  
* Accessible contrast  
* Minimum 44×44px touch targets

---

# **16\. Empty States**

Every empty state should:

* Explain why it's empty.  
* Offer a next action.  
* Match the MarvelVerse tone.

Example:

"No characters match your filters."

CTA:

"Explore all characters."

---

# **17\. Error States**

Friendly but thematic.

Example:

**404**

"Looks like you've stepped into the wrong universe."

Buttons:

* Return Home  
* Explore Timeline

---

# **18\. Loading States**

Use skeletons instead of spinners whenever possible.

Examples:

* Poster skeleton  
* Timeline shimmer  
* Character card placeholder  
* Search result placeholder

---

# **19\. Page Templates**

## **Home**

* Hero  
* Featured Saga  
* Trending Titles  
* Characters  
* Timeline Preview  
* Teams  
* Footer

## **Detail Pages**

* Hero  
* Metadata  
* Main Content  
* Related Content  
* Timeline  
* Footer

---

# **20\. Design Tokens**

All visual decisions should be tokenized.

Examples:

* Colors  
* Typography  
* Spacing  
* Radius  
* Motion durations  
* Easing  
* Shadows  
* Borders

This ensures consistency across implementation.

---

# **21\. Interaction Patterns**

Standardize interactions:

* Card hover  
* Button press  
* Image zoom  
* Search suggestions  
* Filter changes  
* Timeline navigation

Interactions should feel consistent regardless of the page.

---

# **22\. Future Design Extensions**

The design system should support future additions without visual inconsistency:

* AI Assistant  
* Universe Map  
* Relationship Graph  
* Watchlists  
* Collections  
* User Profiles  
* Themes (if introduced)

---

# **23\. Quality Checklist**

Every new screen should satisfy:

* Uses approved colors  
* Uses typography scale  
* Uses spacing system  
* Uses component library  
* Meets accessibility guidelines  
* Works responsively  
* Includes loading, empty, and error states  
* Uses approved motion patterns  
* Matches MarvelVerse branding

