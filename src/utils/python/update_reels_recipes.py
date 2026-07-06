"""
Скрипт за обновяване на рецепти-ленти (Facebook Reels).

Приема масив от reel URL-и със заглавия, сваля thumbnail-ите им
и обновява public/json/recipes-reels.json.

Извлича ID-то от URL-а, сваля thumbnail чрез yt-dlp (или facebook-scraper като fallback),
и записва изображението като WebP в public/img/health/recipes/reels/.

Изисквания:
    pip install yt-dlp Pillow requests

Използване:
    Редактирай масива `reels` по-долу и изпълни:
        python update_reels_recipes.py
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.request import urlretrieve, urlopen
from urllib.error import URLError

# ---------------------------------------------------------------------------
# КОНФИГУРАЦИЯ — редактирай само тук
# ---------------------------------------------------------------------------

reels = [
    {
        "url": "https://www.facebook.com/reel/1559464902195403",
        "title": "Пастет от зелен грах и авокадо",
    },
    {
        "url": "https://www.facebook.com/reel/1287730440221118",
        "title": "Здравословни принцеси на фурна",
    },
    {
        "url": "https://www.facebook.com/reel/1499100508227210",
        "title": "Пълнозърнест ориз с маслини и броколи на фурна",
    },
    {
        "url": "https://www.facebook.com/reel/1269531691912151",
        "title": "Пастет от сварена леща",
    },
    {
        "url": "https://www.facebook.com/reel/2011734209418853",
        "title": "Гранола (хрупкаво мюсли)",
    },
    {
        "url": "https://www.facebook.com/reel/1593588265233078",
        "title": "Слънчогледови кюфтета",
    },
    {
        "url": "https://www.facebook.com/reel/1678356593148744",
        "title": "Растително мляко",
    },
    {
        "url": "https://www.facebook.com/reel/1555061128899128",
        "title": "Чиа пудинг",
    }
]

# ---------------------------------------------------------------------------
# Пътища (относително спрямо корена на проекта)
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parents[2]  # src/utils/python -> project root

IMG_DIR = PROJECT_ROOT / "public" / "img" / "health" / "recipes" / "reels" # за готови WebP изображения
TMP_DIR = PROJECT_ROOT / "tmp" / "recipes"  # за оригинални изображения
JSON_PATH = PROJECT_ROOT / "public" / "json" / "recipes-reels.json"

# Пътят, записван в JSON (публичен URL префикс)
IMG_PUBLIC_PREFIX = "/img/health/recipes/reels"

# Размер на изрязаното изображение (crop от центъра)
CROP_W = 246
CROP_H = 146


# ---------------------------------------------------------------------------
# Помощни функции
# ---------------------------------------------------------------------------


def extract_reel_id(url: str) -> str:
    """Извлича числовото ID от Facebook Reel URL."""
    match = re.search(r"/reel/(\d+)", url)
    if not match:
        raise ValueError(f"Не може да се извлече ID от URL: {url}")
    return match.group(1)


def normalize_reel_url(reel_id: str) -> str:
    """Нормализира URL-а до каноничен вид."""
    return f"https://www.facebook.com/reel/{reel_id}/"


def download_thumbnail_yt_dlp(reel_url: str, dest_path: Path) -> bool:
    """
    Сваля thumbnail чрез yt-dlp.
    Записва го в dest_path (без разширение — yt-dlp добавя само).
    Връща True при успех.
    """
    tmp_thumb = dest_path.with_suffix(".tmp_thumb")
    try:
        result = subprocess.run(
            [
                sys.executable, "-m", "yt_dlp",
                "--write-thumbnail",
                "--skip-download",
                "--no-playlist",
                "-o", str(tmp_thumb),
                reel_url,
            ],
            capture_output=True,
            text=True,
            timeout=60,
        )
        # yt-dlp добавя разширение — намери го
        reel_id = dest_path.stem
        for candidate in tmp_thumb.parent.glob(tmp_thumb.name + "*"):
            if candidate.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
                convert_to_webp(candidate, dest_path, reel_id)
                candidate.unlink(missing_ok=True)
                return True
        # понякога записва без суфикс
        if tmp_thumb.exists() and tmp_thumb.stat().st_size > 0:
            convert_to_webp(tmp_thumb, dest_path, reel_id)
            tmp_thumb.unlink(missing_ok=True)
            return True
        return False
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False


def download_thumbnail_og(reel_url: str, dest_path: Path) -> bool:
    """
    Fallback: взема og:image мета тага от страницата.
    Забележка: Facebook блокира headless заявки — работи само ако IP не е блокиран.
    """
    try:
        import urllib.request as req
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            )
        }
        request = req.Request(reel_url, headers=headers)
        with req.urlopen(request, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="replace")

        match = re.search(r'<meta property="og:image"\s+content="([^"]+)"', html)
        if not match:
            match = re.search(r'<meta content="([^"]+)"\s+property="og:image"', html)
        if not match:
            return False

        img_url = match.group(1).replace("&amp;", "&")
        tmp_path = dest_path.with_suffix(".tmp_og")
        urlretrieve(img_url, str(tmp_path))
        convert_to_webp(tmp_path, dest_path, dest_path.stem)
        tmp_path.unlink(missing_ok=True)
        return True
    except Exception:
        return False


def save_original(src: Path, reel_id: str) -> None:
    """Запазва оригиналното изображение в tmp/recipes/."""
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    suffix = src.suffix or ".jpg"
    dest = TMP_DIR / f"{reel_id}{suffix}"
    if not dest.exists():
        import shutil
        shutil.copy2(src, dest)


def convert_to_webp(src: Path, dest: Path, reel_id: str = "") -> None:
    """Запазва оригинала в tmp/, после изрязва от центъра до CROP_WxCROP_H и записва WebP."""
    try:
        from PIL import Image

        if reel_id:
            save_original(src, reel_id)

        with Image.open(src) as img:
            w, h = img.size

            # Мащабираме така, че по-малкото измерение да покрие целевото
            scale = max(CROP_W / w, CROP_H / h)
            new_w = max(1, int(w * scale))
            new_h = max(1, int(h * scale))
            img = img.resize((new_w, new_h), Image.LANCZOS)

            # Изрязваме от центъра
            left = (new_w - CROP_W) // 2
            top = (new_h - CROP_H) // 2
            img = img.crop((left, top, left + CROP_W, top + CROP_H))

            img.save(str(dest), "WEBP", quality=85)
    except ImportError:
        # Pillow не е наличен — просто копирай
        import shutil
        shutil.copy2(src, dest)
    except Exception as exc:
        # Ако конверсията се провали, копираме оригинала
        import shutil
        shutil.copy2(src, dest)
        print(f"  Предупреждение при конверсия: {exc}")


def load_existing_json() -> list:
    """Зарежда съществуващия JSON файл или връща празен масив."""
    if JSON_PATH.exists():
        with open(JSON_PATH, encoding="utf-8") as f:
            return json.load(f)
    return []


def save_json(data: list) -> None:
    """Записва JSON файла."""
    JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


# ---------------------------------------------------------------------------
# Главна логика
# ---------------------------------------------------------------------------


def process_reels(reels_input: list) -> None:
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)

    existing = load_existing_json()
    existing_ids = {item["id"] for item in existing}

    new_entries = []
    skipped = 0
    downloaded = 0
    failed = []

    for reel in reels_input:
        url = reel["url"].strip()
        title = reel.get("title", "").strip()

        try:
            reel_id = extract_reel_id(url)
        except ValueError as exc:
            print(f"[ПРОПУСНАТ] {exc}")
            skipped += 1
            continue

        canonical_url = normalize_reel_url(reel_id)
        img_filename = f"{reel_id}.webp"
        img_dest = IMG_DIR / img_filename
        img_public_path = f"{IMG_PUBLIC_PREFIX}/{img_filename}"

        print(f"Обработване: {reel_id} — {title}")

        # Свали thumbnail само ако изображението не съществува
        if not img_dest.exists():
            print(f"  Свалям thumbnail…")
            ok = download_thumbnail_yt_dlp(canonical_url, img_dest)
            if not ok:
                print(f"  yt-dlp неуспешен, пробвам og:image fallback…")
                ok = download_thumbnail_og(canonical_url, img_dest)
            if ok:
                print(f"  Thumbnail записан: {img_dest.name}")
                downloaded += 1
            else:
                print(f"  [ГРЕШКА] Не може да се свали thumbnail за {reel_id}")
                failed.append(reel_id)
                # Добавяме в JSON дори без thumbnail
        else:
            print(f"  Thumbnail вече съществува, пропускам изтегляне.")

        # Добави в JSON само ако не съществува
        if reel_id not in existing_ids:
            entry = {
                "id": reel_id,
                "title": title,
                "image": img_public_path,
                "reelUrl": canonical_url,
            }
            new_entries.append(entry)
            existing_ids.add(reel_id)
        else:
            print(f"  Вече е в JSON, пропускам.")

    if new_entries:
        updated = existing + new_entries
        save_json(updated)
        print(f"\nДобавени {len(new_entries)} нови записа в {JSON_PATH.relative_to(PROJECT_ROOT)}")
    else:
        print("\nНяма нови записа за добавяне.")

    print(f"Свалени thumbnails: {downloaded}")
    if skipped:
        print(f"Пропуснати (невалиден URL): {skipped}")
    if failed:
        print(f"Неуспешни thumbnails: {', '.join(failed)}")


if __name__ == "__main__":
    process_reels(reels)
