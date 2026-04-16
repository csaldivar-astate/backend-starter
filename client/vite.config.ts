import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', '');
  const backendPort = env.PORT || '3000';

  return {
    plugins: [sveltekit()],
    server: {
      port: 5173,
      strictPort: false,
      proxy: {
        '/api': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true
        }
      }
    }
  };
});
