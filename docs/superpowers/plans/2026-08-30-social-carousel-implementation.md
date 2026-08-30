# Social Carousel Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deterministic 7-slide LinkedIn carousel from checked-in portfolio metadata and existing screenshots.

**Architecture:** Keep publication copy in `portfolio/social_carousel.json`. A pure-Python generator validates metadata and screenshot paths, embeds screenshots in SVG, writes seven 1080×1350 SVG slides, and optionally exports PNG/PDF when CairoSVG and pypdf are installed.

**Tech Stack:** Python 3.11+, JSON, SVG, pytest; optional CairoSVG and pypdf.

**Spec:** `docs/superpowers/specs/2026-08-30-social-carousel-design.md`

## Global Constraints

- V1 outputs exactly 7 portrait slides at 1080×1350.
- Slides: cover, GeoPlatform, Pulso Público Argentina, Anti IA, FleetFlow Sim, Atlas Geotech, More Systems.
- Rally Stage Sim is excluded.
- GeoPlatform is live but never labeled open source.
- Pulso and FleetFlow are live and open source.
- Atlas is a live application with a public repository.
- Anti IA is an experimental product without a public link in V1.
- SVG generation must work with Python standard library only.
- PNG/PDF export dependencies are optional.

---

### Task 1: Carousel metadata and validation

**Files:**
- Create: `portfolio/social_carousel.json`
- Create: `tests/test_build_social_carousel.py`
- Create: `scripts/build_social_carousel.py`

**Interfaces:**
- Consumes: existing screenshots under `assets/`.
- Produces: `validate_metadata(data: dict, repo_root: Path) -> CarouselMetadata`.

- [ ] Write tests for duplicate IDs, missing screenshots, invalid metadata and deterministic ordering.
- [ ] Run `python -m pytest tests/test_build_social_carousel.py -q` and verify the tests fail before implementation.
- [ ] Implement metadata dataclasses and validation.
- [ ] Run the focused tests and verify they pass.

### Task 2: SVG renderer

**Files:**
- Modify: `scripts/build_social_carousel.py`
- Test: `tests/test_build_social_carousel.py`

**Interfaces:**
- Consumes: validated `CarouselMetadata`.
- Produces: `build_slide_map(meta, repo_root) -> list[tuple[str, str]]` and seven deterministic SVG files.

- [ ] Add tests for seven filenames, XML escaping, status/link handling and deterministic output.
- [ ] Implement the shared 1080×1350 visual system, cover, project slide and More Systems templates.
- [ ] Embed screenshots as base64 and crop with SVG `preserveAspectRatio` without stretching.
- [ ] Run the focused test suite and verify all tests pass.

### Task 3: Optional PNG/PDF export

**Files:**
- Create: `requirements-social.txt`
- Modify: `scripts/build_social_carousel.py`

**Interfaces:**
- Produces CLI flags `--png` and `--pdf`.

- [ ] Add clear dependency errors when CairoSVG or pypdf are unavailable.
- [ ] Export matching PNGs with CairoSVG when requested.
- [ ] Merge per-slide PDFs into `portfolio-carousel.pdf` with pypdf when requested.
- [ ] Keep unit tests independent from optional binary-export libraries.

### Task 4: Verification

- [ ] Run `python -m pytest tests/test_build_social_carousel.py -q` and require zero failures.
- [ ] Run `python scripts/build_social_carousel.py` against the checked-in metadata and real screenshots.
- [ ] Verify the output list is exactly `01-cover.svg` through `07-more-systems.svg`.
- [ ] Confirm no Rally slide is generated and project statuses match the design spec.
