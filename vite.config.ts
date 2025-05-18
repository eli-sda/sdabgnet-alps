import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';

// Generate a unique cache version based on the current timestamp
const cacheVersion = `v${Date.now()}`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // This plugin will use the paths defined in your tsconfig.json
    svgr(),

    visualizer({ open: true }), // Opens a report in the browser after build
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/index.html', // Ensure navigation requests fallback to index.html
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/new\.sdabg\.net\/.*$/,
            handler: 'NetworkFirst', // Use NetworkFirst strategy for dynamic content
            options: {
              cacheName: `dynamic-content-${cacheVersion}`,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400
              }
            }
          }
        ]
      },
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
  }
});
