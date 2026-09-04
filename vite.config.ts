import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    },
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
        },
        // Don't externalize react-router-dom - let Vite bundle it
        external: [],
      },
      // Ensure dependencies are properly bundled
      commonjsOptions: {
        include: [/node_modules/],
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
