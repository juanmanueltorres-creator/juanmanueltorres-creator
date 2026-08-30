# Social Carousel Export — Design

Date: 2026-08-30

## Goal

Add a small, reproducible export system to the profile repository that turns the current portfolio metadata and screenshots into a LinkedIn-ready document carousel.

The first version should optimize for low maintenance: one metadata file, one generator, deterministic output, no paid services, and no dependency on external design tools.

## Scope

V1 produces a 7-slide portrait carousel at 1080×1350:

1. Cover
2. GeoPlatform
3. Pulso Público Argentina
4. Anti IA
5. FleetFlow Sim
6. Atlas Geotech
7. More Systems

Rally Stage Sim is intentionally excluded until there is a better screenshot and a more mature public implementation.

The final slide includes Opportunity OS, Question Radar, Screen2Social and Geo Agent as compact secondary builds.

## Content rules

All copy is English, short and concrete.

Each visual project slide contains:

- project name
- one-sentence explanation of what it does
- status
- stack
- screenshot
- live-app label when applicable
- repository label when public

Accuracy rules:

- GeoPlatform: public live application; private repository; never label it open source.
- Pulso Público Argentina: live and open source.
- Anti IA: experimental product; no live/repository link until the public surface is confirmed.
- FleetFlow Sim: live and open source.
- Atlas Geotech: live application plus public repository.
- Secondary tools use repository links only.

## Visual system

Canvas: 1080×1350 portrait.

Style follows the current profile identity:

- near-black background
- warm gold/brown accents
- light warm text
- restrained borders and ornaments
- serif display titles plus monospace metadata
- screenshots are the visual focus, not decorative illustrations

Project slides share the same template so the carousel reads as one system.

Screenshot treatment:

- one fixed media frame per slide
- preserve original image ratio
- use SVG `preserveAspectRatio="xMidYMid slice"` when a crop is needed
- avoid stretching screenshots
- per-project focal alignment may be configured in metadata if necessary

## Architecture

### `portfolio/social_carousel.json`

Single source of truth for slide content and project metadata.

Expected fields for project slides:

- `id`
- `name`
- `description`
- `status`
- `stack`
- `screenshot`
- `live_url` optional
- `repo_url` optional
- `image_fit` optional
- `image_position` optional

The cover and closing slide use dedicated top-level blocks.

### `scripts/build_social_carousel.py`

Pure-Python generator responsible for:

1. validating metadata
2. validating referenced screenshot files
3. embedding screenshots as base64 inside SVG
4. rendering seven deterministic SVG slides
5. optionally converting SVG slides to PNG
6. optionally combining slides into a PDF document

SVG generation must use only the Python standard library. PNG/PDF export is optional at runtime and uses explicit local dependencies.

### `requirements-social.txt`

Contains export-only dependencies:

- CairoSVG for SVG → PNG/PDF rendering
- pypdf for combining PDF pages

The generator must fail with a clear message when export dependencies are missing, while SVG generation remains usable without them.

### Outputs

Generated artifacts go under:

`assets/social/generated/`

Naming:

- `01-cover.svg`
- `02-geoplatform.svg`
- `03-pulso.svg`
- `04-anti-ia.svg`
- `05-fleetflow.svg`
- `06-atlas.svg`
- `07-more-systems.svg`

When export dependencies are available:

- matching `.png` files
- `portfolio-carousel.pdf`

Generated assets are deterministic and may be committed when a publication snapshot is desired.

## Data flow

`social_carousel.json` + existing screenshots → validation → SVG template renderer → SVG slides → optional CairoSVG render → optional PDF merge.

The README is not parsed dynamically. Carousel content is curated in metadata so README wording changes cannot silently alter a publication.

## Error handling

The build exits non-zero when:

- JSON is invalid
- a required field is missing
- a screenshot path does not exist
- duplicate slide IDs exist
- stack/status values are malformed
- requested PNG/PDF export dependencies are unavailable

Error messages include the project/slide ID and failing field whenever possible.

## Testing

Unit tests cover:

- metadata validation
- missing screenshot detection
- duplicate IDs
- XML escaping
- deterministic slide ordering
- correct link/status handling
- generation of seven SVG files from the checked-in metadata

Tests should not require CairoSVG or pypdf. Binary export is treated as an integration path.

## Non-goals for V1

- automated posting to LinkedIn or other networks
- OBS/video integration
- dynamic GitHub API scraping
- screenshot capture from live websites
- automatic README parsing
- Rally Stage Sim slide
- multiple social-media aspect ratios

These can be added later only if the static LinkedIn carousel proves useful.

## Success criteria

V1 is complete when one command can create seven consistent SVG slides from the existing screenshots and, when optional dependencies are installed, export matching PNG files plus a single LinkedIn-ready PDF without manual layout work.
