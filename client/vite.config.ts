import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({ registerType: 'autoUpdate' })],
  base: 'https://getinstamedia.d1r0l.xyz',
  build: {
    outDir: 'build'
  },
  server: {
    port: 3001
  }
})
