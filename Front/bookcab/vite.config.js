import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  // ✅ Safely extract your backend URL from .env
  const backendUrl = env.VITE_BACKEND_URL;

  // 🚨 Debug log (see terminal)
  console.log('🌐 VITE_BACKEND_URL:', backendUrl);

  // ❌ If URL is missing, stop the build with clear error
  if (!backendUrl) {
    throw new Error("❌ VITE_BACKEND_URL is not defined in .env");
  }

  return {
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [react(), tailwindcss()],
  };
});
