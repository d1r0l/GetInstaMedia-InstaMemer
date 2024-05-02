import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'https://getinstamedia.d1r0l.xyz',
  build: {
    outDir: 'build'
  },
  server: {
    port: 3001
  }
})
