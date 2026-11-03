import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readFileSync } from 'fs'

// `vite preview` serves the same security headers as Vercel, so the e2e suite runs under the real CSP.
// HSTS and upgrade-insecure-requests are left out locally because preview is plain http.
const vercelHeaders = Object.fromEntries(
  JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'))
    .headers.find(h => h.source === '/(.*)').headers
    .filter(h => h.key !== 'Strict-Transport-Security')
    .map(h => [h.key, h.value.replace(/;\s*upgrade-insecure-requests/, '')])
)

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
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    headers: vercelHeaders
  },
  test: {
    // e2e/*.spec.js belongs to Playwright
    include: ['src/**/*.test.{js,jsx}']
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'ui-vendor', test: /node_modules[\\/]lucide-react[\\/]/ },
            { name: 'utils-vendor', test: /node_modules[\\/](clsx|tailwind-merge)[\\/]/ }
          ]
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
})

