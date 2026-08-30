import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    cssTarget: ['chrome87', 'firefox78', 'safari13', 'edge88'],
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        pure_funcs: [],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase': ['@supabase/supabase-js'],
          'emailjs': ['@emailjs/browser'],
        },
      },
    },
  },
  server: {
    host: true,
  },
  preview: {
    host: true,
  },
});
