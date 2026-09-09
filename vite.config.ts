import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Match the existing iOS 15 deployment target rather than Vite's newer default browser baseline.
  build: { target: 'safari15' },
})
