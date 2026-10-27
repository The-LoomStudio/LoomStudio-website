import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import siteSearch from './src/integrations/site-search.ts';

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  integrations: [react(), siteSearch(), {
    name: 'loom-logo-transition-preview',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev') return;
        injectRoute({ pattern: '/dev/preview/logo-transition', entrypoint: './src/dev-preview/logo-transition.astro' });
        injectRoute({ pattern: '/dev/preview/text-logo', entrypoint: './src/dev-preview/text-logo.astro' });
        injectRoute({ pattern: '/dev/preview/setting-composition', entrypoint: './src/dev-preview/setting-composition.astro' });
        injectRoute({ pattern: '/dev/preview/story-branching', entrypoint: './src/dev-preview/story-branching.astro' });
      },
    },
  }],
  vite: {
    // Check/build use production JSX; keep their optimizer cache away from the live dev server.
    cacheDir: `node_modules/.vite-${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`,
  },
});
