#!/usr/bin/env node
// Usage (inside packages/shadcn-react-table): pnpm registry:build
// Generates registry.json from the library tree, then `shadcn build` turns it
// into public/r/<name>.json. The file list is never hand-maintained: every
// file under src/components/ui/shadcn-react-table is an item file, every
// `@/components/ui/<name>` import is a registryDependency, and the SRT-only
// CSS rules in src/index.css ship through the item's `css` field.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB_REL = 'src/components/ui/shadcn-react-table';
const LIB_DIR = path.join(PKG, LIB_REL);
const CHECKBOX_REL = 'src/components/ui/checkbox.tsx';
const CSS_FILE = path.join(PKG, 'src/index.css');
const OUT = path.join(PKG, 'registry.json');

const ITEM = 'shadcn-react-table';
const GITHUB_REPO = 'anindosarker/shadcn-react-table';
const HOMEPAGE = `https://github.com/${GITHUB_REPO}`;
// Locale items depend on the main item. A bare name would resolve to
// shadcn/ui's own registry, so the dependency is the GitHub item address,
// which the CLI resolves through the root registry.json of the repo.
// Override for a local install test against `pnpm registry:serve`:
//   REGISTRY_BASE_URL=http://localhost:5310/r pnpm registry:build
const MAIN_ITEM_ADDRESS = process.env.REGISTRY_BASE_URL
  ? `${process.env.REGISTRY_BASE_URL}/${ITEM}.json`
  : `${GITHUB_REPO}/${ITEM}`;
// Forked ui parts ship inside the item instead of being registryDependencies.
const FORKED_UI = new Set(['checkbox']);
// npm packages the library imports (bare specifiers). Pinned ones take their
// version from package.json so the registry never drifts from what is tested
// here; the rest stay unversioned so the CLI keeps whatever the user has
// (a pinned lucide-react@^0.544 would downgrade a fresh shadcn init).
const NPM_DEPS = [
  { name: '@tanstack/react-table', pinned: true },
  { name: '@tanstack/react-virtual', pinned: true },
  { name: '@tanstack/match-sorter-utils', pinned: true },
  { name: 'highlight-words', pinned: true },
  { name: 'class-variance-authority' },
  { name: 'lucide-react' },
  { name: 'radix-ui' },
];
const NPM_DEV_DEPS = [{ name: 'tw-animate-css' }];

const pkgJson = JSON.parse(
  fs.readFileSync(path.join(PKG, 'package.json'), 'utf8'),
);

// ---------- helpers ----------
const walk = (dir) => {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out.sort();
};

const rel = (p) => path.relative(PKG, p).split(path.sep).join('/');
const uiTarget = (relPath) => relPath.replace(/^src\/components\/ui\//, '@ui/');

const fileEntry = (relPath) => ({
  path: relPath,
  type: 'registry:ui',
  target: uiTarget(relPath),
});

const withVersion = ({ name, pinned }, bucket) => {
  const spec = pkgJson[bucket]?.[name];
  if (!spec) {
    console.error(
      `build-registry: ${name} missing from package.json ${bucket}`,
    );
    process.exit(1);
  }
  return pinned ? `${name}@${spec}` : name;
};

const uiImports = (files) => {
  const names = new Set();
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(
      /from\s+['"]@\/components\/ui\/([^/'"]+)['"]/g,
    )) {
      names.add(m[1]);
    }
  }
  return [...names].sort();
};

// Minimal CSS block parser: returns the top-level rules of a stylesheet as
// [selectorOrAtRule, body] pairs, where body is either a declaration object
// or a nested map of the same shape. Comments are dropped. Good enough for
// the plain keyframes/rules in src/index.css; not a general CSS parser.
const parseBlocks = (css) => {
  const out = {};
  let i = 0;
  const skipWs = () => {
    while (i < css.length && /\s/.test(css[i])) i++;
  };
  const readUntil = (chars) => {
    let s = '';
    while (i < css.length && !chars.includes(css[i])) s += css[i++];
    return s;
  };
  while (i < css.length) {
    skipWs();
    if (i >= css.length) break;
    const head = readUntil('{;}').trim();
    if (css[i] === '{') {
      i++;
      const bodyStart = i;
      let depth = 1;
      while (i < css.length && depth > 0) {
        if (css[i] === '{') depth++;
        else if (css[i] === '}') depth--;
        i++;
      }
      const body = css.slice(bodyStart, i - 1);
      out[head] = /\{/.test(body) ? parseBlocks(body) : parseDecls(body);
    } else {
      // Bare at-rule such as @import, or a stray `;`/`}`.
      if (css[i] === ';' || css[i] === '}') i++;
      if (head) out[head] = {};
    }
  }
  return out;
};

const parseDecls = (body) => {
  const out = {};
  for (const decl of body.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim();
    const value = decl
      .slice(idx + 1)
      .replace(/\s+/g, ' ')
      .trim();
    if (prop) out[prop] = value;
  }
  return out;
};

const srtCss = () => {
  const raw = fs
    .readFileSync(CSS_FILE, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = parseBlocks(raw);
  const picked = {};
  for (const [key, value] of Object.entries(blocks)) {
    if (/\bsrt-/.test(key)) picked[key] = value;
  }
  if (Object.keys(picked).length === 0) {
    console.error('build-registry: no srt-* rules found in src/index.css');
    process.exit(1);
  }
  return picked;
};

// ---------- items ----------
const libFiles = walk(LIB_DIR);
const localeDir = path.join(LIB_DIR, 'locales');
const isLocale = (p) => p.startsWith(localeDir + path.sep);
const localeCode = (p) => path.basename(p).replace(/\.ts$/, '');

const coreFiles = libFiles.filter(
  (p) => !isLocale(p) || localeCode(p) === 'en',
);
const localeFiles = libFiles.filter(
  (p) => isLocale(p) && localeCode(p) !== 'en',
);

const registryDependencies = uiImports([
  ...coreFiles,
  path.join(PKG, CHECKBOX_REL),
]).filter((name) => !FORKED_UI.has(name));

const main = {
  name: ITEM,
  type: 'registry:ui',
  title: 'Shadcn React Table',
  description:
    'A fully featured data table built on TanStack Table and shadcn/ui, ported from material-react-table.',
  dependencies: NPM_DEPS.map((n) => withVersion(n, 'dependencies')),
  devDependencies: NPM_DEV_DEPS.map((n) => withVersion(n, 'devDependencies')),
  registryDependencies,
  files: [...coreFiles.map(rel), CHECKBOX_REL].map(fileEntry),
  css: srtCss(),
};

const locales = localeFiles.map((p) => {
  const code = localeCode(p);
  return {
    name: `${ITEM}-locale-${code}`,
    type: 'registry:ui',
    title: `Shadcn React Table locale: ${code}`,
    description: `The ${code} localization for shadcn-react-table.`,
    registryDependencies: [MAIN_ITEM_ADDRESS],
    files: [fileEntry(rel(p))],
  };
});

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'srt',
  homepage: HOMEPAGE,
  items: [main, ...locales],
};

fs.writeFileSync(OUT, JSON.stringify(registry, null, 2) + '\n');
console.log(
  `registry.json: ${main.files.length} files in ${ITEM}, ${locales.length} locale items, ${registryDependencies.length} registryDependencies`,
);
