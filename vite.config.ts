import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // This plugin will use the paths defined in your tsconfig.json
    svgr(),

    visualizer({ open: true }), // Opens a report in the browser after build
    VitePWA({
      registerType: 'autoUpdate',
      srcDir: 'src',
      filename: 'sw.js',
      strategies: 'injectManifest', // Use your custom service worker
      injectRegister: 'auto',
      devOptions: {
        enabled: false // Disable Service Worker in development
      }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sw: resolve(__dirname, 'src/sw.js')
      },
      output: {
        assetFileNames: 'assets/[name].[hash][extname]', // Ensure assets are placed in the assets folder
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    },
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false, // Disable source map generation to exclude .map.js files
    copyPublicDir: true // Enable copying of the public folder
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // set react-jinke-music-player variables
          // Primary theme colors using your ming palette
          'primary-color': '#007f98', // $mingColor for active elements (track, handle)
          'primary-color-light': '#ffffff', // White text color
          'primary-color-dark': '#4a4a4a', // $grayDarkColor for dark background

          // Background colors
          'bg-color': '#ffffff', // White main background
          'panel-bg': '#4a4a4a', // $grayDarkColor - dark panel background
          'panel-bg-dark': '#4a4a4a', // $grayDarkColor - main panel background
          'panel-bg-mobile': '#4a4a4a', // $grayDarkColor - mobile panel background
          'panel-bg-light': '#f5f5f5', // $lightGrayColor for light panels
          'controller-bg-light': '#f5f5f5', // $lightGrayColor for controller

          // Text colors
          'font-color': '#002938', // $mingDarkestColor for dark text
          'base-color': '#f5f5f5', // Light gray for progress track base - no transparency

          // Progress bar colors - correct variable names
          'progress-bar-bg-color-light': '#f5f5f5', // Light gray for progress track (light mode)
          'progress-bar-bg-color-dark': '#f5f5f5', // Light gray for progress track (dark mode)
          'progress-load-bar-bg-color': '#d0d0d0', // Medium gray for load bar track (dark mode)
          'progress-load-bar-bg-color-light': '#d0d0d0', // Medium gray for load bar track (light mode)

          // Lyric colors
          'player-lyric-color': '#9ae1f0' // $lighterMingColor
        },
        javascriptEnabled: true
      }
    }
  }
});
