#!/usr/bin/env node
/**
 * `pnpm lib:install:base`: the Base UI copy of the library for the rendered
 * examples, under components/ui-base/ (the table in
 * components/ui-base/shadcn-table/ plus the 23 Base UI shadcn parts it
 * imports, installed from the `base-nova` style). The examples/.base variants
 * (lib/example-variants.mjs) import from there, so a reader on the Base UI
 * tab sees the Base UI edition render.
 *
 * Source: the built Base UI item packages/shadcn-table/public/r/shadcn-table-base.json
 * (`pnpm -w registry:build`) plus the files of its locale items
 * (shadcn-table-base-locale-<code>.json: the localization examples import
 * every locale), merged into one item so the CLI never resolves the locale
 * items' GitHub dependency. The item is rewritten on the way in: its
 * `@/components/ui/` imports point at `@/components/ui-base/` (the CLI only
 * rewrites `@/registry/...` specifiers), its st-collapsible-* animation names
 * become st-base-collapsible-* and its `css` block is dropped: the Radix copy
 * owns the st-collapsible-* keyframes in app/global.css (`lib:install` rewrites
 * them inside `@theme inline`, and Tailwind emits those last), so the Base UI
 * keyframes live there by hand under the renamed names.
 * `shadcn add` then runs with a temporary components.json (style `base-nova`,
 * `ui` alias `@/components/ui-base`), so the bare registryDependencies install
 * as Base UI parts into components/ui-base/. The real components.json is
 * restored afterwards, and so are app/global.css (the CLI appends the style's
 * tokens to it), package.json and the lockfile (every package the item needs
 * is already a dependency here), from copies taken before the install, so
 * uncommitted edits to them survive.
 *
 * Manual equivalent: pnpm exec shadcn add <rewritten item json> table --overwrite --yes
 * with components.json temporarily set to {"style":"base-nova","aliases":{"ui":"@/components/ui-base"}}.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB_R = path.join(
  APP,
  '..',
  '..',
  'packages',
  'shadcn-table',
  'public',
  'r',
);
const ITEM_NAME = 'shadcn-table-base';
const ITEM = path.join(LIB_R, `${ITEM_NAME}.json`);
/** Parts the examples import that the item itself does not depend on. */
const EXTRA_PARTS = ['table'];
const COMPONENTS_JSON = path.join(APP, 'components.json');
const UI_ALIAS = '@/components/ui-base';
/** Files the CLI touches that this install must leave as they were. */
const KEEP = [
  'components.json',
  'app/global.css',
  'package.json',
  '../../pnpm-lock.yaml',
].map((rel) => path.join(APP, rel));

if (!fs.existsSync(ITEM)) {
  console.error(
    `install-base: ${path.relative(APP, ITEM)} missing; run pnpm -w registry:build first`,
  );
  process.exit(1);
}

const item = JSON.parse(fs.readFileSync(ITEM, 'utf8'));
delete item.css;
const localeItems = fs
  .readdirSync(LIB_R)
  .filter((f) => f.startsWith(`${ITEM_NAME}-locale-`) && f.endsWith('.json'))
  .sort();
for (const file of localeItems) {
  item.files.push(
    ...JSON.parse(fs.readFileSync(path.join(LIB_R, file), 'utf8')).files,
  );
}
for (const file of item.files) {
  file.content = file.content
    .replace(/(['"])@\/components\/ui\//g, `$1${UI_ALIAS}/`)
    .replace(/\bst-collapsible-/g, 'st-base-collapsible-');
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'shadcn-table-base-'));
const itemFile = path.join(tmp, 'shadcn-table-base.json');
fs.writeFileSync(itemFile, JSON.stringify(item, null, 2));

const kept = new Map(KEEP.map((file) => [file, fs.readFileSync(file, 'utf8')]));
const config = JSON.parse(kept.get(COMPONENTS_JSON));
config.style = 'base-nova';
config.aliases.ui = UI_ALIAS;
fs.writeFileSync(COMPONENTS_JSON, JSON.stringify(config, null, 2) + '\n');
try {
  execFileSync(
    'pnpm',
    ['exec', 'shadcn', 'add', itemFile, ...EXTRA_PARTS, '--overwrite', '--yes'],
    { cwd: APP, stdio: 'inherit' },
  );
} finally {
  for (const [file, content] of kept) fs.writeFileSync(file, content);
  fs.rmSync(tmp, { recursive: true, force: true });
}
const parts = fs
  .readdirSync(path.join(APP, 'components', 'ui-base'))
  .filter((f) => f.endsWith('.tsx')).length;
console.log(
  `components/ui-base: ${item.files.length} table files (${localeItems.length} locales merged in), ${parts} parts; components.json, app/global.css, package.json and the lockfile kept as they were`,
);
