# Portfolio Reel — Motion Canvas

Vertical 1080×1350 portfolio reel built with Motion Canvas. The final visual direction is **Open Technical Editorial**: open canvas, IBM Plex typography, restrained bronze accents, functional domain motion, and product screenshots as the primary elevated surfaces.

## Runtime contract

- Canvas: **1080×1350**
- Preview/render: **25 fps**
- Color: **sRGB**
- Renderer: **FFmpeg**
- Target output: **MP4** with **Fast Start** enabled
- Scenes: **7**
- Current assembled duration: **20.0 seconds**

Scene order:

1. Cover
2. GeoPlatform
3. Pulso Público Argentina
4. Anti IA
5. FleetFlow Sim
6. Atlas Geotech
7. More Systems

## Install

From `motion/portfolio-reel`:

```bash
npm ci
```

The Motion Canvas packages are intentionally pinned to `3.17.2`.

## Preview

```bash
npm run dev
```

Open the local Motion Canvas editor shown by Vite and review the reel at 1× playback before export.

## Verification

```bash
npm run check
```

`npm run check` runs:

1. Vitest
2. TypeScript typecheck
3. Vite production build

From the repository root, also keep the static social-carousel pipeline isolated:

```bash
python -m pytest tests/test_build_social_carousel.py -q
git diff --exit-code origin/main -- portfolio/social_carousel.json scripts/build_social_carousel.py
```

## Manual MP4 export

Use the Motion Canvas editor's video export with these settings:

- Resolution: **1080×1350**
- Frame rate: **25 fps**
- Color space: **sRGB**
- Renderer: **FFmpeg**
- Container: **MP4**
- Fast Start: **enabled**

The final MP4 should be watched outside the editor after export. Check the opening frame, every scene transition, representative paused frames, and the final frame.

Do **not** commit the rendered MP4 unless explicitly requested.

## Final visual QA

Confirm before delivery:

- screenshots dominate scenes 02–06;
- no product scene has a visible full-scene enclosing card;
- meaningful content keeps breathable outer margins;
- screenshot borders and shadows read as subtle elevation, not glow;
- route and point geometry remain inside safe margins;
- labels are tertiary but readable;
- each scene has one dominant motion idea;
- no critical copy uses runtime `textWrap`;
- no clipping or unreadable microcopy appears at feed scale;
- all seven scenes read as one coherent editorial system.

## Source of truth

Canonical product copy and screenshot references remain in:

```text
portfolio/social_carousel.json
```

The Motion Canvas reel consumes that metadata without modifying the static carousel renderer or generated static outputs.
