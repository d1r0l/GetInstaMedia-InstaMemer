import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    mkcert({ savePath: '../certs' }),
    VitePWA({ registerType: 'autoUpdate' })
  ],
  base: 'https://getinstamedia.d1r0l.xyz',
  build: {
    outDir: 'build'
  },
  server: {
    port: 3001,
    https: true,
    proxy: {
      '/api': {
        target: 'https://192.168.1.5:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
