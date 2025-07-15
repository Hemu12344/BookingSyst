// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss'; // ✅ correct import
import path from 'path'; // ✅ required for resolve

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const backendUrl = env.VITE_BACKEND_URL;

  if (!backendUrl) throw new Error("❌ VITE_BACKEND_URL is missing in .env");

  return {
    base: '/', // ✅ ensures React Router works on refresh
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist', // ✅ required by Render static serve
    },
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  };
});
