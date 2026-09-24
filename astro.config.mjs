// https://astro.build/config
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const SITE_URL = 'https://mengkong30.github.io';
const base = process.env.GITHUB_ACTIONS === 'true' || process.env.DEPLOY_PAGES === 'true' ? '/codex' : '';
// Existing content uses site-root URLs. Rebase the generated static files so
// local previews stay at / while Pages lives under /codex/.
const pagesPaths = {
  name: 'pages-content-paths',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (!base) return;
      async function visit(folder) {
        for (const entry of await readdir(folder, { withFileTypes: true })) {
          const path = join(folder, entry.name);
          if (entry.isDirectory()) await visit(path);
          else if (/\.(html|css|js|xml|json)$/.test(entry.name)) {
            const input = await readFile(path, 'utf8');
            const output = input
              .replace(/(["'`(])\/(?!\/|codex(?:\/|["'`)]))(?=(?:assets|project|blog|plugins|ricocc|rss|_astro|sitemap|favicon|og\.|preview\.))/g, '$1' + base + '/')
              .replace(/(href=["'])\/(["'])/g, '$1' + base + '/$2');
            if (output !== input) await writeFile(path, output);
          }
        }
      }
      await visit(fileURLToPath(dir));
    }
  }
};
export default defineConfig({
	server: { port: 4322 },
  markdown: {
    shikiConfig: {
    theme: "github-dark",
    wrap: true,
    }
  },
  envPrefix: 'PUBLIC_',
  site: SITE_URL,
  base: base || '/',
  integrations: [sitemap(), mdx(), pagesPaths],
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern",
      },
    },
  },
})
