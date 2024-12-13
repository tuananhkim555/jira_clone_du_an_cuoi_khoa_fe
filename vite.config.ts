import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vercel from 'vite-plugin-vercel';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercel()],
  server: {
    proxy: {
      '/jira-api': {
        target: 'https://your-jira-instance.atlassian.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jira-api/, ''),
      },
    },
    port: process.env.PORT as unknown as number,
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
