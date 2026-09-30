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
      workbox: {
        globPatterns: ['**/*.{js,css,html,wasm,svg,json,woff,woff2,eot,ttf,png,jpg}'],
        maximumFileSizeToCacheInBytes: 20000000,
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
