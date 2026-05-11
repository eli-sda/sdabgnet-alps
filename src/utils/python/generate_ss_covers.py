"""
Скрипт за генериране на хоризонтални (landscape) корици за тримесечията на съботното училище.

Кориците от Adventech API са вертикални (portrait). За og:image в социалните мрежи
е нужен хоризонтален формат (1200x630).

Алгоритъм:
  1. Чете ss-meta.json (генериран от extract_ss_meta.py)
  2. За всяко тримесечие взема URL на кориците
  3. Изтегля вертикалната корица
  4. Генерира 1200x630 изображение:
     - фон: размазана (Gaussian blur) и потъмнена версия на кориците, разтегната да запълни canvas
     - преден план: оригиналната корица, центрирана, наместена по височина
  5. Записва в public/img/ss-covers/{bucket}/{quarter_key}.jpg
  6. Обновява ss-meta.json с полето "landscape_cover" за всяко тримесечие

Използване:
    python generate_ss_covers.py

Зависимости:
    pip install Pillow
"""

import json
import os
from io import BytesIO
from typing import Optional
from urllib.request import urlopen
from urllib.error import HTTPError
from PIL import Image, ImageFilter, ImageEnhance

OUTPUT_WIDTH  = 1200
OUTPUT_HEIGHT = 630
BLUR_RADIUS   = 20
DARKEN_FACTOR = 0.45   # 0=black, 1=original brightness


def fetch_image(url: str) -> Optional[Image.Image]:
    """Изтегля изображение от URL."""
    try:
        with urlopen(url) as response:
            return Image.open(BytesIO(response.read())).convert('RGB')
    except (HTTPError, Exception) as e:
        print(f"    ERROR fetching image: {e}")
        return None


def make_landscape(portrait: Image.Image, width: int = OUTPUT_WIDTH, height: int = OUTPUT_HEIGHT) -> Image.Image:
    """
    Създава landscape изображение от portrait корица:
    - размазан и потъмнен фон (stretch-to-fill)
    - оригинал центриран, наместен по височина
    """
    canvas = Image.new('RGB', (width, height))

    # --- Фон: разтягане, размазване, потъмняване ---
    bg = portrait.copy().resize((width, height), Image.LANCZOS)
    bg = bg.filter(ImageFilter.GaussianBlur(radius=BLUR_RADIUS))
    bg = ImageEnhance.Brightness(bg).enhance(DARKEN_FACTOR)
    canvas.paste(bg, (0, 0))

    # --- Преден план: центрирана корица, наместена по височина ---
    scale = height / portrait.height
    fg_w  = int(portrait.width * scale)
    fg_h  = height
    fg    = portrait.resize((fg_w, fg_h), Image.LANCZOS)

    x = (width - fg_w) // 2
    canvas.paste(fg, (x, 0))

    return canvas


def main():
    script_dir   = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.join(script_dir, '..', '..', '..')
    json_path    = os.path.join(project_root, 'public', 'json', 'ss-meta.json')
    covers_root  = os.path.join(project_root, 'public', 'img', 'ss-covers')

    if not os.path.exists(json_path):
        print(f"ERROR: {json_path} not found. Run extract_ss_meta.py first.")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        meta = json.load(f)

    changed = False

    for bucket, quarters in meta.items():
        out_dir = os.path.join(covers_root, bucket)
        os.makedirs(out_dir, exist_ok=True)

        for key, quarter in quarters.items():
            cover_url = quarter.get('cover', '')
            if not cover_url:
                continue

            out_file = os.path.join(out_dir, f'{key}.jpg')
            rel_url  = f'/img/ss-covers/{bucket}/{key}.jpg'

            # Пропускаме ако вече е генерирано
            if os.path.exists(out_file):
                if quarter.get('landscape_cover') != rel_url:
                    quarter['landscape_cover'] = rel_url
                    changed = True
                print(f"  ✓ {bucket}/{key}.jpg (existing)")
                continue

            print(f"  Generating {bucket}/{key}.jpg from {cover_url[:60]}...")

            img = fetch_image(cover_url)
            if img is None:
                continue

            landscape = make_landscape(img)
            landscape.save(out_file, 'JPEG', quality=88, optimize=True)

            quarter['landscape_cover'] = rel_url
            changed = True
            print(f"    Saved {out_file}")

    if changed:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)
        print("\nUpdated ss-meta.json with landscape_cover fields.")

    print("\n✓ Done!")


if __name__ == '__main__':
    main()
