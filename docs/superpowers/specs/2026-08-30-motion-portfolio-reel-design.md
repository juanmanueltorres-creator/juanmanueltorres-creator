# Motion Portfolio Reel — Design

**Date:** 2026-08-30  
**Status:** Approved design, ready for implementation plan  
**Repository:** `juanmanueltorres-creator/juanmanueltorres-creator`

## Goal

Extend the existing static social-carousel system with a reusable motion renderer that produces a professional portfolio reel without replacing or destabilizing the current SVG/PNG/PDF pipeline.

The reel should make the portfolio feel distinctly geospatial and systems-oriented through restrained cartographic motion: routes, scan pulses, spatial nodes, counters, evidence relationships, and controlled screenshot reveals.

The first version targets a **1080 × 1350 MP4** portfolio reel lasting approximately **18–24 seconds**.

## Non-goals

V1 does not:

- replace `scripts/build_social_carousel.py`;
- change the existing static export contract;
- add Anime.js or Motion Mini to the motion renderer;
- build a website or interactive portfolio experience;
- create 1080 × 1920 or other aspect-ratio variants;
- publish automatically to LinkedIn, X, Instagram, or other platforms;
- render video automatically on every push;
- add generic particles, excessive glow, or decorative motion unrelated to the products.

## Technology Decision

Use **Motion Canvas 3.17.2** as the motion renderer.

Reasons:

- TypeScript-native scene composition;
- designed for programmatic motion graphics rather than browser-only animation;
- deterministic timeline control;
- appropriate primitives for paths, nodes, counters, typography, and screenshot composition;
- supported FFmpeg exporter for producing video from the editor;
- keeps the motion subsystem independent from the existing Python static renderer.

Anime.js remains a candidate for a future interactive web experience, especially for SVG path drawing and browser motion. It is intentionally excluded from Motion Reel V1 to avoid maintaining two animation engines for the same output.

### Render-path constraint

Motion Canvas 3.17.2 documents rendering through the editor and its exporters. V1 therefore uses the supported **editor + FFmpeg exporter** flow for the final MP4. A headless CLI renderer is not a V1 requirement.

Automated verification covers metadata, types, tests, and the Vite production build. The final video render is a required manual verification step.

## Existing System That Must Remain Stable

The current static pipeline is canonical and remains supported:

```text
portfolio/social_carousel.json
        |
scripts/build_social_carousel.py
        |
        +--> SVG
        +--> PNG
        +--> PDF
```

Existing publication assets live under:

```text
assets/social/generated/
```

The Motion Canvas implementation must not change the meaning or required fields of the current static metadata contract.

## Architecture

Add an isolated subsystem:

```text
motion/
  portfolio-reel/
    package.json
    package-lock.json
    tsconfig.json
    vite.config.ts
    src/
      project.ts
      shared/
        theme.ts
        types.ts
        metadata.ts
        assets.ts
        primitives/
          DrawPath.tsx
          RevealText.tsx
          StaggerPoints.tsx
          CountMetric.tsx
          ScreenshotReveal.tsx
          ScanPulse.tsx
      scenes/
        01-cover.tsx
        02-geoplatform.tsx
        03-pulso.tsx
        04-anti-ia.tsx
        05-fleetflow.tsx
        06-atlas.tsx
        07-more-systems.tsx
      tests/
```

The motion renderer reads the same source metadata and screenshots used by the static renderer.

```text
portfolio/social_carousel.json
        |
        +---------------------------+
        |                           |
        v                           v
static renderer                motion renderer
Python + SVG                   Motion Canvas + TS
        |                           |
SVG / PNG / PDF                    MP4
```

## Metadata Contract

`portfolio/social_carousel.json` remains the source of truth for:

- project name;
- description;
- status;
- stack;
- screenshot path;
- live URL;
- repository URL.

The motion renderer may support a new **optional** `motion` object on a project. Static rendering must ignore this object safely.

Example:

```json
{
  "id": "fleetflow",
  "name": "FleetFlow Sim",
  "motion": {
    "motif": "route",
    "duration_seconds": 3.2,
    "focus": "operations"
  }
}
```

The `motion` object is advisory presentation metadata only. Missing motion metadata must fall back to deterministic scene defaults.

## Visual Language

The reel uses the existing dark, muted gold, technical-editorial identity.

Motion should communicate the domain rather than decorate it.

Preferred motifs:

- route/path drawing;
- geographic nodes and point patterns;
- subtle scan/radar pulses;
- coordinate/crosshair cues;
- KPI counters;
- evidence links and relationship lines;
- screenshot masks and restrained camera movement.

Avoid:

- generic floating particles;
- large glows;
- elastic/bouncy text;
- aggressive zooms;
- random parallax;
- visual effects that do not explain the product.

The desired impression is **cartographic + technical + editorial**.

## Output Contract

V1 produces one primary deliverable:

```text
1080 × 1350
25 fps
MP4
18–24 seconds target duration
```

The static carousel remains the source for LinkedIn document/PDF publishing.

The motion reel is a complementary output, not a replacement.

## Shared Motion Primitives

### `RevealText`

Purpose: reveal headings, labels, and short statements with restrained opacity and positional motion.

Requirements:

- deterministic timing;
- no bounce by default;
- reusable across every scene.

### `DrawPath`

Purpose: progressively reveal route, territorial, or relationship lines.

Requirements:

- configurable progress/duration;
- reusable with arbitrary Motion Canvas path geometry;
- no scene-specific business logic.

### `StaggerPoints`

Purpose: reveal spatial observations/signals as a controlled sequence.

Requirements:

- deterministic ordering;
- bounded point count;
- configurable stagger interval;
- efficient enough for the Pulso and Atlas scenes.

### `CountMetric`

Purpose: animate operational metrics such as delivered packages, distance, or active fleet.

Requirements:

- numeric interpolation;
- configurable formatting;
- no `NaN`/`Infinity` output;
- deterministic final value.

### `ScreenshotReveal`

Purpose: present application screenshots consistently.

Requirements:

- common frame and border treatment;
- consistent crop/mask behavior;
- configurable focal position;
- subtle optional scale movement;
- must never distort the source image.

### `ScanPulse`

Purpose: provide a subtle geospatial scan/radar motif.

Requirements:

- low visual dominance;
- finite animation, not an uncontrolled infinite loop;
- configurable center/radius;
- reusable in GeoPlatform and other scenes.

## Scene Design

### 01 — Cover

Narrative:

1. A restrained territorial path/line is drawn.
2. A small number of nodes appear.
3. `TERRITORY`, `EVIDENCE`, and `OPERATIONS` reveal sequentially.
4. The main portfolio statement resolves.

The scene establishes the visual grammar without showing a product screenshot.

### 02 — GeoPlatform

Narrative:

1. Scan pulse establishes a location/context query.
2. Short domain labels reveal: mining, satellite, weather, seismic, routes.
3. The GeoPlatform screenshot resolves from the spatial composition.
4. Optional 2–3% screenshot scale drift provides depth without becoming a zoom effect.

### 03 — Pulso Público Argentina

Narrative:

1. Spatial signal points appear in a deterministic stagger.
2. A compact `SIGNAL → SOURCE → FRESHNESS` relationship is shown.
3. The Pulso screenshot reveals.

The scene emphasizes provenance and current territorial signals rather than generic map animation.

### 04 — Anti IA

Narrative:

1. `COORDINATE` appears with a point.
2. `≠ KNOWLEDGE` establishes the thesis.
3. `DATA`, `EVIDENCE`, and `QUESTION` appear as connected conceptual nodes.
4. `Una coordenada no es un punto.` resolves.
5. The Anti IA interface reveals.

This scene should be editorial and deliberately slower than FleetFlow.

### 05 — FleetFlow Sim

Narrative:

1. A depot node appears.
2. A delivery route is drawn.
3. A vehicle marker follows the route.
4. Selected KPIs animate to deterministic values.
5. The motion composition transitions into the FleetFlow screenshot.

This is the principal operational-motion scene and validates path animation plus counters.

### 06 — Atlas Geotech

Narrative:

1. A simplified Argentina/territorial outline or schematic spatial frame is established.
2. Mining/project points reveal.
3. Short dimensions appear: province, mineral, stage, company, capital.
4. The Atlas screenshot reveals.

No invented geographic detail may be implied by decorative geometry. If a simplified outline is used, it must come from an existing verified asset/data source or be clearly abstract rather than presented as precise geography.

### 07 — More Systems

Narrative:

A simple branching systems diagram reveals four secondary builds:

- Question Radar;
- Opportunity OS;
- Screen2Social;
- Geo Agent.

The scene closes the reel without recreating four large cards.

## Timing Strategy

Target total runtime: **18–24 seconds**.

Guideline only:

- Cover: 2.5–3.0 s
- GeoPlatform: 2.5–3.0 s
- Pulso: 2.5–3.0 s
- Anti IA: 3.0–3.5 s
- FleetFlow: 3.0–3.5 s
- Atlas: 2.5–3.0 s
- More Systems / close: 2.5–3.0 s

Scene timing may be tuned during visual review while preserving the total target range.

## Implementation Order

Implementation must proceed incrementally.

### Stage 1 — Scaffold

- create isolated Motion Canvas package;
- establish dev/preview, test, typecheck, and production-build commands;
- configure the FFmpeg exporter for manual final rendering;
- load and validate existing metadata;
- render a minimal cover scene in the editor preview.

### Stage 2 — Design System

- shared theme tokens;
- typography;
- spacing;
- screenshot frame conventions;
- common scene boundaries.

### Stage 3 — Reusable Primitives

Implement the six primitives independently with focused tests where practical.

### Stage 4 — Anchor Scenes

Build first:

1. Cover;
2. FleetFlow.

These validate both editorial motion and the hardest operational-motion mechanics before investing in the remaining scenes.

### Stage 5 — Remaining Scenes

Add GeoPlatform, Pulso, Anti IA, Atlas, and More Systems using the shared primitives.

### Stage 6 — Full Render and Timing Pass

- preview the complete reel;
- inspect for clipping, overlap, crop issues, and pacing;
- tune scene timings;
- render the final V1 MP4 from the Motion Canvas editor using the FFmpeg exporter.

## Testing and Verification

The motion subsystem must fail clearly when required source assets are missing or metadata cannot be parsed.

Minimum automated checks:

- metadata loader accepts the current canonical JSON;
- referenced screenshots resolve through the explicit asset registry;
- unsupported/malformed optional motion metadata falls back safely or fails with a clear validation error according to the field;
- scene registry contains exactly the expected V1 scene sequence;
- metric formatting never emits `NaN` or `Infinity`;
- TypeScript typecheck passes;
- Vite production build passes.

Required manual verification before V1 is considered complete:

- Motion Canvas editor starts successfully;
- cover preview inspected;
- FleetFlow preview inspected;
- full 1080 × 1350 / 25 fps reel rendered with the FFmpeg exporter;
- no visible text clipping or overlap;
- screenshots preserve aspect ratio and intended focal regions;
- visual hierarchy remains readable at normal social-feed scale;
- total duration remains within 18–24 seconds.

## CI Strategy

V1 rendering is **manual/local first**.

Do not render video on every push.

Automated repository checks may run tests, typecheck, and the Vite build. Video rendering remains manual until Motion Canvas has a deliberately adopted, reliable headless render path for this repository.

A later change may add a manual `workflow_dispatch` only after that render path is explicitly designed and verified. That automation is outside V1.

## Error Handling

The motion renderer must fail closed for configuration and source-data problems.

Examples:

- missing metadata source → clear build/test failure;
- screenshot path absent from the explicit asset registry → identify project id and missing path;
- malformed numeric motion option → validation error or documented default;
- unknown motif → documented default motif, unless a scene explicitly requires one;
- FFmpeg/export failure → the video is not considered produced or complete.

Scenes must not silently substitute unrelated images or fabricated geographic content.

## Compatibility

The new subsystem must not alter the output of the current static renderer for unchanged `social_carousel.json` input.

Adding optional `motion` keys must be backward compatible with Python static generation.

The existing static GitHub Action remains independent from Motion Canvas V1.

## Definition of Done — V1

V1 is complete when:

1. `motion/portfolio-reel` is isolated and reproducibly installable;
2. the existing canonical metadata is loaded successfully;
3. all six reusable primitives exist;
4. all seven scene files exist and are registered in order;
5. Cover and FleetFlow demonstrate the intended cartographic/operational motion language;
6. automated tests, typecheck, and Vite build pass;
7. the full reel renders manually at 1080 × 1350 / 25 fps using the FFmpeg exporter;
8. final runtime is 18–24 seconds;
9. no visible overlap, clipping, image distortion, or unrelated decorative motion remains;
10. existing SVG/PNG/PDF carousel generation continues to pass unchanged;
11. a final MP4 is produced and visually reviewed.
