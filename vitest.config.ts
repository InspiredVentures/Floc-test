/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    css: false,
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://mock.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('mock-key'),
  }
});
