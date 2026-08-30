from __future__ import annotations

import json
from pathlib import Path
import xml.etree.ElementTree as ET

import pytest

from scripts.build_social_carousel import (
    CarouselError,
    build_slide_map,
    load_metadata,
    validate_metadata,
)

PNG_1X1 = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89"
    b"\x00\x00\x00\rIDATx\x9cc``\xf8\xcf\xc0\x00\x00\x03\x01\x01\x00\xc9\xfe\x92\xef\x00\x00\x00\x00IEND\xaeB`\x82"
)
SVG_NS = "{http://www.w3.org/2000/svg}"


def make_png(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(PNG_1X1)


def make_metadata(repo_root: Path) -> Path:
    for rel in [
        "assets/geoplatform-preview.png",
        "assets/pulso_territorial.png",
        "assets/anti-ia-preview.png",
        "assets/fleetflowsim.png",
        "assets/atlasgeotech.png",
    ]:
        make_png(repo_root / rel)

    data = {
        "cover": {
            "eyebrow": "JUAN",
            "title": "Software built around territory, evidence and operations.",
            "subtitle": "A compact visual atlas of geospatial products, applied tools and spatial systems.",
            "footer": "example footer",
        },
        "projects": [
            {
                "id": "geoplatform",
                "name": "GeoPlatform",
                "description": "desc",
                "status": "LIVE APPLICATION",
                "stack": ["React"],
                "screenshot": "assets/geoplatform-preview.png",
            },
            {
                "id": "pulso",
                "name": "Pulso",
                "description": "desc",
                "status": "LIVE",
                "stack": ["React"],
                "screenshot": "assets/pulso_territorial.png",
                "live_url": "https://example.com",
                "repo_url": "https://github.com/example/repo",
            },
            {
                "id": "anti-ia",
                "name": "Anti IA",
                "description": "desc",
                "status": "EXPERIMENTAL",
                "stack": ["React"],
                "screenshot": "assets/anti-ia-preview.png",
            },
            {
                "id": "fleetflow",
                "name": "FleetFlow",
                "description": "desc",
                "status": "LIVE",
                "stack": ["React"],
                "screenshot": "assets/fleetflowsim.png",
            },
            {
                "id": "atlas",
                "name": "Atlas",
                "description": "desc",
                "status": "LIVE",
                "stack": ["R"],
                "screenshot": "assets/atlasgeotech.png",
            },
        ],
        "more_systems": {
            "eyebrow": "MORE",
            "title": "More systems",
            "subtitle": "extra",
            "items": [
                {
                    "name": "Opportunity OS",
                    "description": "A local-first job-search system for finding opportunities, tracking target companies, generating evidence-backed CVs and organizing outreach.",
                    "stack": ["Python", "FastAPI", "SQLite", "Gmail Adapter"],
                    "repo_url": "https://github.com/example/opportunity-os",
                },
                {"name": "B", "description": "bb", "stack": ["Python"]},
                {"name": "C", "description": "cc", "stack": ["Python"]},
                {"name": "D", "description": "dd", "stack": ["Python"]},
            ],
        },
    }
    metadata_path = repo_root / "portfolio/social_carousel.json"
    metadata_path.parent.mkdir(parents=True, exist_ok=True)
    metadata_path.write_text(json.dumps(data), encoding="utf-8")
    return metadata_path


def _root(svg: str) -> ET.Element:
    return ET.fromstring(svg)


def _text_by_class(root: ET.Element, css_class: str, occurrence: int = 0) -> ET.Element:
    matches = [
        element
        for element in root.iter(f"{SVG_NS}text")
        if element.attrib.get("class") == css_class
    ]
    return matches[occurrence]


def _last_baseline(text_element: ET.Element) -> float:
    baseline = float(text_element.attrib["y"])
    for child in text_element:
        if child.tag == f"{SVG_NS}tspan":
            baseline += float(child.attrib.get("dy", "0"))
    return baseline


def test_validate_metadata_rejects_duplicate_ids(tmp_path: Path) -> None:
    metadata_path = make_metadata(tmp_path)
    data = load_metadata(metadata_path)
    data["projects"][1]["id"] = "geoplatform"

    with pytest.raises(CarouselError, match="Duplicate slide id"):
        validate_metadata(data, tmp_path)


def test_validate_metadata_rejects_missing_screenshot(tmp_path: Path) -> None:
    metadata_path = make_metadata(tmp_path)
    data = load_metadata(metadata_path)
    data["projects"][0]["screenshot"] = "assets/missing.png"

    with pytest.raises(CarouselError, match="missing screenshot"):
        validate_metadata(data, tmp_path)


def test_slide_generation_is_deterministic(tmp_path: Path) -> None:
    metadata_path = make_metadata(tmp_path)
    meta = validate_metadata(load_metadata(metadata_path), tmp_path)
    slides_a = build_slide_map(meta, tmp_path)
    slides_b = build_slide_map(meta, tmp_path)

    assert [name for name, _ in slides_a] == [
        "01-cover.svg",
        "02-geoplatform.svg",
        "03-pulso.svg",
        "04-anti-ia.svg",
        "05-fleetflow.svg",
        "06-atlas.svg",
        "07-more-systems.svg",
    ]
    assert [name for name, _ in slides_a] == [name for name, _ in slides_b]
    assert slides_a[1][1] == slides_b[1][1]


def test_project_slide_includes_links_and_escaped_content(tmp_path: Path) -> None:
    metadata_path = make_metadata(tmp_path)
    data = load_metadata(metadata_path)
    data["projects"][1]["name"] = "Pulso <Publico>"
    data["projects"][1]["description"] = "A & B"
    meta = validate_metadata(data, tmp_path)
    slides = dict(build_slide_map(meta, tmp_path))

    svg = slides["03-pulso.svg"]
    assert "Pulso &lt;Publico&gt;" in svg
    assert "A &amp; B" in svg
    assert "open app →" in svg
    assert "repository →" in svg


def test_build_generates_seven_svg_files_from_checked_in_metadata_shape(tmp_path: Path) -> None:
    metadata_path = make_metadata(tmp_path)
    meta = validate_metadata(load_metadata(metadata_path), tmp_path)
    slides = build_slide_map(meta, tmp_path)

    assert len(slides) == 7
    assert all(name.endswith(".svg") for name, _ in slides)


def test_more_systems_rejects_more_than_four_cards(tmp_path: Path) -> None:
    metadata_path = make_metadata(tmp_path)
    data = load_metadata(metadata_path)
    data["more_systems"]["items"].append(
        {"name": "E", "description": "ee", "stack": ["Python"]}
    )

    with pytest.raises(CarouselError, match="up to 4 entries"):
        validate_metadata(data, tmp_path)


def test_cover_subtitle_starts_below_wrapped_title(tmp_path: Path) -> None:
    metadata_path = make_metadata(tmp_path)
    meta = validate_metadata(load_metadata(metadata_path), tmp_path)
    svg = dict(build_slide_map(meta, tmp_path))["01-cover.svg"]
    root = _root(svg)

    title = _text_by_class(root, "title")
    subtitle = _text_by_class(root, "subtitle")

    assert float(subtitle.attrib["y"]) >= _last_baseline(title) + 36


def test_more_systems_stack_starts_below_wrapped_description(tmp_path: Path) -> None:
    metadata_path = make_metadata(tmp_path)
    meta = validate_metadata(load_metadata(metadata_path), tmp_path)
    svg = dict(build_slide_map(meta, tmp_path))["07-more-systems.svg"]
    root = _root(svg)
    elements = list(root.iter())

    body = _text_by_class(root, "tool-body", occurrence=0)
    body_index = elements.index(body)
    first_stack_rect = next(
        element
        for element in elements[body_index + 1 :]
        if element.tag == f"{SVG_NS}rect" and element.attrib.get("height") == "28"
    )

    assert float(first_stack_rect.attrib["y"]) >= _last_baseline(body) + 20


def test_more_systems_repository_button_stays_below_stack_pills(tmp_path: Path) -> None:
    metadata_path = make_metadata(tmp_path)
    meta = validate_metadata(load_metadata(metadata_path), tmp_path)
    svg = dict(build_slide_map(meta, tmp_path))["07-more-systems.svg"]
    root = _root(svg)

    first_card_stack_rects = [
        element
        for element in root.iter(f"{SVG_NS}rect")
        if element.attrib.get("height") == "28"
        and 100 <= float(element.attrib.get("x", "0")) < 476
        and 340 <= float(element.attrib.get("y", "0")) < 730
    ]
    first_repo_button = next(
        element
        for element in root.iter(f"{SVG_NS}rect")
        if element.attrib.get("height") == "32"
        and 100 <= float(element.attrib.get("x", "0")) < 476
        and 340 <= float(element.attrib.get("y", "0")) < 730
    )

    stack_bottom = max(float(rect.attrib["y"]) + 28 for rect in first_card_stack_rects)
    assert float(first_repo_button.attrib["y"]) >= stack_bottom + 12


def test_svg_uses_explicit_font_properties_for_cairosvg(tmp_path: Path) -> None:
    metadata_path = make_metadata(tmp_path)
    meta = validate_metadata(load_metadata(metadata_path), tmp_path)
    svg = dict(build_slide_map(meta, tmp_path))["01-cover.svg"]

    assert "font-family:" in svg
    assert "font-size:" in svg
    assert "font-weight:" in svg
    assert " font:" not in svg
