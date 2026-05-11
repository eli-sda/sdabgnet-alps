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

## Project Scripts

The following npm scripts are available for working with Sabbath School data:

### Extract Sabbath School Missionary Stories

- **Command:** `npm run update-ss-stories`
- **Runs:** `python src/utils/python/extract_stories.py`
- **Description:** Extracts missionary stories from the Adventech API and saves them to `public/json/stories-YYYY.json` and `public/json/stories-index.json`.
- **Requirements:** Python 3.x (no extra packages needed)

### Update Sabbath School Metadata and Covers

- **Command:** `npm run update-ss`
- **Runs:** `python src/utils/python/update_ss.py`
- **Description:**
  1. Downloads and updates all Sabbath School metadata from the Adventech API into `public/json/ss-meta.json`.
  2. Generates landscape (1200×630) Open Graph covers for each quarter in `public/img/ss-covers/`.
  3. Auto-installs Pillow if missing.
- **Requirements:** Python 3.x, Pillow (auto-installed if missing)

You can run these scripts from the project root:

```bash
npm run update-ss-stories
npm run update-ss
```

The scripts will use your default Python interpreter. If you use a virtual environment, activate it first.
