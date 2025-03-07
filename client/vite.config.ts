import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist", // Ensure Vite outputs to 'dist'
  },
  server: {
    port: 5173, // Local development port (not used in prod)
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Your Go backend during development
        changeOrigin: true,
      },
    },
  },
});
