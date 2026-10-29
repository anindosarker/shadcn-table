// Shared by the registry scripts and the per-base item definitions
// (registry/<base>/registry.ts): the base list, then the item builder, which
// lists an item's files (the tree's library files), derives the
// registryDependencies from the `@/components/ui/<part>` imports and pins npm
// versions from package.json. The file list is never hand-maintained.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_BASE, BASE_LABELS } from './bases.mjs';

export const PKG = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
export const ROOT = path.resolve(PKG, '..', '..');
// The docs app: examples.mjs writes its registry.json, hosted.mjs its
// public/r/. The one place the folder name lives in the registry scripts.
export const DOCS = path.join(ROOT, 'apps/shadcn-table-docs');
// The library below a tree's components/ui directory.
const LIB_REL = 'components/ui/shadcn-table';
// The base list (bases.mjs), re-exported for the registry scripts.
export {
  DEFAULT_BASE,
  BASE_LABELS,
  BASES,
  baseItemName,
  REFERENCE_BASE,
  resolveBase,
} from './bases.mjs';
export const GITHUB_REPO = 'anindosarker/shadcn-table';
export const HOMEPAGE = `https://github.com/${GITHUB_REPO}`;
// `--dev` builds a local registry under .dev/ (gitignored) whose locale items
// point at the local server started by `pnpm registry:dev` or `pnpm preview`; the committed
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

/**
 * The items of one base: the main item (every library file of the tree
 * except the non-English locales) and one item per locale. `path` values are relative to the package, `target` values are the
 * alias paths the CLI installs to.
 *
 * @param {{
 *   dir: string,
 *   name: string,
 *   title: string,
 *   description: string,
 *   dependencies: Array<{ name: string, pinned?: boolean }>,
 *   devDependencies: Array<{ name: string, pinned?: boolean }>,
 * }} base
 */
export const buildBaseItems = ({
  dir,
  name,
  title,
  description,
  dependencies,
  devDependencies,
}) => {
  const uiDir = path.join(dir, 'components/ui');
  const libDir = path.join(dir, LIB_REL);
  // An item file: its package-relative `path` and the install `target`,
  // `@ui/` plus the path below its own components/ui directory.
  const fileEntry = (uiRoot, p) => ({
    path: rel(p),
    type: 'registry:ui',
    target: `@ui/${path.relative(uiRoot, p).split(path.sep).join('/')}`,
  });

  // Library files keyed by their path below components/ui/shadcn-table.
  const libEntries = walk(libDir).map((p) => [
    path.relative(libDir, p),
    fileEntry(uiDir, p),
  ]);

  // Locales sit in shared/locales; the Base UI tree keeps them in locales/
  // until it moves to the same layout.
  const isLocale = (key) => /^(shared[\\/])?locales[\\/]/.test(key);
  const localeCode = (key) => path.basename(key).replace(/\.ts$/, '');

  const coreFiles = libEntries
    .filter(([key]) => !isLocale(key) || localeCode(key) === 'en')
    .map(([, entry]) => entry);
  const localeFiles = libEntries.filter(
    ([key]) => isLocale(key) && localeCode(key) !== 'en',
  );
  const registryDependencies = uiImports(
    coreFiles.map((entry) => path.join(PKG, entry.path)),
  );

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
    files: coreFiles,
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

// Whether a committed item name carries the base: `<name>-<base>`
// (baseItemName) or a locale item of one, `<name>-<base>-locale-<code>`. The
// GitHub shorthand aliases (aliasItems) carry none.
const hasBaseName = (name, base) =>
  name.endsWith(`-${base}`) || name.includes(`-${base}-locale-`);

/**
 * The GitHub shorthand aliases (decisions.md, decision 7): one copy of every
 * DEFAULT_BASE item under its plain name (`shadcn-table`,
 * `shadcn-table-locale-<code>`, `example-<slug>`), because `shadcn add
 * anindosarker/shadcn-table/<name>` reads the committed catalog and cannot pick
 * a base. Same type, files and dependencies as the source item; only the name
 * and the description change. build.mjs and examples.mjs append them to the
 * catalogs they write; baseItems and baseExampleItems skip them, so hosted.mjs
 * never serves them.
 *
 * @template {{ name: string, description?: string }} T
 * @param {T[]} items the DEFAULT_BASE items, named by baseItemName
 * @returns {T[]}
 */
export const aliasItems = (items) =>
  items.map((item) => {
    const suffix = `-${DEFAULT_BASE}`;
    const name = item.name.endsWith(suffix)
      ? item.name.slice(0, -suffix.length)
      : item.name.replace(`${suffix}-locale-`, '-locale-');
    if (name === item.name) {
      throw new Error(
        `aliasItems: ${item.name} is not a ${DEFAULT_BASE} item name`,
      );
    }
    return {
      ...item,
      name,
      description: `Alias of ${item.name}: the GitHub shorthand ${GITHUB_REPO}/${name} installs the ${BASE_LABELS[DEFAULT_BASE]} copy.`,
    };
  });

/**
 * One base's items in a catalog built from the committed registry.json: the
 * items whose files live in registry/<base>, split into the main item and its
 * locale items (named `<main>-locale-<code>`). The GitHub shorthand aliases
 * (aliasItems) share the default base's files and are skipped.
 *
 * @param {{ items: Array<{ name: string, files: Array<{ path: string }> }> }} catalog
 * @param {string} base
 */
export const baseItems = (catalog, base) => {
  const own = catalog.items.filter(
    (item) =>
      hasBaseName(item.name, base) &&
      item.files.every((file) => file.path.startsWith(`registry/${base}/`)),
  );
  const main = own.find((item) =>
    own.every(
      (other) =>
        other === item || other.name.startsWith(`${item.name}-locale-`),
    ),
  );
  return {
    main,
    locales: own.filter((item) => item !== main),
  };
};

/**
 * One base's example items in the docs catalog (examples.mjs writes one item
 * per example and base, found by the `examples/<base>/` file paths), each
 * renamed to its hosted name: the plain `example-<slug>`, which baseItemName
 * suffixes with `-<base>` in the committed catalog. hosted.mjs serves them in
 * /r/<base>/, smoke.mjs expects them there. The GitHub shorthand aliases
 * (aliasItems), already plain, are skipped.
 *
 * @param {{ items: Array<{ name: string, files: Array<{ path: string }> }> }} catalog
 * @param {string} base
 */
export const baseExampleItems = (catalog, base) => {
  const suffix = `-${base}`;
  return catalog.items
    .filter(
      (item) =>
        item.name.endsWith(suffix) &&
        item.files.every((file) => file.path.startsWith(`examples/${base}/`)),
    )
    .map((item) => ({
      ...item,
      name: item.name.slice(0, -suffix.length),
    }));
};
