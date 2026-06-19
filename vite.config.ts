import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'd3-bundle': ['d3'],
          'monaco-bundle': ['@monaco-editor/react'],
        },
      },
    },
  },
})
