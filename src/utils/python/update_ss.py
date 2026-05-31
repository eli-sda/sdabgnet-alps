"""
Стартира последователно:
  1. extract_ss_meta.py  – обновява ss-meta.json
  2. generate_ss_covers.py – генерира landscape корици

Използване:
    python update_ss.py
"""

import subprocess
import sys
import os

# Auto-install Pillow if missing
try:
    import PIL  # noqa: F401
except ImportError:
    print('Pillow not found. Installing...')
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'Pillow', '-q'])

script_dir = os.path.dirname(os.path.abspath(__file__))

steps = [
    ('extract_ss_meta.py',  'Extracting SS metadata...'),
    ('generate_ss_covers.py', 'Generating landscape covers...'),
]

for script, label in steps:
    print(f'\n{"="*50}')
    print(f'  {label}')
    print(f'{"="*50}')
    result = subprocess.run(
        [sys.executable, os.path.join(script_dir, script)],
        check=False
    )
    if result.returncode != 0:
        print(f'\nERROR: {script} exited with code {result.returncode}. Stopping.')
        sys.exit(result.returncode)

print('\n✓ All done!')
