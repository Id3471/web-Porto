import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { BACKEND_URL } = loadEnv(mode, '.', '')
  const backendUrl = BACKEND_URL || 'http://127.0.0.1:8000'

  return {
    base: '/web-Porto/',
    plugins: [react()],
    server: {
      proxy: {
        '/admin-api': backendUrl,
        '/contact': backendUrl,
        '/cv': backendUrl,
        '/portfolio-content': backendUrl,
      },
    },
  }
})
