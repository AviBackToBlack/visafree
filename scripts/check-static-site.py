#!/usr/bin/env python3
"""Validate local asset references in the dependency-free static site."""

from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SKIP_SCHEMES = {"http", "https", "mailto", "tel", "javascript", "data"}


class ReferenceParser(HTMLParser):
    def __init__(self, source: Path) -> None:
        super().__init__(convert_charrefs=True)
        self.source = source
        self.references: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if value is None:
                continue
            if name in {"src", "href"}:
                self.references.append((name, value.strip()))


def resolve_local(source: Path, value: str) -> Path | None:
    if not value or value.startswith("#") or value.startswith("//"):
        return None

    parsed = urlsplit(value)
    if parsed.scheme.lower() in SKIP_SCHEMES or parsed.netloc:
        return None

    path_text = unquote(parsed.path)
    if not path_text:
        return None

    if path_text.startswith("/"):
        candidate = ROOT / path_text.lstrip("/")
    else:
        candidate = source.parent / path_text

    return candidate.resolve()


def main() -> int:
    failures: list[str] = []
    html_files = sorted(ROOT.rglob("*.html"))
    if not html_files:
        failures.append("no HTML files found")

    for html_file in html_files:
        parser = ReferenceParser(html_file)
        parser.feed(html_file.read_text(encoding="utf-8"))

        for attribute, value in parser.references:
            candidate = resolve_local(html_file, value)
            if candidate is None:
                continue

            try:
                candidate.relative_to(ROOT)
            except ValueError:
                failures.append(f"{html_file.relative_to(ROOT)}: {attribute} escapes repository root: {value}")
                continue

            if not candidate.exists():
                failures.append(f"{html_file.relative_to(ROOT)}: missing local {attribute}: {value}")

    if failures:
        for failure in failures:
            print(f"ERROR: {failure}")
        return 1

    print(f"Validated {len(html_files)} HTML file(s); all local src/href references resolve.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
