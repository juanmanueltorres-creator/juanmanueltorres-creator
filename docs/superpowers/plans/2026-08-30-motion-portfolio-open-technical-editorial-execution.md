# Motion Portfolio Reel — Open Technical Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the boxed enterprise/dashboard presentation layer with an open technical-editorial motion system where typography, whitespace, one meaningful domain action, and an elevated product screenshot carry each scene.

**Architecture:** Keep Motion Canvas 3.17.2, the seven existing scenes, canonical metadata, fonts, screenshot assets, and tested motion primitives. Introduce a small open presentation layer (`EditorialHeader`, `ScreenshotSurface`, `TechnicalLabel`, `MetricReadout`) backed by centralized spacing/shadow/type tokens, migrate scenes incrementally, and enforce the new visual contract with source-level Vitest checks plus mandatory manual visual checkpoints.

**Tech Stack:** Motion Canvas 3.17.2, TypeScript 5.6, Vite 5.4, Vitest 2.1, IBM Plex Sans/Mono via Fontsource, Lucide Static 1.37.0.

**Spec:** `docs/superpowers/specs/2026-08-30-motion-portfolio-open-technical-editorial-design.md`

## Global Constraints

- Keep portrait output at exactly 1080×1350.
- Keep preview/render at exactly 25 fps.
- Keep Motion Canvas packages pinned at 3.17.2.
- Keep the existing seven-scene architecture and canonical product facts/screenshots/metadata.
- Keep overall runtime in the 18–24 second range, target approximately 20 seconds.
- Keep IBM Plex Sans and IBM Plex Mono; introduce no new font family.
- Keep the dark charcoal / warm ivory / restrained bronze palette.
- Do not add a second renderer or animation engine.
- Do not add Mapbox, deck.gl, Cesium, D3, Three.js, shaders, particles, 3D, audio, random glow, or remote fonts.
- Product scenes must not use a visible outer `EnterpriseFrame` or another full-scene enclosing card.
- Avoid broad `SurfacePanel` cards around functional cues; use whitespace before borders.
- Product screenshots are the primary elevated surfaces.
- Keep at least 64 px between meaningful content and canvas edges and at least 56 px between route/point geometry and any visible local boundary.
- Screenshot reveal scale must remain clamped to 1.03 maximum.
- Critical copy must not use runtime `textWrap`; use controlled widths and explicit line breaks.
- FleetFlow route progress, trail, vehicle, and KPI updates must remain synchronized to one linear progress value.
- More Systems must retain concrete `for (...) view.add(...)` row construction and content-visible base state.
- Static carousel sources and outputs are out of scope and must remain unchanged.
- Do not rewrite branch history to chase visual states; each implementation task lands as a normal commit and visual checkpoints decide whether to proceed.

---

## File Structure

### Create
- `motion/portfolio-reel/src/shared/components/EditorialHeader.tsx`
- `motion/portfolio-reel/src/shared/components/ScreenshotSurface.tsx`
- `motion/portfolio-reel/src/shared/components/TechnicalLabel.tsx`
- `motion/portfolio-reel/src/shared/components/MetricReadout.tsx`
- `motion/portfolio-reel/src/tests/openEditorialComponents.test.ts`
- `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`

### Modify
- `motion/portfolio-reel/src/shared/theme.ts`
- `motion/portfolio-reel/src/shared/components/RegistrationMarks.tsx`
- `motion/portfolio-reel/src/scenes/01-cover.tsx`
- `motion/portfolio-reel/src/scenes/02-geoplatform.tsx`
- `motion/portfolio-reel/src/scenes/03-pulso.tsx`
- `motion/portfolio-reel/src/scenes/04-anti-ia.tsx`
- `motion/portfolio-reel/src/scenes/05-fleetflow.tsx`
- `motion/portfolio-reel/src/scenes/06-atlas.tsx`
- `motion/portfolio-reel/src/scenes/07-more-systems.tsx`
- `motion/portfolio-reel/src/tests/visualContract.test.ts`
- `motion/portfolio-reel/src/tests/primitives.test.ts`
- `motion/portfolio-reel/README.md`

### Preserve
- `motion/portfolio-reel/src/shared/primitives/ScreenshotReveal.tsx` API and 1.03 scale clamp.
- `motion/portfolio-reel/src/shared/primitives/RouteTrail.tsx` API.
- `motion/portfolio-reel/src/project.ts` seven-scene registration.
- Static carousel sources and outputs.

---

### Task 1: Open editorial primitives and tokens

**Files:**
- Modify: `motion/portfolio-reel/src/shared/theme.ts`
- Create: `motion/portfolio-reel/src/shared/components/EditorialHeader.tsx`
- Create: `motion/portfolio-reel/src/shared/components/ScreenshotSurface.tsx`
- Create: `motion/portfolio-reel/src/shared/components/TechnicalLabel.tsx`
- Create: `motion/portfolio-reel/src/shared/components/MetricReadout.tsx`
- Create: `motion/portfolio-reel/src/tests/openEditorialComponents.test.ts`
- Modify: `motion/portfolio-reel/src/tests/visualContract.test.ts`

**Interfaces:**
- `EditorialHeader({eyebrow, name, status})`
- `ScreenshotSurface({screenshot, imagePosition, width, height, imageWidthPadding, frameRef})`
- `TechnicalLabel({text, active})`
- `MetricReadout({label, value, icon, width})`
- `THEME.shadow.product = {color, blur, offset}`

- [ ] **Step 1: Write RED tests**

```ts
import {describe, expect, it} from 'vitest';
import headerSource from '../shared/components/EditorialHeader.tsx?raw';
import screenshotSource from '../shared/components/ScreenshotSurface.tsx?raw';
import labelSource from '../shared/components/TechnicalLabel.tsx?raw';
import metricSource from '../shared/components/MetricReadout.tsx?raw';
import {THEME} from '../shared/theme';

describe('open technical editorial components', () => {
  it('defines open-canvas spacing and product elevation', () => {
    expect(THEME.space.edgeMin).toBeGreaterThanOrEqual(64);
    expect(THEME.space.localVisualMin).toBeGreaterThanOrEqual(56);
    expect(THEME.space.screenshotRadius).toBe(18);
    expect(THEME.shadow.product).toEqual({
      color: '#00000057',
      blur: 70,
      offset: [0, 28],
    });
  });

  it('keeps the header unboxed and wrap-safe', () => {
    expect(headerSource).toContain('<Layout');
    expect(headerSource).not.toContain('<Rect');
    expect(headerSource).not.toContain('textWrap');
    expect(headerSource).toContain('THEME.font.sans');
    expect(headerSource).toContain('THEME.font.mono');
  });

  it('elevates only the screenshot surface', () => {
    expect(screenshotSource).toContain('THEME.space.screenshotRadius');
    expect(screenshotSource).toContain('shadowColor={THEME.shadow.product.color}');
    expect(screenshotSource).toContain('shadowBlur={THEME.shadow.product.blur}');
    expect(screenshotSource).toContain('shadowOffset={THEME.shadow.product.offset}');
    expect(screenshotSource).not.toContain('stroke={THEME.color.accent}');
  });

  it('keeps labels and metrics container-free', () => {
    expect(labelSource).not.toContain('<Rect');
    expect(metricSource).not.toContain('SurfacePanel');
  });
});
```

- [ ] **Step 2: Verify RED**

```bash
cd motion/portfolio-reel
npm test -- --run src/tests/openEditorialComponents.test.ts
```

Expected: FAIL because the new files/tokens do not exist.

- [ ] **Step 3: Add theme tokens**

```ts
space: {
  outer: 72,
  edgeMin: 64,
  localVisualMin: 56,
  contentWidth: 936,
  screenshotWidth: 936,
  screenshotHeight: 560,
  screenshotRadius: 18,
  screenshotY: 35,
  captionY: 410,
},
shadow: {
  product: {
    color: '#00000057',
    blur: 70,
    offset: [0, 28] as const,
  },
},
```

Motion Canvas 2D exposes `shadowColor`, `shadowBlur`, and `shadowOffset`; use those exact props. Use one diffuse shadow only.

- [ ] **Step 4: Implement `EditorialHeader`**

```tsx
import {Layout, Txt} from '@motion-canvas/2d';
import {THEME} from '../theme';

export interface EditorialHeaderProps {
  eyebrow: string;
  name: string;
  status?: string;
}

export function EditorialHeader({eyebrow, name, status}: EditorialHeaderProps) {
  return (
    <Layout layout width={THEME.space.contentWidth} direction={'column'} gap={10} alignItems={'start'}>
      <Txt text={eyebrow} fill={THEME.color.accent} fontFamily={THEME.font.mono} fontSize={15} fontWeight={600} letterSpacing={1.1} />
      <Layout layout width={THEME.space.contentWidth} alignItems={'end'} justifyContent={'space-between'}>
        <Txt text={name} fill={THEME.color.text} fontFamily={THEME.font.sans} fontSize={50} fontWeight={600} />
        {status ? <Txt text={status} fill={THEME.color.muted} fontFamily={THEME.font.mono} fontSize={14} fontWeight={500} /> : null}
      </Layout>
    </Layout>
  );
}
```

- [ ] **Step 5: Implement `TechnicalLabel`**

```tsx
import {Txt} from '@motion-canvas/2d';
import {THEME} from '../theme';

export function TechnicalLabel({text, active = false}: {text: string; active?: boolean}) {
  return <Txt text={text} fill={active ? THEME.color.accent : THEME.color.muted} fontFamily={THEME.font.mono} fontSize={14} fontWeight={500} letterSpacing={0.55} />;
}
```

- [ ] **Step 6: Implement `MetricReadout`**

```tsx
import {Layout, Txt} from '@motion-canvas/2d';
import type {SignalValue} from '@motion-canvas/core';
import type {IconName} from '../icons';
import {THEME} from '../theme';
import {TechIcon} from './TechIcon';
import {TechnicalLabel} from './TechnicalLabel';

export interface MetricReadoutProps {
  label: string;
  value: SignalValue<string>;
  icon?: IconName;
  width?: number;
}

export function MetricReadout({label, value, icon, width = 280}: MetricReadoutProps) {
  return (
    <Layout layout width={width} direction={'column'} gap={5} alignItems={'start'}>
      <Layout layout gap={8} alignItems={'center'}>
        {icon ? <TechIcon name={icon} size={14} /> : null}
        <TechnicalLabel text={label} />
      </Layout>
      <Txt text={value} fill={THEME.color.text} fontFamily={THEME.font.mono} fontSize={28} fontWeight={500} />
    </Layout>
  );
}
```

- [ ] **Step 7: Implement `ScreenshotSurface`**

```tsx
import {Img, Rect} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {ASSET_URLS} from '../assets';
import {normalizeFocalPosition} from '../primitives/ScreenshotReveal';
import {THEME} from '../theme';
import type {ImagePosition} from '../types';

export interface ScreenshotSurfaceProps {
  screenshot: string;
  imagePosition: ImagePosition;
  width?: number;
  height?: number;
  imageWidthPadding?: number;
  frameRef?: Reference<Rect>;
}

export function ScreenshotSurface({
  screenshot,
  imagePosition,
  width = THEME.space.screenshotWidth,
  height = THEME.space.screenshotHeight,
  imageWidthPadding = 120,
  frameRef,
}: ScreenshotSurfaceProps) {
  const focal = normalizeFocalPosition(imagePosition);
  return (
    <Rect
      ref={frameRef}
      width={width}
      height={height}
      radius={THEME.space.screenshotRadius}
      clip
      fill={THEME.color.raised}
      stroke={THEME.color.border}
      lineWidth={1}
      shadowColor={THEME.shadow.product.color}
      shadowBlur={THEME.shadow.product.blur}
      shadowOffset={THEME.shadow.product.offset}
      opacity={0}
    >
      <Img src={ASSET_URLS[screenshot]} width={width + imageWidthPadding} x={focal.x * 44} y={focal.y * 34} />
    </Rect>
  );
}
```

- [ ] **Step 8: Update `visualContract.test.ts`**

Remove assertions that require visible `EnterpriseFrame`, visible three-surface hierarchy, or `StatusChip` composition. Keep canvas/fps, IBM Plex, bounded motion, More Systems concrete-node, wrap-safety, and Motion Canvas color-safety assertions. Add:

```ts
it('keeps the open editorial spacing contract', () => {
  expect(THEME.space.edgeMin).toBeGreaterThanOrEqual(64);
  expect(THEME.space.localVisualMin).toBeGreaterThanOrEqual(56);
});
```

- [ ] **Step 9: Verify GREEN**

```bash
npm test -- --run src/tests/openEditorialComponents.test.ts src/tests/visualContract.test.ts
npm run typecheck
npm run build
```

- [ ] **Step 10: Commit**

```bash
git add motion/portfolio-reel/src/shared motion/portfolio-reel/src/tests/openEditorialComponents.test.ts motion/portfolio-reel/src/tests/visualContract.test.ts
git commit -m "feat: add open editorial motion primitives"
```

---

### Task 2: Cover + GeoPlatform anchor

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/01-cover.tsx`
- Modify: `motion/portfolio-reel/src/scenes/02-geoplatform.tsx`
- Create: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`

**Interfaces:** consumes Task 1 components; establishes shared scene geometry.

- [ ] **Step 1: Write RED tests**

```ts
import {describe, expect, it} from 'vitest';
import coverSource from '../scenes/01-cover.tsx?raw';
import geoSource from '../scenes/02-geoplatform.tsx?raw';

describe('open editorial anchor scenes', () => {
  it('removes the enclosing frame from Cover', () => {
    expect(coverSource).not.toContain('width={1024}');
    expect(coverSource).not.toContain('ref={frame}');
    expect(coverSource).not.toContain('textWrap');
    expect(coverSource).toContain('RegistrationMarks');
  });

  it('moves GeoPlatform off the enterprise shell', () => {
    expect(geoSource).toContain('EditorialHeader');
    expect(geoSource).toContain('ScreenshotSurface');
    expect(geoSource).not.toContain('EnterpriseFrame');
    expect(geoSource).not.toContain('SurfacePanel');
  });
});
```

- [ ] **Step 2: Verify RED**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts
```

- [ ] **Step 3: Open Cover**

Remove the 1024×1294 frame `Rect`, `frame` ref, and frame stroke animation. Keep sparse `RegistrationMarks`. Replace the visible route card with a borderless coordinate parent:

```tsx
<Rect width={936} height={250} y={-320}>
  <Line ref={route} points={routePoints.map(([x, y]) => [x, y + 320])} stroke={THEME.color.accentSoft} lineWidth={2} radius={18} />
  {nodePoints.map((position, index) => (
    <Circle
      ref={nodeRefs[index]}
      x={position[0]}
      y={position[1] + 320}
      width={10}
      height={10}
      fill={THEME.color.canvas}
      stroke={THEME.color.accentSoft}
      lineWidth={2}
    />
  ))}
</Rect>
```

Keep existing explicit title/subtitle line breaks. Set `TERRITORY / EVIDENCE / OPERATIONS` to 14–15 px Mono, weight 500–600, tracking <= 1.0.

- [ ] **Step 4: Open GeoPlatform**

Use `EditorialHeader`, one borderless `TechnicalLabel` domain row (`MINING`, `SATELLITE`, `WEATHER`, `SEISMIC`, `ROUTES`), the existing crosshair/pulse cue, `ScreenshotSurface`, and a borderless context layout containing `LIVE TERRITORIAL CONTEXT`, `ONE PLACE / MULTIPLE VERIFIED CONTEXT LAYERS`, and `05 DOMAINS`.

Use:

```tsx
<ScreenshotSurface frameRef={screenshotFrame} screenshot={project.screenshot} imagePosition={project.imagePosition} />
```

- [ ] **Step 5: Use one GeoPlatform action**

Header present -> domain row fades as one group -> screenshot and pulse resolve together -> context copy fades once.

- [ ] **Step 6: Verify GREEN**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts src/tests/visualContract.test.ts
npm run typecheck
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add motion/portfolio-reel/src/scenes/01-cover.tsx motion/portfolio-reel/src/scenes/02-geoplatform.tsx motion/portfolio-reel/src/tests/openEditorialScenes.test.ts
git commit -m "feat: open cover and geoplatform editorial layout"
```

- [ ] **Step 8: VISUAL CHECKPOINT**

Review Cover + GeoPlatform at 1× and feed-like scale. Require: no enclosing-card feeling, title first, subtle shadow, screenshot dominant, open edges, no content inside the 64 px edge zone.

---

### Task 3: Pulso + Anti IA

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/03-pulso.tsx`
- Modify: `motion/portfolio-reel/src/scenes/04-anti-ia.tsx`
- Modify: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`

- [ ] **Step 1: Add RED tests**

```ts
import pulsoSource from '../scenes/03-pulso.tsx?raw';
import antiIaSource from '../scenes/04-anti-ia.tsx?raw';

it('keeps Pulso signal state lightweight', () => {
  expect(pulsoSource).toContain('EditorialHeader');
  expect(pulsoSource).toContain('ScreenshotSurface');
  expect(pulsoSource).toContain('SIGNAL');
  expect(pulsoSource).toContain('SOURCE');
  expect(pulsoSource).toContain('FRESHNESS');
  expect(pulsoSource).not.toContain('EnterpriseFrame');
  expect(pulsoSource).not.toContain('SurfacePanel');
});

it('keeps Anti IA evidence chain open', () => {
  expect(antiIaSource).toContain('EditorialHeader');
  expect(antiIaSource).toContain('ScreenshotSurface');
  expect(antiIaSource).toContain('COORDINATE');
  expect(antiIaSource).toContain('EVIDENCE');
  expect(antiIaSource).toContain('QUESTION');
  expect(antiIaSource).not.toContain('EnterpriseFrame');
  expect(antiIaSource).not.toContain('SurfacePanel');
  expect(antiIaSource).not.toContain('textWrap');
});
```

- [ ] **Step 2: Verify RED**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts
```

- [ ] **Step 3: Open Pulso**

Use `EditorialHeader`. Replace `StatusChip`s with:

```tsx
<Layout layout width={936} gap={34} alignItems={'center'}>
  <TechnicalLabel text={'SIGNAL'} active />
  <TechnicalLabel text={'SOURCE'} active />
  <TechnicalLabel text={'FRESHNESS'} />
</Layout>
```

Use this compact field:

```ts
const SIGNAL_POINTS = [
  [-336, -28], [-238, 12], [-126, -34], [-8, 8],
  [116, -28], [226, 18], [322, -10], [72, 34],
] as const;
```

Render points in an unstyled coordinate `Rect width={936} height={150}`. Keep provenance as small mono copy. Signal activation is the single action; then reveal `ScreenshotSurface`.

- [ ] **Step 4: Open Anti IA**

Use `EditorialHeader`. Render `COORDINATE ≠ KNOWLEDGE` directly on canvas. Render three `TechnicalLabel`s (`DATA`, active `EVIDENCE`, `QUESTION`) linked by two thin arrow `Line`s. Render `Una coordenada no es un punto.` as unboxed Sans support copy. Resolve chain, then reveal `ScreenshotSurface`.

- [ ] **Step 5: Verify GREEN**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts src/tests/visualContract.test.ts
npm run typecheck
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add motion/portfolio-reel/src/scenes/03-pulso.tsx motion/portfolio-reel/src/scenes/04-anti-ia.tsx motion/portfolio-reel/src/tests/openEditorialScenes.test.ts
git commit -m "feat: open pulso and anti ia editorial cues"
```

- [ ] **Step 7: VISUAL CHECKPOINT**

Reject if Pulso has obvious placeholder space, if the evidence chain becomes a card, or if either cue competes with its screenshot.

---

### Task 4: FleetFlow operational scene

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/05-fleetflow.tsx`
- Modify: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`
- Modify: `motion/portfolio-reel/src/tests/primitives.test.ts`

**Interfaces:** consumes `applyRouteTrail`, `countMetric`, `interpolatePolyline`, Task 1 components.

- [ ] **Step 1: Add route-trail primitive coverage**

Append to `primitives.test.ts`:

```ts
import {routeTrailWindow} from '../shared/primitives/RouteTrail';

describe('RouteTrail', () => {
  it('keeps trail progress bounded', () => {
    expect(routeTrailWindow(-1, 0.24)).toEqual({start: 0, end: 0});
    expect(routeTrailWindow(0.5, 0.24)).toEqual({start: 0.26, end: 0.5});
    expect(routeTrailWindow(2, 0.24)).toEqual({start: 0.76, end: 1});
  });
});
```

- [ ] **Step 2: Add scene RED test**

```ts
import fleetflowSource from '../scenes/05-fleetflow.tsx?raw';
import {FLEETFLOW_ROUTE} from '../scenes/05-fleetflow';

it('keeps FleetFlow open and route-safe', () => {
  expect(fleetflowSource).toContain('EditorialHeader');
  expect(fleetflowSource).toContain('ScreenshotSurface');
  expect(fleetflowSource).toContain('MetricReadout');
  expect(fleetflowSource).toContain('applyRouteTrail');
  expect(fleetflowSource).not.toContain('SurfacePanel');
  expect(fleetflowSource).not.toContain('width={1024}');
  const xs = FLEETFLOW_ROUTE.map(([x]) => Math.abs(x));
  expect(Math.max(...xs)).toBeLessThanOrEqual(350);
});
```

- [ ] **Step 3: Verify RED**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts src/tests/primitives.test.ts
```

- [ ] **Step 4: Center route geometry**

```ts
export const FLEETFLOW_ROUTE = [
  [-340, 36],
  [-205, -28],
  [-78, 24],
  [82, -52],
  [210, 2],
  [340, -66],
] as const;
```

- [ ] **Step 5: Remove visible wrappers**

Use `EditorialHeader`; use one borderless coordinate field. Keep a subtle base route, accent route progress, short trail, depot, stops, and vehicle. Remove the 1024 frame and 880×120 KPI card.

- [ ] **Step 6: Add borderless KPIs**

```tsx
<Layout layout width={936} gap={36} alignItems={'start'}>
  <MetricReadout label={'DELIVERED'} value={() => delivered()} width={260} />
  <MetricReadout label={'DISTANCE'} value={() => distance()} icon={'gauge'} width={260} />
  <MetricReadout label={'ACTIVE'} value={() => active()} width={260} />
</Layout>
```

- [ ] **Step 7: Synchronize one linear progress value**

```ts
yield* all(
  tween(0.72, progress => {
    const p = MOTION.easing.progress(progress);
    const point = interpolatePolyline(FLEETFLOW_ROUTE, p);
    route().end(p);
    applyRouteTrail(trail(), p, 0.24);
    vehicle().position([point.x, point.y]);
  }),
  countMetric(delivered, 0, 100, 0.72),
  countMetric(distance, 0, 84.7, 0.72, {decimals: 1, suffix: ' km'}),
  countMetric(active, 0, 8, 0.72, {suffix: '/8'}),
);
```

Then reveal `ScreenshotSurface` once.

- [ ] **Step 8: Verify GREEN**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts src/tests/primitives.test.ts
npm run typecheck
npm run build
```

- [ ] **Step 9: Commit**

```bash
git add motion/portfolio-reel/src/scenes/05-fleetflow.tsx motion/portfolio-reel/src/tests/openEditorialScenes.test.ts motion/portfolio-reel/src/tests/primitives.test.ts
git commit -m "feat: open fleetflow operational editorial scene"
```

- [ ] **Step 10: VISUAL CHECKPOINT**

Require centered mountain/route, generous side air, readable unboxed KPIs, subordinate trail, dominant screenshot.

---

### Task 5: Atlas filter response

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/06-atlas.tsx`
- Modify: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`

- [ ] **Step 1: Add RED test**

```ts
import atlasSource from '../scenes/06-atlas.tsx?raw';

it('keeps Atlas as one open filter interaction', () => {
  expect(atlasSource).toContain('EditorialHeader');
  expect(atlasSource).toContain('ScreenshotSurface');
  for (const label of ['PROVINCE', 'MINERAL', 'STAGE', 'COMPANY', 'CAPITAL']) {
    expect(atlasSource).toContain(label);
  }
  expect(atlasSource).not.toContain('width={1024}');
  expect(atlasSource).not.toContain('SurfacePanel');
  expect(atlasSource).not.toContain('ABSTRACT TERRITORIAL FRAME');
});
```

- [ ] **Step 2: Verify RED**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts
```

- [ ] **Step 3: Remove grid/card simulation**

Delete the 1024 frame, 880×510 visible surface, and repeated grid lines. Keep an abstract point field only; do not imply an unverified geographic outline.

- [ ] **Step 4: Add one lightweight filter row**

Use `TechnicalLabel`s: `PROVINCE`, active `MINERAL`, `STAGE`, `COMPANY`, `CAPITAL`. Keep labels visible as one row; animate one corresponding project point to accent and <= 1.25 scale.

- [ ] **Step 5: Resolve once to `ScreenshotSurface`**

No per-label reveal sequence.

- [ ] **Step 6: Verify GREEN and commit**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts src/tests/visualContract.test.ts
npm run typecheck
npm run build
git add motion/portfolio-reel/src/scenes/06-atlas.tsx motion/portfolio-reel/src/tests/openEditorialScenes.test.ts
git commit -m "feat: open atlas filter response scene"
```

---

### Task 6: More Systems open close

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/07-more-systems.tsx`
- Modify: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`
- Modify: `motion/portfolio-reel/src/tests/visualContract.test.ts`

- [ ] **Step 1: Add RED test**

```ts
import moreSystemsSource from '../scenes/07-more-systems.tsx?raw';

it('keeps More Systems open, visible, and concrete', () => {
  expect(moreSystemsSource).not.toContain('width={1024}');
  expect(moreSystemsSource).not.toContain('textWrap');
  expect(moreSystemsSource).not.toContain('{systems.map(');
  expect(moreSystemsSource).toContain('for (let index = 0; index < systems.length; index += 1)');
  expect(moreSystemsSource).not.toContain('revealText(');
});
```

- [ ] **Step 2: Verify RED**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts
```

- [ ] **Step 3: Remove frame and make title wrap explicit**

```ts
const closingTitle = carouselMetadata.moreSystems.title.replace(
  ' and experiments.',
  '\nand experiments.',
);
```

Use Sans 44–48, weight 600, explicit line height. Remove `textWrap` and the 1024 frame.

- [ ] **Step 4: Keep concrete row construction exactly**

Keep the existing loop condition:

```ts
for (let index = 0; index < systems.length; index += 1) {
```

Inside each iteration, retain three separate `view.add(...)` calls in this order:

```tsx
view.add(
  <Line
    ref={branches[index]}
    points={[[-330, y], [-215, y]]}
    stroke={index === systems.length - 1 ? THEME.color.accentSoft : THEME.color.border}
    lineWidth={2}
  />,
);

view.add(
  <Circle
    ref={endpointRefs[index]}
    x={-205}
    y={y}
    width={12}
    height={12}
    fill={THEME.color.canvas}
    stroke={index === systems.length - 1 ? THEME.color.accent : THEME.color.text}
    lineWidth={2}
  />,
);

view.add(
  <Layout
    layout
    x={105}
    y={y + 8}
    width={560}
    height={112}
    direction={'column'}
    alignItems={'start'}
    justifyContent={'center'}
    gap={3}
  >
    <Txt text={category} width={560} fill={THEME.color.muted2} fontFamily={THEME.font.mono} fontSize={14} fontWeight={600} letterSpacing={1.0} />
    <Txt text={item.name} width={560} fill={THEME.color.text} fontFamily={THEME.font.sans} fontSize={33} fontWeight={600} />
    <Txt text={item.stack.slice(0, 3).join(' · ')} width={560} fill={THEME.color.muted} fontFamily={THEME.font.mono} fontSize={14} fontWeight={500} />
  </Layout>,
);
```

Keep row content visible from frame zero. Animate only spine, branches, and endpoint opacity.

- [ ] **Step 5: Verify GREEN**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts src/tests/visualContract.test.ts
npm run typecheck
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add motion/portfolio-reel/src/scenes/07-more-systems.tsx motion/portfolio-reel/src/tests/openEditorialScenes.test.ts motion/portfolio-reel/src/tests/visualContract.test.ts
git commit -m "feat: open more systems editorial close"
```

- [ ] **Step 7: VISUAL CHECKPOINT — ALL 7 SCENES**

Run full reel at 1× and feed scale. Reject if any scene reintroduces a dominant outer card, if screenshot geometry feels inconsistent, or if title/footer/route crowds edges.

---

### Task 7: Lock the final cross-scene contract

**Files:**
- Modify: `motion/portfolio-reel/src/tests/visualContract.test.ts`
- Modify: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`
- Delete obsolete shell components only after source search proves no legitimate imports remain.

- [ ] **Step 1: Add final product-scene contract**

```ts
const PRODUCT_SCENES = [
  ['02-geoplatform.tsx', geoplatformSource],
  ['03-pulso.tsx', pulsoSource],
  ['04-anti-ia.tsx', antiIaSource],
  ['05-fleetflow.tsx', fleetflowSource],
  ['06-atlas.tsx', atlasSource],
] as const;

for (const [filename, source] of PRODUCT_SCENES) {
  expect(source, filename).toContain('EditorialHeader');
  expect(source, filename).toContain('ScreenshotSurface');
  expect(source, filename).not.toContain('EnterpriseFrame');
  expect(source, filename).not.toContain('SurfacePanel');
  expect(source, filename).not.toContain('textWrap');
  expect(source, filename).not.toContain('width={1024}');
}
```

- [ ] **Step 2: Lock screenshot and reveal geometry**

```ts
expect(THEME.space.screenshotWidth).toBe(936);
expect(THEME.space.screenshotHeight).toBe(560);
expect(THEME.space.screenshotRadius).toBe(18);
expect(clampScreenshotScale(2)).toBe(1.03);
expect(clampScreenshotScale(0.5)).toBe(1);
```

- [ ] **Step 3: Lock seven-scene registration**

Import `project.ts?raw`; assert all seven `?scene` import paths occur. Keep:

```ts
expect(THEME.canvas).toEqual({width: 1080, height: 1350, fps: 25});
```

- [ ] **Step 4: Search obsolete shells**

```bash
git grep -n "EnterpriseFrame" -- motion/portfolio-reel/src
git grep -n "SurfacePanel" -- motion/portfolio-reel/src
```

Delete `EnterpriseFrame.tsx`, `SurfacePanel.tsx`, and obsolete imports/tests only when the search output contains no finalized scene or shared component consumer.

- [ ] **Step 5: Full package verification**

```bash
cd motion/portfolio-reel
npm run check
```

- [ ] **Step 6: Static carousel isolation**

```bash
cd ../..
python -m pytest tests/test_build_social_carousel.py -q
git diff --exit-code origin/main -- portfolio/social_carousel.json scripts/build_social_carousel.py
```

- [ ] **Step 7: Commit**

```bash
git add motion/portfolio-reel/src
git commit -m "test: lock open editorial reel contract"
```

---

### Task 8: Timing, documentation, final render QA

**Files:**
- Create or modify: `motion/portfolio-reel/README.md`
- Modify scene terminal waits only when the assembled timeline is outside 18–24 seconds or a specific pacing issue is observed.

- [ ] **Step 1: Measure assembled timeline**

Run `npm run dev`; confirm exactly seven scenes. Accept 18–24 seconds, target ~20 seconds.

- [ ] **Step 2: Adjust only isolated waits when needed**

Change terminal `waitFor(...)` or isolated resolution durations; do not push micro/component motion outside the spec ranges.

- [ ] **Step 3: Document workflow**

README must include:

```bash
npm ci
npm run dev
npm run check
```

Manual export settings:

- 1080×1350
- 25 fps
- sRGB
- FFmpeg renderer
- MP4
- Fast Start enabled

State: review MP4 outside editor; do not commit MP4 unless explicitly requested.

- [ ] **Step 4: Fresh final verification**

```bash
cd motion/portfolio-reel
npm run check
cd ../..
python -m pytest tests/test_build_social_carousel.py -q
git diff --exit-code origin/main -- portfolio/social_carousel.json scripts/build_social_carousel.py
```

Expected: every command exits 0.

- [ ] **Step 5: Manual visual QA**

Confirm all of the following:

- screenshot dominant in scenes 02–06;
- no unnecessary enclosing cards;
- open breathable edges;
- title precedes metadata;
- shadow reads as elevation, not glow;
- route/points remain inside safe margins;
- labels remain tertiary but readable;
- one dominant action per scene;
- representative paused frames remain coherent;
- all seven scenes feel like one editorial system;
- no clipping or unreadable microcopy.

- [ ] **Step 6: Commit documentation/timing**

```bash
git add motion/portfolio-reel/README.md motion/portfolio-reel/src/scenes
git commit -m "docs: finalize open editorial reel workflow"
```

---

## Mandatory Visual Checkpoints

Execution stops for explicit user approval after:

1. Task 2 — Cover + GeoPlatform.
2. Task 3 — Pulso + Anti IA.
3. Task 4 — FleetFlow.
4. Task 6 — full seven-scene reel.
5. Task 8 — final MP4/manual QA.

If a checkpoint exposes a systemic typography, spacing, screenshot-elevation, or shadow problem, fix the shared primitive/token first and rerun the affected checkpoint. Do not add per-scene wrapper cards to compensate.
