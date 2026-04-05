# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

If you want to view the bundle analysis after the build:
``npm run build``, you can manually open the generated [stats.html](stats.html) file in your browser.

## Python Scripts

### Extract Missionary Stories Script

The project includes a Python script to extract missionary stories from the Adventist Sabbath School API:

**Location:** `src/utils/python/extract_stories.py`

**What it does:**
1. Fetches all adult quarterlies (without -cq and -cc suffix) from the Adventech API
2. Filters only years from 2024 onwards
3. For each quarterly, retrieves all lessons (sorted from newest to oldest)
4. For each lesson, extracts the 8th day (index 7) - the missionary story
5. Extracts data from each story: `date`, `bible`, `content`, `title`
6. Saves stories in separate JSON files by year (e.g., `stories-2024.json`, `stories-2025.json`)
7. Creates an index file `stories-index.json` with a list of all available years
8. **Smart caching:** If a year's file already exists, it skips re-fetching the data

**Usage:**
```bash
# From the script directory
cd src/utils/python
python extract_stories.py

# Or from project root
python src/utils/python/extract_stories.py
```

**Requirements:** Python 3.x (uses only built-in libraries: `json`, `urllib`, `os`, `time`)

**Output:** 
- `public/json/stories-YYYY.json` - Stories for each year (2024+)
- `public/json/stories-index.json` - Index file with metadata about all years

**Index file structure:**
```json
{
  "years": [
    {
      "year": "2025",
      "file": "stories-2025.json",
      "count": 52
    }
  ],
  "total_years": 2,
  "last_updated": "2026-01-25 12:30:45"
}
```