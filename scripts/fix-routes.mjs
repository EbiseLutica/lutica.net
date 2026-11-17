// Cloudflare Pages の _routes.json は、splat (`/xxx/*`) の exclude と重複する個別 exclude があると拒否される。
// アダプタが生成した `dist/_routes.json` から、splat に包含される個別エントリを取り除く。
import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../dist/_routes.json', import.meta.url);
const routes = JSON.parse(readFileSync(path, 'utf8'));

const splats = routes.exclude.filter((p) => p.endsWith('/*')).map((p) => p.slice(0, -1));
routes.exclude = routes.exclude.filter((p) => p.endsWith('/*') || !splats.some((prefix) => p.startsWith(prefix)));

writeFileSync(path, JSON.stringify(routes, null, 2));
console.log(`[fix-routes] exclude: ${routes.exclude.length} entries`);
