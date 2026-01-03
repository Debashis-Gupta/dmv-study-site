import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If deploying to GitHub Pages at https://USERNAME.github.io/REPO_NAME/,
// set base to '/REPO_NAME/'.
// For local dev, this doesn't matter.
export default defineConfig({
  plugins: [react()],
  base: '/dmv-study-site/',
})
