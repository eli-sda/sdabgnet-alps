"""
Скрипт за извличане на мета данни за всички уроци от съботно училище.

Взема всички тримесечия за:
  - възрастни (adult)  – без суфикс (напр. "2025-04")
  - младежи   (cq)     – суфикс -cq  (напр. "2025-04-cq")
  - юноши     (cc)     – суфикс -cc  (напр. "2025-04-cc")

За всяко тримесечие взема списъка с уроци и записва:
  - заглавие на тримесечието
  - корица на тримесечието
  - списък с уроци { id: <число>, title: <заглавие> }

Резултатът се записва в public/json/ss-meta.json със структура:
{
  "adult": {
    "2026_01": {
      "title": "...",
      "cover": "...",
      "human_date": "...",
      "lessons": [
        { "id": "2026-01-01", "title": "...", "cover": "...", "start_date": "...", "end_date": "..." },
        ...
      ]
    },
    ...
  },
  "cq": { ... },
  "cc": { ... }
}

API endpoints:
- Списък с тримесечия: https://sabbath-school-stage.adventech.io/api/v2/bg/quarterlies/index.json
- Данни за тримесечие: .../quarterlies/{quarter_id}/index.json

Използване:
    python extract_ss_meta.py
"""

import json
import time
from typing import List, Dict, Any, Optional
import os
from urllib.request import urlopen
from urllib.error import HTTPError

SS_API_URL_BG_QUARTER = "https://sabbath-school-stage.adventech.io/api/v2/bg/quarterlies"

# adult='' (без суфикс), cq=младежи, cc=юноши
TYPE_KEYS = {
    'adult': '',
    'cq': 'cq',
    'cc': 'cc'
}


def fetch_json(url: str) -> Any:
    """Взема JSON данни от URL използвайки urllib"""
    try:
        with urlopen(url) as response:
            return json.loads(response.read().decode('utf-8'))
    except HTTPError as e:
        raise Exception(f"HTTP Error {e.code}: {e.reason} — {url}")


def get_quarter_type(quarter_id: str) -> str:
    """
    Определя типа на тримесечието по суфикса в id.
    '2025-04'    -> '' (adult)
    '2025-04-cq' -> 'cq'
    '2025-04-cc' -> 'cc'
    """
    parts = quarter_id.split('-')
    if len(parts) >= 3:
        return parts[2]   # 'cq' или 'cc'
    return ''             # възрастни


def quarter_key(quarter_id: str) -> Optional[str]:
    """
    Построява ключ от вида '2025_04' от quarter_id '2025-04' или '2025-04-cq'.
    Връща None ако форматът е неразпознат.
    """
    parts = quarter_id.split('-')
    if len(parts) < 2:
        return None
    year = parts[0]
    quarter_num = parts[1]
    if not year.isdigit() or not quarter_num.isdigit():
        return None
    return f"{year}_{quarter_num.zfill(2)}"


def get_all_quarterlies() -> List[Dict[str, Any]]:
    """Взема пълния списък с тримесечия от API."""
    url = f"{SS_API_URL_BG_QUARTER}/index.json"
    return fetch_json(url)


def get_quarter_data(quarter_id: str) -> Dict[str, Any]:
    """Взема данните за тримесечие (заглавие, корица, уроци)."""
    url = f"{SS_API_URL_BG_QUARTER}/{quarter_id}/index.json"
    return fetch_json(url)


def main():
    """
    Главна функция:
    - Взема всички тримесечия
    - Групира ги по тип (adult / cq / cc)
    - За всяко тримесечие взема заглавие, корица и списък уроци
    - Записва резултата в public/json/ss-meta.json
    """

    # Изходна директория
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.join(script_dir, '..', '..', '..')
    output_dir = os.path.join(project_root, 'public', 'json')
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, 'ss-meta.json')

    # Структура на резултата
    result: Dict[str, Dict[str, Any]] = {
        'adult': {},
        'cq': {},
        'cc': {}
    }

    # Зареждане на съществуващия файл (за да пропуснем вече обработените тримесечия)
    if os.path.exists(output_file):
        with open(output_file, 'r', encoding='utf-8') as f:
            try:
                result = json.load(f)
            except Exception:
                pass  # файлът е повреден – започваме наново

    print("Fetching list of all quarterlies...")
    quarterlies = get_all_quarterlies()
    print(f"Found {len(quarterlies)} quarterlies in total.")

    for q in quarterlies:
        q_id = q.get('id', '')
        key = quarter_key(q_id)
        if not key:
            print(f"  Skipping unrecognized id: {q_id}")
            continue

        q_type = get_quarter_type(q_id)

        # Намери правилния bucket (adult / cq / cc)
        bucket = next((k for k, v in TYPE_KEYS.items() if v == q_type), None)
        if bucket is None:
            print(f"  Unknown type '{q_type}' for {q_id}, skipping.")
            continue

        # Пропускаме ако тримесечието вече е в JSON-а
        if key in result.get(bucket, {}):
            print(f"  [{bucket:5s}] {q_id} -> key {key} (already exists, skipping)")
            continue

        print(f"  [{bucket:5s}] {q_id} -> key {key}")

        try:
            data = get_quarter_data(q_id)
            quarterly_info = data.get('quarterly', {})
            lessons_raw = data.get('lessons', [])

            lessons = []
            for lesson in lessons_raw:
                lessons.append({
                    'id': lesson.get('id', ''),
                    'title': lesson.get('title', ''),
                    'start_date': lesson.get('start_date', ''),
                    'end_date': lesson.get('end_date', '')
                })

            result[bucket][key] = {
                'title': quarterly_info.get('title', q.get('title', '')),
                'cover': quarterly_info.get('cover', q.get('cover', '')),
                'human_date': quarterly_info.get('human_date', ''),
                'lessons': lessons
            }

        except Exception as e:
            print(f"    ERROR fetching {q_id}: {e}")

        # Малко пауза за да не претоварим сървъра
        time.sleep(0.15)

    # Сортиране на ключовете (от най-новото към най-старото)
    for bucket in result:
        result[bucket] = dict(
            sorted(result[bucket].items(), reverse=True)
        )

    # Запис на файла
    print(f"\nWriting output to {output_file} ...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    # Статистика
    for bucket, quarters in result.items():
        lesson_total = sum(len(v['lessons']) for v in quarters.values())
        print(f"  {bucket:5s}: {len(quarters)} quarters, {lesson_total} lessons")

    print("\n✓ Done!")


if __name__ == "__main__":
    main()
