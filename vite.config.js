import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
        crypto: true
      }
    })],
  optimizeDeps: {
    exclude: ['crypto'],
    include: ['xlsx-js-style', 'vue-json-pretty']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/js': path.resolve(__dirname, './src/js'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/style': path.resolve(__dirname, './src/style')
    }
  },
  publicDir: 'public', // убедитесь что это указано
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Копируем все из public в dist
    copyPublicDir: true
  },
})
