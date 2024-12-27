import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import sass from 'sass-embedded';
import {visualizer}  from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass, // Use the imported module
      },
    },
  },
  plugins: [
    react(),
    tsconfigPaths(), // This plugin will use the paths defined in your tsconfig.json
    svgr(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    visualizer({ open: true }), // Opens a report in the browser after build
  ],
  build: {
    rollupOptions: {
      external: ['react-router-dom'], // Mark as external, to prevents Vite from bundling them in both this app and the local alps library
    }
  }
  // optimizeDeps: {
  //   include: ['@mui/material', '@mui/system', 'react-router-dom'],
  // },
});
