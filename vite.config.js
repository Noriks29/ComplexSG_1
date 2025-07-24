import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/js': path.resolve(__dirname, './src/js'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/style': path.resolve(__dirname, './src/style')
    }
  }
})
