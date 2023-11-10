import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port: 3000,
  },
  plugins: [react(),
    VitePWA({ registerType: "autoUpdate"})
  ],
})
