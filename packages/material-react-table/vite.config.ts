import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), (await import('@tailwindcss/vite')).default()],
}));
