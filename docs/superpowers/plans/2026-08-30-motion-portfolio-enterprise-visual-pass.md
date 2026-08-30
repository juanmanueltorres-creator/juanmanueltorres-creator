# Motion Portfolio Reel — Enterprise Visual Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise the existing Motion Canvas portfolio reel from a functional 5/10 prototype to a coherent 7/10 enterprise geospatial product reel through typography, surfaces, shared workspace framing, restrained iconography, domain motion, and stronger screenshot hierarchy.

**Architecture:** Keep the current seven-scene Motion Canvas renderer and static-carousel data contract intact. Add a small enterprise visual-system layer under `src/shared/` and migrate scenes incrementally onto it, preserving the current 1080×1350 / 25 fps / ~20 s output and the known clipping fixes. Product scenes share one stable `EnterpriseFrame`; Cover and More Systems use the same typography/surface language without pretending to be browser mockups.

**Tech Stack:** Motion Canvas 3.17.2, TypeScript, Vite 5, Vitest, Fontsource IBM Plex Sans/Mono 5.3.0, Lucide Static 1.37.0, existing Python static-carousel regression tests.

**Spec:** `docs/superpowers/specs/2026-08-30-motion-portfolio-enterprise-visual-pass-design.md`

## Global Constraints

- Preserve Motion Canvas `3.17.2`; do not upgrade to the 3.18 alpha in this pass.
- Preserve canvas `1080 × 1350`, preview/render `25 fps`, sRGB, and manual editor + FFmpeg export.
- Preserve the exact seven-scene registry and current product facts, statuses, links, screenshot sources, and canonical metadata.
- Preserve the static carousel pipeline and keep `portfolio/social_carousel.json` plus `scripts/build_social_carousel.py` behavior unchanged.
- Keep total runtime within `18–24 s`; current target is `20.0 s`.
- Do not add Anime.js, Three.js, deck.gl, Kepler.gl, Mapbox GL, Cesium, shaders, particles, audio, or a second animation engine.
- Do not add `d3-shape` in this plan; native Motion Canvas path/line geometry is sufficient for the 7/10 target.
- Do not use remote web fonts. IBM Plex must be bundled locally through Fontsource.
- Use Lucide only for bounded technical micro-UI; maximum approximately 2–4 meaningful icons per scene.
- Do not reintroduce absolute-edge text anchoring helpers (`leftAlignedCenterX`, `rightAlignedCenterX`) or mapped JSX fragments in More Systems.
- Because Motion Canvas 3.17.2 has known text-wrap sensitivity, enterprise components must avoid `textWrap` for critical copy. Use explicit line breaks or fixed single-line labels instead.
- More Systems base content must remain visible independently of timeline reveal state.
- Tests verify structural contracts, not pixel-perfect aesthetics.
- Every visual checkpoint must be inspected at real portrait settings, not 1920×1080 defaults.

---

## File Map

### New shared foundation

- `motion/portfolio-reel/src/shared/fonts.ts` — imports self-hosted IBM Plex weights.
- `motion/portfolio-reel/src/shared/motion.ts` — shared motion durations/easing vocabulary.
- `motion/portfolio-reel/src/shared/icons.ts` — bounded Lucide SVG-string registry.
- `motion/portfolio-reel/src/shared/components/EnterpriseFrame.tsx` — stable workspace frame for product scenes.
- `motion/portfolio-reel/src/shared/components/ProjectHeader.tsx` — shared product name/status/mode row.
- `motion/portfolio-reel/src/shared/components/SurfacePanel.tsx` — raised/flat surface wrapper.
- `motion/portfolio-reel/src/shared/components/StatusChip.tsx` — compact active/inactive metadata chip.
- `motion/portfolio-reel/src/shared/components/TechIcon.tsx` — Motion Canvas `SVG` wrapper over curated Lucide strings.
- `motion/portfolio-reel/src/shared/components/RegistrationMarks.tsx` — restrained corner/grid registration marks.
- `motion/portfolio-reel/src/shared/components/MetricPanel.tsx` — compact KPI surface for FleetFlow.
- `motion/portfolio-reel/src/shared/primitives/RouteTrail.tsx` — deterministic route trail/progress helper.

### Existing shared files to modify

- `motion/portfolio-reel/package.json`
- `motion/portfolio-reel/package-lock.json`
- `motion/portfolio-reel/src/project.ts`
- `motion/portfolio-reel/src/shared/theme.ts`
- `motion/portfolio-reel/src/shared/timing.ts` only if timing QA requires a documented change; default is no change.
- `motion/portfolio-reel/src/shared/primitives/ScreenshotReveal.tsx`
- `motion/portfolio-reel/src/tests/visualContract.test.ts`
- `motion/portfolio-reel/src/tests/primitives.test.ts`
- `motion/portfolio-reel/src/tests/timing.test.ts`

### Scenes to modify

- `motion/portfolio-reel/src/scenes/01-cover.tsx`
- `motion/portfolio-reel/src/scenes/02-geoplatform.tsx`
- `motion/portfolio-reel/src/scenes/03-pulso.tsx`
- `motion/portfolio-reel/src/scenes/04-anti-ia.tsx`
- `motion/portfolio-reel/src/scenes/05-fleetflow.tsx`
- `motion/portfolio-reel/src/scenes/06-atlas.tsx`
- `motion/portfolio-reel/src/scenes/07-more-systems.tsx`

### Documentation / local render contract

- Create `motion/portfolio-reel/README.md` with exact preview/render/QA instructions.

---

### Task 1: Enterprise Typography, Surface Tokens, and Motion Vocabulary

**Files:**
- Modify: `motion/portfolio-reel/package.json`
- Modify: `motion/portfolio-reel/package-lock.json`
- Create: `motion/portfolio-reel/src/shared/fonts.ts`
- Create: `motion/portfolio-reel/src/shared/motion.ts`
- Modify: `motion/portfolio-reel/src/project.ts`
- Modify: `motion/portfolio-reel/src/shared/theme.ts`
- Test: `motion/portfolio-reel/src/tests/visualContract.test.ts`

**Interfaces:**
- Consumes: existing `THEME` object and Motion Canvas project entrypoint.
- Produces: `THEME.font.sans`, `THEME.font.mono`, surface tokens, typography scale, and `MOTION` timing/easing constants used by every later task.

- [ ] **Step 1: Write failing enterprise foundation tests**

Add these assertions to `src/tests/visualContract.test.ts`:

```ts
import {MOTION} from '../shared/motion';

it('uses enterprise IBM Plex typography', () => {
  expect(THEME.font.sans).toBe('IBM Plex Sans');
  expect(THEME.font.display).toBe('IBM Plex Sans');
  expect(THEME.font.mono).toBe('IBM Plex Mono');
});

it('defines three explicit enterprise surface levels', () => {
  expect(THEME.color.canvas).toBeTruthy();
  expect(THEME.color.workspace).toBeTruthy();
  expect(THEME.color.raised).toBeTruthy();
  expect(THEME.color.workspace).not.toBe(THEME.color.raised);
});

it('uses one bounded motion vocabulary', () => {
  expect(MOTION.micro).toBeGreaterThanOrEqual(0.08);
  expect(MOTION.micro).toBeLessThanOrEqual(0.18);
  expect(MOTION.component).toBeGreaterThanOrEqual(0.18);
  expect(MOTION.component).toBeLessThanOrEqual(0.45);
  expect(MOTION.scene).toBeGreaterThanOrEqual(0.35);
  expect(MOTION.scene).toBeLessThanOrEqual(0.7);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
cd motion/portfolio-reel
npm test -- src/tests/visualContract.test.ts
```

Expected: FAIL because `THEME.font.sans`, enterprise surface keys, and `MOTION` do not exist.

- [ ] **Step 3: Install pinned self-hosted IBM Plex packages**

Run:

```bash
npm install @fontsource/ibm-plex-sans@5.3.0 @fontsource/ibm-plex-mono@5.3.0
```

Expected: `package.json` and `package-lock.json` update; Motion Canvas versions remain exactly `3.17.2`.

- [ ] **Step 4: Create deterministic font imports**

Create `src/shared/fonts.ts`:

```ts
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/ibm-plex-mono/700.css';
```

Import it once near the top of `src/project.ts`:

```ts
import './shared/fonts';
```

- [ ] **Step 5: Add enterprise theme tokens while preserving compatibility keys**

Replace the font block and extend the current color/type tokens in `src/shared/theme.ts`:

```ts
export const THEME = Object.freeze({
  canvas: {width: 1080, height: 1350, fps: 25},
  color: {
    canvas: '#090807',
    background: '#090807',
    workspace: '#0f0e0c',
    surface: '#0f0e0c',
    raised: '#171410',
    surfaceRaised: '#171410',
    border: '#34291f',
    borderSoft: '#211a14',
    accent: '#caa56b',
    accentSoft: '#7d6543',
    text: '#f5ecdf',
    muted: '#b8aa98',
    muted2: '#817566',
  },
  font: {
    sans: 'IBM Plex Sans',
    display: 'IBM Plex Sans',
    mono: 'IBM Plex Mono',
  },
  type: {
    eyebrow: 16,
    projectTitle: 48,
    coverTitle: 62,
    body: 23,
    metric: 28,
    micro: 14,
  },
  space: {
    outer: 72,
    contentWidth: 936,
    screenshotWidth: 936,
    screenshotHeight: 560,
    screenshotY: 35,
    captionY: 410,
  },
});
```

Do not delete compatibility keys used by existing scenes until their migrations are complete.

- [ ] **Step 6: Create the shared motion vocabulary**

Create `src/shared/motion.ts`:

```ts
import {easeInOutCubic, easeOutCubic, linear} from '@motion-canvas/core';

export const MOTION = Object.freeze({
  micro: 0.12,
  component: 0.32,
  scene: 0.52,
  easing: {
    enter: easeOutCubic,
    continuity: easeInOutCubic,
    progress: linear,
  },
});
```

- [ ] **Step 7: Run foundation verification**

Run:

```bash
npm test -- src/tests/visualContract.test.ts
npm run typecheck
npm run build
```

Expected: all PASS. Build must bundle Fontsource locally and make no runtime network font request.

- [ ] **Step 8: Commit Task 1**

```bash
git add motion/portfolio-reel/package.json \
  motion/portfolio-reel/package-lock.json \
  motion/portfolio-reel/src/project.ts \
  motion/portfolio-reel/src/shared/fonts.ts \
  motion/portfolio-reel/src/shared/motion.ts \
  motion/portfolio-reel/src/shared/theme.ts \
  motion/portfolio-reel/src/tests/visualContract.test.ts

git commit -m "feat: add enterprise typography and motion tokens"
```

---

### Task 2: Shared Enterprise UI Components and Bounded Lucide Icons

**Files:**
- Modify: `motion/portfolio-reel/package.json`
- Modify: `motion/portfolio-reel/package-lock.json`
- Create: `motion/portfolio-reel/src/shared/icons.ts`
- Create: `motion/portfolio-reel/src/shared/components/TechIcon.tsx`
- Create: `motion/portfolio-reel/src/shared/components/StatusChip.tsx`
- Create: `motion/portfolio-reel/src/shared/components/SurfacePanel.tsx`
- Create: `motion/portfolio-reel/src/shared/components/ProjectHeader.tsx`
- Create: `motion/portfolio-reel/src/shared/components/RegistrationMarks.tsx`
- Create: `motion/portfolio-reel/src/shared/components/EnterpriseFrame.tsx`
- Create: `motion/portfolio-reel/src/shared/components/MetricPanel.tsx`
- Test: `motion/portfolio-reel/src/tests/visualContract.test.ts`

**Interfaces:**
- Consumes: `THEME`, `MOTION`, Motion Canvas `Layout`, `Rect`, `Txt`, `SVG`.
- Produces: reusable enterprise visual primitives used by Tasks 3–6.

- [ ] **Step 1: Add RED structural tests for the shared visual system**

Append raw imports and assertions to `visualContract.test.ts`:

```ts
import enterpriseFrameSource from '../shared/components/EnterpriseFrame.tsx?raw';
import projectHeaderSource from '../shared/components/ProjectHeader.tsx?raw';
import statusChipSource from '../shared/components/StatusChip.tsx?raw';
import techIconSource from '../shared/components/TechIcon.tsx?raw';

it('defines the shared enterprise workspace shell', () => {
  expect(enterpriseFrameSource).toContain('RegistrationMarks');
  expect(enterpriseFrameSource).toContain('ProjectHeader');
  expect(enterpriseFrameSource).toContain('THEME.color.workspace');
});

it('keeps enterprise headers layout-driven and wrap-safe', () => {
  expect(projectHeaderSource).toContain("justifyContent={'space-between'}");
  expect(projectHeaderSource).not.toContain('textWrap');
});

it('keeps icon and chip styling bounded', () => {
  expect(techIconSource).toContain('<SVG');
  expect(statusChipSource).toContain('THEME.color.raised');
});
```

- [ ] **Step 2: Run tests and verify RED**

```bash
npm test -- src/tests/visualContract.test.ts
```

Expected: FAIL because enterprise components do not exist.

- [ ] **Step 3: Install pinned Lucide static assets**

```bash
npm install lucide-static@1.37.0
```

Do not install React/Vue Lucide packages.

- [ ] **Step 4: Create a curated icon registry, not an icon wall**

Create `src/shared/icons.ts` using Vite raw imports from `lucide-static`:

```ts
import layers from 'lucide-static/icons/layers.svg?raw';
import satellite from 'lucide-static/icons/satellite.svg?raw';
import route from 'lucide-static/icons/route.svg?raw';
import database from 'lucide-static/icons/database.svg?raw';
import activity from 'lucide-static/icons/activity.svg?raw';
import mapPin from 'lucide-static/icons/map-pin.svg?raw';
import gauge from 'lucide-static/icons/gauge.svg?raw';
import network from 'lucide-static/icons/network.svg?raw';
import fileText from 'lucide-static/icons/file-text.svg?raw';

export const ICONS = Object.freeze({
  layers,
  satellite,
  route,
  database,
  activity,
  mapPin,
  gauge,
  network,
  fileText,
});

export type IconName = keyof typeof ICONS;
```

If the installed package exposes the same files under a different documented subpath, update only these imports; keep the `ICONS` public interface exact.

- [ ] **Step 5: Implement `TechIcon`**

Create `src/shared/components/TechIcon.tsx`:

```tsx
import {SVG, type SVGProps} from '@motion-canvas/2d';
import {ICONS, type IconName} from '../icons';
import {THEME} from '../theme';

export interface TechIconProps extends Omit<SVGProps, 'svg'> {
  name: IconName;
  size?: number;
}

export function TechIcon({name, size = 20, ...props}: TechIconProps) {
  return (
    <SVG
      svg={ICONS[name]}
      width={size}
      height={size}
      stroke={THEME.color.muted}
      fill={'transparent'}
      {...props}
    />
  );
}
```

- [ ] **Step 6: Implement compact chips and surface panels**

`StatusChip.tsx` public interface:

```ts
export interface StatusChipProps {
  label: string;
  active?: boolean;
  icon?: IconName;
  width?: number;
}
```

Rendering rules:

```tsx
<Rect
  layout
  height={34}
  radius={17}
  padding={[0, 14]}
  gap={8}
  alignItems={'center'}
  fill={active ? THEME.color.raised : THEME.color.workspace}
  stroke={active ? THEME.color.accentSoft : THEME.color.borderSoft}
  lineWidth={1}
>
  {icon ? <TechIcon name={icon} size={15} /> : null}
  <Txt
    text={label}
    fill={active ? THEME.color.text : THEME.color.muted}
    fontFamily={THEME.font.mono}
    fontSize={THEME.type.micro}
    fontWeight={600}
  />
</Rect>
```

`SurfacePanel.tsx` wraps children in one controlled surface level and defaults to `THEME.color.raised`, `radius={18}`, `lineWidth={1}`, and `stroke={THEME.color.borderSoft}`.

- [ ] **Step 7: Implement the shared project header**

`ProjectHeader.tsx` must use one layout row and never `textWrap`:

```tsx
<Layout
  layout
  width={936}
  height={58}
  alignItems={'center'}
  justifyContent={'space-between'}
>
  <Layout layout direction={'column'} gap={3} alignItems={'start'}>
    <Txt text={eyebrow} fontFamily={THEME.font.mono} fontSize={14} />
    <Txt text={name} fontFamily={THEME.font.sans} fontSize={42} fontWeight={600} />
  </Layout>
  <StatusChip label={status} active />
</Layout>
```

Expose:

```ts
export interface ProjectHeaderProps {
  eyebrow: string;
  name: string;
  status: string;
}
```

- [ ] **Step 8: Implement registration marks and `EnterpriseFrame`**

`RegistrationMarks.tsx` draws four restrained corner marks and optional short grid ticks only; no full-screen decorative grid.

`EnterpriseFrame.tsx` interface:

```ts
export interface EnterpriseFrameProps {
  eyebrow: string;
  name: string;
  status: string;
  children: Node | Node[];
  footer?: string;
}
```

Core geometry:

```tsx
<Rect
  width={1024}
  height={1294}
  radius={24}
  fill={THEME.color.workspace}
  stroke={THEME.color.borderSoft}
  lineWidth={1}
>
  <RegistrationMarks />
  <Layout layout width={936} height={1180} direction={'column'} gap={24}>
    <ProjectHeader eyebrow={eyebrow} name={name} status={status} />
    {children}
    {footer ? <Txt text={footer} ... /> : null}
  </Layout>
</Rect>
```

Do not add fake browser controls.

- [ ] **Step 9: Implement `MetricPanel`**

Expose:

```ts
export interface MetricPanelProps {
  label: string;
  value: string;
  icon?: IconName;
  width?: number;
}
```

Use `SurfacePanel`, mono value typography, and optional `TechIcon`.

- [ ] **Step 10: Verify shared components**

Run:

```bash
npm test -- src/tests/visualContract.test.ts
npm run typecheck
npm run build
```

Expected: PASS. Verify the bundle resolves only the curated icon SVGs used by `icons.ts`.

- [ ] **Step 11: Commit Task 2**

```bash
git add motion/portfolio-reel/package.json \
  motion/portfolio-reel/package-lock.json \
  motion/portfolio-reel/src/shared/icons.ts \
  motion/portfolio-reel/src/shared/components \
  motion/portfolio-reel/src/tests/visualContract.test.ts

git commit -m "feat: add enterprise reel visual components"
```

---

### Task 3: Anchor Visual Upgrade — Cover and GeoPlatform

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/01-cover.tsx`
- Modify: `motion/portfolio-reel/src/scenes/02-geoplatform.tsx`
- Modify: `motion/portfolio-reel/src/shared/primitives/ScreenshotReveal.tsx`
- Test: `motion/portfolio-reel/src/tests/visualContract.test.ts`
- Test: `motion/portfolio-reel/src/tests/primitives.test.ts`

**Interfaces:**
- Consumes: `EnterpriseFrame`, `StatusChip`, `TechIcon`, `RegistrationMarks`, `THEME`, `MOTION`, existing screenshot asset registry.
- Produces: first visual checkpoint proving the enterprise direction before migrating the other five scenes.

- [ ] **Step 1: Add RED tests for anchor-scene enterprise usage**

Add to `visualContract.test.ts`:

```ts
it('upgrades GeoPlatform onto the shared enterprise frame', () => {
  expect(geoplatformSource).toContain('<EnterpriseFrame');
  expect(geoplatformSource).toContain('MINING');
  expect(geoplatformSource).toContain('SATELLITE');
  expect(geoplatformSource).toContain('WEATHER');
  expect(geoplatformSource).toContain('SEISMIC');
  expect(geoplatformSource).toContain('ROUTES');
});

it('keeps the cover enterprise and wrap-safe', () => {
  expect(coverSource).toContain('RegistrationMarks');
  expect(coverSource).not.toContain('Georgia');
  expect(coverSource).not.toContain('textWrap');
});
```

Add a primitive test confirming screenshot scaling remains bounded:

```ts
it('keeps enterprise screenshot drift restrained', () => {
  expect(clampScreenshotScale(1.08)).toBe(1.03);
  expect(clampScreenshotScale(0.9)).toBe(1);
});
```

Rename/export the internal screenshot clamp as `clampScreenshotScale` and cap enterprise drift at `1.03`.

- [ ] **Step 2: Run anchor tests and verify RED**

```bash
npm test -- src/tests/visualContract.test.ts src/tests/primitives.test.ts
```

Expected: FAIL until the scenes and clamp are migrated.

- [ ] **Step 3: Upgrade screenshot reveal to the enterprise motion vocabulary**

Change `ScreenshotReveal.tsx` to use `MOTION.component` / `MOTION.easing.enter` defaults and cap scale at 3%:

```ts
export function clampScreenshotScale(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(1.03, Math.max(1, value));
}
```

The reveal remains opacity + restrained scale only.

- [ ] **Step 4: Recompose Cover as a product-film title card**

Requirements:

- keep the territorial line + nodes concept;
- use IBM Plex Sans/Mono only;
- use explicit line breaks for the main statement rather than `textWrap`;
- use `RegistrationMarks` and a subtle workspace-toned inner surface;
- reduce tiny labels to only `TERRITORY`, `EVIDENCE`, `OPERATIONS`;
- animate the territorial line first, labels second, statement third;
- final 0.4–0.5 s should visually resemble the frame geometry used by GeoPlatform so the cut feels continuous.

Main title must be explicit:

```tsx
<Txt
  text={'Software built around\nterritory, evidence and\noperations.'}
  fontFamily={THEME.font.sans}
  fontSize={THEME.type.coverTitle}
  fontWeight={600}
  lineHeight={76}
/>
```

- [ ] **Step 5: Recompose GeoPlatform inside `EnterpriseFrame`**

Use:

```tsx
<EnterpriseFrame
  eyebrow={'02 / TERRITORIAL INTELLIGENCE'}
  name={project.name}
  status={project.status}
  footer={'MINING · SATELLITE · WEATHER · SEISMIC · ROUTES'}
>
  {/* mode chip row */}
  {/* dominant screenshot */}
</EnterpriseFrame>
```

Mode chips:

- `MINING` → `database`
- `SATELLITE` → `satellite`
- `WEATHER` → `activity`
- `SEISMIC` → `activity`
- `ROUTES` → `route`

Only one or two chips may be accent-active at a time. Screenshot must remain the largest single visual object in the scene.

- [ ] **Step 6: Run automated anchor verification**

```bash
npm test -- src/tests/visualContract.test.ts src/tests/primitives.test.ts
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 7: Visual checkpoint — stop and inspect before further migration**

Run:

```bash
npm run dev
```

Inspect at `1080×1350 / 25 fps`:

- late Cover frame;
- early GeoPlatform frame;
- GeoPlatform screenshot-dominant frame;
- transition from Cover into GeoPlatform at 1× playback.

Acceptance:

- typography clearly looks more enterprise than the current Georgia/Courier version;
- no clipping;
- no new `textWrap` bug;
- screenshot is visibly more important than labels;
- frame does not look like fake browser chrome;
- registration marks remain subordinate.

Do not proceed if the enterprise frame itself looks visually wrong; fix the shared component rather than compensating per scene.

- [ ] **Step 8: Commit Task 3**

```bash
git add motion/portfolio-reel/src/scenes/01-cover.tsx \
  motion/portfolio-reel/src/scenes/02-geoplatform.tsx \
  motion/portfolio-reel/src/shared/primitives/ScreenshotReveal.tsx \
  motion/portfolio-reel/src/tests

git commit -m "feat: upgrade cover and geoplatform enterprise visuals"
```

---

### Task 4: Pulso and Anti IA — Enterprise State and Evidence Motion

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/03-pulso.tsx`
- Modify: `motion/portfolio-reel/src/scenes/04-anti-ia.tsx`
- Test: `motion/portfolio-reel/src/tests/visualContract.test.ts`

**Interfaces:**
- Consumes: `EnterpriseFrame`, `StatusChip`, `SurfacePanel`, `TechIcon`, `MOTION`, canonical project metadata.
- Produces: two enterprise product scenes that communicate state/provenance and evidence reasoning rather than decorative diagrams.

- [ ] **Step 1: Write RED source-contract tests**

```ts
it('uses enterprise frame and provenance states in Pulso', () => {
  expect(pulsoSource).toContain('<EnterpriseFrame');
  expect(pulsoSource).toContain('SIGNAL');
  expect(pulsoSource).toContain('SOURCE');
  expect(pulsoSource).toContain('FRESHNESS');
});

it('uses enterprise frame and evidence hierarchy in Anti IA', () => {
  expect(antiIaSource).toContain('<EnterpriseFrame');
  expect(antiIaSource).toContain('COORDINATE');
  expect(antiIaSource).toContain('EVIDENCE');
  expect(antiIaSource).toContain('QUESTION');
  expect(antiIaSource).not.toContain('textWrap');
});
```

- [ ] **Step 2: Run and confirm RED**

```bash
npm test -- src/tests/visualContract.test.ts
```

Expected: FAIL until both scenes migrate.

- [ ] **Step 3: Upgrade Pulso**

Composition requirements:

- wrap scene in `EnterpriseFrame`;
- keep deterministic signal-point stagger but reduce point count if needed for hierarchy;
- present `SIGNAL`, `SOURCE`, `FRESHNESS` as compact state chips on a raised surface, not floating copy;
- animate one active signal point into one active chip state using `MOTION.micro`;
- reveal the screenshot while the state rail remains visually related;
- do not introduce additional colors beyond the shared palette.

Use `mapPin` or `activity` icon only where it improves comprehension; total icons in this scene ≤ 3.

- [ ] **Step 4: Upgrade Anti IA**

Composition requirements:

- wrap product UI in `EnterpriseFrame`;
- preserve `COORDINATE ≠ KNOWLEDGE` as the scene's editorial anchor;
- use explicit lines, not wrapping, e.g. `text={'COORDINATE\n≠ KNOWLEDGE'}` only if needed for portrait fit;
- render `DATA → EVIDENCE → QUESTION` as three hierarchical nodes/surfaces;
- one evidence/question node may receive a subtle selected-state accent;
- interface reveal should look like the conceptual graph resolving into a real product UI;
- keep `Una coordenada no es un punto.` as restrained closing copy, not a giant slogan.

- [ ] **Step 5: Verify Task 4**

```bash
npm test -- src/tests/visualContract.test.ts
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit Task 4**

```bash
git add motion/portfolio-reel/src/scenes/03-pulso.tsx \
  motion/portfolio-reel/src/scenes/04-anti-ia.tsx \
  motion/portfolio-reel/src/tests/visualContract.test.ts

git commit -m "feat: upgrade pulso and anti ia enterprise states"
```

---

### Task 5: FleetFlow — Route Trail, Spatial Symbols, and KPI Hierarchy

**Files:**
- Create: `motion/portfolio-reel/src/shared/primitives/RouteTrail.tsx`
- Modify: `motion/portfolio-reel/src/scenes/05-fleetflow.tsx`
- Modify: `motion/portfolio-reel/src/tests/primitives.test.ts`
- Modify: `motion/portfolio-reel/src/tests/visualContract.test.ts`

**Interfaces:**
- Consumes: existing `DrawPath`, `CountMetric`, `EnterpriseFrame`, `MetricPanel`, `MOTION`.
- Produces: `routeTrailWindow(progress, length)` pure helper plus a refined FleetFlow enterprise scene.

- [ ] **Step 1: Write RED primitive tests for a bounded fading trail window**

Add to `primitives.test.ts`:

```ts
import {routeTrailWindow} from '../shared/primitives/RouteTrail';

it('keeps route trail progress finite and bounded', () => {
  expect(routeTrailWindow(-1, 0.24)).toEqual({start: 0, end: 0});
  expect(routeTrailWindow(0.5, 0.24)).toEqual({start: 0.26, end: 0.5});
  expect(routeTrailWindow(2, 0.24)).toEqual({start: 0.76, end: 1});
});
```

Add to `visualContract.test.ts`:

```ts
it('upgrades FleetFlow into the enterprise operational frame', () => {
  expect(fleetflowSource).toContain('<EnterpriseFrame');
  expect(fleetflowSource).toContain('MetricPanel');
  expect(fleetflowSource).toContain('RouteTrail');
});
```

- [ ] **Step 2: Run and confirm RED**

```bash
npm test -- src/tests/primitives.test.ts src/tests/visualContract.test.ts
```

Expected: FAIL because `RouteTrail` and enterprise FleetFlow composition do not exist.

- [ ] **Step 3: Implement `RouteTrail` without adding D3**

Create `src/shared/primitives/RouteTrail.tsx`:

```ts
import type {Line} from '@motion-canvas/2d';

export function routeTrailWindow(progress: number, length = 0.24) {
  const safeProgress = Number.isFinite(progress)
    ? Math.max(0, Math.min(1, progress))
    : 0;
  const safeLength = Number.isFinite(length)
    ? Math.max(0, Math.min(1, length))
    : 0.24;
  return {
    start: Math.max(0, safeProgress - safeLength),
    end: safeProgress,
  };
}

export function applyRouteTrail(node: Line, progress: number, length = 0.24) {
  const {start, end} = routeTrailWindow(progress, length);
  node.start(start);
  node.end(end);
}
```

Use a second `Line` with lower opacity/wider stroke as the trail; do not add blur/glow.

- [ ] **Step 4: Recompose FleetFlow inside `EnterpriseFrame`**

Required hierarchy:

1. stable enterprise header;
2. route viewport as primary diagram;
3. depot/stops/vehicle using one symbol language;
4. three compact `MetricPanel`s for delivered, distance, active;
5. screenshot reveal.

Use icons no more than:

- `route` for route mode;
- `gauge` for metric group;
- optional `mapPin` for depot/stops.

- [ ] **Step 5: Synchronize route trail, vehicle, and metrics**

During the existing vehicle progress tween, update:

- route main progress;
- trail `start/end` window;
- vehicle position;
- `CountMetric` values.

Use `MOTION.easing.progress` for operational progress and avoid bounce/overshoot.

- [ ] **Step 6: Verify Task 5**

```bash
npm test -- src/tests/primitives.test.ts src/tests/visualContract.test.ts
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 7: Visual checkpoint — FleetFlow**

Run `npm run dev` and inspect the full FleetFlow scene at 1×.

Acceptance:

- trail is visible but subordinate to the vehicle/route;
- KPI surface hierarchy reads at feed scale;
- route and numbers feel synchronized;
- screenshot remains the destination of the scene rather than an afterthought;
- no glow or videogame HUD excess.

- [ ] **Step 8: Commit Task 5**

```bash
git add motion/portfolio-reel/src/shared/primitives/RouteTrail.tsx \
  motion/portfolio-reel/src/scenes/05-fleetflow.tsx \
  motion/portfolio-reel/src/tests

git commit -m "feat: refine fleetflow route and enterprise kpis"
```

---

### Task 6: Atlas and More Systems — Enterprise Filtering and Stable Close

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/06-atlas.tsx`
- Modify: `motion/portfolio-reel/src/scenes/07-more-systems.tsx`
- Test: `motion/portfolio-reel/src/tests/visualContract.test.ts`

**Interfaces:**
- Consumes: enterprise components, current concrete-node More Systems architecture, canonical metadata.
- Produces: final two enterprise scenes without regressing the previously fixed empty-card bug.

- [ ] **Step 1: Add RED tests for Atlas and closing-frame contracts**

```ts
it('uses enterprise filter state in Atlas', () => {
  expect(atlasSource).toContain('<EnterpriseFrame');
  expect(atlasSource).toContain('PROVINCE');
  expect(atlasSource).toContain('MINERAL');
  expect(atlasSource).toContain('STAGE');
  expect(atlasSource).toContain('COMPANY');
  expect(atlasSource).toContain('CAPITAL');
});

it('keeps More Systems as a stable populated enterprise close', () => {
  expect(moreSystemsSource).not.toContain('{systems.map(');
  expect(moreSystemsSource).not.toContain('opacity={0}');
  expect(moreSystemsSource).not.toContain('revealText(');
  expect(moreSystemsSource).toContain('Question Radar');
  expect(moreSystemsSource).toContain('Opportunity OS');
  expect(moreSystemsSource).toContain('Screen2Social');
  expect(moreSystemsSource).toContain('Geo Agent');
});
```

- [ ] **Step 2: Run and confirm RED only for missing enterprise composition**

```bash
npm test -- src/tests/visualContract.test.ts
```

Expected: Atlas enterprise assertions fail. Existing More Systems safety assertions should remain green.

- [ ] **Step 3: Upgrade Atlas**

Requirements:

- use `EnterpriseFrame`;
- retain explicitly abstract territorial frame unless using verified geography already in repo;
- present `PROVINCE`, `MINERAL`, `STAGE`, `COMPANY`, `CAPITAL` as compact filter rows/chips;
- animate one selected filter state and a corresponding restrained change in point emphasis;
- screenshot appears earlier and is the dominant evidence;
- no invented geographic precision.

Use at most `database`, `mapPin`, and one additional relevant icon.

- [ ] **Step 4: Upgrade More Systems without changing its proven rendering architecture**

Preserve the concrete `for (...) { view.add(...) }` row creation that fixed the missing-content bug.

Each row should use:

- 14 px mono category;
- 30–34 px sans semibold system name;
- 14–15 px mono stack;
- one thin branch from the shared spine;
- one small endpoint marker;
- optional one icon per row only if it improves category recognition.

Do not make row content depend on opacity reveals. Animate only spine/branches/endpoints.

The final frame must remain fully populated and readable if paused on the last frame.

- [ ] **Step 5: Verify Task 6**

```bash
npm test -- src/tests/visualContract.test.ts
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 6: Visual checkpoint — full seven-scene preview**

Run `npm run dev` and inspect all seven scenes at `1080×1350 / 25 fps`.

Mandatory frames:

- Cover late state;
- GeoPlatform screenshot state;
- Pulso active signal state;
- Anti IA evidence state;
- FleetFlow KPI/route state;
- Atlas filter state;
- More Systems final state.

Do not proceed if any text clipping or empty More Systems regression appears.

- [ ] **Step 7: Commit Task 6**

```bash
git add motion/portfolio-reel/src/scenes/06-atlas.tsx \
  motion/portfolio-reel/src/scenes/07-more-systems.tsx \
  motion/portfolio-reel/src/tests/visualContract.test.ts

git commit -m "feat: upgrade atlas and enterprise closing scene"
```

---

### Task 7: Cross-Scene Continuity, Timing, and Full Regression

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/02-geoplatform.tsx`
- Modify: `motion/portfolio-reel/src/scenes/03-pulso.tsx`
- Modify: `motion/portfolio-reel/src/scenes/04-anti-ia.tsx`
- Modify: `motion/portfolio-reel/src/scenes/05-fleetflow.tsx`
- Modify: `motion/portfolio-reel/src/scenes/06-atlas.tsx`
- Modify only if justified by QA: `motion/portfolio-reel/src/shared/timing.ts`
- Test: `motion/portfolio-reel/src/tests/visualContract.test.ts`
- Test: `motion/portfolio-reel/src/tests/timing.test.ts`

**Interfaces:**
- Consumes: complete enterprise scene set.
- Produces: coherent product-scene continuity and verified ~20 s runtime.

- [ ] **Step 1: Add RED continuity contract**

```ts
it('uses one shared workspace frame across all product scenes', () => {
  for (const [filename, source] of PROJECT_SCENES) {
    expect(source, filename).toContain('<EnterpriseFrame');
  }
});

it('does not reintroduce critical text wrapping into product headers', () => {
  for (const [filename, source] of PROJECT_SCENES) {
    expect(source, filename).not.toContain('leftAlignedCenterX');
    expect(source, filename).not.toContain('rightAlignedCenterX');
  }
});
```

Update `timing.test.ts` to keep the runtime contract explicit:

```ts
it('keeps the enterprise reel inside the social runtime budget', () => {
  expect(totalDurationSeconds()).toBeGreaterThanOrEqual(18);
  expect(totalDurationSeconds()).toBeLessThanOrEqual(24);
});
```

- [ ] **Step 2: Run continuity/timing tests**

```bash
npm test -- src/tests/visualContract.test.ts src/tests/timing.test.ts
```

Expected: any un-migrated product scene fails. Runtime should already pass at `20.0 s`.

- [ ] **Step 3: Normalize product-scene frame geometry and transition direction**

Across GeoPlatform → Atlas:

- exact same `EnterpriseFrame` outer size and product viewport geometry;
- header remains at the same vertical position;
- screenshots use the same radius and dominant viewport size;
- active accent moves through scene content rather than frame chrome;
- entry/reveal timing uses `MOTION.scene` and `MOTION.component` vocabulary;
- no scene invents a custom easing unless operational progress requires linear motion.

Do not attempt literal cross-scene node persistence; continuity is achieved through matching geometry and choreography because each Motion Canvas scene remains isolated.

- [ ] **Step 4: Preserve 20.0 s unless visual QA proves a timing defect**

Default: leave `SCENE_DURATION_SECONDS` unchanged:

```ts
{
  cover: 2.7,
  geoplatform: 2.7,
  pulso: 2.7,
  'anti-ia': 3.2,
  fleetflow: 3.3,
  atlas: 2.7,
  'more-systems': 2.7,
}
```

Only change these values after a manual preview identifies a specific too-fast/too-slow scene. Any change must keep the total in `18–24 s` and be included in the Task 7 commit.

- [ ] **Step 5: Run complete automated regression**

From `motion/portfolio-reel`:

```bash
npm run check
```

From repository root:

```bash
python -m pytest tests/test_build_social_carousel.py -q
```

Then verify the static contract was not edited:

```bash
git diff --exit-code origin/main -- portfolio/social_carousel.json scripts/build_social_carousel.py
```

Expected:

- Motion tests PASS;
- TypeScript PASS;
- Vite build PASS;
- static carousel `10 passed` or current equivalent PASS count;
- canonical JSON and static renderer unchanged relative to main.

- [ ] **Step 6: Commit Task 7**

```bash
git add motion/portfolio-reel/src/scenes \
  motion/portfolio-reel/src/shared/timing.ts \
  motion/portfolio-reel/src/tests

git commit -m "feat: unify enterprise reel continuity and timing"
```

If `timing.ts` did not change, omit it from `git add`.

---

### Task 8: Render Contract, Final Visual QA, and Completion Gate

**Files:**
- Create: `motion/portfolio-reel/README.md`
- Modify only if final QA identifies a concrete defect: affected scene/shared file plus its test.

**Interfaces:**
- Consumes: fully migrated enterprise reel.
- Produces: reproducible local preview/render instructions and a manually reviewed final MP4.

- [ ] **Step 1: Write the render/QA README**

Create `motion/portfolio-reel/README.md` with this exact operational contract:

```markdown
# Portfolio Reel

## Development

```powershell
npm ci
npm run dev
```

Use the exact Vite URL printed in the terminal.

## Preview contract

- Resolution: 1080 × 1350
- Preview frame rate: 25 fps
- Rendering frame rate: 25 fps
- Scale: 1.0x Full
- Color space: sRGB

## Final render

Use Motion Canvas editor → Video (FFmpeg):

- range: 0 → end
- resolution: 1080 × 1350
- frame rate: 25 fps
- scale: 1.0x Full
- color space: sRGB
- Fast Start: on when available
- output: MP4

## Manual QA

- Watch complete reel at 1× outside the editor UI.
- Verify no text clipping or overlap.
- Verify product screenshots preserve aspect ratio.
- Verify product UI dominates each product scene.
- Verify Cover → GeoPlatform continuity.
- Verify FleetFlow route/KPIs are synchronized.
- Verify More Systems final frame is fully populated.
- Verify total runtime remains 18–24 seconds.
```

- [ ] **Step 2: Run final automated verification on the exact HEAD intended for render**

```bash
cd motion/portfolio-reel
npm ci
npm run check
cd ../..
python -m pytest tests/test_build_social_carousel.py -q
```

Expected: all PASS.

- [ ] **Step 3: Start clean editor preview**

```bash
cd motion/portfolio-reel
npm run dev
```

Open the Vite URL in Chrome/Edge and verify the editor shows `1080×1350`, `25`, `25` before judging any scene.

- [ ] **Step 4: Perform the final seven-scene visual review**

Inspect:

1. Cover — title safe, enterprise typography, clean handoff.
2. GeoPlatform — flagship hierarchy, large real product UI.
3. Pulso — provenance states visibly connect to product data.
4. Anti IA — evidence hierarchy remains serious/editorial.
5. FleetFlow — route trail and KPIs read as operations intelligence, not HUD decoration.
6. Atlas — filters visibly affect point emphasis without fake geography.
7. More Systems — fully populated final composition.

If a defect is found, add a focused failing regression test first, fix only that defect, rerun `npm run check`, and create a dedicated `fix:` commit before rendering.

- [ ] **Step 5: Render the MP4 manually**

Use the README contract. Do not mark complete based only on editor playback.

- [ ] **Step 6: Watch the exported MP4 outside Motion Canvas**

Acceptance criteria:

- no clipping;
- no stretched screenshots;
- no empty closing frame;
- no visible font fallback to Georgia/Courier;
- no random particles/glow;
- consistent frame geometry across five product scenes;
- motion guides attention rather than competing with screenshots;
- runtime in `18–24 s`.

- [ ] **Step 7: Commit Task 8 documentation**

```bash
git add motion/portfolio-reel/README.md
git commit -m "docs: add enterprise reel render and qa contract"
```

Do not commit the MP4 unless explicitly requested; the V1 output is a reviewed local/export artifact, not a repository binary requirement.

---

## Final Verification Matrix

| Requirement | Automated | Manual |
| --- | --- | --- |
| IBM Plex self-hosted | build + source contract | visual font check |
| 3-level surfaces | source contract | visual hierarchy |
| EnterpriseFrame across 5 product scenes | source contract | continuity playback |
| Bounded Lucide icons | build/source | no icon clutter |
| Screenshots dominate | theme/source contract | feed-scale review |
| Pulso provenance motion | source contract | playback |
| Anti IA evidence hierarchy | source contract | playback |
| FleetFlow trail/KPI sync | primitive tests | playback |
| Atlas filter response | source contract | playback |
| More Systems always populated | regression tests | final-frame review |
| 1080×1350 / 25 fps | theme/meta tests | editor settings |
| 18–24 s | timing test | MP4 duration |
| Static carousel unaffected | Python regression + git diff | n/a |
| Final MP4 professional 7/10 target | n/a | full exported-video review |

## Commit Sequence

1. `feat: add enterprise typography and motion tokens`
2. `feat: add enterprise reel visual components`
3. `feat: upgrade cover and geoplatform enterprise visuals`
4. `feat: upgrade pulso and anti ia enterprise states`
5. `feat: refine fleetflow route and enterprise kpis`
6. `feat: upgrade atlas and enterprise closing scene`
7. `feat: unify enterprise reel continuity and timing`
8. `docs: add enterprise reel render and qa contract`

Implementation must stop at the visual checkpoints after Tasks 3, 5, and 6 so the shared system can be corrected globally before later scenes copy a weak visual decision.
