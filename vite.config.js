import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5176, // chatig-front uses 5173
    // Mini App is served through an ngrok tunnel in dev; allow those hosts so
    // Vite doesn't block the request. '.ngrok-free.app' matches any subdomain
    // (ngrok URLs change each restart on the free plan).
    allowedHosts: ['.ngrok-free.app', '.ngrok.app'],
    // Backend'ni alohida tunnel orqali ochish shart bo'lmasligi uchun /api ni
    // shu dev-server o'zi localhost:8080 (Laravel) ga proxy qiladi. Shunda faqat
    // bitta tunnel (frontend) kerak va CORS muammosi yo'q.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
