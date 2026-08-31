import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { HttpsProxyAgent } from 'https-proxy-agent';

// When an HTTP proxy is configured in the environment (e.g. corporate/network proxy),
// route Vite's dev server proxy requests through it so DNS resolves correctly.
const proxyAgent =
  process.env.https_proxy || process.env.HTTPS_PROXY
    ? new HttpsProxyAgent(
        (process.env.https_proxy || process.env.HTTPS_PROXY) as string
      )
    : undefined;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/sdabg': {
        target: 'https://sdasofia.org',
        changeOrigin: true,
        secure: false,
        ...(proxyAgent && { agent: proxyAgent })
      },
      '/rss': {
        target: 'https://api.sdabg.net',
        changeOrigin: true,
        secure: false,
        ...(proxyAgent && { agent: proxyAgent })
      },
      '/api': {
        target: 'https://api.sdabg.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ...(proxyAgent && { agent: proxyAgent })
      }
    }
  },
  resolve: { alias: [{ find: /^~(.*)$/, replacement: '$1' }] }, //Fixed a build error caused by legacy Webpack tilde (~) imports in react-jinke-music-player's .less files
  plugins: [
    react(),
    tsconfigPaths(), // This plugin will use the paths defined in your tsconfig.json
    svgr(),

    // Return 404 for missing static files instead of falling back to index.html
    {
      name: 'static-file-404',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && /\.(json|xml|txt|pdf|csv)([?#].*)?$/.test(req.url)) {
            // Skip Vite-internal requests: source file transforms, HMR, etc.
            if (
              req.url.startsWith('/src/') ||
              req.url.startsWith('/@') ||
              req.url.includes('?import') ||
              req.url.includes('?v=') ||
              req.url.includes('?t=')
            ) {
              return next();
            }
          const cleanPath = decodeURIComponent(
            req.url.split('?')[0].split('#')[0]
          );
          const rel = cleanPath.slice(1);
            // Check both public/ and project root (e.g. manifest.json lives at root)
            const inPublic = resolve(__dirname, 'public', rel);
            const inRoot = resolve(__dirname, rel);
            if (!existsSync(inPublic) && !existsSync(inRoot)) {
              res.statusCode = 404;
              res.end();
              return;
            }
          }
          next();
        });
      }
    },
    visualizer({ open: false }), // Generate bundle analysis report without auto-opening
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
