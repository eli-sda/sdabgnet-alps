import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import sass from 'sass-embedded';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass // Use the imported module
      }
    }
  },

  plugins: [
    react(),
    tsconfigPaths(), // This plugin will use the paths defined in your tsconfig.json
    svgr(),

    visualizer({ open: true }) // Opens a report in the browser after build
  ]
});
