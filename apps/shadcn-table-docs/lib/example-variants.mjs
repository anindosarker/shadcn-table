#!/usr/bin/env node
/**
 * Per-base variants of the docs examples. examples/<slug>/ is base-neutral
 * source that imports `@/components/ui/...` (the path a user has after
 * `shadcn add`; the code view shows it as is). For each base, every source
 * file of examples/<slug>/ (TS.tsx, helpers, data; not the index.tsx docs
 * wrapper) is rewritten into examples/<variant dir>/<slug>/* (gitignored,
 * folder names in lib/example-variant-dir.mjs) for that base's installed copy
 * of the table and its shadcn parts (`pnpm lib:install <base>`, under
 * components/ui-<base>): `@/components/ui/` imports point at
 * `@/components/ui-<base>/`, and on the Base UI base Radix's `asChild` on a
 * part becomes Base UI's `render` prop (the one Radix-only prop the examples
 * use). components/example-variant.tsx lazy-loads the variant for the
 * selected base; the output is formatted with the repo's prettier config.
 *
 * Runs before `next build` and `next dev` (package.json `build`, `predev`)
 * and from `pnpm examples:variants`. Stale variant folders are removed.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import ts from 'typescript';
import { listExampleFiles } from './example-files.mjs';
import { VARIANT_DIRS } from './example-variant-dir.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXAMPLES = path.join(APP, 'examples');

/**
 * `@/components/ui/<part>` and `@/components/ui/shadcn-table...` imports to
 * the base's installed copy. Both quote styles; nothing else changes.
 * @param {string} source
 * @param {keyof typeof VARIANT_DIRS} base
 */
export const rewriteImports = (source, base) =>
  source.replace(
    /(['"])@\/components\/ui\//g,
    `$1@/components/ui-${base}/`,
  );

/**
 * `<Trigger asChild><Child {...props}>{content}</Child></Trigger>` to
 * `<Trigger render={<Child {...props} />}>{content}</Trigger>`, the Base UI
 * shape (its `render` prop takes the element, the trigger's children land
 * inside it). Only an element whose single child is an element qualifies;
 * anything else keeps `asChild` and fails the type check, on purpose.
 * @param {string} source
 * @param {string} fileName
 */
export const rewriteAsChild = (source, fileName) => {
  let text = source;
  // Outer edits first; a rewritten subtree is scanned again on the next pass.
  for (let pass = 0; pass < 5 && /\basChild\b/.test(text); pass++) {
    const sf = ts.createSourceFile(
      fileName,
      text,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    /** @type {[number, number, string][]} */
    const edits = [];
    /** @param {ts.Node} node */
    const visit = (node) => {
      if (ts.isJsxElement(node)) {
        const open = node.openingElement;
        const asChild = open.attributes.properties.find(
          (p) => ts.isJsxAttribute(p) && p.name.getText(sf) === 'asChild',
        );
        const kids = node.children.filter(
          (c) => !(ts.isJsxText(c) && c.containsOnlyTriviaWhiteSpaces),
        );
        const child = kids[0];
        if (
          asChild &&
          kids.length === 1 &&
          (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child))
        ) {
          const childOpen = ts.isJsxElement(child)
            ? child.openingElement
            : child;
          const childTag = childOpen.tagName.getText(sf);
          const childAttrs = childOpen.attributes.getText(sf).trim();
          const inner = ts.isJsxElement(child)
            ? text.slice(child.openingElement.end, child.closingElement.pos)
            : '';
          const attrs = [
            ...open.attributes.properties
              .filter((p) => p !== asChild)
              .map((p) => p.getText(sf)),
            `render={<${childTag}${childAttrs ? ` ${childAttrs}` : ''} />}`,
          ].join(' ');
          const tag = open.tagName.getText(sf);
          edits.push([
            node.getStart(sf),
            node.end,
            inner.trim()
              ? `<${tag} ${attrs}>${inner}</${tag}>`
              : `<${tag} ${attrs} />`,
          ]);
          return;
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    if (!edits.length) break;
    for (const [start, end, replacement] of edits.reverse()) {
      text = text.slice(0, start) + replacement + text.slice(end);
    }
  }
  return text;
};

/**
 * One base's variant of one example source file, formatted. The Radix
 * variant only changes the imports; the Base UI one also turns `asChild`
 * into `render`.
 * @param {{ source: string, fileName: string, base: keyof typeof VARIANT_DIRS }} file
 *   fileName is absolute, for prettier's parser choice
 */
export const toVariant = async ({ source, fileName, base }) => {
  let text = rewriteImports(source, base);
  if (base === 'base' && /\.tsx$/.test(fileName)) {
    text = rewriteAsChild(text, fileName);
  }
  if (text === source) return source;
  const config = await prettier.resolveConfig(fileName);
  return prettier.format(text, { ...config, filepath: fileName });
};

async function main() {
  const slugs = (await fs.readdir(EXAMPLES, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort();
  const kept = new Set();
  const sources = new Map();
  for (const slug of slugs) {
    const dir = path.join(EXAMPLES, slug);
    try {
      await fs.access(path.join(dir, 'TS.tsx'));
    } catch {
      continue;
    }
    kept.add(slug);
    sources.set(slug, await listExampleFiles(dir));
  }
  for (const [base, variantDir] of Object.entries(VARIANT_DIRS)) {
    const out = path.join(EXAMPLES, variantDir);
    let files = 0;
    for (const [slug, rels] of sources) {
      const dir = path.join(EXAMPLES, slug);
      for (const rel of rels) {
        const source = await fs.readFile(path.join(dir, rel), 'utf8');
        const target = path.join(out, slug, rel);
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(
          target,
          await toVariant({ source, fileName: target, base }),
        );
        files += 1;
      }
    }
    // Variant folders whose example is gone.
    await fs.mkdir(out, { recursive: true });
    for (const entry of await fs.readdir(out, { withFileTypes: true })) {
      if (entry.isDirectory() && !kept.has(entry.name)) {
        await fs.rm(path.join(out, entry.name), { recursive: true });
      }
    }
    console.log(`examples/${variantDir}: ${kept.size} examples, ${files} files`);
  }
}

await main();
