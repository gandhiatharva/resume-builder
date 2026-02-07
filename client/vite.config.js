import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// here we have imported tailwind, we have taken this directly from documentation portion 
// to use tailwind with vite

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
