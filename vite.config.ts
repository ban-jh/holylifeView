import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 38080,
    proxy: {
      '/api': {
        target: 'http://localhost:38081',
        changeOrigin: true,
      },
      '/swagger-ui': {
        target: 'http://localhost:38081',
        changeOrigin: true,
      },
      '/v3/api-docs': {
        target: 'http://localhost:38081',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  base: '/',
})