// Shared by the per-base item definitions (bases/<base>/registry.ts): lists
// an item's files (the shared library files, each replaced by the base's
// override at the same relative path, plus the forked parts), derives the
// registryDependencies from the `@/components/ui/<part>` imports, picks the
// ST-only CSS rules out of the base's index.css and pins npm versions from
// package.json. The file list is never hand-maintained.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PKG = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
export const ROOT = path.resolve(PKG, '..', '..');
// The docs app: examples.mjs writes its registry.json, hosted.mjs its
// public/r/. The one place the folder name lives in the registry scripts.
export const DOCS = path.join(ROOT, 'apps/docs');
// Library files relative to a components/ui directory, both under shared/
// and under bases/<base>/ (the overrides).
const LIB_REL = 'components/ui/shadcn-table';
const SHARED_LIB = path.join(PKG, 'shared', LIB_REL);
export const GITHUB_REPO = 'anindosarker/shadcn-table';
export const HOMEPAGE = `https://github.com/${GITHUB_REPO}`;
// `--dev` builds a local registry under .dev/ (gitignored) whose locale items
// point at the local server started by `pnpm registry:dev`; the committed
// registry.json is never touched. REGISTRY_BASE_URL overrides the dev URL.
export const DEV = process.argv.includes('--dev');

const pkgJson = JSON.parse(
  fs.readFileSync(path.join(PKG, 'package.json'), 'utf8'),
);

// Locale items depend on the main item. A bare name would resolve to
// shadcn/ui's own registry, so the dependency is the GitHub item address,
// which the CLI resolves through the root registry.json of the repo.
const mainItemAddress = (item) =>
  DEV
    ? `${process.env.REGISTRY_BASE_URL ?? 'http://localhost:5310/r'}/${item}.json`
    : `${GITHUB_REPO}/${item}`;

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

// Pinned ones take their version from package.json so the registry never
// drifts from what is tested here; the rest stay unversioned so the CLI keeps
// whatever the user has (a pinned lucide-react@^0.544 would downgrade a fresh
// shadcn init).
const withVersion = ({ name, pinned }, bucket) => {
  const spec = pkgJson[bucket]?.[name];
  if (!spec) {
    console.error(`lib.mjs: ${name} missing from package.json ${bucket}`);
    process.exit(1);
  }
  return pinned ? `${name}@${spec}` : name;
};

// `@/components/ui/shadcn-table` is the library's own entry point (the
// locales import it); only `@/components/ui/<part>` is a shadcn part.
const uiImports = (files) => {
  const names = new Set();
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(
      /from\s+['"]@\/components\/ui\/([^/'"]+)['"]/g,
    )) {
      if (m[1] !== 'shadcn-table') names.add(m[1]);
    }
  }
  return [...names].sort();
};

// Minimal CSS block parser: returns the top-level rules of a stylesheet as
// [selectorOrAtRule, body] pairs, where body is either a declaration object
// or a nested map of the same shape. Comments are dropped. Good enough for
// the plain keyframes/rules in index.css; not a general CSS parser.
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

const stCss = (cssFile) => {
  const raw = fs.readFileSync(cssFile, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = parseBlocks(raw);
  const picked = {};
  for (const [key, value] of Object.entries(blocks)) {
    if (/\bst-/.test(key)) picked[key] = value;
  }
  if (Object.keys(picked).length === 0) {
    console.error(`lib.mjs: no st-* rules found in ${rel(cssFile)}`);
    process.exit(1);
  }
  return picked;
};

/**
 * The items of one base: the main item (every library file except the
 * non-English locales, plus the forked ui parts) and one item per locale. A
 * library file is the shared copy under shared/components/ui/shadcn-table
 * unless bases/<base>/components/ui/shadcn-table holds a file at the same
 * relative path, which replaces it. `path` values are relative to the
 * package, `target` values are the alias paths the CLI installs to, the same
 * for a shared file and an override.
 *
 * @param {{
 *   dir: string,
 *   name: string,
 *   title: string,
 *   description: string,
 *   dependencies: Array<{ name: string, pinned?: boolean }>,
 *   devDependencies: Array<{ name: string, pinned?: boolean }>,
 *   forkedUi: string[],
 * }} base
 */
export const baseItems = ({
  dir,
  name,
  title,
  description,
  dependencies,
  devDependencies,
  forkedUi,
}) => {
  const uiDir = path.join(dir, 'components/ui');
  const overrideDir = path.join(uiDir, 'shadcn-table');
  // An item file: its package-relative `path` and the install `target`,
  // `@ui/` plus the path below its own components/ui directory.
  const fileEntry = (uiRoot, p) => ({
    path: rel(p),
    type: 'registry:ui',
    target: `@ui/${path.relative(uiRoot, p).split(path.sep).join('/')}`,
  });

  // Library files keyed by their path below components/ui/shadcn-table:
  // the shared copies first, then the overrides on top. An override without
  // a shared copy is a typo in its path (the folder mirrors shared/).
  const libFiles = new Map();
  for (const p of walk(SHARED_LIB)) {
    libFiles.set(
      path.relative(SHARED_LIB, p),
      fileEntry(path.join(PKG, 'shared/components/ui'), p),
    );
  }
  const overrides = fs.existsSync(overrideDir) ? walk(overrideDir) : [];
  for (const p of overrides) {
    const key = path.relative(overrideDir, p);
    if (!libFiles.has(key)) {
      console.error(
        `lib.mjs: ${rel(p)} overrides nothing; no shared/${LIB_REL}/${key}`,
      );
      process.exit(1);
    }
    libFiles.set(key, fileEntry(uiDir, p));
  }
  const libEntries = [...libFiles.keys()]
    .sort()
    .map((key) => [key, libFiles.get(key)]);

  const isLocale = (key) => key.startsWith(`locales${path.sep}`);
  const localeCode = (key) => path.basename(key).replace(/\.ts$/, '');

  const coreFiles = libEntries
    .filter(([key]) => !isLocale(key) || localeCode(key) === 'en')
    .map(([, entry]) => entry);
  const localeFiles = libEntries.filter(
    ([key]) => isLocale(key) && localeCode(key) !== 'en',
  );
  // Forked ui parts ship inside the item instead of being registryDependencies.
  const forkedFiles = forkedUi.map((part) =>
    fileEntry(uiDir, path.join(uiDir, `${part}.tsx`)),
  );

  const registryDependencies = uiImports(
    [...coreFiles, ...forkedFiles].map((entry) => path.join(PKG, entry.path)),
  ).filter((part) => !forkedUi.includes(part));

  const main = {
    name,
    type: 'registry:ui',
    title,
    description,
    dependencies: dependencies.map((n) => withVersion(n, 'dependencies')),
    devDependencies: devDependencies.map((n) =>
      withVersion(n, 'devDependencies'),
    ),
    registryDependencies,
    files: [...coreFiles, ...forkedFiles],
    css: stCss(path.join(dir, 'index.css')),
  };

  const locales = localeFiles.map(([key, entry]) => {
    const code = localeCode(key);
    return {
      name: `${name}-locale-${code}`,
      type: 'registry:ui',
      title: `${title} locale: ${code}`,
      description: `The ${code} localization for ${name}.`,
      registryDependencies: [mainItemAddress(name)],
      files: [entry],
    };
  });

  return [main, ...locales];
};
