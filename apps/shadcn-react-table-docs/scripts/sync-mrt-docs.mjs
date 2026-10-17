#!/usr/bin/env node
/**
 * Sync MRT docs pages into this fumadocs app.
 *
 * Reads ../material-react-table-docs/pages/docs/**\/*.mdx and writes
 * content/docs/<same relative path>.mdx, plus:
 *   - lib/routes.ts            (MRT components/navigation/routes.ts, text-mapped)
 *   - content/docs/meta.json   (sidebar order, from routes.ts)
 *   - content/docs/<section>/meta.json for every /docs/<section> route
 *
 * Usage:
 *   node scripts/sync-mrt-docs.mjs                     # all pages
 *   node scripts/sync-mrt-docs.mjs index.mdx getting-started/install.mdx
 *
 * Everything not listed in the tables below is copied verbatim.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const MRT_DIR = path.resolve(APP_DIR, '..', 'material-react-table-docs');
const MRT_PAGES = path.join(MRT_DIR, 'pages', 'docs');
const MRT_ROUTES = path.join(MRT_DIR, 'components', 'navigation', 'routes.ts');
const OUT_PAGES = path.join(APP_DIR, 'content', 'docs');
const OUT_ROUTES = path.join(APP_DIR, 'lib', 'routes.ts');

const REGISTRY_INSTALL =
  'pnpm dlx shadcn@latest add anindosarker/shadcn-react-table/shadcn-react-table';

/**
 * Text replacements, applied in order to page bodies, titles, descriptions
 * and routes.ts. Order matters: longer / more specific patterns first.
 */
const TEXT_MAP = [
  ['Material React Table', 'Shadcn React Table'],
  ['material-react-table', 'shadcn-react-table'],
  ['MaterialReactTable', 'ShadcnReactTable'],
  ['Material UI', 'shadcn/ui'],
  ['MUI', 'shadcn/ui'],
  ['MRT', 'SRT'],
  ['mrt', 'srt'],
  // MRT's npm install tabs become the shadcn registry command.
  [/<InstallCommand\b[^>]*\/>/g, '```bash\n' + REGISTRY_INSTALL + '\n```'],
];

/** Replacements applied only to the page title (from <Head><title>). */
const TITLE_MAP = [
  [/ - Material React Table V\d Docs$/, ''],
  [/\bV3\b/g, 'V1'],
];

/**
 * Relative imports. Keys are path fragments; a matching import is rewritten
 * to the value, or dropped when the value is null (components are resolved
 * through components/mdx.tsx instead).
 */
const IMPORT_MAP = {
  'next/head': null,
  'components/navigation/routes': '@/lib/routes',
};

function applyMap(text, map) {
  return map.reduce(
    (acc, [from, to]) =>
      from instanceof RegExp ? acc.replace(from, to) : acc.replaceAll(from, to),
    text,
  );
}

function rewriteImports(src) {
  const importRe = /^import[\s\S]*?from\s+['"]([^'"]+)['"];?[ \t]*\n/gm;
  return src.replace(importRe, (stmt, spec) => {
    if (spec === 'next/head') return '';
    if (!spec.startsWith('.')) return stmt;
    const hit = Object.entries(IMPORT_MAP).find(([k]) => spec.includes(k));
    if (!hit) return '';
    const [, target] = hit;
    if (target === null) return '';
    return stmt.replace(spec, target);
  });
}

function extractHead(src) {
  const m = src.match(/<Head>([\s\S]*?)<\/Head>\s*\n?/);
  if (!m) return { body: src, title: '', description: '' };
  const head = m[1];
  const t = head.match(
    /<title>\s*(?:\{\s*['"`])?([\s\S]*?)(?:['"`]\s*\})?\s*<\/title>/,
  );
  const d = head.match(
    /<meta\s+name="description"\s+content=(?:"([^"]*)"|\{\s*['"`]([\s\S]*?)['"`]\s*\})/,
  );
  return {
    body: src.replace(m[0], ''),
    title: (t?.[1] ?? '').trim(),
    description: (d?.[1] ?? d?.[2] ?? '').replace(/\s+/g, ' ').trim(),
  };
}

function yamlString(s) {
  return JSON.stringify(s);
}

async function syncPage(rel) {
  const src = await fs.readFile(path.join(MRT_PAGES, rel), 'utf8');
  const { body, title, description } = extractHead(src);
  const fmTitle = applyMap(applyMap(title, TITLE_MAP), TEXT_MAP);
  const fmDesc = applyMap(description, TEXT_MAP);
  let out = rewriteImports(body);
  out = applyMap(out, TEXT_MAP);
  out = out.replace(/^\s*\n/, '');
  const frontmatter = ['---', `title: ${yamlString(fmTitle)}`];
  if (fmDesc) frontmatter.push(`description: ${yamlString(fmDesc)}`);
  frontmatter.push('---', '');
  const dest = path.join(OUT_PAGES, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, frontmatter.join('\n') + '\n' + out);
  return { rel, title: fmTitle };
}

async function listPages() {
  const out = [];
  async function walk(dir) {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name.endsWith('.mdx')) out.push(path.relative(MRT_PAGES, p));
    }
  }
  await walk(MRT_PAGES);
  return out.sort();
}

async function loadRoutes() {
  const raw = await fs.readFile(MRT_ROUTES, 'utf8');
  const mapped = applyMap(raw, TEXT_MAP);
  await fs.mkdir(path.dirname(OUT_ROUTES), { recursive: true });
  await fs.writeFile(OUT_ROUTES, mapped);
  // Evaluate the TS file as JS: drop the type block and the annotation.
  const js = mapped
    .replace(/export type RouteItem = \{[\s\S]*?\};\n/, '')
    .replace(/export const routes: Array<RouteItem> =/, 'return');
  return new Function(js)();
}

/** fumadocs meta.json files mirroring MRT's sidebar sections. */
async function writeMeta(routes) {
  const sections = routes.filter(
    (r) => r.href?.startsWith('/docs/') && Array.isArray(r.items),
  );
  const rootPages = ['index', ...sections.map((s) => s.href.split('/')[2])];
  await fs.mkdir(OUT_PAGES, { recursive: true });
  await fs.writeFile(
    path.join(OUT_PAGES, 'meta.json'),
    JSON.stringify({ title: 'Docs', pages: rootPages }, null, 2) + '\n',
  );
  const warnings = [];
  for (const section of sections) {
    const folder = section.href.split('/')[2];
    const prefix = `/docs/${folder}/`;
    const pages = [];
    const push = (item) => {
      if (!item.href || item.external) return;
      if (item.href.startsWith(prefix)) {
        pages.push(item.href.slice(prefix.length).split('#')[0]);
      } else if (!item.href.includes('#')) {
        warnings.push(`${folder}: skipped cross-section link ${item.href}`);
      }
    };
    for (const item of section.items) {
      if (item.secondaryItems) {
        pages.push(`---${item.label}---`);
        item.secondaryItems.forEach(push);
      } else {
        push(item);
      }
    }
    const dir = path.join(OUT_PAGES, folder);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, 'meta.json'),
      JSON.stringify(
        { title: section.label, defaultOpen: true, pages: [...new Set(pages)] },
        null,
        2,
      ) + '\n',
    );
  }
  return { sections: sections.map((s) => s.label), warnings };
}

async function main() {
  const allow = process.argv.slice(2).map((p) => p.replace(/^\.?\//, ''));
  const pages = allow.length ? allow : await listPages();
  const routes = await loadRoutes();
  const meta = await writeMeta(routes);
  const done = [];
  for (const rel of pages) done.push(await syncPage(rel));
  console.log(`routes -> ${path.relative(APP_DIR, OUT_ROUTES)}`);
  console.log(`meta.json sections: ${meta.sections.join(', ')}`);
  for (const w of meta.warnings) console.log(`warn: ${w}`);
  for (const d of done) console.log(`page  ${d.rel}  (title: ${d.title})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
