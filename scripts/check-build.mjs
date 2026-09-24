import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
const root = 'dist';
const failures = [];
let checked = 0;
async function walk(dir) {
  for (const item of await readdir(dir, {withFileTypes:true})) {
    const path = join(dir,item.name);
    if (item.isDirectory()) await walk(path);
    else if (item.name.endsWith('.html')) {
      const text = await readFile(path,'utf8');
      for (const match of text.matchAll(/(?:href|src|poster|data-src)=["']([^"']+)["']/g)) {
        const url = match[1];
        if (!url.startsWith('/') || url.startsWith('//')) continue;
        checked++;
        if (url.startsWith('/codex/')) { failures.push(`${path}: obsolete /codex/ link ${url}`); continue; }
        const local = join(root, decodeURIComponent(url.slice(1).split(/[?#]/)[0]));
        try { await stat(local); } catch { failures.push(`${path}: missing ${url}`); }
      }
      if (/mcp\.figma\.com\/mcp|localhost:4322/.test(text)) failures.push(`${path}: development URL`);
    }
  }
}
await walk(root);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Passed: ${checked} local URL references across generated HTML.`);
