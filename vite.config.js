import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss(),],
    server: {
    port: 3000,
  },
    css: {
    modules: {
      // make sure App.css is not treated as module
      scopeBehaviour: 'local', // or 'global' for default
    },
  },
})
