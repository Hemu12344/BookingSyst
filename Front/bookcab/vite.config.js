import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // ✅ Vite-native plugin

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const backendUrl = env.VITE_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("❌ VITE_BACKEND_URL is not defined in .env");
  }

  const isDev = mode === 'development';

  return {
    server: isDev
      ? {
          proxy: {
            '/api': {
              target: backendUrl,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          },
        }
      : undefined,
    plugins: [
      react(),
      tailwindcss() // ✅ Add Tailwind Vite plugin directly
    ],
  };
});
