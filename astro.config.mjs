import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import siteSearch from './src/integrations/site-search.ts';

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  integrations: [react(), siteSearch()],
  vite: {
    // Check/build use production JSX; keep their optimizer cache away from the live dev server.
    cacheDir: `node_modules/.vite-${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`,
  },
});
