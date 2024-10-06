import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/jira-api': {
        target: 'https://your-jira-instance.atlassian.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jira-api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['axios']
  }
})
