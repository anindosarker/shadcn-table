// Spec 66 audit reader: opens code panels in a browser, reads the text they
// show and classifies it against D142 (the table's own code, complete enough
// to copy and run, never the test).
//
// Run from the root of a checkout with dependencies installed (playwright and
// typescript resolve from packages/shadcn-table), against a server you start:
//
//   node read-panels.mjs storybook <url> --out rows.json [--ids first-per-file]
//     <url>: a static Storybook of one base, e.g. http://127.0.0.1:5341
//     (python3 -m http.server -d packages/shadcn-table/storybook-static/base).
//     Reads <url>/index.json, opens the manager once and switches story by
//     history.pushState + popstate; reads the Code panel
//     ([id$="tabpanel-storybook/docs/panel"] pre). Story files are read from
//     packages/shadcn-table/stories to tell an import from a file-local name.
//     --only id,id reads those ids only.
//   node read-panels.mjs docs <url> --out rows.json [--pages a,b,...]
//     <url>: a production docs server (next start). Reads every page of
//     apps/shadcn-table-docs/content/docs/examples/*.mdx, examples/more/*.mdx
//     and guides/*.mdx with localStorage st-example-mode=code, every example
//     panel (article [data-mode]) on it, every file of its file tree, and
//     every item of a guide's Example section (Next: button).
//
// Resumable: rows are written to --out as they are read; ids or pages already
// in the file are skipped. Classes (a panel can carry several):
//   complete    table code (ShadcnTable / useShadcnTable) and every name it
//               uses is declared in the text, imported from a package (the
//               Storybook panel shows no import lines, so a package import of
//               the story file counts as present) or a global
//   no-columns-data  table code, but names it uses (columns, data, helpers)
//               are declared only in the story file or a relative import,
//               or it passes no columns and data and no table instance
//   wrapper     no table code: it renders a component, or calls a story
//               factory, declared elsewhere
//   other       none of the above (empty panel, no table, no component)
//   test        the text holds a test: play, expect(, userEvent, within(,
//               storybook/test
// pass = complete and not test.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = process.cwd();
const require = createRequire(
  path.join(ROOT, 'packages/shadcn-table/package.json'),
);
const ts = require('typescript');
const { chromium } = require('playwright');

const [mode, baseUrl, ...rest] = process.argv.slice(2);
const opt = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i === -1 ? undefined : rest[i + 1];
};
const OUT = opt('out');
if (!['storybook', 'docs'].includes(mode) || !baseUrl || !OUT) {
  console.error('usage: read-panels.mjs storybook|docs <url> --out <json>');
  process.exit(2);
}
const STORIES = path.join(ROOT, 'packages/shadcn-table/stories');
const DOCS = path.join(ROOT, 'apps/shadcn-table-docs/content/docs');

const rows = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const save = () => fs.writeFileSync(OUT, JSON.stringify(rows, null, 1));

// ---------- classification ----------

const TEST_RE = /\bplay\s*[:=]|\bexpect\(|\buserEvent\b|\bwithin\(|storybook\/test/;
const TABLE_RE = /\b(ShadcnTable|useShadcnTable)\b/;
const BROWSER_GLOBALS = new Set(
  'window document console navigator location localStorage sessionStorage fetch alert confirm prompt setTimeout clearTimeout setInterval clearInterval requestAnimationFrame cancelAnimationFrame HTMLElement HTMLInputElement HTMLDivElement HTMLButtonElement HTMLTableRowElement HTMLTableCellElement Element Node Event MouseEvent KeyboardEvent PointerEvent CustomEvent ResizeObserver IntersectionObserver MutationObserver Blob File FileReader URL URLSearchParams AbortController crypto Intl structuredClone getComputedStyle DragEvent DataTransfer NodeFilter TouchEvent Touch FocusEvent InputEvent ClipboardEvent WheelEvent DOMRect Range Selection getSelection matchMedia Image performance queueMicrotask undefined arguments globalThis'.split(
    ' ',
  ),
);
const isGlobal = (n) =>
  BROWSER_GLOBALS.has(n) || n in globalThis || /^(HTML|SVG)\w*Element$/.test(n);

const parse = (text, name) =>
  ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

/** Parse a panel text: as a module, else as one expression (a story export). */
function parsePanel(text) {
  const sf = parse(text, 'panel.tsx');
  if (!sf.parseDiagnostics.length) return sf;
  const wrapped = parse(`const __panel = (\n${text}\n);`, 'panel.tsx');
  return wrapped.parseDiagnostics.length ? null : wrapped;
}

function bindingNames(name, out) {
  if (ts.isIdentifier(name)) out.add(name.text);
  else for (const el of name.elements ?? []) if (!ts.isOmittedExpression(el)) bindingNames(el.name, out);
}

/** Names declared anywhere in the text, and names it uses (values only). */
function names(sf) {
  const declared = new Set();
  const used = new Set();
  const visit = (node) => {
    if (ts.isTypeNode(node) && !ts.isExpressionWithTypeArguments(node)) return;
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isTypeParameterDeclaration(node)) {
      declared.add(node.name.text);
      return;
    }
    if (ts.isVariableDeclaration(node) || ts.isParameter(node) || ts.isBindingElement(node)) {
      if (!ts.isBindingElement(node) || node.parent) bindingNames(node.name, declared);
    }
    if ((ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isEnumDeclaration(node) || ts.isFunctionExpression(node) || ts.isClassExpression(node)) && node.name)
      declared.add(node.name.text);
    if (ts.isImportClause(node) && node.name) declared.add(node.name.text);
    if (ts.isImportSpecifier(node) || ts.isNamespaceImport(node)) declared.add(node.name.text);
    if (ts.isIdentifier(node)) {
      const p = node.parent;
      const skip =
        (ts.isPropertyAccessExpression(p) && p.name === node) ||
        (ts.isQualifiedName(p) && p.right === node) ||
        ((ts.isPropertyAssignment(p) || ts.isMethodDeclaration(p) || ts.isPropertyDeclaration(p) || ts.isGetAccessor(p) || ts.isSetAccessor(p) || ts.isEnumMember(p)) && p.name === node) ||
        (ts.isJsxAttribute(p) && p.name === node) ||
        (ts.isBindingElement(p) && p.propertyName === node) ||
        ((ts.isImportSpecifier(p) || ts.isExportSpecifier(p)) && p.propertyName === node) ||
        ((ts.isVariableDeclaration(p) || ts.isParameter(p) || ts.isBindingElement(p) || ts.isFunctionDeclaration(p) || ts.isFunctionExpression(p) || ts.isClassDeclaration(p) || ts.isImportSpecifier(p) || ts.isImportClause(p) || ts.isNamespaceImport(p) || ts.isEnumDeclaration(p)) && p.name === node) ||
        ts.isLabeledStatement(p) || ts.isBreakOrContinueStatement(p) ||
        ((ts.isJsxOpeningElement(p) || ts.isJsxSelfClosingElement(p) || ts.isJsxClosingElement(p)) && p.tagName === node && /^[a-z]/.test(node.text));
      if (!skip) used.add(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return { declared, used };
}

/** Top-level facts of a story file: package imports, file-local names, export shapes. */
const fileCache = new Map();
function storyFile(rel) {
  if (fileCache.has(rel)) return fileCache.get(rel);
  const text = fs.readFileSync(path.join(STORIES, rel), 'utf8');
  const sf = parse(text, rel);
  const pkg = new Set();
  const local = new Set();
  const shapes = {};
  const playAssigned = new Set();
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) {
      const spec = st.moduleSpecifier.text;
      const target = spec.startsWith('.') ? local : pkg;
      const c = st.importClause;
      if (c?.name) target.add(c.name.text);
      const nb = c?.namedBindings;
      if (nb && ts.isNamespaceImport(nb)) target.add(nb.name.text);
      if (nb && ts.isNamedImports(nb)) nb.elements.forEach((e) => target.add(e.name.text));
    } else if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        bindingNames(d.name, local);
        const exported = st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
        if (exported && ts.isIdentifier(d.name)) {
          const init = d.initializer;
          let shape = 'other';
          if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) shape = 'arrow';
          else if (init && ts.isCallExpression(init)) shape = `factory ${init.expression.getText(sf)}()`;
          else if (init && ts.isObjectLiteralExpression(init)) {
            const keys = init.properties.map((p) => p.name?.getText(sf)).filter(Boolean);
            const render = init.properties.find((p) => p.name?.getText(sf) === 'render');
            let r = '';
            if (render) {
              const v = ts.isPropertyAssignment(render) ? render.initializer : render;
              const body = v.body ?? v;
              const oneLine = body && (ts.isJsxSelfClosingElement(body) || ts.isJsxElement(body) || ts.isParenthesizedExpression(body));
              r = ts.isMethodDeclaration(render) || ts.isFunctionExpression(v) ? 'render function' : oneLine ? 'render one-line' : 'render block';
            }
            shape = `object {${keys.join(', ')}}${r ? ` (${r})` : ''}`;
          }
          shapes[d.name.text] = shape;
        }
      }
    } else if ((ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st) || ts.isEnumDeclaration(st) || ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) && st.name) {
      local.add(st.name.text);
    } else if (ts.isExpressionStatement(st) && ts.isBinaryExpression(st.expression)) {
      const l = st.expression.left;
      if (ts.isPropertyAccessExpression(l) && l.name.text === 'play' && ts.isIdentifier(l.expression)) playAssigned.add(l.expression.text);
    }
  }
  for (const n of playAssigned) if (shapes[n] === 'arrow') shapes[n] = 'arrow + X.play';
  const out = { pkg, local, shapes };
  fileCache.set(rel, out);
  return out;
}

/**
 * Classify one panel. `files`: [{path, text}]. `story`: the story file facts
 * for a Storybook panel (names the panel uses that the file imports from a
 * package count as present).
 */
function classify(files, story) {
  const all = files.map((f) => f.text).join('\n');
  const missing = new Set();
  let parsed = true;
  const paths = new Set(files.map((f) => f.path.replace(/^\//, '').replace(/\.(tsx?|jsx?)$/, '')));
  for (const f of files) {
    const sf = parsePanel(f.text);
    if (!sf) { parsed = false; continue; }
    const { declared, used } = names(sf);
    for (const n of used) {
      if (declared.has(n) || isGlobal(n)) continue;
      if (story?.pkg.has(n)) continue;
      missing.add(n);
    }
    // a relative import whose file the panel does not list
    for (const st of sf.statements) {
      if (ts.isImportDeclaration(st) && st.moduleSpecifier.text.startsWith('.')) {
        const target = path.posix.normalize(path.posix.join(path.posix.dirname(f.path.replace(/^\//, '')), st.moduleSpecifier.text)).replace(/\.(tsx?|jsx?)$/, '');
        if (![...paths].some((p) => p === target || p === `${target}/index`)) missing.add(`import ${st.moduleSpecifier.text}`);
      }
    }
  }
  const classes = [];
  const table = TABLE_RE.test(all);
  if (!all.trim()) classes.push('other');
  // a table with neither columns and data nor a table instance (the args
  // one-liner `<ShadcnTable />`) has nothing to copy
  else if (table)
    classes.push(missing.size || !(/\bcolumns\b/.test(all) && /\bdata\b/.test(all)) && !/table=\{/.test(all) ? 'no-columns-data' : 'complete');
  else if ([...missing].some((n) => !n.startsWith('import '))) classes.push('wrapper');
  else classes.push('other');
  if (TEST_RE.test(all)) classes.push('test');
  return {
    classes,
    pass: classes.length === 1 && classes[0] === 'complete',
    missing: [...missing].sort(),
    parsed,
  };
}

// ---------- Storybook ----------

const PANEL = '[id$="tabpanel-storybook/docs/panel"] pre';

async function readStorybook() {
  const index = await (await fetch(`${baseUrl}/index.json`)).json();
  let stories = Object.values(index.entries).filter((e) => e.type === 'story');
  if (opt('ids') === 'first-per-file') {
    const seen = new Set();
    stories = stories.filter((e) => !seen.has(e.importPath) && seen.add(e.importPath));
  }
  const only = opt('only')?.split(',');
  if (only) stories = stories.filter((e) => only.includes(e.id));
  const todo = stories.filter((e) => !rows[e.id]);
  console.log(`storybook: ${stories.length} ids, ${todo.length} to read`);
  if (!todo.length) return;
  const browser = await chromium.launch();
  let page = null;
  const read = () => page.evaluate((s) => document.querySelector(s)?.innerText ?? '', PANEL);
  // a fresh page loaded at the story (first id, and after a crash); the
  // manager channel's storyRendered events are kept in window.__q66
  const open = async (id) => {
    await page?.close().catch(() => {});
    page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    await page.addInitScript(() => {
      window.__q66 = new Set();
      const hook = setInterval(() => {
        const ch = window.__STORYBOOK_ADDONS_CHANNEL__;
        if (!ch) return;
        clearInterval(hook);
        ch.on('storyRendered', (a) => window.__q66.add(typeof a === 'string' ? a : a?.storyId));
      }, 5);
    });
    await page.goto(`${baseUrl}/?path=/story/${id}`, { waitUntil: 'load' });
    await page.waitForSelector(PANEL, { timeout: 60000 });
  };
  // The manager switches story in place (history.pushState + popstate). The
  // panel first shows the story's source as written and, for a story with
  // args, replaces it with the transformed snippet once the story rendered.
  // So: wait for storyRendered of the id (at most 20 s), then for the text
  // to stay the same for 800 ms.
  const show = async (id, fresh) => {
    if (fresh) await open(id);
    else
      await page.evaluate((id) => {
        window.__q66.delete(id);
        history.pushState({}, '', `?path=/story/${id}`);
        dispatchEvent(new PopStateEvent('popstate', { state: {} }));
      }, id);
    await page
      .waitForFunction((id) => window.__q66.has(id), id, { timeout: 20000, polling: 50 })
      .catch(() => {});
    let text = await read();
    for (;;) {
      await page.waitForTimeout(800);
      const again = await read();
      if (again === text) break;
      text = again;
    }
    return text;
  };
  let fresh = true;
  const t0 = Date.now();
  for (const [i, e] of todo.entries()) {
    let text;
    let crashed = false;
    try {
      text = await show(e.id, fresh);
    } catch {
      // the tab crashed (the story's render): once more on a fresh page
      try {
        text = await show(e.id, true);
      } catch (err) {
        crashed = String(err.message).split('\n')[0];
        text = '';
      }
    }
    fresh = !!crashed;
    const rel = e.importPath.replace(/^\.\/stories\//, '');
    const story = storyFile(rel);
    rows[e.id] = {
      id: e.id,
      title: e.title,
      name: e.name,
      file: rel,
      exportName: e.exportName,
      shape: story.shapes[e.exportName] ?? 'unknown',
      text,
      ...(crashed ? { crashed } : {}),
      ...classify([{ path: 'panel.tsx', text }], story),
    };
    if (i % 10 === 9) save();
  }
  save();
  console.log(`read ${todo.length} in ${Math.round((Date.now() - t0) / 1000)} s`);
  await browser.close();
}

// ---------- docs ----------

function docsPages() {
  const list = (dir, prefix) =>
    fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).map((f) => `${prefix}/${f.replace(/\.mdx$/, '').replace(/^index$/, '')}`.replace(/\/$/, ''));
  return [
    ...list(path.join(DOCS, 'examples'), '/docs/examples'),
    ...list(path.join(DOCS, 'examples/more'), '/docs/examples/more'),
    ...list(path.join(DOCS, 'guides'), '/docs/guides'),
  ];
}

async function readPanel(page, handle) {
  // every file of the tree; a panel with no tree shows one file
  const fileRows = await handle.$$('[data-tree-row]:not([data-folder])');
  const header = async () => (await handle.$eval('[data-slot="code-explorer"] span.font-mono', (e) => e.textContent.trim()).catch(() => ''));
  const pre = async () => (await handle.$eval('[data-slot="code"] pre', (e) => e.innerText).catch(() => ''));
  const files = [];
  if (!fileRows.length) {
    files.push({ path: await header(), text: await pre() });
  } else {
    for (const r of fileRows) {
      const name = (await r.textContent()).trim();
      await r.click();
      let text = '';
      for (let k = 0; k < 30; k++) {
        await page.waitForTimeout(100);
        if ((await header()).endsWith(`/${name}`) || (await header()) === name) { text = await pre(); break; }
      }
      files.push({ path: await header(), text });
    }
  }
  return files;
}

async function readDocs() {
  const only = opt('pages')?.split(',');
  const pages = only ?? docsPages();
  const todo = pages.filter((p) => !rows[p]);
  console.log(`docs: ${pages.length} pages, ${todo.length} to read`);
  if (!todo.length) return;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  await ctx.addInitScript(() => {
    try { localStorage.setItem('st-example-mode', 'code'); } catch {}
  });
  const page = await ctx.newPage();
  const t0 = Date.now();
  for (const [i, p] of todo.entries()) {
    const kind = p.startsWith('/docs/examples/more/') ? 'story' : p.startsWith('/docs/examples/') ? 'example' : 'guide';
    const res = await page.goto(baseUrl + p, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => null);
    await page.waitForTimeout(300);
    const panels = [];
    const ids = await page.$$eval('article [data-mode]', (els) => els.map((e) => e.id));
    for (const id of ids) {
      const guideSection = id.startsWith('guide-example-');
      const seen = new Set();
      for (let step = 0; step < 20; step++) {
        const handle = await page.$(guideSection ? 'article [id^="guide-example-"][data-mode]' : `article [id="${id}"]`);
        if (!handle) break;
        const cur = await handle.getAttribute('id');
        if (seen.has(cur)) break;
        seen.add(cur);
        if ((await handle.getAttribute('data-mode')) === 'preview') {
          await (await handle.$('button:text-is("Code")'))?.click();
          await page.waitForTimeout(200);
        }
        const files = await readPanel(page, handle);
        const panelKind = kind === 'guide' ? (guideSection ? 'guide-example' : 'guide-inline') : kind;
        panels.push({ id: cur, kind: panelKind, files, ...classify(files) });
        if (!guideSection) break;
        const next = await handle.$('button[aria-label^="Next: "]');
        if (!next) break;
        await next.click();
        await page.waitForTimeout(600);
      }
    }
    rows[p] = { page: p, kind, status: res?.status() ?? 0, panels };
    if (i % 10 === 9) save();
  }
  save();
  console.log(`read ${todo.length} in ${Math.round((Date.now() - t0) / 1000)} s`);
  await browser.close();
}

// --reclassify: classify the stored texts again, read nothing
if (rest.includes('--reclassify')) {
  for (const r of Object.values(rows)) {
    if (mode === 'storybook') {
      const story = storyFile(r.file);
      Object.assign(r, { shape: story.shapes[r.exportName] ?? 'unknown' }, classify([{ path: 'panel.tsx', text: r.text }], story));
    } else for (const p of r.panels) Object.assign(p, classify(p.files));
  }
  save();
} else await (mode === 'storybook' ? readStorybook() : readDocs());
