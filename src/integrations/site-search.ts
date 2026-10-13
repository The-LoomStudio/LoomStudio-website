import type { AstroIntegration } from 'astro';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { createIndex, close } from 'pagefind';
import { items, journeys, regions } from '../components/architecture-map/map-data';
import { concepts } from '../components/architecture-map/concepts';

function assertIndexed(result: { errors: unknown[] }) {
  if (result.errors.length) throw new Error(`Search index: ${JSON.stringify(result.errors)}`);
}

export default function siteSearch(): AstroIntegration {
  let output: URL;
  return { name: 'loom-site-search', hooks: {
    'astro:config:done': ({ config }) => { output = config.outDir; },
    'astro:server:setup': ({ server }) => {
      // Dev serves the last production index; rebuilding updates it without copying into public/.
      server.middlewares.use(async (request, response, next) => {
        const path = request.url?.split('?')[0] ?? '';
        if (!/^\/pagefind\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+$/.test(path)) return next();
        try {
          const data = await readFile(new URL(`.${path}`, output));
          response.setHeader('Content-Type', path.endsWith('.js') ? 'text/javascript' : 'application/octet-stream');
          response.end(data);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT') return next();
          next(error as Error);
        }
      });
    },
    'astro:build:done': async ({ dir, logger }) => {
      const { index, errors } = await createIndex({ excludeSelectors: ['header.site-controls', '.route-menu', '.site-search', 'footer', 'script', 'style', '[data-pagefind-ignore]'] });
      assertIndexed({ errors });
      if (!index) throw new Error('Search index was not created');
      try {
        const root = fileURLToPath(dir);
        const files = await readdir(root, { recursive: true, withFileTypes: true });
        for (const file of files) {
          if (!file.isFile() || !file.name.endsWith('.html')) continue;
          const path = join(file.parentPath, file.name);
          const route = '/' + relative(root, path).replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
          if (route === '/404' || route === '/docs/architecture') continue;
          const html = await readFile(path, 'utf8');
          const section = route === '/news' ? 'news' : route.startsWith('/docs') ? 'docs' : 'pages';
          if (section === 'news') {
            // News cards have explicit stable ids; index each card as its own destination.
            for (const match of html.matchAll(/<article\b[^>]*\bid="(news-[^"]+)"[^>]*>[\s\S]*?<\/article>/g)) {
              assertIndexed(await index.addHTMLFile({ url: `/news#${match[1]}`, content:
                `<html lang="zh"><body data-pagefind-body data-pagefind-filter="section:news">${match[0].replace('<h2', '<h2 data-pagefind-meta="title"')}</body></html>` }));
            }
          } else {
            assertIndexed(await index.addHTMLFile({ url: route, content: html.replace('<main', `<main data-pagefind-body data-pagefind-filter="section:${section}"`) }));
          }
        }
        const records = [
          ...items.map(item => ({ id: `module=${encodeURIComponent(item.id)}`, title: item.title, content: `${item.summary} ${item.detail} ${item.boundary}` })),
          ...Object.entries(concepts).map(([name, concept]) => ({ id: `concept=${encodeURIComponent(name)}`, title: name,
            content: `${concept.summary} ${concept.detail} ${concept.fields.map(field => `${field.name} ${field.meaning}`).join(' ')}` })),
          ...journeys.map(journey => ({ id: `journey=${encodeURIComponent(journey.id)}`, title: journey.title,
            content: `${journey.summary} ${journey.boundary} ${journey.steps.map(step => `${step.title} ${step.detail}`).join(' ')}` })),
          ...regions.map(region => ({ id: `module=${encodeURIComponent(region.id)}`, title: region.title, content: region.subtitle })),
        ];
        for (const record of records) assertIndexed(await index.addCustomRecord({
          url: `/docs/architecture#${record.id}`, language: 'zh', content: `${record.title} ${record.content}`,
          meta: { title: record.title }, filters: { section: ['architecture'] },
        }));
        assertIndexed(await index.writeFiles({ outputPath: join(root, 'pagefind') }));
        logger.info(`Indexed public pages and ${records.length} architecture destinations.`);
      } finally { await index.deleteIndex(); await close(); }
    },
  } };
}
