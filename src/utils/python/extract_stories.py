"""
Скрипт за извличане на мисионерски истории от Съботното училище на Adventech API и записването им в JSON файлове по години.

Този скрипт:
1. Взема всички тримесечия за възрастни (без -cq и -cc суфикс) от Adventech API
2. За всяко тримесечие взема всички уроци
3. За всеки урок взема 8-ия ден (индекс 7) - мисионерската история
4. Извлича данни от всяка история: date, bible, content, title
5. Записва историите в отделни JSON файлове по година (напр. stories-2025.json)
6. Създава индексен файл stories-index.json със списък на всички налични години

ВАЖНО: Скриптът проверява дали файлът за годината вече съществува.
Ако съществува, пропуска го и не дърпа данните отново.

API endpoints:
- Списък с тримесечия: https://sabbath-school-stage.adventech.io/api/v2/bg/quarterlies/index.json
- Уроци за тримесечие: .../quarterlies/{quarter_id}/index.json
- Дни за урок: .../lessons/{lesson_id}/index.json
- Съдържание на ден: .../days/{day_id}/index.json

Използване:
    python extract_stories.py
"""
# Липсват за  2025-01, 2024-02, 2024-01, 2023, 2022, 2021, 2020-4, 2020-3, 2018-04, 2018-03
# някъде за уроци има "работим-по-този-урок"
# => вземаме само уроците от 2024г нататък
import json
import time
from typing import List, Dict, Any
import os
from urllib.request import urlopen
from urllib.error import HTTPError

SS_API_URL_BG_QUARTER = "https://sabbath-school-stage.adventech.io/api/v2/bg/quarterlies"

def fetch_json(url: str) -> Any:
    """Взема JSON данни от URL използвайки urllib"""
    try:
        with urlopen(url) as response:
            return json.loads(response.read().decode('utf-8'))
    except HTTPError as e:
        raise Exception(f"HTTP Error {e.code}: {e.reason}")

def get_all_quarterlies() -> List[Dict[str, Any]]:
    """
    Взема всички тримесечия за възрастни от API.
    Филтрира само тези без -cq (младежи) и -cc (юноши) суфикс.
    """
    url = f"{SS_API_URL_BG_QUARTER}/index.json"
    quarterlies = fetch_json(url)
    
    adult_quarterlies = []
    for q in quarterlies:
        q_id = q.get('id', '')
        # Само тримесечия без -cq и -cc суфикс (за възрастни)
        if not q_id.endswith('-cq') and not q_id.endswith('-cc'):
            adult_quarterlies.append(q)
    
    return adult_quarterlies

def get_quarter_lessons(quarter_id: str) -> List[Dict[str, Any]]:
    """Взема всички уроци за дадено тримесечие"""
    url = f"{SS_API_URL_BG_QUARTER}/{quarter_id}/index.json"
    data = fetch_json(url)
    return data.get('lessons', [])

def get_lesson_days(lesson_full_path: str) -> List[Dict[str, Any]]:
    """Взема всички дни за даден урок"""
    url = f"{lesson_full_path}/index.json"
    data = fetch_json(url)
    return data.get('days', [])

def get_day_content(day_full_read_path: str) -> Dict[str, Any]:
    """Взема пълното съдържание на даден ден"""
    url = f"{day_full_read_path}/index.json"
    return fetch_json(url)

def extract_title_from_content(content: str) -> tuple[str, str]:
    """
    Извлича заглавието от съдържанието и го премахва.
    Взема текста от първия ред (обикновено <h3> таг), извлича само текста
    и връща заглавието и съдържанието без първия ред.
    
    Returns:
        tuple[str, str]: (title, content_without_title)
    """
    if not content:
        return "", ""
    
    lines = content.split('\n')
    if not lines:
        return "", content
    
    first_line = lines[0].strip()
    
    # Извличане на текста от HTML тага (напр. <h3 id="...">Текст</h3>)
    # Търсим текста между > и </
    import re
    match = re.search(r'>([^<]+)</', first_line)
    title = match.group(1).strip() if match else first_line
    
    # Премахване на първия ред от съдържанието
    content_without_title = '\n'.join(lines[1:]).strip()
    
    return title, content_without_title

def extract_year_from_quarter_id(quarter_id: str) -> str:
    """
    Извлича годината от quarter_id (напр. '2025-04' -> '2025')
    """
    return quarter_id.split('-')[0] if '-' in quarter_id else quarter_id[:4]

def fetch_stories_for_quarterlies(year: str, quarterlies: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Взема историите за подадените тримесечия.
    Връща списък с истории без да ги записва.
    """
    stories = []
    # Сортиране на тримесечията от най-новото към най-старото
    quarterlies = sorted(quarterlies, key=lambda q: q.get('id', ''), reverse=True)

    print(f"\nProcessing {len(quarterlies)} quarterlies for year {year}...")

    for quarterly in quarterlies:
        quarter_id = quarterly.get('id')
        print(f"  Processing quarterly: {quarter_id}")

        try:
            lessons = get_quarter_lessons(quarter_id)
            # Сортиране на уроците от най-новия към най-стария
            lessons = sorted(lessons, key=lambda l: l.get('id', ''), reverse=True)
            print(f"    Found {len(lessons)} lessons")

            for lesson in lessons:
                lesson_id = lesson.get('id')
                lesson_full_path = lesson.get('full_path')
                print(f"      Processing lesson: {lesson_id}")

                try:
                    days = get_lesson_days(lesson_full_path)

                    # Проверка дали има 8-ия ден (индекс 7 - мисионерската история)
                    if len(days) >= 8:
                        story_day = days[7]  # 8-ия ден = мисионерската история
                        day_full_read_path = story_day.get('full_read_path')

                        print(f"        Fetching story day content...")
                        day_content = get_day_content(day_full_read_path)

                        # Извличане на нужните полета
                        content = day_content.get('content', '')
                        title, content_clean = extract_title_from_content(content)

                        story = {
                            'date': day_content.get('date', ''),
                            'bible': day_content.get('bible', []),
                            'content': content_clean,
                            'title': title,
                            'index': day_content.get('index', '')
                        }

                        stories.append(story)
                        print(f"        Added story: {story['title'][:50]}...")
                    else:
                        print(f"        Warning: Lesson has only {len(days)} days, skipping")

                except Exception as e:
                    print(f"        Error processing lesson {lesson_id}: {e}")
                    continue

                # Малко забавяне за да не претоварим сървъра
                time.sleep(0.2)

        except Exception as e:
            print(f"    Error processing quarterly {quarter_id}: {e}")
            continue

    return stories


def process_year_stories(year: str, quarterlies: List[Dict[str, Any]], output_dir: str) -> int:
    """
    Обработва всички истории за дадена година.
    Връща броя на добавените истории.
    """
    year_quarterlies = [q for q in quarterlies if extract_year_from_quarter_id(q.get('id', '')) == year]
    stories = fetch_stories_for_quarterlies(year, year_quarterlies)

    # Записване на историите за годината
    if stories:
        output_file = os.path.join(output_dir, f'stories-{year}.json')
        print(f"\n  Saving {len(stories)} stories to stories-{year}.json...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(stories, f, ensure_ascii=False, indent=2)

    return len(stories)

def main():
    """
    Главна функция която:
    - Обхожда всички тримесечия за възрастни
    - Групира ги по години
    - За всяка година проверява дали файлът съществува
    - Ако не съществува, взема всички истории и ги записва
    - За текущата година - проверява дали има нови тримесечия (от index "bg-2026-01-13-inside-story") и ги добавя
    - Създава индексен файл stories-index.json със списък на годините
    """
    import datetime
    current_year = str(datetime.date.today().year)

    try:
        # Определяне на изходна директория
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.join(script_dir, '..', '..', '..')
        output_dir = os.path.join(project_root, 'public', 'json')
        os.makedirs(output_dir, exist_ok=True)
        
        print("Fetching all adult quarterlies...")
        quarterlies = get_all_quarterlies()
        print(f"Found {len(quarterlies)} adult quarterlies")
        
        # Групиране на тримесечията по години (само 2024 и по-нови)
        years = {}
        for q in quarterlies:
            year = extract_year_from_quarter_id(q.get('id', ''))
            # Филтриране само на години >= 2024
            if year.isdigit() and int(year) >= 2024:
                if year not in years:
                    years[year] = []
                years[year].append(q)
        
        print(f"\nFound {len(years)} unique years (2024+): {sorted(years.keys(), reverse=True)}")
        
        # Обработка на всяка година
        years_index = []
        for year in sorted(years.keys(), reverse=True):
            output_file = os.path.join(output_dir, f'stories-{year}.json')
            
            if os.path.exists(output_file):
                # Зареждане на съществуващите истории
                try:
                    with open(output_file, 'r', encoding='utf-8') as f:
                        existing_stories = json.load(f)
                except Exception:
                    existing_stories = []

                if year == current_year:
                    # За текущата година: проверяваме за липсващи тримесечия
                    # Форматът на index е: "bg-2026-01-13-inside-story" => тримесечието е "2026-01"
                    import re as _re
                    processed_quarters = set()
                    for story in existing_stories:
                        idx = story.get('index', '')
                        m = _re.search(r'bg-(\d{4}-\d{2})-', idx)
                        if m:
                            processed_quarters.add(m.group(1))

                    missing_quarterlies = [q for q in years[year] if q.get('id') not in processed_quarters]

                    if missing_quarterlies:
                        missing_ids = [q.get('id') for q in missing_quarterlies]
                        print(f"\n  Found {len(missing_quarterlies)} new quarter(s) for {year}: {missing_ids}")
                        new_stories = fetch_stories_for_quarterlies(year, missing_quarterlies)
                        all_stories = new_stories + existing_stories
                        print(f"\n  Saving {len(all_stories)} stories to stories-{year}.json...")
                        with open(output_file, 'w', encoding='utf-8') as f:
                            json.dump(all_stories, f, ensure_ascii=False, indent=2)
                        story_count = len(all_stories)
                    else:
                        print(f"\n✓ No new quarters for {year}, skipping...")
                        story_count = len(existing_stories)
                else:
                    print(f"\n✓ File stories-{year}.json already exists, skipping...")
                    story_count = len(existing_stories)
            else:
                # Обработка на историите за годината
                story_count = process_year_stories(year, years[year], output_dir)
            
            # Добавяне в индекса
            if story_count > 0:
                years_index.append({
                    'year': year,
                    'file': f'stories-{year}.json',
                    'count': story_count
                })
        
        # Записване на индексния файл
        index_file = os.path.join(output_dir, 'stories-index.json')
        print(f"\nCreating index file stories-index.json...")
        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump({
                'years': years_index,
                'total_years': len(years_index),
                'last_updated': time.strftime('%Y-%m-%d %H:%M:%S')
            }, f, ensure_ascii=False, indent=2)
        
        print("\n✓ Done!")
        print(f"Total years processed: {len(years_index)}")
        
    except Exception as e:
        print(f"Fatal error: {e}")
        return

if __name__ == "__main__":
    main()