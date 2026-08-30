#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import sys
from dataclasses import dataclass
from html import escape
from pathlib import Path
from typing import Iterable

CANVAS_WIDTH = 1080
CANVAS_HEIGHT = 1350
BACKGROUND = "#090807"
SURFACE = "#11100d"
SURFACE_2 = "#15120f"
BORDER = "#3a2d21"
ACCENT = "#caa56b"
TEXT = "#f3e8d4"
MUTED = "#b9a58a"
MUTED_2 = "#8e7c67"
TAG_BG = "#191510"


class CarouselError(Exception):
    pass


@dataclass(frozen=True)
class ProjectSlide:
    id: str
    name: str
    description: str
    status: str
    stack: list[str]
    screenshot: str
    live_url: str | None = None
    repo_url: str | None = None
    image_fit: str = "slice"
    image_position: str = "center"


@dataclass(frozen=True)
class ToolCard:
    name: str
    description: str
    stack: list[str]
    repo_url: str | None = None


@dataclass(frozen=True)
class CarouselMetadata:
    cover: dict
    projects: list[ProjectSlide]
    more_systems: dict


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build a LinkedIn-ready social carousel.")
    parser.add_argument(
        "--metadata",
        default="portfolio/social_carousel.json",
        help="Path to the carousel metadata JSON file.",
    )
    parser.add_argument(
        "--output-dir",
        default="assets/social/generated",
        help="Directory where generated files will be written.",
    )
    parser.add_argument("--png", action="store_true", help="Also export PNG files using CairoSVG.")
    parser.add_argument("--pdf", action="store_true", help="Also export a merged PDF using CairoSVG and pypdf.")
    return parser.parse_args(argv)


def load_metadata(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise CarouselError(f"Metadata file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise CarouselError(f"Invalid JSON in metadata file {path}: {exc}") from exc


def _require_string(value: object, field_name: str, slide_id: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise CarouselError(f"Slide '{slide_id}' has invalid '{field_name}'.")
    return value.strip()


def _require_string_list(value: object, field_name: str, slide_id: str) -> list[str]:
    if not isinstance(value, list) or not value or any(
        not isinstance(item, str) or not item.strip() for item in value
    ):
        raise CarouselError(f"Slide '{slide_id}' has invalid '{field_name}'.")
    return [item.strip() for item in value]


def _optional_string(value: object, field_name: str, slide_id: str) -> str | None:
    if value is None:
        return None
    if not isinstance(value, str) or not value.strip():
        raise CarouselError(f"Slide '{slide_id}' has invalid '{field_name}'.")
    return value.strip()


def validate_metadata(data: dict, repo_root: Path) -> CarouselMetadata:
    if not isinstance(data, dict):
        raise CarouselError("Metadata root must be a JSON object.")

    cover = data.get("cover")
    if not isinstance(cover, dict):
        raise CarouselError("Metadata must include a 'cover' object.")
    for field in ("eyebrow", "title", "subtitle", "footer"):
        _require_string(cover.get(field), f"cover.{field}", "cover")

    projects_data = data.get("projects")
    if not isinstance(projects_data, list) or not projects_data:
        raise CarouselError("Metadata must include a non-empty 'projects' array.")

    seen_ids: set[str] = set()
    projects: list[ProjectSlide] = []
    for raw in projects_data:
        if not isinstance(raw, dict):
            raise CarouselError("Each entry in 'projects' must be an object.")
        slide_id = _require_string(raw.get("id"), "id", "project")
        if slide_id in seen_ids:
            raise CarouselError(f"Duplicate slide id: '{slide_id}'.")
        seen_ids.add(slide_id)

        screenshot = _require_string(raw.get("screenshot"), "screenshot", slide_id)
        screenshot_path = repo_root / screenshot
        if not screenshot_path.exists():
            raise CarouselError(
                f"Slide '{slide_id}' references missing screenshot '{screenshot}'."
            )

        image_fit = raw.get("image_fit", "slice")
        if image_fit not in {"slice", "meet"}:
            raise CarouselError(
                f"Slide '{slide_id}' has invalid 'image_fit'. Use 'slice' or 'meet'."
            )
        image_position = raw.get("image_position", "center")
        if image_position not in {"center", "top", "bottom", "left", "right"}:
            raise CarouselError(f"Slide '{slide_id}' has invalid 'image_position'.")

        projects.append(
            ProjectSlide(
                id=slide_id,
                name=_require_string(raw.get("name"), "name", slide_id),
                description=_require_string(raw.get("description"), "description", slide_id),
                status=_require_string(raw.get("status"), "status", slide_id),
                stack=_require_string_list(raw.get("stack"), "stack", slide_id),
                screenshot=screenshot,
                live_url=_optional_string(raw.get("live_url"), "live_url", slide_id),
                repo_url=_optional_string(raw.get("repo_url"), "repo_url", slide_id),
                image_fit=image_fit,
                image_position=image_position,
            )
        )

    more_systems = data.get("more_systems")
    if not isinstance(more_systems, dict):
        raise CarouselError("Metadata must include a 'more_systems' object.")
    for field in ("eyebrow", "title", "subtitle"):
        _require_string(more_systems.get(field), f"more_systems.{field}", "more_systems")
    items = more_systems.get("items")
    if not isinstance(items, list) or not items:
        raise CarouselError("'more_systems.items' must be a non-empty array.")
    if len(items) > 4:
        raise CarouselError("'more_systems.items' supports up to 4 entries in V1.")

    cards: list[ToolCard] = []
    for idx, item in enumerate(items, start=1):
        slide_id = f"more_systems[{idx}]"
        if not isinstance(item, dict):
            raise CarouselError(f"{slide_id} must be an object.")
        cards.append(
            ToolCard(
                name=_require_string(item.get("name"), "name", slide_id),
                description=_require_string(item.get("description"), "description", slide_id),
                stack=_require_string_list(item.get("stack"), "stack", slide_id),
                repo_url=_optional_string(item.get("repo_url"), "repo_url", slide_id),
            )
        )

    return CarouselMetadata(
        cover={key: str(cover[key]).strip() for key in ("eyebrow", "title", "subtitle", "footer")},
        projects=projects,
        more_systems={
            "eyebrow": str(more_systems["eyebrow"]).strip(),
            "title": str(more_systems["title"]).strip(),
            "subtitle": str(more_systems["subtitle"]).strip(),
            "items": cards,
        },
    )


def _image_position_preserve(position: str, fit: str) -> str:
    align_map = {
        "center": "xMidYMid",
        "top": "xMidYMin",
        "bottom": "xMidYMax",
        "left": "xMinYMid",
        "right": "xMaxYMid",
    }
    mode = "slice" if fit == "slice" else "meet"
    return f"{align_map[position]} {mode}"


def _data_uri(path: Path) -> str:
    mime, _ = mimetypes.guess_type(path.name)
    mime = mime or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def _wrap_text(text: str, line_length: int) -> list[str]:
    words = text.split()
    if not words:
        return [""]
    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        trial = f"{current} {word}"
        if len(trial) <= line_length:
            current = trial
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def _text_block(lines: Iterable[str], x: int, y: int, line_height: int, css_class: str) -> str:
    tspans = []
    for idx, line in enumerate(lines):
        dy = 0 if idx == 0 else line_height
        tspans.append(f'<tspan x="{x}" dy="{dy}">{escape(line)}</tspan>')
    return f'<text x="{x}" y="{y}" class="{css_class}">' + "".join(tspans) + "</text>"


def _stack_pills(items: list[str], x: int, y: int, max_width: int) -> str:
    parts: list[str] = []
    cursor_x = x
    cursor_y = y
    for item in items:
        label = escape(item)
        width = 24 + max(70, len(item) * 9)
        if cursor_x + width > x + max_width:
            cursor_x = x
            cursor_y += 34
        parts.append(
            f'<rect x="{cursor_x}" y="{cursor_y}" rx="14" ry="14" width="{width}" height="28" fill="{TAG_BG}" stroke="{BORDER}" />'
            f'<text x="{cursor_x + width / 2}" y="{cursor_y + 19}" class="pill" text-anchor="middle">{label}</text>'
        )
        cursor_x += width + 10
    return "".join(parts)


def _link_pills(project: ProjectSlide, x: int, y: int) -> str:
    links: list[tuple[str, str]] = []
    if project.live_url:
        links.append(("open app", project.live_url))
    if project.repo_url:
        links.append(("repository", project.repo_url))
    parts: list[str] = []
    cursor_x = x
    for label, url in links:
        width = 124 if label == "open app" else 130
        parts.append(
            f'<a href="{escape(url, quote=True)}">'
            f'<rect x="{cursor_x}" y="{y}" rx="14" ry="14" width="{width}" height="32" fill="{TAG_BG}" stroke="{ACCENT}" />'
            f'<text x="{cursor_x + width / 2}" y="{y + 21}" class="pill-link" text-anchor="middle">{escape(label)} →</text>'
            f'</a>'
        )
        cursor_x += width + 12
    return "".join(parts)


def _svg_shell(body: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{CANVAS_WIDTH}" height="{CANVAS_HEIGHT}" viewBox="0 0 {CANVAS_WIDTH} {CANVAS_HEIGHT}" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070605"/>
      <stop offset="70%" stop-color="{BACKGROUND}"/>
      <stop offset="100%" stop-color="#140d09"/>
    </linearGradient>
    <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#5d4025"/>
      <stop offset="50%" stop-color="{ACCENT}"/>
      <stop offset="100%" stop-color="#5d4025"/>
    </linearGradient>
    <style>
      .eyebrow {{ fill:{ACCENT}; font:700 18px "Courier New", monospace; letter-spacing:2.4px; }}
      .title {{ fill:{TEXT}; font:700 56px Georgia, "Palatino Linotype", serif; }}
      .subtitle {{ fill:{MUTED}; font:400 26px Georgia, serif; }}
      .slide-number {{ fill:{MUTED_2}; font:700 16px "Courier New", monospace; letter-spacing:1.8px; }}
      .kicker {{ fill:{ACCENT}; font:700 14px "Courier New", monospace; letter-spacing:1.8px; }}
      .project-title {{ fill:{TEXT}; font:700 44px Georgia, serif; }}
      .body {{ fill:{MUTED}; font:400 24px Georgia, serif; }}
      .label {{ fill:{MUTED_2}; font:700 14px "Courier New", monospace; letter-spacing:1.4px; }}
      .status {{ fill:{TEXT}; font:700 15px "Courier New", monospace; letter-spacing:1.4px; }}
      .pill {{ fill:{TEXT}; font:700 13px "Courier New", monospace; letter-spacing:0.4px; }}
      .pill-link {{ fill:{ACCENT}; font:700 13px "Courier New", monospace; letter-spacing:0.4px; }}
      .tool-title {{ fill:{TEXT}; font:700 27px Georgia, serif; }}
      .tool-body {{ fill:{MUTED}; font:400 18px Georgia, serif; }}
      .footer {{ fill:{MUTED_2}; font:700 14px "Courier New", monospace; letter-spacing:1.4px; }}
    </style>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="28" y="28" width="1024" height="1294" rx="24" fill="none" stroke="#201711"/>
  {body}
</svg>'''


def render_cover(meta: CarouselMetadata) -> str:
    cover = meta.cover
    body = f'''
    <text x="72" y="104" class="eyebrow">{escape(cover['eyebrow'])}</text>
    <line x1="72" y1="126" x2="1008" y2="126" stroke="url(#goldLine)" stroke-width="1.5" opacity="0.8" />
    {_text_block(_wrap_text(cover['title'], 20), 72, 250, 66, 'title')}
    {_text_block(_wrap_text(cover['subtitle'], 38), 72, 430, 34, 'subtitle')}
    <rect x="72" y="535" width="936" height="520" rx="28" fill="{SURFACE}" stroke="{BORDER}"/>
    <text x="108" y="608" class="kicker">SELECTED BUILDS</text>
    <line x1="108" y1="626" x2="972" y2="626" stroke="{BORDER}" stroke-width="1"/>
    <text x="108" y="690" class="project-title">GeoPlatform · Pulso · Anti IA</text>
    <text x="108" y="742" class="body">FleetFlow Sim · Atlas Geotech</text>
    <text x="108" y="826" class="label">GEOSPATIAL · TERRITORY · EVIDENCE · OPERATIONS</text>
    <text x="108" y="902" class="body">A compact visual atlas of my public-facing software builds.</text>
    <text x="72" y="1248" class="footer">{escape(cover['footer'])}</text>
    <text x="1008" y="1248" class="slide-number" text-anchor="end">01 / 07</text>
    '''
    return _svg_shell(body)


def render_project_slide(project: ProjectSlide, index: int, total: int, repo_root: Path) -> str:
    screenshot_uri = _data_uri(repo_root / project.screenshot)
    preserve = _image_position_preserve(project.image_position, project.image_fit)
    body = f'''
    <text x="72" y="102" class="eyebrow">SELECTED BUILD</text>
    <line x1="72" y1="124" x2="1008" y2="124" stroke="url(#goldLine)" stroke-width="1.5" opacity="0.8" />
    <text x="72" y="196" class="project-title">{escape(project.name)}</text>
    <rect x="72" y="246" width="936" height="520" rx="28" fill="{SURFACE}" stroke="{BORDER}"/>
    <clipPath id="shot-clip"><rect x="96" y="270" width="888" height="472" rx="20" ry="20" /></clipPath>
    <image href="{screenshot_uri}" x="96" y="270" width="888" height="472" preserveAspectRatio="{preserve}" clip-path="url(#shot-clip)"/>
    <text x="72" y="818" class="label">STATUS</text>
    <text x="72" y="840" class="status">{escape(project.status)}</text>
    {_text_block(_wrap_text(project.description, 46), 72, 902, 31, 'body')}
    <text x="72" y="1036" class="label">STACK</text>
    {_stack_pills(project.stack, 72, 1058, 936)}
    {_link_pills(project, 72, 1182)}
    <text x="1008" y="1248" class="slide-number" text-anchor="end">{index:02d} / {total:02d}</text>
    '''
    return _svg_shell(body)


def render_more_systems(meta: CarouselMetadata, index: int, total: int) -> str:
    more = meta.more_systems
    items: list[ToolCard] = more["items"]
    body_parts = [
        f'<text x="72" y="104" class="eyebrow">{escape(more["eyebrow"])}</text>',
        '<line x1="72" y1="126" x2="1008" y2="126" stroke="url(#goldLine)" stroke-width="1.5" opacity="0.8" />',
        f'<text x="72" y="198" class="project-title">{escape(more["title"])}</text>',
        _text_block(_wrap_text(more["subtitle"], 46), 72, 250, 30, "body"),
    ]
    card_positions = [(72, 340), (548, 340), (72, 760), (548, 760)]
    for card, (x, y) in zip(items, card_positions):
        parts = [
            f'<rect x="{x}" y="{y}" width="404" height="330" rx="24" fill="{SURFACE_2}" stroke="{BORDER}" />',
            f'<text x="{x + 28}" y="{y + 54}" class="tool-title">{escape(card.name)}</text>',
            _text_block(_wrap_text(card.description, 24), x + 28, y + 96, 26, 'tool-body'),
            _stack_pills(card.stack, x + 28, y + 210, 348),
        ]
        if card.repo_url:
            parts.append(
                f'<a href="{escape(card.repo_url, quote=True)}">'
                f'<rect x="{x + 28}" y="{y + 268}" rx="14" ry="14" width="136" height="32" fill="{TAG_BG}" stroke="{ACCENT}" />'
                f'<text x="{x + 96}" y="{y + 289}" class="pill-link" text-anchor="middle">repository →</text>'
                f'</a>'
            )
        body_parts.append("".join(parts))
    body_parts.append(
        f'<text x="1008" y="1248" class="slide-number" text-anchor="end">{index:02d} / {total:02d}</text>'
    )
    return _svg_shell("".join(body_parts))


def build_slide_map(meta: CarouselMetadata, repo_root: Path) -> list[tuple[str, str]]:
    slides: list[tuple[str, str]] = [("01-cover.svg", render_cover(meta))]
    total = len(meta.projects) + 2
    for offset, project in enumerate(meta.projects, start=2):
        slides.append(
            (
                f"{offset:02d}-{project.id}.svg",
                render_project_slide(project, offset, total, repo_root),
            )
        )
    slides.append(
        (f"{total:02d}-more-systems.svg", render_more_systems(meta, total, total))
    )
    return slides


def write_svg_slides(slides: list[tuple[str, str]], output_dir: Path) -> list[Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    for filename, svg in slides:
        path = output_dir / filename
        path.write_text(svg, encoding="utf-8")
        written.append(path)
    return written


def export_pngs(svg_paths: list[Path]) -> None:
    try:
        import cairosvg
    except Exception as exc:
        raise CarouselError(
            "PNG export requested, but CairoSVG is not installed. Install requirements-social.txt."
        ) from exc
    for svg_path in svg_paths:
        png_path = svg_path.with_suffix(".png")
        cairosvg.svg2png(
            url=str(svg_path),
            write_to=str(png_path),
            output_width=CANVAS_WIDTH,
            output_height=CANVAS_HEIGHT,
        )


def export_pdf(svg_paths: list[Path], output_dir: Path) -> Path:
    try:
        import cairosvg
    except Exception as exc:
        raise CarouselError(
            "PDF export requested, but CairoSVG is not installed. Install requirements-social.txt."
        ) from exc
    try:
        from pypdf import PdfWriter
    except Exception as exc:
        raise CarouselError(
            "PDF export requested, but pypdf is not installed. Install requirements-social.txt."
        ) from exc

    writer = PdfWriter()
    temp_pdf_paths: list[Path] = []
    for svg_path in svg_paths:
        pdf_path = svg_path.with_suffix(".page.pdf")
        temp_pdf_paths.append(pdf_path)
        cairosvg.svg2pdf(url=str(svg_path), write_to=str(pdf_path))
        writer.append(str(pdf_path))

    output_path = output_dir / "portfolio-carousel.pdf"
    with output_path.open("wb") as fh:
        writer.write(fh)
    for temp in temp_pdf_paths:
        temp.unlink(missing_ok=True)
    return output_path


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    metadata_path = Path(args.metadata)
    repo_root = metadata_path.parent.parent if metadata_path.parts else Path(".")
    output_dir = Path(args.output_dir)

    try:
        meta = validate_metadata(load_metadata(metadata_path), repo_root)
        svg_paths = write_svg_slides(build_slide_map(meta, repo_root), output_dir)
        if args.png:
            export_pngs(svg_paths)
        if args.pdf:
            export_pdf(svg_paths, output_dir)
    except CarouselError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    print(f"Generated {len(svg_paths)} SVG slides in {output_dir}")
    if args.png:
        print("PNG export completed.")
    if args.pdf:
        print(f"PDF export completed: {output_dir / 'portfolio-carousel.pdf'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
