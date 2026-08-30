# Motion Portfolio Reel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an isolated Motion Canvas renderer that turns the existing portfolio metadata and screenshots into a professional 1080 × 1350 / 25 fps motion reel while leaving the current SVG/PNG/PDF renderer unchanged.

**Architecture:** Keep `portfolio/social_carousel.json` as the canonical content source. Add `motion/portfolio-reel` as a standalone TypeScript/Vite/Motion Canvas package that imports the canonical JSON and an explicit registry of the existing screenshot assets, validates them at runtime, and composes seven Motion Canvas scenes from six reusable motion primitives. Automated checks cover metadata, helpers, types, and production bundling; final MP4 export uses the documented Motion Canvas editor + FFmpeg exporter flow.

**Tech Stack:** Node.js 20+, npm, TypeScript, Vite, Vitest, Motion Canvas `3.17.2`, `@motion-canvas/ffmpeg` `3.17.2`.

**Spec:** `docs/superpowers/specs/2026-08-30-motion-portfolio-reel-design.md`

## Global Constraints

- Primary V1 output: **1080 × 1350**, **25 fps**, **MP4**, **18–24 seconds**.
- Motion renderer: **Motion Canvas 3.17.2**.
- Final video rendering in V1 uses the supported **Motion Canvas editor + FFmpeg exporter** flow; no unsupported headless renderer is introduced.
- `portfolio/social_carousel.json` remains the source of truth for project name, description, status, stack, screenshot path, live URL, and repository URL.
- `scripts/build_social_carousel.py` and the current SVG/PNG/PDF publication contract must remain unchanged.
- Adding `motion` metadata is optional; V1 scenes must have deterministic defaults and must not require changes to the canonical JSON.
- Do not add Anime.js, Motion Mini, Remotion, generic particles, large glow effects, bounce-heavy text, aggressive zooms, or unrelated decorative motion.
- Screenshot sources must remain the existing repository assets; no duplicate screenshot copies inside the motion package.
- Any Argentina/geographic geometry must come from an existing verified source/asset or be visibly abstract rather than presented as precise geography.
- Video rendering is manual/local first. Do not add a video-rendering GitHub Action in V1.

---

## File Structure

Create the following isolated package:

```text
motion/portfolio-reel/
  package.json                 # pinned Motion Canvas package and npm scripts
  package-lock.json            # reproducible dependency graph
  tsconfig.json                # Motion Canvas/TypeScript configuration
  vite.config.ts               # Motion Canvas + FFmpeg plugins and repo-root file access
  src/
    project.ts                 # Motion Canvas project entry point
    sceneRegistry.ts           # plain V1 scene id/order contract, testable without ?scene imports
    shared/
      types.ts                 # canonical metadata and motion option types
      metadata.ts              # runtime validation + lookup helpers
      assets.ts                # explicit repo screenshot-path -> Vite URL registry
      theme.ts                 # canvas, colors, typography, spacing, frame constants
      timing.ts                # scene durations and total-duration helper
      primitives/
        RevealText.tsx         # restrained text reveal
        ScreenshotReveal.tsx   # screenshot frame/crop/reveal
        ScanPulse.tsx          # finite geospatial pulse
        DrawPath.tsx           # line/path reveal
        StaggerPoints.tsx      # bounded deterministic point reveal
        CountMetric.tsx        # numeric metric animation and formatter
    scenes/
      01-cover.tsx
      02-geoplatform.tsx
      03-pulso.tsx
      04-anti-ia.tsx
      05-fleetflow.tsx
      06-atlas.tsx
      07-more-systems.tsx
    tests/
      metadata.test.ts
      sceneRegistry.test.ts
      timing.test.ts
      primitives.test.ts
```

Responsibilities are intentionally separated: validation does not know about Motion Canvas nodes, scene order is testable without Vite scene transforms, visual constants live in one theme module, and each primitive owns one motion behavior.

---

### Task 1: Scaffold the isolated Motion Canvas package and fail-closed metadata loader

**Files:**
- Create: `motion/portfolio-reel/package.json`
- Create: `motion/portfolio-reel/package-lock.json`
- Create: `motion/portfolio-reel/tsconfig.json`
- Create: `motion/portfolio-reel/vite.config.ts`
- Create: `motion/portfolio-reel/src/shared/types.ts`
- Create: `motion/portfolio-reel/src/shared/assets.ts`
- Create: `motion/portfolio-reel/src/shared/metadata.ts`
- Create: `motion/portfolio-reel/src/tests/metadata.test.ts`
- Create: `motion/portfolio-reel/src/scenes/01-cover.tsx`
- Create: `motion/portfolio-reel/src/project.ts`

**Interfaces:**
- Consumes: canonical `portfolio/social_carousel.json` and existing `assets/*.png` screenshots.
- Produces:
  - `validateCarouselMetadata(input: unknown, assets: Readonly<Record<string, string>>): CarouselMetadata`
  - `getProject(metadata: CarouselMetadata, id: ProjectId): ProjectSlide`
  - `ASSET_URLS: Readonly<Record<string, string>>`
  - a minimal Motion Canvas project that opens in the editor.

- [ ] **Step 1: Write metadata tests before implementation**

Create `src/tests/metadata.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import canonical from '../../../../portfolio/social_carousel.json';
import {validateCarouselMetadata, getProject} from '../shared/metadata';

const assets = {
  'assets/geoplatform-preview.png': 'geoplatform-url',
  'assets/pulso_territorial.png': 'pulso-url',
  'assets/anti-ia-preview.png': 'anti-url',
  'assets/fleetflowsim.png': 'fleet-url',
  'assets/atlasgeotech.png': 'atlas-url',
} as const;

describe('validateCarouselMetadata', () => {
  it('accepts the checked-in canonical carousel', () => {
    const result = validateCarouselMetadata(canonical, assets);
    expect(result.projects.map(project => project.id)).toEqual([
      'geoplatform',
      'pulso',
      'anti-ia',
      'fleetflow',
      'atlas',
    ]);
  });

  it('rejects a screenshot path that is not in the explicit asset registry', () => {
    const broken = structuredClone(canonical);
    broken.projects[0].screenshot = 'assets/missing.png';
    expect(() => validateCarouselMetadata(broken, assets)).toThrow(
      "project 'geoplatform' references unregistered screenshot 'assets/missing.png'",
    );
  });

  it('rejects duplicate project ids', () => {
    const broken = structuredClone(canonical);
    broken.projects[1].id = 'geoplatform';
    expect(() => validateCarouselMetadata(broken, assets)).toThrow(
      "duplicate project id 'geoplatform'",
    );
  });

  it('uses deterministic motion defaults when motion metadata is absent', () => {
    const result = validateCarouselMetadata(canonical, assets);
    expect(getProject(result, 'fleetflow').motion).toEqual({
      motif: 'default',
      durationSeconds: undefined,
      focus: undefined,
    });
  });
});
```

- [ ] **Step 2: Create package configuration and install dependencies**

Create `package.json` with pinned Motion Canvas packages:

```json
{
  "name": "portfolio-reel",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "build": "vite build",
    "check": "npm run test && npm run typecheck && npm run build"
  },
  "dependencies": {
    "@motion-canvas/2d": "3.17.2",
    "@motion-canvas/core": "3.17.2",
    "@motion-canvas/ffmpeg": "3.17.2"
  },
  "devDependencies": {
    "@motion-canvas/ui": "3.17.2",
    "@motion-canvas/vite-plugin": "3.17.2",
    "typescript": "^5.6.0",
    "vite": "^5.4.0",
    "vitest": "^2.1.0"
  }
}
```

Create `tsconfig.json`:

```json
{
  "extends": "@motion-canvas/2d/tsconfig.project.json",
  "compilerOptions": {
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "types": ["vite/client", "vitest/globals"]
  },
  "include": ["src", "node_modules/@motion-canvas/core/project.d.ts"]
}
```

Create `vite.config.ts`:

```ts
import {resolve} from 'node:path';
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  server: {
    fs: {
      allow: [resolve(__dirname, '../..')],
    },
  },
  plugins: [motionCanvas(), ffmpeg()],
});
```

Run:

```bash
cd motion/portfolio-reel
npm install
```

Expected: `package-lock.json` is created and Motion Canvas resolves to `3.17.2`.

- [ ] **Step 3: Run the new metadata test to verify RED**

Run:

```bash
npm test -- src/tests/metadata.test.ts
```

Expected: FAIL because `types.ts`, `assets.ts`, and `metadata.ts` do not exist yet.

- [ ] **Step 4: Implement metadata types and explicit screenshot registry**

Create `src/shared/types.ts`:

```ts
export const PROJECT_IDS = [
  'geoplatform',
  'pulso',
  'anti-ia',
  'fleetflow',
  'atlas',
] as const;

export type ProjectId = (typeof PROJECT_IDS)[number];
export type ImageFit = 'slice' | 'meet';
export type ImagePosition = 'center' | 'top' | 'bottom' | 'left' | 'right';
export type MotionMotif = 'default' | 'scan' | 'signals' | 'evidence' | 'route' | 'atlas';

export interface MotionOptions {
  motif: MotionMotif;
  durationSeconds?: number;
  focus?: string;
}

export interface CoverMetadata {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
}

export interface ProjectSlide {
  id: ProjectId;
  name: string;
  description: string;
  status: string;
  stack: string[];
  screenshot: string;
  imageFit: ImageFit;
  imagePosition: ImagePosition;
  liveUrl?: string;
  repoUrl?: string;
  motion: MotionOptions;
}

export interface MoreSystem {
  name: string;
  description: string;
  stack: string[];
  repoUrl?: string;
}

export interface CarouselMetadata {
  cover: CoverMetadata;
  projects: ProjectSlide[];
  moreSystems: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: MoreSystem[];
  };
}
```

Create `src/shared/assets.ts` using the original repository assets, not copies:

```ts
import geoplatform from '../../../../assets/geoplatform-preview.png?url';
import pulso from '../../../../assets/pulso_territorial.png?url';
import antiIa from '../../../../assets/anti-ia-preview.png?url';
import fleetflow from '../../../../assets/fleetflowsim.png?url';
import atlas from '../../../../assets/atlasgeotech.png?url';

export const ASSET_URLS = Object.freeze({
  'assets/geoplatform-preview.png': geoplatform,
  'assets/pulso_territorial.png': pulso,
  'assets/anti-ia-preview.png': antiIa,
  'assets/fleetflowsim.png': fleetflow,
  'assets/atlasgeotech.png': atlas,
});
```

- [ ] **Step 5: Implement fail-closed metadata validation**

Create `src/shared/metadata.ts`. Keep validation dependency-free and explicit. The implementation must:

1. require `cover`, `projects`, and `more_systems` objects;
2. reject unknown project ids and duplicates;
3. require all strings/stack entries used by the current JSON;
4. map snake_case JSON fields to TypeScript camelCase fields;
5. reject screenshot paths absent from the asset registry;
6. accept missing `motion` and return `{motif: 'default'}`;
7. validate optional `motion.motif` against `MotionMotif` and require `duration_seconds > 0` when supplied;
8. require exactly the five V1 primary project ids and four `more_systems.items`.

Core signatures:

```ts
export function validateCarouselMetadata(
  input: unknown,
  assets: Readonly<Record<string, string>>,
): CarouselMetadata;

export function getProject(
  metadata: CarouselMetadata,
  id: ProjectId,
): ProjectSlide;
```

Load the checked-in JSON only after these pure functions are defined:

```ts
import rawMetadata from '../../../../portfolio/social_carousel.json';
import {ASSET_URLS} from './assets';

export const carouselMetadata = validateCarouselMetadata(rawMetadata, ASSET_URLS);
```

- [ ] **Step 6: Add a minimal Motion Canvas cover scene and project entry point**

Create `src/scenes/01-cover.tsx`:

```tsx
import {makeScene2D, Txt} from '@motion-canvas/2d';
import {carouselMetadata} from '../shared/metadata';

export default makeScene2D(function* (view) {
  view.fill('#090807');
  view.add(
    <Txt
      text={carouselMetadata.cover.title}
      fill={'#f3e8d4'}
      fontFamily={'Georgia, serif'}
      fontSize={64}
      width={900}
      textWrap
      textAlign={'left'}
    />,
  );
});
```

Create `src/project.ts`:

```ts
import {makeProject} from '@motion-canvas/core';
import cover from './scenes/01-cover?scene';

export default makeProject({
  scenes: [cover],
});
```

- [ ] **Step 7: Verify GREEN and buildability**

Run:

```bash
npm test -- src/tests/metadata.test.ts
npm run typecheck
npm run build
```

Expected: all pass.

Then run:

```bash
npm run dev
```

Expected: Motion Canvas editor opens/serves successfully and the minimal cover is visible.

- [ ] **Step 8: Commit Task 1**

```bash
git add motion/portfolio-reel
git commit -m "feat: scaffold motion portfolio reel"
```

---

### Task 2: Add the shared visual system, scene order contract, and timing contract

**Files:**
- Create: `motion/portfolio-reel/src/shared/theme.ts`
- Create: `motion/portfolio-reel/src/shared/timing.ts`
- Create: `motion/portfolio-reel/src/sceneRegistry.ts`
- Create: `motion/portfolio-reel/src/tests/sceneRegistry.test.ts`
- Create: `motion/portfolio-reel/src/tests/timing.test.ts`
- Modify: `motion/portfolio-reel/src/scenes/01-cover.tsx`

**Interfaces:**
- Produces `THEME`, `SCENE_IDS`, `SCENE_DURATION_SECONDS`, `totalDurationSeconds()`.
- Later scene tasks must consume these constants rather than hard-code canvas colors, margins, or scene durations.

- [ ] **Step 1: Write RED tests for scene order and total duration**

`src/tests/sceneRegistry.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import {SCENE_IDS} from '../sceneRegistry';

describe('SCENE_IDS', () => {
  it('contains the V1 scenes in publication order', () => {
    expect(SCENE_IDS).toEqual([
      'cover',
      'geoplatform',
      'pulso',
      'anti-ia',
      'fleetflow',
      'atlas',
      'more-systems',
    ]);
  });
});
```

`src/tests/timing.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import {totalDurationSeconds} from '../shared/timing';

describe('scene timing', () => {
  it('keeps V1 inside the 18-24 second target', () => {
    expect(totalDurationSeconds()).toBeGreaterThanOrEqual(18);
    expect(totalDurationSeconds()).toBeLessThanOrEqual(24);
  });
});
```

Run `npm test`; expected: RED because modules do not exist.

- [ ] **Step 2: Implement the shared theme**

Create `src/shared/theme.ts`:

```ts
export const THEME = Object.freeze({
  canvas: {width: 1080, height: 1350, fps: 25},
  color: {
    background: '#090807',
    surface: '#11100d',
    surfaceRaised: '#15120f',
    border: '#3a2d21',
    borderSoft: '#201711',
    accent: '#caa56b',
    text: '#f3e8d4',
    muted: '#b9a58a',
    muted2: '#8e7c67',
  },
  font: {
    display: 'Georgia, serif',
    mono: 'Courier New, monospace',
  },
  space: {
    outer: 72,
    contentWidth: 936,
    screenshotWidth: 888,
    screenshotHeight: 500,
  },
});
```

- [ ] **Step 3: Implement scene registry and timing**

`src/sceneRegistry.ts`:

```ts
export const SCENE_IDS = [
  'cover',
  'geoplatform',
  'pulso',
  'anti-ia',
  'fleetflow',
  'atlas',
  'more-systems',
] as const;

export type SceneId = (typeof SCENE_IDS)[number];
```

`src/shared/timing.ts`:

```ts
import type {SceneId} from '../sceneRegistry';

export const SCENE_DURATION_SECONDS: Readonly<Record<SceneId, number>> = {
  cover: 2.7,
  geoplatform: 2.7,
  pulso: 2.7,
  'anti-ia': 3.2,
  fleetflow: 3.3,
  atlas: 2.7,
  'more-systems': 2.7,
};

export function totalDurationSeconds(): number {
  return Object.values(SCENE_DURATION_SECONDS).reduce((sum, value) => sum + value, 0);
}
```

Expected total: **20.0 seconds**.

- [ ] **Step 4: Refactor minimal cover to consume theme values**

Replace raw colors/fonts in `01-cover.tsx` with `THEME` values. Do not add final cover motion yet.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm test
npm run typecheck
npm run build
```

Expected: PASS.

Commit:

```bash
git add motion/portfolio-reel/src
git commit -m "feat: add motion reel design system"
```

---

### Task 3: Implement `RevealText`, `ScreenshotReveal`, and `ScanPulse`

**Files:**
- Create: `motion/portfolio-reel/src/shared/primitives/RevealText.tsx`
- Create: `motion/portfolio-reel/src/shared/primitives/ScreenshotReveal.tsx`
- Create: `motion/portfolio-reel/src/shared/primitives/ScanPulse.tsx`
- Create: `motion/portfolio-reel/src/tests/primitives.test.ts`

**Interfaces:**
- Produces reusable scene helpers:
  - `function* revealText(node: Txt, duration?: number, offsetY?: number): ThreadGenerator`
  - `function normalizeFocalPosition(value: ImagePosition): {x: number; y: number}`
  - `function* revealScreenshot(node: Rect, duration?: number, startScale?: number): ThreadGenerator`
  - `function normalizePulseRadius(radius: number): number`
  - `function* scanPulse(node: Circle, duration?: number, radius?: number): ThreadGenerator`

- [ ] **Step 1: Extend primitive tests with pure helper behavior**

Add to `primitives.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import {normalizeFocalPosition} from '../shared/primitives/ScreenshotReveal';
import {normalizePulseRadius} from '../shared/primitives/ScanPulse';

describe('ScreenshotReveal', () => {
  it('maps focal positions deterministically', () => {
    expect(normalizeFocalPosition('center')).toEqual({x: 0, y: 0});
    expect(normalizeFocalPosition('top')).toEqual({x: 0, y: -1});
    expect(normalizeFocalPosition('bottom')).toEqual({x: 0, y: 1});
  });
});

describe('ScanPulse', () => {
  it('clamps invalid radii to a safe finite range', () => {
    expect(normalizePulseRadius(-20)).toBe(0);
    expect(normalizePulseRadius(180)).toBe(180);
    expect(normalizePulseRadius(5000)).toBe(720);
    expect(normalizePulseRadius(Number.NaN)).toBe(0);
  });
});
```

Run `npm test`; expected RED.

- [ ] **Step 2: Implement restrained text reveal**

`RevealText.tsx` must initialize the target node at opacity `0` and `y + offsetY`, then animate opacity to `1` and position back to its original y using `all()` and `easeOutCubic`. Defaults: `duration = 0.35`, `offsetY = 18`. No spring/bounce easing.

- [ ] **Step 3: Implement screenshot focal normalization and reveal**

`ScreenshotReveal.tsx` must:

- map `center/top/bottom/left/right` to deterministic crop focal coordinates;
- animate frame opacity `0 → 1` and scale `startScale → 1`;
- clamp `startScale` to `1.0–1.06` so the effect stays within the approved 2–3% visual drift in normal use;
- preserve source aspect ratio using Motion Canvas `Img` inside a clipped rounded `Rect` rather than width/height distortion.

Use `THEME.space.screenshotWidth` and `THEME.space.screenshotHeight` for every primary screenshot frame.

- [ ] **Step 4: Implement finite scan pulse**

`ScanPulse.tsx` must animate one circle from low radius/opacity to the configured radius and opacity `0`, then stop. No repeating generator and no infinite loop.

- [ ] **Step 5: Verify and commit**

```bash
npm test
npm run typecheck
npm run build
git add motion/portfolio-reel/src
git commit -m "feat: add reveal and scan motion primitives"
```

---

### Task 4: Implement `DrawPath`, `StaggerPoints`, and `CountMetric`

**Files:**
- Create: `motion/portfolio-reel/src/shared/primitives/DrawPath.tsx`
- Create: `motion/portfolio-reel/src/shared/primitives/StaggerPoints.tsx`
- Create: `motion/portfolio-reel/src/shared/primitives/CountMetric.tsx`
- Modify: `motion/portfolio-reel/src/tests/primitives.test.ts`

**Interfaces:**
- Produces:
  - `clampProgress(value: number): number`
  - `function* drawPath(path: Line, duration?: number): ThreadGenerator`
  - `boundedPoints<T>(items: readonly T[], max?: number): readonly T[]`
  - `function* staggerPoints(nodes: readonly Circle[], interval?: number, max?: number): ThreadGenerator`
  - `formatMetric(value: number, options?: MetricFormatOptions): string`
  - `function* countMetric(signal: SimpleSignal<string>, from: number, to: number, duration: number, options?: MetricFormatOptions): ThreadGenerator`

- [ ] **Step 1: Write RED tests for clamping, bounds, and metric formatting**

Add:

```ts
import {clampProgress} from '../shared/primitives/DrawPath';
import {boundedPoints} from '../shared/primitives/StaggerPoints';
import {formatMetric} from '../shared/primitives/CountMetric';

it('clamps path progress to 0-1', () => {
  expect(clampProgress(-1)).toBe(0);
  expect(clampProgress(0.5)).toBe(0.5);
  expect(clampProgress(2)).toBe(1);
  expect(clampProgress(Number.NaN)).toBe(0);
});

it('bounds staggered point collections', () => {
  expect(boundedPoints([1, 2, 3, 4], 3)).toEqual([1, 2, 3]);
});

it('formats metrics without NaN or Infinity', () => {
  expect(formatMetric(12.36, {decimals: 1, suffix: ' km'})).toBe('12.4 km');
  expect(formatMetric(Number.NaN)).toBe('0');
  expect(formatMetric(Number.POSITIVE_INFINITY)).toBe('0');
});
```

Run `npm test`; expected RED.

- [ ] **Step 2: Implement the path reveal**

Use Motion Canvas `Line` progress/end signal so `drawPath` begins at `end(0)` and tween to `end(1)` with `easeInOutCubic`. `clampProgress` must guarantee finite `0..1` values.

- [ ] **Step 3: Implement bounded deterministic point stagger**

`boundedPoints` defaults to `max = 24`. `staggerPoints` must use array order exactly as supplied, initialize nodes at opacity/scale `0`, and reveal each with a fixed interval (default `0.06s`). Never randomize point order.

- [ ] **Step 4: Implement metric formatting/counting**

Use a pure formatter:

```ts
export interface MetricFormatOptions {
  decimals?: number;
  prefix?: string;
  suffix?: string;
}
```

Any non-finite numeric input returns the formatted zero value. The animation interpolates with `tween()` and updates a string signal; final assignment must be exactly the formatted `to` value.

- [ ] **Step 5: Verify and commit**

```bash
npm test
npm run typecheck
npm run build
git add motion/portfolio-reel/src
git commit -m "feat: add path point and metric primitives"
```

---

### Task 5: Build the final Cover anchor scene

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/01-cover.tsx`
- Modify: `motion/portfolio-reel/src/shared/timing.ts` only if visual review requires a duration change while total remains 18–24 s.

**Interfaces:**
- Consumes: `THEME`, `DrawPath`, `StaggerPoints`, `RevealText`, `carouselMetadata.cover`, `SCENE_DURATION_SECONDS.cover`.
- Produces: completed `01-cover` scene with the approved cartographic/editorial motion language.

- [ ] **Step 1: Replace the minimal scene with the approved composition**

The scene must use this deterministic narrative in order:

1. dark background and thin muted border establish immediately;
2. one abstract non-geographic route-like `Line` draws across the upper/middle field;
3. 4–6 small nodes reveal along the composition;
4. mono labels `TERRITORY`, `EVIDENCE`, `OPERATIONS` reveal sequentially;
5. canonical `cover.title` and `cover.subtitle` resolve last;
6. hold final state long enough to read before scene end.

The path must be explicitly abstract; do not make it resemble a claimed precise map boundary.

- [ ] **Step 2: Use a fixed, collision-safe layout**

Reserve non-overlapping regions:

```text
y  80–160   eyebrow / top rule
y 210–520   abstract route + three labels
y 600–850   main title
y 880–1010  subtitle
y 1200–1260 footer
```

No animated element may cross from the route region into the title region after its final state.

- [ ] **Step 3: Verify programmatically**

Run:

```bash
npm run check
```

Expected: all tests, typecheck, and build pass.

- [ ] **Step 4: Verify visually in Motion Canvas editor**

Run `npm run dev`, play only the cover scene, and confirm:

- no text overlap;
- line/nodes read as technical/cartographic, not decorative particles;
- text animation is restrained;
- final title is readable at feed scale.

- [ ] **Step 5: Commit**

```bash
git add motion/portfolio-reel/src/scenes/01-cover.tsx motion/portfolio-reel/src/shared/timing.ts
git commit -m "feat: build motion reel cover scene"
```

---

### Task 6: Build the FleetFlow anchor scene and validate the hardest motion mechanics

**Files:**
- Create: `motion/portfolio-reel/src/scenes/05-fleetflow.tsx`
- Modify: `motion/portfolio-reel/src/tests/primitives.test.ts` only if a new pure route helper is introduced.

**Interfaces:**
- Consumes: `getProject(carouselMetadata, 'fleetflow')`, `ASSET_URLS`, `DrawPath`, `CountMetric`, `ScreenshotReveal`, `RevealText`, `THEME`.
- Produces: deterministic depot → route → moving vehicle → KPI → screenshot scene.

- [ ] **Step 1: Define deterministic schematic route data inside the scene module**

Use a small local route in canvas coordinates, explicitly schematic and unrelated to real Córdoba streets:

```ts
export const FLEETFLOW_ROUTE = [
  [-380, 120],
  [-220, 20],
  [-80, 90],
  [90, -30],
  [240, 45],
  [380, -80],
] as const;
```

This route is a motion motif, not claimed operational geography.

- [ ] **Step 2: Build the sequence**

Scene order:

1. reveal `DEPOT` node;
2. draw route with `DrawPath`;
3. move a simple vehicle marker along the same route points using deterministic interpolation;
4. animate three KPI values:
   - `DELIVERED 100`
   - `DISTANCE 84.7 km`
   - `ACTIVE 8/8`
5. fade schematic elements down;
6. reveal the canonical FleetFlow screenshot using `ScreenshotReveal` and its configured focal position.

Do not imply these KPI values are live Córdoba operations; they are scene/demo values consistent with the synthetic simulator framing.

- [ ] **Step 3: Verify mechanics and visual restraint**

Run `npm run check`, then preview the FleetFlow scene. Confirm:

- route reveal and vehicle travel use the same geometry;
- counters finish exactly at their final values;
- no metric emits transient `NaN`/`Infinity`;
- screenshot is not distorted;
- motion resolves inside `SCENE_DURATION_SECONDS.fleetflow`.

- [ ] **Step 4: Commit**

```bash
git add motion/portfolio-reel/src/scenes/05-fleetflow.tsx motion/portfolio-reel/src/tests/primitives.test.ts
git commit -m "feat: build FleetFlow motion scene"
```

---

### Task 7: Build GeoPlatform, Pulso, and Anti IA scenes from shared primitives

**Files:**
- Create: `motion/portfolio-reel/src/scenes/02-geoplatform.tsx`
- Create: `motion/portfolio-reel/src/scenes/03-pulso.tsx`
- Create: `motion/portfolio-reel/src/scenes/04-anti-ia.tsx`

**Interfaces:**
- Consumes canonical metadata/project screenshots plus existing primitives.
- Produces three completed primary product scenes without adding scene-specific animation engines/helpers.

- [ ] **Step 1: Implement GeoPlatform scene**

Required order:

1. focal crosshair/location dot;
2. one finite `ScanPulse`;
3. reveal exactly these domain labels around the focal point: `MINING`, `SATELLITE`, `WEATHER`, `SEISMIC`, `ROUTES`;
4. reduce label opacity;
5. reveal GeoPlatform screenshot at common screenshot dimensions;
6. optional final scale drift must stay within `1.00–1.03`.

Use `getProject(..., 'geoplatform')`; do not hard-code product title/status copy already present in metadata.

- [ ] **Step 2: Implement Pulso scene**

Use 10–16 deterministic abstract signal points, not fake georeferenced claims. Required order:

1. `StaggerPoints` reveals the points;
2. relationship labels reveal as `SIGNAL → SOURCE → FRESHNESS`;
3. points/relationship recede;
4. canonical Pulso screenshot reveals.

The abstract point field must be visually presented as a signal motif, not an exact Argentina event map.

- [ ] **Step 3: Implement Anti IA scene**

Required editorial sequence:

1. point + `COORDINATE`;
2. `≠ KNOWLEDGE`;
3. connected nodes `DATA`, `EVIDENCE`, `QUESTION`;
4. `Una coordenada no es un punto.`;
5. canonical Anti IA screenshot reveal.

Use slower spacing than FleetFlow; no bounce or frantic transitions.

- [ ] **Step 4: Verify all three scenes**

Run:

```bash
npm run check
npm run dev
```

Preview each scene individually. Reject any scene with text overlap, screenshot distortion, generic particles, or a visual that implies fabricated geography.

- [ ] **Step 5: Commit**

```bash
git add motion/portfolio-reel/src/scenes/02-geoplatform.tsx \
        motion/portfolio-reel/src/scenes/03-pulso.tsx \
        motion/portfolio-reel/src/scenes/04-anti-ia.tsx
git commit -m "feat: add GeoPlatform Pulso and Anti IA motion scenes"
```

---

### Task 8: Build Atlas + More Systems, register all seven scenes, and perform full regression/render verification

**Files:**
- Create: `motion/portfolio-reel/src/scenes/06-atlas.tsx`
- Create: `motion/portfolio-reel/src/scenes/07-more-systems.tsx`
- Modify: `motion/portfolio-reel/src/project.ts`
- Modify: `motion/portfolio-reel/src/tests/sceneRegistry.test.ts`
- Verify unchanged: `portfolio/social_carousel.json`
- Verify unchanged behavior: `scripts/build_social_carousel.py`, `tests/test_build_social_carousel.py`

**Interfaces:**
- Produces final seven-scene Motion Canvas V1 project in the canonical order.

- [ ] **Step 1: Implement Atlas scene without fabricated geography**

Use an **abstract territorial frame**, not a hand-drawn Argentina outline, unless an already verified Argentina asset is explicitly introduced in the same task with provenance. V1 default implementation should remain abstract.

Required sequence:

1. subtle territorial grid/frame;
2. deterministic project points reveal;
3. labels reveal: `PROVINCE`, `MINERAL`, `STAGE`, `COMPANY`, `CAPITAL`;
4. abstract composition recedes;
5. Atlas screenshot reveals.

- [ ] **Step 2: Implement More Systems as a branching systems diagram**

Read all four items from `carouselMetadata.moreSystems.items`; do not duplicate their descriptions in scene source.

Render a central vertical spine and four branches in this display order:

1. Question Radar
2. Opportunity OS
3. Screen2Social
4. Geo Agent

Reveal each branch with `DrawPath` + `RevealText`. Keep descriptions off this scene; show name + compact stack only so the closing frame remains readable.

- [ ] **Step 3: Register the seven scenes in `project.ts`**

Use Motion Canvas `?scene` imports:

```ts
import {makeProject} from '@motion-canvas/core';
import cover from './scenes/01-cover?scene';
import geoplatform from './scenes/02-geoplatform?scene';
import pulso from './scenes/03-pulso?scene';
import antiIa from './scenes/04-anti-ia?scene';
import fleetflow from './scenes/05-fleetflow?scene';
import atlas from './scenes/06-atlas?scene';
import moreSystems from './scenes/07-more-systems?scene';

export default makeProject({
  scenes: [cover, geoplatform, pulso, antiIa, fleetflow, atlas, moreSystems],
});
```

Update `sceneRegistry.test.ts` only if necessary to assert that `SCENE_IDS.length === 7`; keep the exact order assertion from Task 2.

- [ ] **Step 4: Run full motion-package checks**

From `motion/portfolio-reel`:

```bash
npm run check
```

Expected:

- Vitest PASS;
- TypeScript PASS;
- Vite production build PASS.

- [ ] **Step 5: Run static-renderer regression checks from repository root**

```bash
python -m pytest tests/test_build_social_carousel.py -q
```

Expected: existing static carousel tests remain green.

Then confirm `git diff -- portfolio/social_carousel.json scripts/build_social_carousel.py` is empty unless optional `motion` metadata was deliberately added. V1 should not need such a change.

- [ ] **Step 6: Preview the entire reel and tune only timing/layout constants**

Run:

```bash
cd motion/portfolio-reel
npm run dev
```

Play the full project in order. Make only bounded tuning changes needed for:

- overlap/clipping;
- screenshot focal crop;
- readability;
- scene pacing;
- total runtime staying between 18 and 24 seconds.

Do not add new effects during this pass.

- [ ] **Step 7: Render the final MP4 with the supported Motion Canvas workflow**

In the Motion Canvas editor Video Settings:

```text
Resolution: 1080 × 1350
Frame rate: 25
Exporter: Video (FFmpeg)
Range: full project
```

Start `RENDER` from the editor. The FFmpeg exporter installs/uses its required FFmpeg integration; do not create a custom unsupported headless CLI wrapper.

Record the final output path in the implementation completion note. Do not check the MP4 into git automatically unless explicitly approved after visual review.

- [ ] **Step 8: Manual final visual checklist**

Verify the rendered MP4:

```text
[ ] total duration 18–24 s
[ ] 1080 × 1350
[ ] 25 fps
[ ] no text overlap or clipping
[ ] no screenshot distortion
[ ] no fabricated geographic claims
[ ] Cover reads as cartographic/editorial
[ ] FleetFlow route + vehicle + KPIs read clearly
[ ] Anti IA has slower editorial pacing
[ ] More Systems remains readable at feed scale
[ ] no generic particle/glow/bounce effects
```

- [ ] **Step 9: Commit Task 8**

```bash
git add motion/portfolio-reel/src
git commit -m "feat: complete motion portfolio reel v1"
```

- [ ] **Step 10: Final evidence before completion claim**

Capture fresh command output for:

```bash
cd motion/portfolio-reel && npm run check
cd ../.. && python -m pytest tests/test_build_social_carousel.py -q
```

Also record the successful manual MP4 render settings/path. Do not claim V1 complete without all three evidence sources: motion checks, static regression checks, and manual video render/visual inspection.

---

## Plan Self-Review

### Spec coverage

- Isolated Motion Canvas package: Task 1.
- Canonical metadata reuse and fail-closed asset validation: Task 1.
- Shared technical/editorial design system: Task 2.
- All six reusable primitives: Tasks 3–4.
- Cover anchor: Task 5.
- FleetFlow anchor: Task 6.
- GeoPlatform/Pulso/Anti IA: Task 7.
- Atlas/More Systems: Task 8.
- Seven-scene order and 18–24 second timing contract: Tasks 2 and 8.
- 1080 × 1350 / 25 fps MP4: Task 8 manual render.
- Static SVG/PNG/PDF compatibility: Task 8 regression check.
- No unsupported headless render assumption: Task 8 follows documented editor + FFmpeg exporter.
- No fabricated geography: explicit constraints in Tasks 6–8.

### Placeholder scan

No `TBD`, `TODO`, “implement later”, or unspecified error-handling steps remain. Every task includes concrete files, interfaces, test commands, expected behavior, and commit boundaries.

### Type/interface consistency

- `ProjectId`, `ProjectSlide`, `CarouselMetadata`, and `MotionOptions` are defined in Task 1 and reused consistently.
- `SCENE_IDS` / `SceneId` are defined in Task 2 and feed `SCENE_DURATION_SECONDS`.
- Primitive helper names used by later scenes match the interfaces defined in Tasks 3–4.
- Scene filenames in Task 8 match the canonical scene order from Task 2 and the design spec.
