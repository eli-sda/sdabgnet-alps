"""
Скрипт за обновяване на рецепти-ленти (Facebook Reels).

Приема масив от reel URL-и със заглавия, сваля thumbnail-ите им
и обновява зададения json в константата JSON_PATH.

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
        "description": "Необходими продукти:\n• 1 чаша зелен грах (замразен, сварен за 5–10 минути)\n• 1/2 авокадо\n• 1–2 с.л. хранителна мая\n• сол на вкус\n• 1–2 с.л. зехтин\n• сух чесън на вкус\n• лимонов сок на вкус\nНачин на приготвяне:\nложете всички продукти в чопър и ги пасирайте до получаване на гладък и кремообразен пастет. При необходимост добавете още зехтин или лимонов сок, за да постигнете желаната консистенция и вкус.",
    },
    {
        "url": "https://www.facebook.com/reel/1287730440221118",
        "title": "Здравословни принцеси на фурна",
        "description": "Необходими продукти:\n• 2 ч.ч. сварен царевичен грис (горещ)\n• 1/2 ч.ч. тофу\n• 1/4 ч.ч. зехтин\n• сол на вкус\n• 2 с.л. хранителна мая\nНачин на приготвяне:\nСварете царевичния грис. Докато е още горещ, го прехвърлете в блендер и добавете тофуто, зехтина, солта и хранителната мая. Блендирайте до получаване на гладка, хомогенна смес.\nПрехвърлете сместа в съд и я оставете да изстине и да се стегне.\nСлед като изстине, намажете върху филии хляб. По желание поръсете със семена отгоре.\nПечете в предварително загрята фурна на 180°C за около 15 минути.",
    },
    {
        "url": "https://www.facebook.com/reel/1499100508227210",
        "title": "Пълнозърнест ориз с маслини и броколи на фурна",
        "description": "Необходими продукти:\n* 2 ч.ч. пълнозърнест ориз\n* 300 г маслини\n* 2–3 глави лук\n* 6–7 скилидки чесън\n* 6–7 с.л. зехтин\n* 1 ч.л. кориандър (на прах)\n* 1 с.л. сол\n* 8 ч.ч. вода\n* 1 глава броколи\nНачин на приготвяне:\nОризът се накисва във вода за около 5–6 часа. След това се отцежда и се прехвърля в подходяща тава.\nМаслините се нарязват на едро, лукът се нарязва на ситно, а чесънът – на тънки филийки. Всички се добавят към ориза, заедно със зехтина, кориандъра, солта и водата. Разбърква се добре.\nТавата се покрива с алуминиево фолио и се пече в предварително загрята фурна на 180°C за около 90 минути. В последните 5 минути фолиото се отстранява, за да се запече леко горният слой.\nБроколите се приготвят на пара и се добавят към готовия ориз.",
    },
    {
        "url": "https://www.facebook.com/reel/1269531691912151",
        "title": "Пастет от сварена леща",
        "description": "• 1 ч.ч. сварена леща ( зелена или кафява )\n• 1/2 ч.ч. орехи\n• 1 глава лук\n• Сол на вкус\n• 3 с.л. зехтин\nПодправки по желание (ние използваме за тази рецета смляан бахар)\nЗадушаваме лука с малко вода и щипка сол, докато омекне. В края добавяме зехтина и подправките на вкус.\nОтделно смиляме орехите на сухо. След това към тях добавяме задушения лук и сварената леща. Пасираме всичко в блендер до получаване на хомогенна смес.\nПо желание, вместо леща може да използвате сварен боб за разнообразие на вкуса.",
    },
    {
        "url": "https://www.facebook.com/reel/2011734209418853",
        "title": "Гранола (хрупкаво мюсли)",
        "description": "• 4 ч. овесени ядки\n• 1/4 ч. зехтин\n• Сок от 2 портокала\n• 1 пак. ванилия\n• 1/4 ч.л. сол\nВсичко се разбърква добре. Овесените ядки трябва да са влажни, почти мокри. При нужда може да се добави малко вода. Изсипват се в предварително с мазнина намазан съд, като дебелината на слоя не е повече от 1 см. Пекат се за първите 20 минути на 170 граудса. След това се разбъркват и за още около час се пекат на 100 градуса, като се разбъркват на всеки 20 минути. Накрая трябва да придобият леко златист цвят. След като истинат се съхръняват на сухо, най-добре в буркан. При консумация могат да се объркат например с фурми, смлени орехи и бадеми и да се залеят с горещо соево, или друго растително мляко. При нужда може да се добави мед за сладост.",
    },
    {
        "url": "https://www.facebook.com/reel/1593588265233078",
        "title": "Слънчогледови кюфтета",
        "description": "• 4-5 картофа\n• 1 ч. белен сльнчоглед\n• 1-2 моркови\n• 1-2 глави лук\n• 3-4 скилидки чесън\n• 1 с.л. сол (равна)\nКартофите се настъргват, слагате малко сол, и ги оставяме 2-3 минути, и после се изцеждат от сока им. Слънчогледът се смила на прах. Морковите и чесънът се настъргват. Лукът се нарязва на ситно. Всички съставки се разбъркват добре. Оформят се малки кюфтета, които се поставят в предварително с мазнина намазан съд. Пекат се на 180 градуса за около 30-40 минути.",
    },
    {
        "url": "https://www.facebook.com/reel/1678356593148744",
        "title": "Растително мляко",
    },
    {
        "url": "https://www.facebook.com/reel/1555061128899128",
        "title": "Чиа пудинг",
        "description": "250 г чиа, изсипваме в\n150 г сухо соево мляко + 1 литър вода, или 1 литър растително мляко, за предпочитане кокосово мляко със по-гъста консистенция\n150 г мед или сироп от агаве\nСол и ванилия на вкус\nРазбъркайте добре всички горепосочени съставки и оставете да престои, докато се сгъсти. Ако сте добавили топла вряща вода или топло мляко, можете да сервирате чиата след 30 минути, но ако сте добавили студено мляко, трябва да я оставите да престои една нощ.\nКогато чиата е готова:\n- Нарежете плодовете или ги пасирайте\n- Започнете да редите всичко на пластове в чаша\n- 2 супени лъжици чиа\n- 1 супена лъжица плодове\n- 1 супена лъжица \"бисквитки\" (вижте инструкциите по-долу)\nПродължете да редите на пластове, докато чашата се напълни. Можете също да гарнирате с плодове.\n\nБисквитки\n50 г кокосово брашно (можете просто да смелите в блендер кокосови стърготини)\n60 г овесени ядки\n35 г кокосова захар\nСмесете всичко в блендер и печете във фурната на 170 градуса по целзий.\nОстаналите бисквитки могат да се съхраняват на сухо място и да се използват за други сладки рецепти.",
    },
]

# ---------------------------------------------------------------------------
# Пътища (относително спрямо корена на проекта)
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parents[2]  # src/utils/python -> project root

IMG_DIR = PROJECT_ROOT / "public" / "img" / "health" / "recipes" / "reels" # за готови WebP изображения
TMP_DIR = PROJECT_ROOT / "tmp" / "recipes"  # за оригинални изображения
JSON_PATH = PROJECT_ROOT / "public" / "json" / "recipes-reels-Banya.json"

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
        description = reel.get("description", "").strip()

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
                "description": description,
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
