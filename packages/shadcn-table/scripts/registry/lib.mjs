// Shared by the registry scripts and the per-base item definitions
// (registry/<base>/registry.ts): the base list, then the item builder, which
// lists an item's files (the tree's library files), derives the
// registryDependencies from the `@/components/ui/<part>` imports and pins npm
// versions from package.json. The file list is never hand-maintained.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_BASE, BASE_LABELS, baseItemName } from './bases.mjs';

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

// Locale, icon set and example items depend on the core item. A bare name
// would resolve to shadcn/ui's own registry, so the dependency is the GitHub
// item address, which the CLI resolves through the root registry.json of the
// repo; under `--dev` it is the local server's URL.
const itemAddress = (item) =>
  DEV
    ? `${process.env.REGISTRY_BASE_URL ?? 'http://localhost:5310/r'}/${item}.json`
    : `${GITHUB_REPO}/${item}`;

/**
 * The address of a base's core item, `shadcn-table-<base>-core`, in the form
 * registryDependencies take: the GitHub item address, or the local server URL
 * under `--dev`.
 *
 * @param {string} base
 */
export const coreItemAddress = (base) =>
  itemAddress(`${baseItemName('shadcn-table', base)}-core`);

// The icon map every item installs at components/ui/shadcn-table/icons.ts:
// icons.ts (Lucide) for the main item, icons/<set>.ts for the icon set items.
const ICON_MAP = 'icons.ts';
const ICON_SET_DIR = 'icons';
const LUCIDE = 'lucide-react';

/**
 * The icon sets besides Lucide: the item suffix and file name
 * (`icons/<set>.ts`), and the npm packages the map imports. Each set's
 * packages are devDependencies here and pinned in its item.
 */
export const ICON_SETS = Object.freeze({
  tabler: { title: 'Tabler', packages: ['@tabler/icons-react'] },
  phosphor: { title: 'Phosphor', packages: ['@phosphor-icons/react'] },
  hugeicons: {
    title: 'Hugeicons',
    packages: ['@hugeicons/react', '@hugeicons/core-free-icons'],
  },
  remixicon: { title: 'Remix', packages: ['@remixicon/react'] },
});

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
 * The items of one base, in this order:
 * - core, `<name>-core`: every library file except the icon maps and the
 *   non-English locales, every dependency but lucide-react
 * - main, `<name>`: the Lucide map icons.ts, lucide-react, on core
 * - one icon set item per ICON_SETS entry, `<name>-<set>`: icons/<set>.ts
 *   installed at the icons.ts target, its packages, on core
 * - one item per non-English locale, `<name>-locale-<code>`, on core
 *
 * `path` values are relative to the package, `target` values are the alias
 * paths the CLI installs to.
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

  const isIconMap = (key) =>
    key === ICON_MAP || key.startsWith(`${ICON_SET_DIR}${path.sep}`);
  const iconMapEntry = libEntries.find(([key]) => key === ICON_MAP)?.[1];
  if (!iconMapEntry) {
    throw new Error(`buildBaseItems: ${LIB_REL}/${ICON_MAP} missing in ${dir}`);
  }

  const coreFiles = libEntries
    .filter(
      ([key]) =>
        !isIconMap(key) && (!isLocale(key) || localeCode(key) === 'en'),
    )
    .map(([, entry]) => entry);
  const localeFiles = libEntries.filter(
    ([key]) => isLocale(key) && localeCode(key) !== 'en',
  );
  const registryDependencies = uiImports(
    coreFiles.map((entry) => path.join(PKG, entry.path)),
  );
  const lucide = dependencies.find((dep) => dep.name === LUCIDE);
  if (!lucide) {
    throw new Error(`buildBaseItems: ${name} lists no ${LUCIDE} dependency`);
  }
  const onCore = [itemAddress(`${name}-core`)];

  const core = {
    name: `${name}-core`,
    type: 'registry:ui',
    title: `${title} core`,
    description: `${description} The library without an icon map: install it through ${name} (Lucide) or one of the icon set items.`,
    dependencies: dependencies
      .filter((dep) => dep !== lucide)
      .map((n) => withVersion(n, 'dependencies')),
    devDependencies: devDependencies.map((n) =>
      withVersion(n, 'devDependencies'),
    ),
    registryDependencies,
    files: coreFiles,
  };

  const main = {
    name,
    type: 'registry:ui',
    title,
    description,
    dependencies: [withVersion(lucide, 'dependencies')],
    registryDependencies: onCore,
    files: [iconMapEntry],
  };

  const iconSets = Object.entries(ICON_SETS).map(
    ([set, { title: label, packages }]) => {
      const file = path.join(libDir, ICON_SET_DIR, `${set}.ts`);
      if (!fs.existsSync(file)) {
        throw new Error(`buildBaseItems: ${rel(file)} missing`);
      }
      return {
        name: `${name}-${set}`,
        type: 'registry:ui',
        title: `${title} with ${label} icons`,
        description: `${description} Installs the ${label} icon map instead of Lucide.`,
        dependencies: packages.map((pkg) =>
          withVersion({ name: pkg, pinned: true }, 'devDependencies'),
        ),
        registryDependencies: onCore,
        files: [{ ...fileEntry(uiDir, file), target: iconMapEntry.target }],
      };
    },
  );

  const locales = localeFiles.map(([key, entry]) => {
    const code = localeCode(key);
    return {
      name: `${name}-locale-${code}`,
      type: 'registry:ui',
      title: `${title} locale: ${code}`,
      description: `The ${code} localization for ${name}.`,
      registryDependencies: onCore,
      files: [entry],
    };
  });

  return [core, main, ...iconSets, ...locales];
};

// The suffixes after `<name>-<base>` of the items buildBaseItems emits besides
// the main item and the locales.
const ITEM_SUFFIXES = ['core', ...Object.keys(ICON_SETS)];

// Whether a committed item name carries the base: `<name>-<base>`
// (baseItemName), its core or icon set item, `<name>-<base>-<suffix>`, or a
// locale item, `<name>-<base>-locale-<code>`. The GitHub shorthand aliases
// (aliasItems) carry none.
const hasBaseName = (name, base) =>
  name.endsWith(`-${base}`) ||
  ITEM_SUFFIXES.some((suffix) => name.endsWith(`-${base}-${suffix}`)) ||
  name.includes(`-${base}-locale-`);

/**
 * The GitHub shorthand aliases (decisions.md, decision 7): one copy of every
 * DEFAULT_BASE item under its plain name (`shadcn-table`,
 * `shadcn-table-core`, `shadcn-table-<set>`, `shadcn-table-locale-<code>`,
 * `example-<slug>`), because `shadcn add
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
    const itemSuffix = ITEM_SUFFIXES.find((s) =>
      item.name.endsWith(`${suffix}-${s}`),
    );
    const name = item.name.endsWith(suffix)
      ? item.name.slice(0, -suffix.length)
      : itemSuffix
        ? `${item.name.slice(0, -`${suffix}-${itemSuffix}`.length)}-${itemSuffix}`
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
 * items whose files live in registry/<base>, split into the core item
 * (`<main>-core`), the main item (the Lucide one, `<main>`), the icon set
 * items (`<main>-<set>`, in ICON_SETS order) and the locale items
 * (`<main>-locale-<code>`). The GitHub shorthand aliases (aliasItems) share
 * the default base's files and are skipped.
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
  const core = own.find((item) => item.name.endsWith(`-${base}-core`));
  const mainName = core?.name.slice(0, -'-core'.length);
  return {
    core,
    main: own.find((item) => item.name === mainName),
    editions: Object.keys(ICON_SETS)
      .map((set) => own.find((item) => item.name === `${mainName}-${set}`))
      .filter(Boolean),
    locales: own.filter((item) => item.name.startsWith(`${mainName}-locale-`)),
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
