import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
export default defineConfig(({ mode }) => {
  // Load .env or .env.production
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const backendUrl = env.VITE_BACKEND_URL;

  if (!backendUrl) {
    throw new Error(`
❌ Missing VITE_BACKEND_URL in .env or .env.${mode}
✅ Add this to your .env:
VITE_BACKEND_URL=http://localhost:5000
    `);
  }

  return {
    base: '/', // optional if deployed at root
    plugins: [react(),tailwindcss()],
    build: {
      outDir: 'dist',  // ✅ This keeps dist inside /Front/bookcab
      emptyOutDir: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      }
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~': path.resolve(__dirname, './public')
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    }
  };
});
