#!/usr/bin/env node
/**
 * One stylesheet per docs style (D29). Each styles/style-<name>.css scopes the
 * shadcn `.cn-*` hook classes under `.style-<name>` with `@apply`; it is
 * compiled against the docs' Tailwind theme (`@reference "./app/global.css"`
 * loads the theme, variants and utilities without emitting them) into
 * public/styles/style-<name>.css (gitignored), wrapped in `@layer base` as the
 * root stylesheet imported it before. app/layout.tsx links the default
 * style's sheet, the pre-paint script (lib/design-system/config.ts) swaps it
 * for the stored style's, and components/design-system-provider.tsx loads the
 * next one on a style change.
 *
 * Runs before `next dev` and `next build` (package.json `predev`, `build`);
 * Each sheet passes through Lightning CSS (`optimize`); `--minify` (used by
 * `build`) also minifies it.
 * Prints the byte size per file; a compile error fails with the style name.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile, optimize } from '@tailwindcss/node';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STYLES = path.join(APP, 'styles');
const OUT = path.join(APP, 'public', 'styles');
const minify = process.argv.includes('--minify');

/** The style names, from the styles/style-<name>.css listing. */
async function styleNames() {
  const files = await fs.readdir(STYLES);
  return files
    .map((file) => /^style-([a-z]+)\.css$/.exec(file)?.[1])
    .filter(Boolean)
    .sort();
}

/** The compiled sheet of one style. */
async function buildStyle(name) {
  // The layer order statement repeats the root stylesheet's, so a style sheet
  // linked before it does not move `base` ahead of `theme`.
  const entry = `@layer theme, base, components, utilities;\n@reference "./app/global.css";\n@import "./styles/style-${name}.css" layer(base);\n`;
  const compiler = await compile(entry, { base: APP, onDependency() {} });
  const css = compiler.build([]);
  // Lightning CSS flattens the nesting and adds the prefixes, as it does for
  // the root stylesheet; without --minify the output stays readable.
  return optimize(css, { minify }).code;
}

await fs.mkdir(OUT, { recursive: true });
for (const name of await styleNames()) {
  let css;
  try {
    css = await buildStyle(name);
  } catch (error) {
    console.error(`build-styles: style-${name}.css failed to compile`);
    throw error;
  }
  const file = path.join(OUT, `style-${name}.css`);
  await fs.writeFile(file, css);
  console.log(
    `build-styles: public/styles/style-${name}.css ${Buffer.byteLength(css)} B`,
  );
}
