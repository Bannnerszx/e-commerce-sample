---
version: alpha
name: Ubuntu
description: Modern violet/indigo theme with high-contrast light and dark mode tokens.
colors:
  light:
    text: "#050315"
    bg: "#fbfbfe"
    primary: "#2f27ce"
    secondary: "#dedcff"
    accent: "#443dff"
  dark:
    text: "#eae9fc"
    bg: "#010104"
    primary: "#3a31d8"
    secondary: "#020024"
    accent: "#0600c2"
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 3.75rem
    fontWeight: 600
    letterSpacing: "-0.02em"
  h1:
    fontFamily: Space Grotesk
    fontSize: 2rem
    fontWeight: 600
  body:
    fontFamily: IBM Plex Sans
    fontSize: 0.95rem
    lineHeight: 1.6
  label:
    fontFamily: IBM Plex Mono
    fontSize: 0.72rem
    letterSpacing: "0.06em"
rounded:
  sm: 4px
  md: 6px
  lg: 10px
spacing:
  sm: 8px
  md: 16px
  lg: 32px
components:
  button-primary:
    backgroundColor: "{colors.light.primary}"
    textColor: "{colors.light.bg}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  card:
    backgroundColor: "{colors.light.secondary}"
    textColor: "{colors.light.text}"
    rounded: "{rounded.lg}"
    padding: 24px
---
## Overview

A dynamic indigo palette structured with dedicated Light and Dark mode tokens for high-contrast accessibility across themes.

The landing page uses a **Monochrome Base + Accent Pop** aesthetic: the page is built almost entirely from the `bg` and `text` tokens, with the violet `accent` reserved as a single, deliberate highlight. It pairs this with **high-contrast typography** and a **halftone / dither pattern background**.

## Landing Page Style

- **Halftone / Dither Pattern Background:** Two offset dot grids drawn in the monochrome `text` color, faded with a diagonal mask so dot density reads as a gradient (see `.halftone` in `page.module.css`). Kept low-opacity so it never competes with content, and pointer/`aria-hidden` so it stays purely decorative.
- **High-Contrast Typography:** Oversized, uppercase Space Grotesk display type (`clamp(2.75rem, 9vw, 6rem)`, weight 700, tight tracking) against a plain `bg`/`text` field. Body and stats use IBM Plex Sans / Mono for contrast in weight and rhythm.
- **Monochrome Base + Accent Pop:** Everything is `bg` + `text` (and mixes between them). The violet `accent` appears in exactly two places — one highlighted headline phrase and the primary CTA — so the "pop" stays rare and intentional. `secondary` is no longer used as a large surface fill.

## Colors

### Light Mode
- **Text (`#050315`):** Core body text and display typography.
- **Background (`#fbfbfe`):** Bright foundation color.
- **Primary (`#2f27ce`):** Key interactive elements and primary actions.
- **Secondary (`#dedcff`):** Soft background fills, borders, and active surface states.
- **Accent (`#443dff`):** High-visibility highlights and focus states.

### Dark Mode
- **Text (`#eae9fc`):** High-contrast body text optimized for dark backgrounds.
- **Background (`#010104`):** Deep black surface foundation.
- **Primary (`#3a31d8`):** Primary interactive focal points.
- **Secondary (`#020024`):** Low-light surface containers and dark borders.
- **Accent (`#0600c2`):** Saturated callout color for specific interactive UI elements.

## Typography

- **display:** Space Grotesk 3.75rem
- **h1:** Space Grotesk 2rem
- **body:** IBM Plex Sans 0.95rem
- **label:** IBM Plex Mono 0.72rem

## Do's and Don'ts

- **Do** reference context-aware design tokens (`light` vs. `dark`) rather than hardcoding hex values.
- **Do** maintain high contrast between text and background across both light and dark themes.
- **Do** keep the base monochrome (`bg` + `text`) and let a single `accent` element "pop" per view.
- **Don't** mix light mode and dark mode palette tokens within a single UI section.
- **Don't** use Accent colors for large background areas; reserve them for interactive highlights.
- **Don't** fill large surfaces with `secondary`; on the landing page the base stays monochrome.