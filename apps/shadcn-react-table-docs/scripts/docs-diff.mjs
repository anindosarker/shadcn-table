#!/usr/bin/env node
/**
 * docs-diff: verify that every synced page in content/docs still mirrors its
 * MRT source (../material-react-table-docs/pages/docs/**\/*.mdx).
 *
 * Per page it compares, after library-name normalisation:
 *   1. title and description (MRT: <Head> block; SRT: frontmatter)
 *   2. the heading list, in order (`#` lines outside code fences)
 *   3. the component tag list, in order (PascalCase JSX tags at line start
 *      outside code fences; MRT example imports are rewritten to their
 *      registry names the same way scripts/sync-mrt-docs.mjs does)
 *
 * Usage:
 *   node scripts/docs-diff.mjs                 # every MRT page
 *   node scripts/docs-diff.mjs guides/sorting.mdx api/mrt-hooks.mdx
 *   node scripts/docs-diff.mjs --json
 *   node scripts/docs-diff.mjs --allow scripts/docs-diff.allow.json
 *
 * The allowlist is `{ "<srt rel path>": ["<exact diff line>", ...] }`; listed
 * lines (for PAGE_RULES deviations) do not count as diffs. Default file:
 * scripts/docs-diff.allow.json when present. Exit 1 when any diff is not
 * allowed or an SRT page is missing.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const MRT_PAGES = path.resolve(
  APP_DIR,
  '..',
  'material-react-table-docs',
  'pages',
  'docs',
);
const SRT_PAGES = path.join(APP_DIR, 'content', 'docs');
const DEFAULT_ALLOW = path.join(APP_DIR, 'scripts', 'docs-diff.allow.json');

/** MRT pages that have no SRT twin by design. */
const SKIP = [
  /^blog\//,
  'about.mdx',
  'changelog.mdx',
  'roadmap.mdx',
  'getting-started/migrating-to-v3.mdx',
  'index.mdx',
];

/**
 * MRT page path -> content/docs path. Copy of OUTPUT_PATHS in
 * scripts/sync-mrt-docs.mjs (not exported there). Keep both in sync.
 */
const OUTPUT_PATHS = {
  'api/mrt-components.mdx': 'api/srt-components.mdx',
  'api/mrt-hooks.mdx': 'api/srt-hooks.mdx',
};

/**
 * Tags that TEXT_MAP in scripts/sync-mrt-docs.mjs turns into something that
 * is not a PascalCase tag any more (null) or into another tag (string).
 */
const TAG_MAP = {
  Head: null, // removed with the <Head> block
  InstallCommand: null, // becomes a ```bash fence
  Box: null, // becomes <span>
  SimpleCodeSandbox: 'BasicExample',
  // rewriteExampleTags renames the usage.mdx import first
  SimpleCodeSandboxExample: 'BasicExample',
};

/**
 * Normalisation applied to both sides so the library-name replacements of
 * TEXT_MAP / TITLE_MAP (sync script, not exported) do not count as diffs:
 * lowercase, strip the mapped names, collapse whitespace.
 */
const NAME_STRIP = [
  / - material react table( v\d)? docs$/,
  /shadcn react table|material react table/g,
  /shadcnreacttable|materialreacttable/g,
  /shadcn-react-table|material-react-table/g,
  /shadcn\/ui|material ui/g,
  /mrt|srt/g,
  /\bmui/g,
];

function normText(s) {
  let out = s.toLowerCase();
  for (const re of NAME_STRIP) out = out.replace(re, '');
  return out
    .replace(/tablepaperprops/g, 'tablelayoutprops')
    .replace(/\s+/g, ' ')
    .trim();
}

function normTitle(s) {
  return normText(s).replace(/\bv3\b/g, 'v1');
}

function normTag(name) {
  return name
    .replace(/MaterialReactTable|ShadcnReactTable/g, '')
    .replace(/MRT|SRT/g, '')
    .replace(/^Mui(?=[A-Z])/, '')
    .toLowerCase();
}

/* ---- MRT side: same parsing as the sync script -------------------------- */

const pascal = (s) =>
  s
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join('');

/** Copy of rewriteExampleTags in scripts/sync-mrt-docs.mjs. */
function rewriteExampleTags(src) {
  const re =
    /^import\s+(\w+)\s+from\s+['"][./]*\/(examples|example-groups)\/([^'"/]+)['"];?/gm;
  const renames = [];
  for (const m of src.matchAll(re)) {
    const [, local, kind, folder] = m;
    const target = kind === 'examples' ? `${pascal(folder)}Example` : folder;
    if (local !== target) renames.push([local, target]);
  }
  return renames.reduce(
    (acc, [from, to]) =>
      acc.replace(new RegExp(`<${from}(?=[\\s/>])`, 'g'), `<${to}`),
    src,
  );
}

/** Copy of extractHead in scripts/sync-mrt-docs.mjs. */
/**
 * Example pages render one example instead of the group tab strip. Copy of
 * groupPanels / renderSingleExample in scripts/sync-mrt-docs.mjs: the panel
 * map of example-groups/<group>.tsx resolves a page slug to its registry
 * example name.
 */
const EXAMPLE_GROUPS = path.join(APP_DIR, 'example-groups');
const groupPanelsCache = new Map();

async function groupPanels(group) {
  if (groupPanelsCache.has(group)) return groupPanelsCache.get(group);
  const src = await fs.readFile(
    path.join(EXAMPLE_GROUPS, `${group}.tsx`),
    'utf8',
  );
  const folders = new Map();
  for (const m of src.matchAll(
    /^import\s+(\w+)\s+from\s+'@\/examples\/([^']+)';/gm,
  )) {
    folders.set(m[1], m[2]);
  }
  const panels = new Map();
  for (const m of src.matchAll(/^\s+'?([\w-]+)'?:\s*<(\w+)\s*\/>,?$/gm)) {
    const folder = folders.get(m[2]);
    if (folder) panels.set(m[1], `${pascal(folder)}Example`);
  }
  groupPanelsCache.set(group, panels);
  return panels;
}

async function renderSingleExample(rel, src) {
  if (!rel.startsWith('examples/')) return src;
  const m = src.match(/^<(\w+) isPage \/>$/m);
  if (!m) return src;
  const example = (await groupPanels(m[1])).get(path.basename(rel, '.mdx'));
  return example ? src.replace(m[0], `<${example} />`) : src;
}

function extractHead(src) {
  const m = src.match(/<Head>([\s\S]*?)<\/Head>\s*\n?/);
  if (!m) return { body: src, title: '', description: '' };
  const head = m[1];
  const t = head.match(
    /<title>\s*(?:\{\s*['"`])?([\s\S]*?)(?:['"`]\s*\})?\s*<\/title>/,
  );
  const d = head.match(
    /<meta\s+name="description"\s+content=(?:"([^"]*)"|\{\s*['"`]([\s\S]*?)['"`]\s*\})/,
  );
  return {
    body: src.replace(m[0], ''),
    title: (t?.[1] ?? '').trim(),
    description: (d?.[1] ?? d?.[2] ?? '').replace(/\s+/g, ' ').trim(),
  };
}

async function parseMrt(src, rel) {
  const { body, title, description } = extractHead(src);
  const rewritten = await renderSingleExample(rel, rewriteExampleTags(body));
  const tags = [];
  for (const t of collectTags(rewritten)) {
    const mapped = t in TAG_MAP ? TAG_MAP[t] : t;
    if (mapped) tags.push(mapped);
  }
  return {
    title,
    description,
    headings: dropTitleHeading(collectHeadings(rewritten), title),
    tags,
  };
}

/* ---- SRT side ------------------------------------------------------------ */

function yamlScalar(raw) {
  const s = raw.trim();
  if (s.startsWith('"')) {
    try {
      return JSON.parse(s);
    } catch {
      return s.slice(1, -1);
    }
  }
  if (s.startsWith("'")) return s.slice(1, -1).replaceAll("''", "'");
  return s;
}

function parseSrt(src) {
  let title = '';
  let description = '';
  let body = src;
  const fm = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    body = src.slice(fm[0].length);
    for (const line of fm[1].split('\n')) {
      const m = line.match(/^(title|description):\s*(.*)$/);
      if (!m) continue;
      if (m[1] === 'title') title = yamlScalar(m[2]);
      else description = yamlScalar(m[2]);
    }
  }
  return {
    title,
    description,
    headings: collectHeadings(body),
    tags: collectTags(body),
  };
}

/* ---- shared scanners ------------------------------------------------------ */

/** Lines of `src` that are outside ``` / ~~~ fences. */
function proseLines(src) {
  const out = [];
  let fence = null;
  for (const line of src.split('\n')) {
    const f = line.match(/^\s*(`{3,}|~{3,})/);
    if (f) {
      if (!fence) fence = f[1][0];
      else if (f[1][0] === fence) fence = null;
      continue;
    }
    if (!fence) out.push(line);
  }
  return out;
}

/**
 * scripts/sync-mrt-docs.mjs drops the first body heading when it repeats the
 * page title (dropTitleHeading there, word-set rule); the MRT heading list
 * gets the same treatment before the comparison. Copy of TITLE_STOPWORDS /
 * titleWords / headingRepeatsTitle; the library names are already gone
 * through normText / normTitle.
 */
const TITLE_STOPWORDS = new Set([
  'feature',
  'guide',
  'example',
  'examples',
  'props',
  'the',
  'a',
]);

function titleWords(text) {
  const words = text
    .replace(/\([^)]*\)/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !TITLE_STOPWORDS.has(w));
  return new Set(words);
}

function headingRepeatsTitle(heading, title) {
  const h = titleWords(heading);
  const t = titleWords(title);
  if (!h.size || !t.size) return false;
  const [small, large] = h.size <= t.size ? [h, t] : [t, h];
  return [...small].every((w) => large.has(w));
}

function dropTitleHeading(headings, title) {
  if (!headings.length) return headings;
  const first = normText(headings[0].replace(/^#{1,6} +/, ''));
  return headingRepeatsTitle(first, normTitle(title))
    ? headings.slice(1)
    : headings;
}

function collectHeadings(src) {
  return proseLines(src)
    .filter((l) => /^#{1,6} /.test(l))
    .map((l) => l.trim());
}

function collectTags(src) {
  const out = [];
  for (const l of proseLines(src)) {
    const m = l.match(/^\s*<([A-Z][A-Za-z0-9_]*)(?=[\s/>]|$)/);
    if (m) out.push(m[1]);
  }
  return out;
}

/* ---- diffing ------------------------------------------------------------ */

/**
 * LCS diff of two string arrays on their normalised keys. Returns
 * `[['-', aItem] | ['+', bItem], ...]` for the items that do not pair up.
 */
function listDiff(a, b, key) {
  const ka = a.map(key);
  const kb = b.map(key);
  const n = ka.length;
  const m = kb.length;
  const lcs = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] =
        ka[i] === kb[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const out = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (ka[i] === kb[j]) {
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      out.push(['-', a[i++]]);
    } else {
      out.push(['+', b[j++]]);
    }
  }
  while (i < n) out.push(['-', a[i++]]);
  while (j < m) out.push(['+', b[j++]]);
  return out;
}

function comparePage(mrt, srt) {
  const lines = [];
  if (normTitle(mrt.title) !== normTitle(srt.title)) {
    lines.push(
      `title: MRT ${JSON.stringify(mrt.title)} vs SRT ${JSON.stringify(srt.title)}`,
    );
  }
  if (normText(mrt.description) !== normText(srt.description)) {
    lines.push(
      `description: MRT ${JSON.stringify(mrt.description)} vs SRT ${JSON.stringify(srt.description)}`,
    );
  }
  for (const [sign, h] of listDiff(mrt.headings, srt.headings, normText)) {
    lines.push(`${sign} heading: ${h}`);
  }
  for (const [sign, t] of listDiff(mrt.tags, srt.tags, normTag)) {
    lines.push(`${sign} tag: <${t}>`);
  }
  return lines;
}

/* ---- driver ------------------------------------------------------------- */

async function listPages() {
  const out = [];
  async function walk(dir) {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name.endsWith('.mdx')) out.push(path.relative(MRT_PAGES, p));
    }
  }
  await walk(MRT_PAGES);
  return out.sort();
}

const isSkipped = (rel) =>
  SKIP.some((s) => (s instanceof RegExp ? s.test(rel) : s === rel));

function parseArgs(argv) {
  const opts = { json: false, allow: null, pages: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') opts.json = true;
    else if (a === '--allow') opts.allow = argv[++i];
    else if (a.startsWith('--allow=')) opts.allow = a.slice('--allow='.length);
    else opts.pages.push(a);
  }
  return opts;
}

async function loadAllow(file) {
  const target = file ?? DEFAULT_ALLOW;
  try {
    return JSON.parse(await fs.readFile(target, 'utf8'));
  } catch (err) {
    if (!file && err.code === 'ENOENT') return {};
    throw new Error(`cannot read allowlist ${target}: ${err.message}`);
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const allow = await loadAllow(opts.allow);
  const pages = (opts.pages.length ? opts.pages : await listPages()).filter(
    (rel) => !isSkipped(rel),
  );

  const results = [];
  for (const rel of pages) {
    const srtRel = OUTPUT_PATHS[rel] ?? rel;
    const allowed = new Set(allow[srtRel] ?? []);
    const mrtSrc = await fs.readFile(path.join(MRT_PAGES, rel), 'utf8');
    let srtSrc;
    try {
      srtSrc = await fs.readFile(path.join(SRT_PAGES, srtRel), 'utf8');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      const line = 'missing: SRT page';
      results.push({
        mrt: rel,
        srt: srtRel,
        status: 'missing',
        diffs: allowed.has(line) ? [] : [line],
        allowed: allowed.has(line) ? [line] : [],
      });
      continue;
    }
    const lines = comparePage(await parseMrt(mrtSrc, rel), parseSrt(srtSrc));
    const diffs = lines.filter((l) => !allowed.has(l));
    results.push({
      mrt: rel,
      srt: srtRel,
      status: diffs.length ? 'diff' : 'ok',
      diffs,
      allowed: lines.filter((l) => allowed.has(l)),
    });
  }

  const ok = results.filter((r) => r.status === 'ok').length;
  const diff = results.filter((r) => r.status === 'diff').length;
  const missing = results.filter((r) => r.status === 'missing').length;
  const summary = `${ok} ok, ${diff} diff, ${missing} missing SRT page`;

  if (opts.json) {
    console.log(
      JSON.stringify(
        { pages: results, summary: { ok, diff, missing } },
        null,
        2,
      ),
    );
  } else {
    for (const r of results) {
      if (r.status === 'ok') console.log(`OK ${r.srt}`);
      else if (r.status === 'missing')
        console.log(`MISSING ${r.srt} (from ${r.mrt})`);
      else {
        console.log(`DIFF ${r.srt}`);
        for (const l of r.diffs) console.log(`  ${l}`);
      }
    }
    console.log(summary);
  }

  const failing = results.some((r) => r.diffs.length > 0);
  process.exitCode = failing ? 1 : 0;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
