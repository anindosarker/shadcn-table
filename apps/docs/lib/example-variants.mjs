#!/usr/bin/env node
/**
 * Base UI variants of the docs examples: examples/.base/<slug>/* (gitignored)
 * is every source file of examples/<slug>/ (TS.tsx, helpers, data; not the
 * index.tsx docs wrapper) rewritten for the Base UI copy of the table and
 * its shadcn parts that `pnpm lib:install:base` installs under
 * components/ui-base: `@/components/ui/` imports point at
 * `@/components/ui-base/`, and Radix's `asChild` on a part becomes Base UI's
 * `render` prop (the one Radix-only prop the examples use). <ExampleSnippet>
 * lazy-loads the variant for the selected base and shows its source in the
 * code view, so the output is formatted with the repo's prettier config.
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
import { BASE_VARIANT_DIR } from './example-variant-dir.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXAMPLES = path.join(APP, 'examples');
const OUT = path.join(EXAMPLES, BASE_VARIANT_DIR);

/**
 * `@/components/ui/<part>` and `@/components/ui/shadcn-table...` imports to
 * the Base UI copy. Both quote styles; nothing else changes.
 * @param {string} source
 */
export const rewriteImports = (source) =>
  source.replace(/(['"])@\/components\/ui\//g, '$1@/components/ui-base/');

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
 * The Base UI variant of one example source file, formatted.
 * @param {string} source
 * @param {string} fileName absolute path, for prettier's parser choice
 */
export const toBaseVariant = async (source, fileName) => {
  let text = rewriteImports(source);
  if (/\.tsx$/.test(fileName)) text = rewriteAsChild(text, fileName);
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
  let files = 0;
  for (const slug of slugs) {
    const dir = path.join(EXAMPLES, slug);
    try {
      await fs.access(path.join(dir, 'TS.tsx'));
    } catch {
      continue;
    }
    kept.add(slug);
    for (const rel of await listExampleFiles(dir)) {
      const source = await fs.readFile(path.join(dir, rel), 'utf8');
      const target = path.join(OUT, slug, rel);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, await toBaseVariant(source, target));
      files += 1;
    }
  }
  // Variant folders whose example is gone.
  await fs.mkdir(OUT, { recursive: true });
  for (const entry of await fs.readdir(OUT, { withFileTypes: true })) {
    if (entry.isDirectory() && !kept.has(entry.name)) {
      await fs.rm(path.join(OUT, entry.name), { recursive: true });
    }
  }
  console.log(
    `examples/${BASE_VARIANT_DIR}: ${kept.size} examples, ${files} files`,
  );
}

await main();
