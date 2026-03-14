import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cache-Control': 'no-store',
      // Required for Google OAuth popup - allows postMessage from OAuth popup to parent
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
});
