# Motion Portfolio Reel — Open Technical Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the boxed enterprise/dashboard presentation layer with an open technical-editorial motion system where typography, whitespace, one meaningful domain action, and an elevated product screenshot carry each scene.

**Architecture:** Keep Motion Canvas 3.17.2, the seven existing scenes, canonical metadata, fonts, screenshot assets, and existing tested motion primitives. Introduce a small editorial presentation layer (`EditorialHeader`, `ScreenshotSurface`, `TechnicalLabel`, `MetricReadout`) backed by centralized spacing/shadow/type tokens, migrate scenes incrementally, and enforce the new visual contract with source-level Vitest checks plus mandatory manual checkpoints.

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

### New shared presentation files

- `motion/portfolio-reel/src/shared/components/EditorialHeader.tsx` — open scene heading: eyebrow, product name, status; no surrounding card.
- `motion/portfolio-reel/src/shared/components/ScreenshotSurface.tsx` — the only shared elevated product surface; owns screenshot radius, low-contrast border, centralized shadow, clipping, and focal positioning.
- `motion/portfolio-reel/src/shared/components/TechnicalLabel.tsx` — lightweight mono label/state text without a container.
- `motion/portfolio-reel/src/shared/components/MetricReadout.tsx` — compact label/value KPI without a surrounding panel.

### Existing shared files to modify

- `motion/portfolio-reel/src/shared/theme.ts` — editorial spacing, screenshot geometry, and centralized shadow tokens.
- `motion/portfolio-reel/src/shared/motion.ts` — preserve bounded durations/easings; only adjust if tests show a spec mismatch.
- `motion/portfolio-reel/src/shared/primitives/ScreenshotReveal.tsx` — keep scale clamp and reveal behavior; no API rewrite unless required by `ScreenshotSurface`.
- `motion/portfolio-reel/src/shared/components/RegistrationMarks.tsx` — retain only sparse open-canvas detail; must not imply a full frame.

### Scene files to migrate

- `motion/portfolio-reel/src/scenes/01-cover.tsx`
- `motion/portfolio-reel/src/scenes/02-geoplatform.tsx`
- `motion/portfolio-reel/src/scenes/03-pulso.tsx`
- `motion/portfolio-reel/src/scenes/04-anti-ia.tsx`
- `motion/portfolio-reel/src/scenes/05-fleetflow.tsx`
- `motion/portfolio-reel/src/scenes/06-atlas.tsx`
- `motion/portfolio-reel/src/scenes/07-more-systems.tsx`

### Tests

- Modify: `motion/portfolio-reel/src/tests/visualContract.test.ts`
- Modify: `motion/portfolio-reel/src/tests/primitives.test.ts`
- Create: `motion/portfolio-reel/src/tests/openEditorialComponents.test.ts`
- Create: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`
- Keep existing FleetFlow route-trail tests if present.

---

### Task 1: Establish the Open Editorial presentation primitives

**Files:**
- Modify: `motion/portfolio-reel/src/shared/theme.ts`
- Create: `motion/portfolio-reel/src/shared/components/EditorialHeader.tsx`
- Create: `motion/portfolio-reel/src/shared/components/ScreenshotSurface.tsx`
- Create: `motion/portfolio-reel/src/shared/components/TechnicalLabel.tsx`
- Create: `motion/portfolio-reel/src/shared/components/MetricReadout.tsx`
- Create: `motion/portfolio-reel/src/tests/openEditorialComponents.test.ts`
- Modify: `motion/portfolio-reel/src/tests/visualContract.test.ts`

**Interfaces:**
- Consumes: `THEME`, `ASSET_URLS`, `normalizeFocalPosition`, Motion Canvas `Layout`, `Rect`, `Txt`, `Img`, optional Lucide `IconName`.
- Produces:
  - `EditorialHeader(props: {eyebrow: string; name: string; status?: string})`
  - `ScreenshotSurface(props: {screenshot: string; imagePosition: ImagePosition; width?: number; height?: number; ref?: Reference<Rect>})`
  - `TechnicalLabel(props: {text: string; active?: boolean})`
  - `MetricReadout(props: {label: string; value: SignalValue<string>; icon?: IconName; width?: number})`
  - `THEME.shadow.product` and editorial spacing tokens used by all later scenes.

- [ ] **Step 1: Write failing component-contract tests**

```ts
import {describe, expect, it} from 'vitest';
import headerSource from '../shared/components/EditorialHeader.tsx?raw';
import screenshotSource from '../shared/components/ScreenshotSurface.tsx?raw';
import labelSource from '../shared/components/TechnicalLabel.tsx?raw';
import metricSource from '../shared/components/MetricReadout.tsx?raw';
import {THEME} from '../shared/theme';

describe('open technical editorial components', () => {
  it('defines centralized open-canvas spacing and product elevation', () => {
    expect(THEME.space.edgeMin).toBeGreaterThanOrEqual(64);
    expect(THEME.space.localVisualMin).toBeGreaterThanOrEqual(56);
    expect(THEME.space.screenshotRadius).toBeGreaterThanOrEqual(16);
    expect(THEME.space.screenshotRadius).toBeLessThanOrEqual(18);
    expect(THEME.shadow.product).toBeTruthy();
  });

  it('keeps the editorial header unboxed and wrap-safe', () => {
    expect(headerSource).toContain('<Layout');
    expect(headerSource).not.toContain('<Rect');
    expect(headerSource).not.toContain('textWrap');
    expect(headerSource).toContain('IBM Plex');
  });

  it('makes the screenshot the shared elevated surface', () => {
    expect(screenshotSource).toContain('THEME.space.screenshotRadius');
    expect(screenshotSource).toContain('THEME.shadow.product');
    expect(screenshotSource).not.toContain('THEME.color.accent}');
  });

  it('keeps labels and metrics container-free', () => {
    expect(labelSource).not.toContain('<Rect');
    expect(metricSource).not.toContain('SurfacePanel');
  });
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
cd motion/portfolio-reel
npm test -- --run src/tests/openEditorialComponents.test.ts
```

Expected: FAIL because the four new component files and editorial theme tokens do not exist yet.

- [ ] **Step 3: Add exact editorial theme tokens**

Extend `THEME` without changing the canvas contract:

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
  product: '0 28 70 0 rgba(0, 0, 0, 0.34)',
  productTight: '0 8 20 0 rgba(0, 0, 0, 0.22)',
},
```

If Motion Canvas shadow props require numeric fields rather than CSS-like strings, represent the same values as a typed object and update the test to assert the centralized object keys, not a duplicated literal.

- [ ] **Step 4: Implement `EditorialHeader` minimally**

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

Do not add a `Rect`, border, background, or outer frame.

- [ ] **Step 5: Implement `TechnicalLabel` and `MetricReadout`**

```tsx
export function TechnicalLabel({text, active = false}: {text: string; active?: boolean}) {
  return <Txt text={text} fill={active ? THEME.color.accent : THEME.color.muted} fontFamily={THEME.font.mono} fontSize={14} fontWeight={500} letterSpacing={0.55} />;
}
```

```tsx
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

- [ ] **Step 6: Implement `ScreenshotSurface` with centralized elevation**

Use one `Rect` as the product boundary, `radius={THEME.space.screenshotRadius}`, low-contrast `stroke={THEME.color.border}`, `lineWidth={1}`, `clip`, and the shared screenshot dimensions. Apply Motion Canvas shadow props using the centralized `THEME.shadow.product` values; do not add glow or accent border. Use `normalizeFocalPosition(imagePosition)` for focal offsets.

- [ ] **Step 7: Replace obsolete enterprise-shell assertions in `visualContract.test.ts`**

Delete tests whose desired behavior is specifically `EnterpriseFrame` / three explicit visible surface levels. Add:

```ts
it('keeps the open editorial canvas free of mandatory full-scene shells', () => {
  expect(THEME.space.edgeMin).toBeGreaterThanOrEqual(64);
  expect(THEME.space.localVisualMin).toBeGreaterThanOrEqual(56);
});
```

Keep the portrait, IBM Plex, bounded motion, wrap-safety, More Systems concrete-node, and Motion Canvas color-safety assertions.

- [ ] **Step 8: Run focused tests and full type/build checks**

Run:

```bash
npm test -- --run src/tests/openEditorialComponents.test.ts src/tests/visualContract.test.ts
npm run typecheck
npm run build
```

Expected: all pass.

- [ ] **Step 9: Commit**

```bash
git add motion/portfolio-reel/src/shared/theme.ts motion/portfolio-reel/src/shared/components motion/portfolio-reel/src/tests/openEditorialComponents.test.ts motion/portfolio-reel/src/tests/visualContract.test.ts
git commit -m "feat: add open editorial motion primitives"
```

---

### Task 2: Open the Cover and GeoPlatform anchor scenes

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/01-cover.tsx`
- Modify: `motion/portfolio-reel/src/scenes/02-geoplatform.tsx`
- Create: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`

**Interfaces:**
- Consumes: `EditorialHeader`, `ScreenshotSurface`, `TechnicalLabel`, `RegistrationMarks`, `MOTION`, existing reveal primitives.
- Produces: the reference geometry and visual grammar that later product scenes follow.

- [ ] **Step 1: Write RED source contracts for Cover and GeoPlatform**

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

- [ ] **Step 2: Run and verify RED**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts
```

Expected: Cover still contains the 1024×1294 enclosing `Rect`; GeoPlatform still imports/uses `EnterpriseFrame` and `SurfacePanel`.

- [ ] **Step 3: Recompose Cover on an open canvas**

Keep the current title copy and route concept, but remove the 1024×1294 workspace `Rect` and its animated border state. Keep sparse `RegistrationMarks`, but ensure they remain detached registration detail rather than a perimeter box. Replace the 936×330 route card with a borderless route field:

```tsx
<Rect width={936} height={250} y={-320}>
  <Line ref={route} points={...} stroke={THEME.color.accentSoft} lineWidth={2} />
  {...nodes}
</Rect>
```

Keep explicit title/subtitle line breaks. Reduce the `TERRITORY / EVIDENCE / OPERATIONS` treatment to lightweight labels with less tracking. Remove `frame()` animation entirely.

- [ ] **Step 4: Recompose GeoPlatform around the open grammar**

Use:

```tsx
<EditorialHeader eyebrow={'02 / TERRITORIAL INTELLIGENCE'} name={project.name} status={project.status} />
```

Below it, render the domain vocabulary as unboxed `TechnicalLabel`s in one `Layout`. Keep one small layer/signal cue (crosshair/pulse is acceptable) and then render `ScreenshotSurface` as the dominant object. Replace the `SurfacePanel` context rail with a borderless two-column `Layout` containing `LIVE TERRITORIAL CONTEXT`, the verified-context sentence, and `05 DOMAINS`.

- [ ] **Step 5: Keep one dominant GeoPlatform action**

Animation order:

1. Header is present immediately.
2. Domain labels settle in as one group.
3. Pulse/crosshair and screenshot reveal together.
4. Context copy fades in once.

Do not animate each domain label independently.

- [ ] **Step 6: Run tests and checks**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts src/tests/visualContract.test.ts
npm run typecheck
npm run build
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add motion/portfolio-reel/src/scenes/01-cover.tsx motion/portfolio-reel/src/scenes/02-geoplatform.tsx motion/portfolio-reel/src/tests/openEditorialScenes.test.ts
git commit -m "feat: open cover and geoplatform editorial layout"
```

- [ ] **Step 8: Mandatory visual checkpoint**

Run `npm run dev` and review Cover + GeoPlatform at 1× and reduced feed-like scale. Do not begin Task 3 until the user approves:

- no enclosing-card feeling;
- title hierarchy reads first;
- screenshot feels elevated without glow;
- shadows remain subtle;
- canvas edges feel open;
- no copy or route geometry crowds the 64 px edge zone.

---

### Task 3: Migrate Pulso and Anti IA to lightweight technical cues

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/03-pulso.tsx`
- Modify: `motion/portfolio-reel/src/scenes/04-anti-ia.tsx`
- Modify: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`

**Interfaces:**
- Consumes: `EditorialHeader`, `ScreenshotSurface`, `TechnicalLabel`, `MOTION`, `staggerPoints`, `drawPath`, `revealText`.
- Produces: open signal-field and evidence-chain patterns without card wrappers.

- [ ] **Step 1: Extend source-contract tests and verify RED**

```ts
it('keeps Pulso signal state lightweight', () => {
  expect(pulsoSource).toContain('EditorialHeader');
  expect(pulsoSource).toContain('SIGNAL');
  expect(pulsoSource).toContain('SOURCE');
  expect(pulsoSource).toContain('FRESHNESS');
  expect(pulsoSource).not.toContain('EnterpriseFrame');
  expect(pulsoSource).not.toContain('SurfacePanel');
});

it('keeps Anti IA evidence chain open', () => {
  expect(antiIaSource).toContain('COORDINATE');
  expect(antiIaSource).toContain('EVIDENCE');
  expect(antiIaSource).toContain('QUESTION');
  expect(antiIaSource).toContain('ScreenshotSurface');
  expect(antiIaSource).not.toContain('EnterpriseFrame');
  expect(antiIaSource).not.toContain('SurfacePanel');
  expect(antiIaSource).not.toContain('textWrap');
});
```

Run focused test; expect failures from legacy wrappers.

- [ ] **Step 2: Recompose Pulso**

Use `EditorialHeader`. Replace three `StatusChip`s with a borderless state rail:

```tsx
<Layout layout width={936} gap={34} alignItems={'center'}>
  <TechnicalLabel text={'SIGNAL'} active />
  <TechnicalLabel text={'SOURCE'} active />
  <TechnicalLabel text={'FRESHNESS'} />
</Layout>
```

Replace the `SurfacePanel` field with a plain `Rect width={936} height={150}` that has no fill/stroke. Distribute 7–8 points across at least ~700 px of width; keep all points at least 56 px from local boundaries. Preserve provenance copy as small mono text. Reveal the signal field as the single action, then reveal `ScreenshotSurface`.

- [ ] **Step 3: Recompose Anti IA**

Use `EditorialHeader`. Render `COORDINATE ≠ KNOWLEDGE` directly on canvas. Render the Data → Evidence → Question chain using labels + two thin lines/arrows, no `StatusChip`, no `SurfacePanel`. Keep only `EVIDENCE` active/accented. Render `Una coordenada no es un punto.` as supporting Sans copy without a container. Then reveal `ScreenshotSurface`.

- [ ] **Step 4: Keep one dominant action per scene**

Pulso: signal activation → screenshot.

Anti IA: Data → Evidence → Question resolution → screenshot.

Do not sequence every label/control as an independent reveal.

- [ ] **Step 5: Run checks**

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

- [ ] **Step 7: Mandatory visual checkpoint**

Review representative Pulso and Anti IA frames. Reject the task if any cue looks like a detached SaaS card, if Pulso has obvious dead placeholder space, or if the evidence chain competes with the screenshot.

---

### Task 4: Build FleetFlow as an open operational scene

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/05-fleetflow.tsx`
- Use existing: `motion/portfolio-reel/src/shared/primitives/RouteTrail.tsx`
- Use existing: `motion/portfolio-reel/src/shared/components/MetricReadout.tsx`
- Modify: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`
- Modify or retain: FleetFlow route primitive tests

**Interfaces:**
- Consumes: `EditorialHeader`, `ScreenshotSurface`, `MetricReadout`, `applyRouteTrail(Line, progress, length)`, `countMetric`, `interpolatePolyline`, `MOTION.easing.progress`.
- Produces: `FLEETFLOW_ROUTE` with safe margins and synchronized linear operational progress.

- [ ] **Step 1: Add RED contracts for route safety and open composition**

```ts
it('keeps FleetFlow open and route-safe', () => {
  expect(fleetflowSource).toContain('EditorialHeader');
  expect(fleetflowSource).toContain('ScreenshotSurface');
  expect(fleetflowSource).toContain('MetricReadout');
  expect(fleetflowSource).toContain('applyRouteTrail');
  expect(fleetflowSource).not.toContain('SurfacePanel');
  expect(fleetflowSource).not.toContain('width={1024}');
});
```

In the route math test:

```ts
const xs = FLEETFLOW_ROUTE.map(([x]) => Math.abs(x));
expect(Math.max(...xs)).toBeLessThanOrEqual(350);
```

Run focused tests and confirm RED.

- [ ] **Step 2: Center route geometry**

Use this safe baseline unless visual QA finds a specific issue:

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

This leaves at least 100 px inside a 880–936 px local field and satisfies the 56 px local-margin rule.

- [ ] **Step 3: Remove schematic/card wrappers**

Use an open route field `Rect` only as a coordinate parent, with no visible fill/stroke. Keep a subtle base route line, a short accent trail, depot, stops, and vehicle. Do not draw a large KPI card.

- [ ] **Step 4: Replace KPI card with three `MetricReadout`s**

```tsx
<Layout layout width={936} gap={36} alignItems={'start'}>
  <MetricReadout label={'DELIVERED'} value={() => delivered()} width={260} />
  <MetricReadout label={'DISTANCE'} value={() => distance()} icon={'gauge'} width={260} />
  <MetricReadout label={'ACTIVE'} value={() => active()} width={260} />
</Layout>
```

Keep weight 500 and no enclosing background.

- [ ] **Step 5: Synchronize one linear progress signal**

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

Then resolve once into `ScreenshotSurface`.

- [ ] **Step 6: Run checks**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts src/tests/primitives.test.ts
npm run typecheck
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add motion/portfolio-reel/src/scenes/05-fleetflow.tsx motion/portfolio-reel/src/tests/openEditorialScenes.test.ts motion/portfolio-reel/src/tests/primitives.test.ts
git commit -m "feat: open fleetflow operational editorial scene"
```

- [ ] **Step 8: Mandatory visual checkpoint**

Review FleetFlow at 1×. Confirm route/mountain is visibly centered, no geometry hugs a boundary, KPIs read without needing boxes, the trail is subordinate, and the screenshot remains the final dominant product object.

---

### Task 5: Recompose Atlas as a single filter-response action

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/06-atlas.tsx`
- Modify: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`

**Interfaces:**
- Consumes: `EditorialHeader`, `ScreenshotSurface`, `TechnicalLabel`, `staggerPoints`, `MOTION`.
- Produces: an abstract, non-geographic point field with one selected filter and one point-state response.

- [ ] **Step 1: Add and run RED contract**

```ts
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

Expected: RED against the current framed grid scene.

- [ ] **Step 2: Remove grid/card simulation**

Delete the 1024 frame, 880×510 surface card, and repeated vertical/horizontal grid lines. Keep an abstract point field with no claim that it is an Argentina outline.

- [ ] **Step 3: Render filter vocabulary as text, not chips**

Use a single lightweight row of `TechnicalLabel`s. Make `MINERAL` the selected state. Animate one corresponding project point from muted to accent / slightly larger; other points remain stable.

- [ ] **Step 4: Resolve to screenshot**

After the selected point response, reveal `ScreenshotSurface` once. Do not independently reveal all five labels.

- [ ] **Step 5: Run checks and commit**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts src/tests/visualContract.test.ts
npm run typecheck
npm run build
git add motion/portfolio-reel/src/scenes/06-atlas.tsx motion/portfolio-reel/src/tests/openEditorialScenes.test.ts
git commit -m "feat: open atlas filter response scene"
```

---

### Task 6: Open the More Systems closing scene without destabilizing it

**Files:**
- Modify: `motion/portfolio-reel/src/scenes/07-more-systems.tsx`
- Modify: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`
- Modify: `motion/portfolio-reel/src/tests/visualContract.test.ts`

**Interfaces:**
- Consumes: `RegistrationMarks` if sparse detail is still useful, existing canonical `carouselMetadata.moreSystems`, `drawPath`, `MOTION`.
- Produces: four always-visible system rows with only spine/branches/endpoints animated.

- [ ] **Step 1: Add RED closing-scene contract**

```ts
it('keeps More Systems open, visible, and concrete', () => {
  expect(moreSystemsSource).not.toContain('width={1024}');
  expect(moreSystemsSource).not.toContain('textWrap');
  expect(moreSystemsSource).not.toContain('{systems.map(');
  expect(moreSystemsSource).toContain('for (let index = 0; index < systems.length; index += 1)');
  expect(moreSystemsSource).not.toContain('opacity={0}');
  expect(moreSystemsSource).not.toContain('revealText(');
});
```

Run and verify RED because the current scene still has a 1024 frame and `textWrap`.

- [ ] **Step 2: Remove the enclosing frame and fragile title wrapping**

Replace the full-frame `Rect` with open canvas. Compute a wrap-safe title once:

```ts
const closingTitle = carouselMetadata.moreSystems.title.replace(
  ' and experiments.',
  '\nand experiments.',
);
```

Render with Sans 44–48, weight 600, explicit line height.

- [ ] **Step 3: Keep the proven row construction**

Do not refactor the concrete loop. Keep:

```ts
for (let index = 0; index < systems.length; index += 1) {
  // view.add branch
  // view.add endpoint
  // view.add row Layout
}
```

Use Mono 14 for category, Sans 32–34 weight 600 for name, Mono 14–15 weight 400–500 for stack. Keep row content visible from frame zero.

- [ ] **Step 4: Animate only geometry**

Initialize `spine().end(0)`, branch `.end(0)`, endpoint opacity 0; animate spine then branch+endpoint. Never animate row content opacity.

- [ ] **Step 5: Run checks and commit**

```bash
npm test -- --run src/tests/openEditorialScenes.test.ts src/tests/visualContract.test.ts
npm run typecheck
npm run build
git add motion/portfolio-reel/src/scenes/07-more-systems.tsx motion/portfolio-reel/src/tests/openEditorialScenes.test.ts motion/portfolio-reel/src/tests/visualContract.test.ts
git commit -m "feat: open more systems editorial close"
```

- [ ] **Step 6: Mandatory seven-scene visual checkpoint**

Run the entire reel at 1× and reduced feed scale. Do not continue if one scene reintroduces a dominant enclosing card, if screenshots do not share perceived geometry, or if any title/footer/route crowds the edge zone.

---

### Task 7: Enforce the final cross-scene visual contract and remove obsolete visible-shell dependencies

**Files:**
- Modify: `motion/portfolio-reel/src/tests/visualContract.test.ts`
- Modify: `motion/portfolio-reel/src/tests/openEditorialScenes.test.ts`
- Modify: product scenes only if tests expose a specific contract violation.
- Leave `EnterpriseFrame.tsx` / `SurfacePanel.tsx` in the tree if other code still imports them; delete only when `git grep` proves they are unused.

**Interfaces:**
- Consumes: all seven finalized scenes and shared editorial primitives.
- Produces: a stable structural contract for future changes.

- [ ] **Step 1: Replace transitional migration tests with the final contract**

Use a product-scene source list and assert:

```ts
for (const [filename, source] of PRODUCT_SCENES) {
  expect(source, filename).toContain('EditorialHeader');
  expect(source, filename).toContain('ScreenshotSurface');
  expect(source, filename).not.toContain('EnterpriseFrame');
  expect(source, filename).not.toContain('SurfacePanel');
  expect(source, filename).not.toContain('textWrap');
  expect(source, filename).not.toContain('width={1024}');
}
```

Keep Cover and More Systems separate because they intentionally do not use `ScreenshotSurface`.

- [ ] **Step 2: Assert screenshot consistency**

```ts
expect(THEME.space.screenshotWidth).toBe(936);
expect(THEME.space.screenshotHeight).toBe(560);
expect(THEME.space.screenshotRadius).toBe(18);
```

Keep `clampScreenshotScale` tests for 1.00–1.03.

- [ ] **Step 3: Assert registration/project contract**

Keep exact project scene registration:

```ts
expect(projectSource).toContain("cover from './scenes/01-cover?scene'");
// ...through 07-more-systems
```

Keep exact portrait/fps assertion from `THEME.canvas`.

- [ ] **Step 4: Check for unused shell components before deletion**

Run:

```bash
git grep -n "EnterpriseFrame" -- motion/portfolio-reel/src
git grep -n "SurfacePanel" -- motion/portfolio-reel/src
```

If results are only their own files/tests, delete obsolete components and obsolete tests/imports. If any legitimate consumer remains, keep the files; the user-visible contract is what matters.

- [ ] **Step 5: Run full package verification**

```bash
cd motion/portfolio-reel
npm run check
```

Expected: Vitest, TypeScript, and Vite build all pass.

- [ ] **Step 6: Verify static carousel isolation**

From repository root:

```bash
python -m pytest tests/test_build_social_carousel.py -q
git diff --exit-code origin/main -- portfolio/social_carousel.json scripts/build_social_carousel.py
```

Expected: static carousel regression passes and protected source files show no motion-branch changes.

- [ ] **Step 7: Commit**

```bash
git add motion/portfolio-reel/src
git commit -m "test: lock open editorial reel contract"
```

---

### Task 8: Timing continuity, manual render instructions, and final QA

**Files:**
- Create or modify: `motion/portfolio-reel/README.md`
- Modify scene waits/durations only if full-reel timing falls outside 18–24 seconds or manual pacing identifies a specific issue.

**Interfaces:**
- Consumes: final seven scenes and Motion Canvas 3.17.2 editor/FFmpeg workflow.
- Produces: reproducible preview/render instructions and final manual QA evidence.

- [ ] **Step 1: Measure the assembled reel in the Motion Canvas editor**

Open `npm run dev` and confirm the project timeline contains exactly seven scenes. Record total duration from the editor. Accept 18–24 seconds; target approximately 20 seconds.

- [ ] **Step 2: Adjust only scene-level waits if required**

If total duration is outside range, change only terminal `waitFor(...)` values or clearly isolated action durations. Do not speed up typography/route motion below the global motion ranges to hit a number.

- [ ] **Step 3: Write README instructions**

Document exactly:

```bash
npm ci
npm run dev
npm run check
```

Then document manual export settings:

- 1080×1350
- 25 fps
- sRGB
- FFmpeg renderer
- MP4
- Fast Start enabled

State explicitly that the MP4 is reviewed outside the editor and is not committed unless requested.

- [ ] **Step 4: Run final automated verification fresh**

```bash
cd motion/portfolio-reel
npm run check
cd ../..
python -m pytest tests/test_build_social_carousel.py -q
git diff --exit-code origin/main -- portfolio/social_carousel.json scripts/build_social_carousel.py
```

Expected: all commands exit 0.

- [ ] **Step 5: Final manual visual QA**

Watch the full reel at 1× and at reduced feed scale. Confirm every item from the spec checklist:

- screenshot is dominant in scenes 02–06;
- no unnecessary enclosing cards;
- open breathable edges;
- title precedes metadata in hierarchy;
- shadow reads as elevation, not glow;
- routes/points remain inside safe margins;
- labels remain readable but tertiary;
- one dominant action per scene;
- representative paused frames still make sense;
- all seven scenes feel like one editorial system;
- no clipping or unreadable microcopy.

- [ ] **Step 6: Commit documentation/timing changes**

```bash
git add motion/portfolio-reel/README.md motion/portfolio-reel/src/scenes
git commit -m "docs: finalize open editorial reel workflow"
```

---

## Implementation Checkpoints

The execution must stop for user visual approval after:

1. Task 2 — Cover + GeoPlatform establish the new language.
2. Task 3 — Pulso + Anti IA validate signal/evidence cues without card soup.
3. Task 4 — FleetFlow validates operational motion and route margins.
4. Task 6 — full seven-scene visual review.
5. Task 8 — final MP4/manual QA.

Do not compensate for a weak shared visual primitive by adding per-scene wrappers. If a checkpoint reveals a systemic issue with typography, screenshot elevation, spacing, or shadows, fix the shared primitive/token first and rerun the affected checkpoint.
