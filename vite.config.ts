import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    VueI18nPlugin({
      include: [path.resolve(import.meta.dirname, './src/locales/**')]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      // The default is a blocking <script> in <head>; registering the SW can wait
      injectRegister: 'script-defer',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,json,woff,woff2,eot,ttf,png,jpg}'],
        // The demo images come in ten widths each, but a visitor only ever sees the two
        // their srcset picks, so cache those on use instead of precaching ~7 MB up front
        globIgnores: ['assets/404.html', 'assets/images/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/assets/images/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'demo-images',
              expiration: { maxEntries: 20 }
            }
          },
          {
            // Ghostscript is 19 MB and only needed for PDFs, so it is cached on first use
            // instead of being precached for every visitor. Only a real wasm response is
            // cached, never an SPA fallback served for it mid-deploy
            urlPattern: ({ url }) => url.pathname.endsWith('.wasm'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'ghostscript',
              cacheableResponse: {
                statuses: [200],
                headers: { 'content-type': 'application/wasm' }
              },
              // The file name is hashed, so a new build replaces the previous one
              expiration: { maxEntries: 1 }
            }
          }
        ],
        // Give hashed assets a revision too, so they are precached with `cache: 'reload'`
        // and never from a stale HTTP cache entry (e.g. an SPA fallback served mid-deploy)
        dontCacheBustURLsMatching: undefined,
        navigateFallbackDenylist: [/^\/api\//]
      },
      manifest: false,
      devOptions: {
        enabled: true
      }
    })
  ],
  server: {
    // The live counter Worker, started with `pnpm dev:counter`
    proxy: {
      '/api': { target: 'http://localhost:8787', ws: true, changeOrigin: true }
    }
  },
  build: {
    // odometer's default theme ships legacy IE `*property` hacks that Lightning CSS
    // (Vite's default CSS minifier) rejects, so keep minifying CSS with esbuild
    cssMinify: 'esbuild'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
