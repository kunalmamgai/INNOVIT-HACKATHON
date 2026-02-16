import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/chat': 'http://127.0.0.1:8000',
      '/places': 'http://127.0.0.1:8000',
      '/login': 'http://127.0.0.1:8000',
      '/recommend': 'http://127.0.0.1:8000',
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    terserOptions: {
      compress: { drop_console: true }
    }
  }
})
