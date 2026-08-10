import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/chat': 'https://delhi-heritage-api.onrender.com',
      '/places': 'https://delhi-heritage-api.onrender.com',
      '/login': 'https://delhi-heritage-api.onrender.com',
      '/recommend': 'https://delhi-heritage-api.onrender.com',
      '/bookings': 'https://delhi-heritage-api.onrender.com',
      '/payments': 'https://delhi-heritage-api.onrender.com',
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
    },
    rollupOptions: {
      output: {
        // Split heavy vendor libraries into stable, cacheable chunks so the
        // initial bundle stays small and only loads what each route needs.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          leaflet: ['leaflet', 'react-leaflet'],
          pdf: ['jspdf'],
          animation: ['framer-motion'],
          state: ['zustand', 'i18next', 'react-i18next']
        }
      }
    }
  }
})
