import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // the Arena live-preview proxy uses a dynamic *.e2b.app host — allow it
    allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
    cors: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
    cors: true,
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
});
