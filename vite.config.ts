import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cache-Control': 'no-store',
      // Removed Cross-Origin-Opener-Policy - it was blocking Google OAuth popup postMessage
      // If you need COOP for security, use: 'Cross-Origin-Opener-Policy': 'unsafe-none'
    },
  },
});
