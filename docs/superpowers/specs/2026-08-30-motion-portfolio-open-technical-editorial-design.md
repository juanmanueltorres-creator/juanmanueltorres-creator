# Motion Portfolio Reel — Open Technical Editorial Design

Date: 2026-08-30
Status: Approved design direction, pending implementation plan
Branch: `feat/motion-portfolio-reel`

## 1. Goal

Evolve the motion portfolio reel away from a boxed SaaS/dashboard look and toward a restrained technical-editorial product film.

The target is a reel that feels like professional geospatial and decision-support software rather than a stack of animated cards.

The visual system must communicate hierarchy through typography, whitespace, contrast, and meaningful motion. Borders and panels are secondary tools, not the primary layout mechanism.

## 2. Hard Constraints

- Keep the portrait output at 1080×1350.
- Keep 25 fps preview/render.
- Keep Motion Canvas 3.17.2 and the current seven-scene architecture.
- Keep the current product facts, screenshots, metadata, and overall ~20 second target.
- Keep IBM Plex Sans and IBM Plex Mono.
- Keep the existing dark charcoal / warm ivory / restrained bronze palette.
- Do not add a second renderer or animation engine.
- Do not add particles, shaders, 3D, audio, random glow, or decorative motion.
- Do not use a visible outer `EnterpriseFrame` or any full-scene card that encloses the whole composition.
- Do not create repeated large `SurfacePanel` cards around every functional element.
- Product screenshots are the main elements that may be visually encapsulated.
- Keep scene edges visually open: no thick perimeter border and no boxed safe-area treatment.
- Maintain generous internal breathing room so mountains, routes, diagrams, labels, and screenshots do not sit against card or canvas edges.
- Keep major free-floating content at least 64 px from canvas edges unless a deliberate full-bleed screenshot treatment is explicitly approved.
- Keep route, mountain, signal, and evidence geometry at least 56 px inside its own visual field.

## 3. Design Principle

> Space separates. Typography organizes. Shadow elevates. Border protects the product.

The reel should feel open, deliberate, and technical.

Every scene should answer three questions immediately:

1. What product or system is this?
2. What technical idea is being demonstrated?
3. What real interface resolves that idea?

If a decorative element does not help answer one of those questions, remove it.

## 4. Visual Hierarchy

Each product scene follows one shared hierarchy:

1. Eyebrow / scene index
2. Product title
3. Status or small operational state
4. One functional visual cue or technical interaction
5. Dominant screenshot
6. Small footer / domain vocabulary

The layout remains visually consistent across scenes, but not mechanically identical.

The screenshot should occupy approximately 60–75% of the meaningful visual area once fully revealed.

## 5. Typography

### 5.1 Families

- Primary: IBM Plex Sans
- Technical / metadata: IBM Plex Mono

No additional font family is introduced.

### 5.2 Weight discipline

Avoid using bold everywhere.

Recommended weights:

- Eyebrow: Mono Medium / 500–600
- Product title: Sans Semibold / 600
- Body/supporting text: Sans Regular / 400
- Technical state / metric: Mono Medium / 500
- Footer: Mono Regular or Medium / 400–500

### 5.3 Size vocabulary

Keep a small five-level vocabulary:

- Eyebrow: 14–16 px
- Product title: 46–54 px
- Technical state / metric: 15–20 px
- Supporting copy: 19–23 px
- Footer / microcopy: 13–15 px

Avoid unnecessary letter spacing. Reserve noticeable tracking for short uppercase technical labels only.

Critical copy must remain wrap-safe through explicit line breaks or controlled widths; do not rely on fragile runtime `textWrap` behavior.

## 6. Color

The palette remains restrained.

- Canvas: near-black charcoal
- Primary text: warm ivory
- Secondary text: warm muted gray
- Accent: restrained bronze
- Accent soft: desaturated bronze/brown

Rules:

- Accent is for active state, selected evidence, route progress, or one meaningful signal.
- Do not use accent simply to decorate borders.
- Do not give every label or icon accent color.
- Avoid high-contrast outlines around general layout groups.

## 7. Borders, Cards, and Surfaces

### 7.1 Remove

- Visible full-scene outer frame.
- Large enclosing cards around the entire content hierarchy.
- Nested panels used only to visually separate groups that whitespace can already separate.
- Repeated bordered containers around route, chips, labels, and captions.

### 7.2 Keep

Borders remain allowed primarily for:

- Product screenshots
- Very small selected-state controls if needed
- One-off technical affordances where a boundary carries meaning

### 7.3 Screenshot treatment

The product screenshot is the main elevated object.

Target treatment:

- Radius: 16–18 px
- Border: 1 px, low contrast
- Shadow: subtle and diffuse, visually below the screenshot
- Optional secondary short shadow to create separation from the canvas
- No glow
- No bronze outline
- No fake browser chrome unless the real screenshot already contains it

The screenshot should appear as a real product surface floating above the editorial canvas.

## 8. Shadow Strategy

Use shadows only to communicate elevation.

The reel should not look soft, hazy, or glassmorphic.

Recommended approach:

- One large, low-opacity soft shadow
- Optional one smaller, tighter shadow
- No shadow on every label, chip, line, or decorative element
- No luminous shadows

Shadow values should be centralized in shared theme tokens rather than duplicated per scene.

## 9. Motion Strategy

Each scene gets one dominant action.

Avoid the previous pattern of sequential component inventory animation:

`chip appears → panel appears → another chip appears → card appears → screenshot appears`

The new motion language is:

- Micro motion: 80–180 ms
- Component motion: 180–450 ms
- Scene resolution: 350–700 ms
- Operational progress: linear
- Entry/settling: restrained ease-out / ease-in-out

Motion should explain state change, not advertise animation capability.

### 9.1 Meaningful actions by scene

- GeoPlatform: layers / domain signals organize, then product resolves.
- Pulso: territorial signals become active, then product resolves.
- Anti IA: Data → Evidence → Question, then product resolves.
- FleetFlow: route progress + vehicle motion + KPI response, then product resolves.
- Atlas: one filter selection changes point emphasis, then product resolves.

The screenshot reveal should remain restrained: opacity + maximum 1–3% scale drift.

## 10. Scene Designs

### 10.1 Scene 01 — Cover

Purpose: establish editorial identity, not simulate an application.

Structure:

- Open canvas
- Small eyebrow / portfolio identity
- Large title with explicit line breaks
- Sparse territorial line / registration detail
- Three small conceptual terms: territory, evidence, operations

No outer frame. No card.

The scene should end in a composition whose title geometry naturally hands off to the product-scene title position.

### 10.2 Scene 02 — GeoPlatform

Purpose: flagship system; establish the product-scene grammar.

Structure:

- Open title/header area
- Small restrained domain vocabulary: mining, satellite, weather, seismic, routes
- One functional layer/signal cue, not a card row
- Large dominant screenshot
- Small footer

Domain labels may use tiny icons, but icon count remains bounded and visually subordinate.

### 10.3 Scene 03 — Pulso Público Argentina

Purpose: public territorial signals with provenance and freshness.

Structure:

- Open title/header area
- Compact signal field with points distributed across the width
- `SIGNAL · SOURCE · FRESHNESS` as a lightweight state rail, not a card system
- Large screenshot
- Footer: earthquakes, thermal, weather, source, freshness

The signal field must remain compact. Empty space should be intentional, not look unfinished.

### 10.4 Scene 04 — Anti IA

Purpose: evidence-first reasoning.

Structure:

- Open title/header area
- `COORDINATE ≠ KNOWLEDGE`
- Data → Evidence → Question as a clean technical chain
- Thesis line: `Una coordenada no es un punto.`
- Large screenshot

The evidence chain is the single conceptual action. Do not wrap it in a large panel.

### 10.5 Scene 05 — FleetFlow

Purpose: operational movement and measurable delivery state.

Structure:

- Open title/header area
- Route/mountain line centered with generous side margins
- Depot, stops, vehicle, short route trail
- Three compact KPIs aligned cleanly without enclosing the whole group in a large card
- Large screenshot

The route geometry must stay comfortably inside the visual field, including at peak trail width and vehicle radius.

Route, vehicle, trail, and KPIs remain synchronized with the same linear progress signal.

### 10.6 Scene 06 — Atlas Geotech

Purpose: mining intelligence through filtering.

Structure:

- Open title/header area
- Small filter vocabulary: province, mineral, stage, company, capital
- One selected filter produces a visible point-state response
- No invented geographic outline unless verified
- Large screenshot

The filter interaction should read as one technical action, not as five equally weighted chips inside a card.

### 10.7 Scene 07 — More Systems

Purpose: confident editorial close.

Structure:

- Open canvas
- Closing title
- Four systems arranged as a technical index or branching list
- Thin spine / branch geometry may animate
- Names and stacks remain visible as base content
- No full enclosing card
- Final GitHub handle / repository identity

Preserve the proven concrete `for (...) view.add(...)` construction. Do not return to mapped JSX fragments for the system rows.

## 11. Shared Components / Tokens

The redesign should simplify the component system rather than add another layer of wrappers.

Expected shared pieces:

- `EditorialHeader`
- `ScreenshotSurface`
- `TechnicalLabel`
- `MetricReadout`
- `RegistrationMarks` or equivalent sparse registration detail
- `RouteTrail`
- centralized typography tokens
- centralized shadow tokens
- centralized motion tokens

Existing `EnterpriseFrame` and broad `SurfacePanel` usage should be removed from product scenes or reduced to internal low-level reuse only where it does not create visible card framing.

## 12. Iconography

Lucide remains the allowed icon source.

Rules:

- Maximum 2–4 meaningful icons per scene
- Icons must describe a domain concept or state
- No icon purely to fill empty space
- Icons use muted or primary text colors by default
- Accent only when icon indicates active/selected state

## 13. Common Failure Modes to Prevent

### Card soup
Too many enclosed panels make every element compete equally.

Prevention: use whitespace first; borders only where boundaries carry meaning.

### Equal-weight syndrome
Title, controls, schematic, and screenshot all look equally important.

Prevention: screenshot dominates; functional cue is secondary; metadata is tertiary.

### Decorative enterprise
Adding more boxes, dividers, and interface chrome to look professional.

Prevention: professionalism comes from restraint, consistency, and hierarchy.

### Motion inventory
Animating every available element simply because it can animate.

Prevention: one dominant action per scene, plus only necessary supporting motion.

### Edge crowding
Routes, mountains, labels, or screenshots sit too close to boundaries.

Prevention: enforce the 64 px canvas margin and 56 px internal visual-field margin, then test at actual feed scale.

### Font noise
Too many weights, sizes, letter-spacing values, or uppercase labels.

Prevention: strict five-level type vocabulary and bounded weight usage.

### Shadow noise
Every surface gets a shadow.

Prevention: shadow belongs mainly to the dominant screenshot/elevated product surface.

## 14. Continuity Across Scenes

Scenes remain isolated Motion Canvas scenes; no literal persistent DOM/node continuity is required.

Continuity comes from:

- consistent title x/y geometry
- consistent screenshot width and radius
- consistent screenshot reveal
- consistent canvas and type system
- matching footer position
- repeated accent behavior for active state
- stable motion durations/easings

Avoid hard scene-to-scene wipes that feel unrelated to the content.

## 15. Baseline and Recovery Strategy

Implementation must stop using branch resets as a visual iteration mechanism.

The implementation baseline is the current `feat/motion-portfolio-reel` branch after this spec is committed.

Historical visual states are reference-only:

- `backup/motion-enterprise-d74f51c` preserves the later boxed Enterprise pass.
- `candidate/motion-enterprise-a8864` preserves the centered-route / micro-polish candidate.

Rules:

- Do not reset the implementation branch to historical commits while iterating.
- Reuse a historical implementation only by copying or cherry-picking the smallest validated primitive needed.
- Keep every new visual checkpoint as a normal forward commit.
- If a checkpoint is rejected, revert or replace that specific forward change rather than moving the branch backward through unrelated commits.
- Mandatory manual checkpoints occur after the shared open-editorial shell, after FleetFlow, and after all seven scenes are migrated.

This preserves provenance and prevents another visual commit-selection loop.

## 16. Testing Strategy

Automated tests remain structural and behavioral, not pixel-perfect.

Required tests should cover:

- no product scene uses visible `EnterpriseFrame`
- no critical copy relies on `textWrap`
- screenshot surface dimensions/radius remain consistent
- screenshot scale drift is clamped to max 1.03
- shadow tokens are centralized
- FleetFlow route trail stays bounded 0..1
- FleetFlow route geometry maintains safe side margins
- More Systems continues to use concrete `view.add(...)` rows
- seven canonical scenes remain registered
- portrait 1080×1350 / 25 fps contract remains unchanged

Manual visual QA remains mandatory for typography, whitespace, shadows, edge safety, and feed-scale readability.

## 17. Manual Visual QA Checklist

Review each scene at actual portrait preview size and at reduced feed-like scale.

Check:

- Is the screenshot clearly the dominant object?
- Is any element visually trapped inside unnecessary cards?
- Are scene edges open and breathable?
- Does the title read before the metadata?
- Are shadows subtle enough to notice only as elevation?
- Are routes/points/lines comfortably inside margins?
- Are technical labels readable without dominating?
- Is there only one meaningful animated action?
- Does the scene still make sense if paused on a representative frame?
- Do all seven scenes feel like one editorial system?

## 18. Non-Goals

This pass does not include:

- new product screenshots
- new application features
- live map integrations
- Mapbox / deck.gl / Cesium runtime dependencies in the reel
- D3 dependency
- Three.js
- audio design
- particle systems
- shaders
- 3D camera work
- automated headless MP4 rendering

## 19. Definition of Done

The redesign is complete when:

1. All seven scenes use the Open Technical Editorial language.
2. No product scene is visibly enclosed by a full-scene card/frame.
3. Product screenshots are the primary elevated surfaces.
4. IBM Plex typography is consistent and restrained.
5. Shadow treatment is centralized and subtle.
6. Borders are sparse and functional.
7. GeoPlatform, Pulso, Anti IA, FleetFlow, and Atlas each show one domain-specific action.
8. FleetFlow route/mountain remains centered with safe margins.
9. More Systems remains fully populated and stable.
10. The reel remains approximately 18–24 seconds, target ~20 seconds.
11. Tests, typecheck, Vite build, dev smoke, and static carousel regression all pass.
12. Manual review finds no clipping, edge crowding, excessive carding, or unreadable microcopy.
13. Final MP4 is rendered manually through Motion Canvas FFmpeg settings and reviewed outside the editor.
