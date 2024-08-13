import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [
      react(),
      mkcert({ savePath: '../certs' }),
      VitePWA({ registerType: 'autoUpdate' })
    ],
    base: process.env.VITE_BASE_URL || '/',
    build: {
      outDir: 'build',
      manifest: 'manifest.webmanifest'
    },
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: process.env.VITE_DEV_BACK_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        }
      }
    }
  })
}
