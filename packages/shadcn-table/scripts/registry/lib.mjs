// Shared by the registry scripts and the per-edition item definitions
// (registry/<edition>/registry.ts): the edition list, then the item builder,
// which lists an item's files (the tree's library files plus the forked
// parts), derives the registryDependencies from the `@/components/ui/<part>`
// imports and pins npm versions from package.json. The file list is never
// hand-maintained.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
// The edition list (editions.mjs), re-exported for the registry scripts.
export {
  DEFAULT_EDITION,
  EDITION_LABELS,
  EDITIONS,
  editionItemName,
  REFERENCE_EDITION,
  resolveEdition,
} from './editions.mjs';
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
 * except the non-English locales, plus the forked ui parts) and one item per
 * locale. `path` values are relative to the package, `target` values are the
 * alias paths the CLI installs to.
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

/**
 * One edition's items in a catalog built from the committed registry.json:
 * the items whose files live in registry/<edition>, split into the main item
 * and its locale items (named `<main>-locale-<code>`).
 *
 * @param {{ items: Array<{ name: string, files: Array<{ path: string }> }> }} catalog
 * @param {string} edition
 */
export const editionItems = (catalog, edition) => {
  const own = catalog.items.filter((item) =>
    item.files.every((file) => file.path.startsWith(`registry/${edition}/`)),
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
 * One edition's example items in the docs catalog (examples.mjs writes one
 * item per example and edition, found by the `examples/<edition>/` file
 * paths), each renamed to its hosted name: the plain `example-<slug>`,
 * which editionItemName suffixes with `-<edition>` in the committed catalog.
 * hosted.mjs serves them in /r/<edition>/, smoke.mjs expects them there.
 *
 * @param {{ items: Array<{ name: string, files: Array<{ path: string }> }> }} catalog
 * @param {string} edition
 */
export const editionExampleItems = (catalog, edition) => {
  const suffix = `-${edition}`;
  return catalog.items
    .filter((item) =>
      item.files.every((file) => file.path.startsWith(`examples/${edition}/`)),
    )
    .map((item) => ({
      ...item,
      name: item.name.slice(0, -suffix.length),
    }));
};
