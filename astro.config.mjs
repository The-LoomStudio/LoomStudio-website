import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  integrations: [react()],
  vite: {
    // Check/build use production JSX; keep their optimizer cache away from the live dev server.
    cacheDir: `node_modules/.vite-${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`,
  },
});
