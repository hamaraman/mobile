import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // 5173 falls inside a Windows reserved port range on this machine, so the
    // default bind fails with EACCES. 3000 sits outside the excluded ranges.
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
  },
})
