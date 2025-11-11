import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // Use '/' for Vercel, '/DoktorABC-Mock/' for GitHub Pages
  // Vercel sets VERCEL=1 and VERCEL_URL during builds
  // GitHub Actions sets CI=true
  base: (process.env.VERCEL || process.env.VERCEL_URL) 
    ? '/' 
    : (process.env.CI && process.env.NODE_ENV === 'production' 
      ? '/DoktorABC-Mock/' 
      : '/'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true
  }
})

