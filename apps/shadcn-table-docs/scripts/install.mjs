#!/usr/bin/env node
/**
 * `pnpm lib:install <base>`: installs one base's copy of the library for the
 * rendered examples, under components/ui-<base>/ (the table in
 * components/ui-<base>/shadcn-table/ plus the shadcn parts it imports,
 * installed from the base's style, `<base>-nova`). <base> is any base
 * (packages/shadcn-table/scripts/registry/bases.mjs); its item is the one
 * registry/<base>/ holds in the committed registry.json. The generated example
 * variants (lib/example-variants.mjs) import from there, so a reader on any
 * base tab sees that base's copy render.
 *
 * Source: the built items in packages/shadcn-table/public/r/
 * (`pnpm -w registry:build`): the core item <item>-core.json, the Lucide item
 * <item>.json (icons.ts) and the locale items <item>-locale-<code>.json (the
 * localization examples import every locale), merged into one item so the
 * CLI never resolves the core dependency through its GitHub address. The item is rewritten on the way in: its
 * `@/components/ui/` imports point at `@/components/ui-<base>/` (the CLI
 * rewrites only `@/registry/...` specifiers). Each copy renders its own
 * keyframes in a hoisted style element; on every base but the reference
 * (radix) the st-collapsible-* keyframe names and the st-collapsible style href
 * become st-<base>-collapsible (st-base-collapsible, st-aria-collapsible) so
 * they do not collide with the Radix copy's (keyframe names are global and
 * React keeps one style per href).
 * `shadcn add` then runs with a temporary components.json (the base's style,
 * `ui` alias `@/components/ui-<base>`), so the bare registryDependencies
 * install as that base's parts into the same folder. The real
 * components.json is restored afterwards, and so are app/global.css (the CLI
 * appends the style's tokens to it), package.json and the lockfile (every
 * package the item needs is already a dependency here), from copies taken
 * before the install, so uncommitted edits to them survive.
 *
 * Manual equivalent: pnpm exec shadcn add <rewritten item json> table --overwrite --yes
 * with components.json temporarily set to {"style":"<style>","aliases":{"ui":"@/components/ui-<base>"}}.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BASES,
  baseItems,
  REFERENCE_BASE,
} from '../../../packages/shadcn-table/scripts/registry/lib.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB = path.join(APP, '..', '..', 'packages', 'shadcn-table');
const LIB_R = path.join(LIB, 'public', 'r');
/** The shadcn style each base installs with: `<base>-<STYLE>`. */
const STYLE = 'nova';
/** Parts the examples import that the item itself does not depend on. */
const EXTRA_PARTS = ['table'];
const COMPONENTS_JSON = path.join(APP, 'components.json');
/** Files the CLI touches that this install must leave as they were. */
const KEEP = [
  'components.json',
  'app/global.css',
  'package.json',
  '../../pnpm-lock.yaml',
].map((rel) => path.join(APP, rel));

const base = process.argv[2];
if (!BASES.includes(base)) {
  console.error(`usage: node scripts/install.mjs <${BASES.join('|')}>`);
  process.exit(1);
}
/** The base's committed core and main item names, from registry.json. */
const { core, main } = baseItems(
  JSON.parse(fs.readFileSync(path.join(LIB, 'registry.json'), 'utf8')),
  base,
);
const itemName = main?.name;
if (!core || !itemName) {
  console.error(
    `install: no ${base} core or main item in packages/shadcn-table/registry.json`,
  );
  process.exit(1);
}
const style = `${base}-${STYLE}`;
const uiAlias = `@/components/ui-${base}`;
const uiDir = path.join(APP, 'components', `ui-${base}`);
const readItem = (name) => {
  const file = path.join(LIB_R, `${name}.json`);
  if (!fs.existsSync(file)) {
    console.error(
      `install: ${path.relative(APP, file)} missing; run pnpm -w registry:build first`,
    );
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};

// Core carries the dependencies and the bare parts; the main item adds
// icons.ts and lucide-react. Its registryDependency on core is left out, the
// merged item holds core's files.
const item = readItem(core.name);
const lucide = readItem(itemName);
item.name = itemName;
item.files.push(...lucide.files);
item.dependencies = [...(item.dependencies ?? []), ...lucide.dependencies];
const localeItems = fs
  .readdirSync(LIB_R)
  .filter((f) => f.startsWith(`${itemName}-locale-`) && f.endsWith('.json'))
  .sort();
for (const file of localeItems) {
  item.files.push(
    ...JSON.parse(fs.readFileSync(path.join(LIB_R, file), 'utf8')).files,
  );
}
for (const file of item.files) {
  file.content = file.content.replace(
    /(['"])@\/components\/ui\//g,
    `$1${uiAlias}/`,
  );
  if (base !== REFERENCE_BASE) {
    file.content = file.content.replace(
      /\bst-collapsible\b/g,
      `st-${base}-collapsible`,
    );
  }
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `shadcn-table-${base}-`));
const mergedFile = path.join(tmp, `${itemName}.json`);
fs.writeFileSync(mergedFile, JSON.stringify(item, null, 2));

const kept = new Map(KEEP.map((file) => [file, fs.readFileSync(file, 'utf8')]));
const config = JSON.parse(kept.get(COMPONENTS_JSON));
config.style = style;
config.aliases.ui = uiAlias;
fs.writeFileSync(COMPONENTS_JSON, JSON.stringify(config, null, 2) + '\n');
try {
  execFileSync(
    'pnpm',
    [
      'exec',
      'shadcn',
      'add',
      mergedFile,
      ...EXTRA_PARTS,
      '--overwrite',
      '--yes',
    ],
    { cwd: APP, stdio: 'inherit' },
  );
} finally {
  for (const [file, content] of kept) fs.writeFileSync(file, content);
  fs.rmSync(tmp, { recursive: true, force: true });
}
const parts = fs.readdirSync(uiDir).filter((f) => f.endsWith('.tsx')).length;
console.log(
  `${path.relative(APP, uiDir)}: ${item.files.length} table files (${localeItems.length} locales merged in), ${parts} parts; components.json, app/global.css, package.json and the lockfile kept as they were`,
);
