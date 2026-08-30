# Motion Portfolio Reel — Enterprise Visual Pass V1

**Date:** 2026-08-30  
**Status:** Proposed design for user review  
**Repository:** `juanmanueltorres-creator/juanmanueltorres-creator`  
**Target branch:** `feat/motion-portfolio-reel`

## Goal

Raise the existing Motion Canvas portfolio reel from a functional technical prototype to a visibly more professional, enterprise-grade geospatial product reel without rebuilding the renderer or expanding scope into 3D, shaders, audio, or a second animation engine.

The target is a pragmatic visual-quality jump from approximately **5/10 to 7/10** by improving typography, visual hierarchy, continuity, product framing, domain-specific motion, and surface depth.

The reel remains:

- 1080 × 1350;
- 25 fps;
- approximately 18–24 seconds;
- Motion Canvas 3.17.2;
- based on the existing seven-scene sequence;
- manually rendered through the supported editor + FFmpeg workflow.

## Design Principle

The enterprise pass follows one rule:

> **Motion must clarify product, state, hierarchy, or spatial context.**

The reel should feel closer to an enterprise geospatial product launch or technical product story than to a social template, generic motion-graphics demo, or cyberpunk montage.

The target language is:

**enterprise geospatial + technical editorial + restrained operational motion**

## Non-goals

Enterprise Visual Pass V1 does not:

- replace Motion Canvas;
- add Anime.js to the renderer;
- add Three.js, deck.gl, Kepler.gl, Mapbox GL, or Cesium as runtime reel dependencies;
- add shaders, WebGL lighting, particle systems, or generic background effects;
- add sound design or music;
- add 1080 × 1920 output;
- change the canonical static-carousel metadata contract;
- redesign the underlying portfolio applications;
- introduce an automated video-render pipeline;
- attempt a high-end studio-grade 8–10/10 motion piece.

External geospatial and enterprise products are references for visual grammar only unless explicitly listed as a dependency below.

## Research-Derived Direction

The pass adopts the following patterns from enterprise design systems and geospatial products:

### Productive motion

Motion is short, controlled, and directional. Expressive motion is reserved for major scene transitions or domain moments.

Avoid:

- bounce;
- elastic overshoot;
- arbitrary spinning;
- continuous decorative loops;
- aggressive zooms;
- movement that competes with the product screenshot.

### Continuity

Shared visual elements persist conceptually across scenes so the reel feels like one product story rather than seven unrelated slides.

Examples:

- a persistent outer workspace frame;
- consistent top metadata row;
- recurring coordinate/grid cues;
- stable screenshot frame geometry;
- recurring active-state accent;
- shared scene transition direction.

### Hierarchy through space and surfaces

Use spacing, typography, elevation, opacity, and subtle surface contrast before adding borders.

Borders are reduced to structural hairlines and active states.

### Domain motion

Animation should resemble real geospatial/operational behavior:

- route drawing and trailing vehicle motion;
- layer activation;
- point/signal appearance;
- evidence relationships;
- temporal or status transitions;
- selection/focus changes;
- data filtering and KPI response.

## Typography

### Decision

Replace the current default typography:

- `Georgia, serif`
- `Courier New, monospace`

with a self-hosted IBM Plex family:

- **IBM Plex Sans** for display, labels, body, and product UI;
- **IBM Plex Mono** for coordinates, metrics, metadata, system labels, and technical annotations.

### Why

IBM Plex preserves the technical character of the current reel while moving it away from retro/editorial typography toward enterprise software and data-product typography.

### Packaging

Fonts must be reproducible and repository-controlled through a package-based self-hosting mechanism such as Fontsource rather than depending on remote Google Fonts or runtime network access.

No font files are manually distributed outside the project.

### Type hierarchy

Target roles:

- scene eyebrow / system label: 14–18 px mono;
- product title: 42–54 px sans semibold/bold;
- major cover statement: 54–68 px sans semibold/bold;
- short description: 20–26 px sans regular/medium;
- KPI / technical metric: 22–34 px mono medium/semibold;
- micro metadata: 12–16 px mono.

The implementation plan may adjust exact values after preview, but the hierarchy must remain consistent across scenes.

## Color and Surface System

Retain the current dark + muted-gold identity, but increase depth and hierarchy.

### Core palette intent

- near-black background;
- dark warm neutral surface;
- slightly lighter raised surface;
- restrained muted-gold accent;
- warm off-white text;
- desaturated warm-gray secondary text.

### Surface levels

Define at least three explicit visual levels:

1. **Canvas** — background / environmental field;
2. **Workspace Surface** — main product/story frame;
3. **Raised Data Surface** — KPI, status, selected layer, or detail card.

### Rules

- avoid outlining every container;
- use 1 px / hairline borders for structure;
- reserve stronger accent borders for selected/active states;
- shadows, if used, must be subtle and low-spread;
- one restrained radial or linear tonal gradient may be used to avoid a completely flat black field;
- glow is not a base surface technique.

## Enterprise Workspace Frame

Add a reusable `EnterpriseFrame` visual component used by the product scenes.

The frame is not a browser mockup. It is a minimal technical workspace shell that provides continuity.

### Frame anatomy

Recommended elements:

- outer safe-area frame;
- compact top metadata row;
- project name / status;
- optional scene index or mode label;
- subtle coordinate/grid or registration marks;
- main visual/product viewport;
- optional lower metadata/status rail.

### Continuity behavior

The frame geometry should remain stable from GeoPlatform through Atlas.

Scene transitions replace or transform the internal content rather than rebuilding the entire visual grammar from zero.

Cover and More Systems may use variations of the same frame language without requiring the full product shell.

## Iconography

### Decision

Use **Lucide** as the default icon source for technical micro-UI where icons improve comprehension.

Potential icons include:

- Layers;
- Satellite;
- Route;
- Database;
- Activity;
- Search;
- MapPin;
- Gauge;
- Network;
- FileText.

### Rules

- maximum approximately 2–4 meaningful icons per scene;
- no icon wall;
- icons must label domain concepts or state;
- use consistent stroke width and size;
- icons should normally inherit secondary or accent color rather than introducing new colors.

## Data Geometry

### Decision

D3 Shape is an allowed optional dependency when it materially simplifies deterministic generation of:

- route curves;
- small time-series/area shapes;
- profile lines;
- data-driven path geometry.

It must not become a general visualization framework inside the reel.

### Reference-only libraries

The following are visual/interaction references only in V1:

- deck.gl;
- Kepler.gl;
- Mapbox storytelling patterns;
- Palantir geospatial interface patterns;
- ArcGIS Calcite hierarchy conventions.

Do not install these packages into the renderer for V1.

## Motion System

### Motion tiers

Define three motion tiers:

#### Tier 1 — Micro

Duration target: roughly 80–180 ms.

Examples:

- status activation;
- chip highlight;
- icon appearance;
- KPI digit settle;
- endpoint activation.

#### Tier 2 — Component

Duration target: roughly 180–450 ms.

Examples:

- panel reveal;
- screenshot mask reveal;
- path segment draw;
- layer transition;
- evidence relation reveal.

#### Tier 3 — Scene

Duration target: roughly 350–700 ms.

Examples:

- workspace transition between products;
- cover-to-product transition;
- product-to-product continuity move.

Scene transitions must not become cinematic camera moves.

### Easing

Keep a deliberately small easing vocabulary.

Preferred:

- `easeInOutCubic` for path/camera continuity;
- a restrained ease-out for entrances;
- linear or near-linear motion for operational progress where appropriate.

Avoid per-scene easing experimentation.

## Parallax and Depth

Allow subtle parallax only where it strengthens hierarchy.

Three conceptual planes:

1. environmental/grid layer;
2. diagram/data layer;
3. product/screenshot layer.

Recommended movement range is approximately 1–3% of composition scale or a similarly restrained positional offset.

Parallax must stop when it becomes noticeable as an effect by itself.

## Screenshot Treatment

Screenshots remain the primary evidence that these are real products.

### Target proportion

Product/UI imagery should occupy approximately **60–75% of the meaningful visual area** in product scenes.

### Frame treatment

- preserve source aspect ratio;
- no stretching;
- consistent corner radius;
- subtle surface lift;
- optional internal crop or focal window;
- optional 1–3% scale drift;
- no fake browser chrome unless a scene specifically benefits from it.

### Focus animation

A scene may use one restrained focal gesture:

- crop shift;
- selection rectangle;
- highlight rail;
- small zoom;
- layer emphasis.

Do not combine all of them in one scene.

## Scene Upgrades

### 01 — Cover

Current purpose remains: establish territory, evidence, and operations.

Enterprise upgrade:

- IBM Plex typography;
- stronger but simpler hierarchy;
- fewer tiny labels;
- thin registration/grid marks;
- one clean territorial/data line;
- subtle background depth;
- transition should visually hand off into the common enterprise workspace frame.

The cover should feel like a product-film title card, not a presentation cover.

### 02 — GeoPlatform

This is the flagship product scene.

Upgrade:

- full enterprise workspace frame;
- compact mode chips for `MINING`, `SATELLITE`, `WEATHER`, `SEISMIC`, `ROUTES`;
- Lucide icons where useful;
- screenshot appears earlier and larger;
- one controlled layer/focus transition;
- subtle coordinate/grid cues;
- optional scan pulse remains subordinate to product UI.

Desired impression: integrated territorial operations console.

### 03 — Pulso Público Argentina

Upgrade:

- signal points organized as data states rather than decorative dots;
- small state chips for `SIGNAL`, `SOURCE`, `FRESHNESS`;
- active signal highlight;
- screenshot remains dominant;
- point activity transitions into visible product data rather than fading into an unrelated screenshot.

Desired impression: provenance-aware live territorial signal system.

### 04 — Anti IA

Keep the strongest editorial identity in the reel.

Upgrade:

- `COORDINATE ≠ KNOWLEDGE` remains the conceptual anchor;
- evidence network uses clearer node hierarchy;
- the interface should appear as the resolution of the conceptual diagram;
- one selected evidence/question region may receive a subtle focus state;
- typography shifts to enterprise while preserving seriousness and restraint.

Desired impression: evidence reasoning system, not generic AI branding.

### 05 — FleetFlow Sim

This remains the primary operational-motion scene.

Upgrade:

- path with smoother geometry;
- short fading vehicle trail inspired by trip/trajectory visualizations;
- vehicle/depot/stops use a consistent spatial-symbol system;
- KPI panel uses raised-surface hierarchy;
- route/KPI progress stays synchronized;
- transition resolves cleanly into the real screenshot.

Desired impression: operations intelligence / fleet control simulation.

### 06 — Atlas Geotech

Upgrade:

- abstract territorial frame remains explicitly abstract unless using verified geography;
- project points use restrained data categories;
- filter dimensions are presented as compact enterprise filter chips or rows;
- filter activation causes a visible but minimal response in point emphasis;
- screenshot enters earlier and remains the dominant evidence.

Desired impression: mining intelligence / project portfolio explorer.

### 07 — More Systems

The existing branch/spine concept remains.

Upgrade:

- use enterprise typography and spacing;
- each system appears as a compact row with category, name, and stack;
- one shared systems spine remains as visual structure;
- reduce decorative complexity;
- final state must be useful as a stable closing frame;
- content must remain visible independently of timeline reveal state.

Desired impression: coherent ecosystem of supporting tools, not miscellaneous leftovers.

## Shared Components

The implementation plan should prefer reusable components over scene-specific duplicated styling.

Expected additions or refactors may include:

- `EnterpriseFrame`;
- `ProjectHeader`;
- `SurfacePanel`;
- `StatusChip`;
- `TechLabel`;
- `IconLabel`;
- `MetricPanel`;
- `RegistrationMarks` / subtle grid helper;
- optional `RouteTrail` primitive;
- centralized typography tokens;
- centralized motion-duration/easing tokens.

Exact filenames may differ if the current code structure suggests a cleaner boundary.

## Dependencies

### Allowed additions

Preferred minimal additions:

- IBM Plex through Fontsource packages or an equivalent local package strategy;
- Lucide icon package or SVG extraction strategy;
- optional `d3-shape` only if used for deterministic geometry.

### Dependency rule

A dependency is accepted only if it removes meaningful custom code or provides a durable design primitive.

Do not add a dependency merely for a single decorative effect.

## Compatibility

The enterprise pass must preserve:

- Motion Canvas 3.17.2 unless a separate compatibility decision is approved;
- the seven-scene registry;
- the static carousel pipeline;
- canonical project metadata;
- existing screenshot sources;
- 1080 × 1350 / 25 fps output contract;
- manual FFmpeg export path.

The enterprise pass may refactor shared scene composition but must not change product facts, statuses, links, or provenance.

## Testing Strategy

### Automated

Add or update tests for visual-system contracts where practical:

- enterprise typography tokens use IBM Plex family names;
- required scenes use the shared frame/header where specified;
- screenshot dimensions stay within portrait safe area;
- no scene reintroduces unsupported absolute-edge text anchoring patterns that previously caused clipping;
- More Systems retains visible base content;
- icon usage is deterministic and bounded;
- metric formatting remains finite;
- scene registry remains exact;
- typecheck passes;
- production build passes;
- static carousel regression remains green.

Tests should verify structural contracts, not pixel-perfect aesthetics.

### Manual visual QA

Required before merge:

- inspect all seven scenes at 1080 × 1350;
- inspect Cover, GeoPlatform, FleetFlow, and More Systems at several timeline frames;
- verify no clipping or text-wrap regressions;
- verify screenshot crops and product legibility;
- verify micro-UI remains readable at normal feed scale;
- verify continuity between scenes feels intentional;
- verify no scene becomes more visually complex than the product it presents;
- render full MP4 and watch at 1× without editor UI;
- inspect the final closing frame independently.

## Quality Bar

The enterprise pass is successful when a viewer can reasonably infer all of the following without explanation:

1. this is one coherent portfolio system rather than seven unrelated slides;
2. the work is geospatial/data/operations software;
3. the products are real interfaces, not speculative mockups;
4. the visual language is deliberate and professional;
5. motion helps explain the products rather than decorating them.

The target is a strong **7/10 professional product reel**, not maximum visual complexity.

## Definition of Done

Enterprise Visual Pass V1 is complete when:

1. IBM Plex typography is integrated reproducibly;
2. enterprise surface and hierarchy tokens replace the current flat presentation where appropriate;
3. a shared enterprise workspace/frame language is visible across product scenes;
4. iconography is consistent and restrained;
5. product screenshots dominate product scenes;
6. GeoPlatform, Pulso, Anti IA, FleetFlow, and Atlas each include at least one domain-specific state or motion cue;
7. FleetFlow includes a refined route/vehicle treatment with synchronized KPI behavior;
8. scene-to-scene continuity is visibly improved;
9. More Systems remains a stable, fully populated closing composition;
10. automated tests, typecheck, build, and static-carousel regression pass;
11. no text clipping, unsupported wrapping regression, or screenshot distortion is visible;
12. the final 1080 × 1350 / 25 fps MP4 is manually rendered and reviewed;
13. the reel remains within approximately 18–24 seconds unless visual QA justifies a small documented adjustment.
