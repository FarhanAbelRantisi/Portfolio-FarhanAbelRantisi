import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    drop: ['console', 'debugger']
  },
  server: {
    port: 5173,
    open: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          spline: ['@splinetool/react-spline', '@splinetool/runtime'],
          supabase: ['@supabase/supabase-js'],
          githubCalendar: ['react-github-calendar']
        }
      }
    }
  }
})

