#!/usr/bin/env python3
"""Generate a Sanity NDJSON import file from a folder of mp3 files.

Every mp3 in the source folder becomes one `link` document:

    {
        "_type": "link",
        "title": "<file name without extension, cut before the series marker>",
        "author": "Роджър Морно",
        "type": "audio",
        "isResource": true,
        "fileName": "<file name with extension>",
        "keyWords": ["<playlist title>", "<index>"]
    }

The title is the file name without bracket tags such as
" - Пътешествие в свръхестественото - Роджър Морно".
Files are sorted naturally (so "02 ..." comes before "10 ...") and the index
starts at 1 in that order.

Usage:
  py generateAudioLinksFromDir.py
  py generateAudioLinksFromDir.py --source "D:\\mp3\\some-folder" --output audio-links.ndjson
  py generateAudioLinksFromDir.py --playlist-title "Друга поредица" --author "Друг автор"
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

PLAYLIST_TITLE = "Пътешествие в свръхестественото"
AUTHOR = "Роджър Морно"
DEFAULT_SOURCE = Path(r"D:\mp3\Пътешествие в свръхестественото")
DEFAULT_OUTPUT = Path(r"D:\projects\Sanity\tmp\DB_to_Sanity\AudioLinksPateshestvie.ndjson")

AUDIO_EXTENSIONS = {".mp3"}

# Everything from this marker on is cut from the title.
TITLE_STOP_MARKER = " - Пътешествие в свръхестественото"

_NUMBER_RE = re.compile(r"(\d+)")


def natural_key(text: str) -> list[tuple[int, int, str]]:
    """Sort key that orders embedded numbers numerically: "2 ..." < "10 ..."."""
    return [
        (0, int(part), "") if part.isdigit() else (1, 0, part.casefold())
        for part in _NUMBER_RE.split(text)
    ]


def extract_title(stem: str) -> str:
    """Drop the series/author tail.

    The marker is removed from its *last* occurrence, so titles that repeat the
    series name survive:
        "03 - Пътешествие в свръхестественото - Пътешествие в свръхестественото - Роджър Морно"
        -> "03 - Пътешествие в свръхестественото"
    """
    position = stem.casefold().rfind(TITLE_STOP_MARKER.casefold())
    if position != -1:
        stem = stem[:position]
    return stem.rstrip(" -–—\t")


def build_link(
    media_file: Path, index: int, playlist_title: str, author: str
) -> dict:
    return {
        "_type": "link",
        "title": extract_title(media_file.stem),
        "author": author,
        "type": "audio",
        "isResource": True,
        "fileName": media_file.name,
        "keyWords": [playlist_title, str(index)],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        type=Path,
        default=DEFAULT_SOURCE,
        help=f"folder with the mp3 files (default: {DEFAULT_SOURCE})",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"path of the NDJSON file to write (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--playlist-title",
        default=PLAYLIST_TITLE,
        help=f'value for keyWords[0] (default: "{PLAYLIST_TITLE}")',
    )
    parser.add_argument(
        "--author",
        default=AUTHOR,
        help=f'author of the audio files (default: "{AUTHOR}")',
    )
    args = parser.parse_args()

    source: Path = args.source
    if not source.is_dir():
        raise SystemExit(f"Error: source folder not found: {source}")

    files = sorted(
        (
            entry
            for entry in source.iterdir()
            if entry.is_file()
            and entry.suffix.lower() in AUDIO_EXTENSIONS
            and not entry.name.startswith(".")
        ),
        key=lambda p: natural_key(p.name),
    )

    if not files:
        raise SystemExit(f"Error: no mp3 files found in {source}")

    links = [
        build_link(media_file, index, args.playlist_title, args.author)
        for index, media_file in enumerate(files, start=1)
    ]

    output: Path = args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8", newline="\n") as out:
        for link in links:
            out.write(json.dumps(link, ensure_ascii=False) + "\n")

    print(f'Playlist: "{args.playlist_title}" ({args.author})')
    for link in links:
        print(f"  [{link['keyWords'][1]:>3}] {link['title']}")
    print(f"\n✅ {len(links)} документа са записани в {output}")


if __name__ == "__main__":
    main()
