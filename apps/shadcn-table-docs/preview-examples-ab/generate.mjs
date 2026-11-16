// PREVIEW ONLY: generates two throwaway Examples sidebars (EX A, EX B) for the owner to compare; never ship, delete with --clean.
/**
 * Writes content/docs/examples-a/ ("Examples A: regrouped") and
 * content/docs/examples-b/ ("Examples B: Storybook groups") from the two
 * sidebar drafts in the release plan's reference/docs-layout folder:
 *   sidebar-with-stories.md            (A: 12 groups, one table per group)
 *   sidebar-storybook-groups-as-is.md  (B: 9 docs groups, then every story file)
 *
 * Each row becomes one stub page whose body is one line of links: the story in
 * the deployed Storybook and/or the real docs page /docs/examples/<slug>.
 * Story ids follow Storybook's rule (storybook/internal/csf toId and
 * storyNameFromExport), from the story file's meta title and export name.
 *
 * Run from apps/shadcn-table-docs:
 *   node preview-examples-ab/generate.mjs           regenerate both sections
 *   node preview-examples-ab/generate.mjs --clean   delete both sections
 * Markdown sources default to the main checkout's plan folder; override with
 *   --a <path> --b <path>.
 * The rest of the demo is marked "preview-examples-ab" in lib/source.ts,
 * lib/layout.shared.tsx, components/sidebar-section-tabs.tsx and the routes
 * that read lib/source.ts publicSource.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = path.join(appDir, 'content/docs');
const storiesDir = path.resolve(appDir, '../../packages/shadcn-table/stories');
const STORYBOOK = 'https://storybook.shadcn-table.com/base/';
const SECTIONS = {
  a: { dir: 'examples-a', title: 'Examples A: regrouped' },
  b: { dir: 'examples-b', title: 'Examples B: Storybook groups' },
};
const MORE_DIR = 'more';

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};

for (const { dir } of Object.values(SECTIONS))
  fs.rmSync(path.join(docsDir, dir), { recursive: true, force: true });
if (args.includes('--clean')) {
  console.log('removed content/docs/examples-a and content/docs/examples-b');
  process.exit(0);
}

// The drafts live in the main checkout's plan folder (worktrees share its .git).
const mainRoot = path.dirname(
  path.resolve(
    appDir,
    execSync('git rev-parse --git-common-dir', { cwd: appDir })
      .toString()
      .trim(),
  ),
);
const refDir = path.join(
  mainRoot,
  '.ai/plans/v0.9.x/anindosarker/reference/docs-layout',
);
const mdA = fs.readFileSync(
  arg('--a') ?? path.join(refDir, 'sidebar-with-stories.md'),
  'utf8',
);
const mdB = fs.readFileSync(
  arg('--b') ?? path.join(refDir, 'sidebar-storybook-groups-as-is.md'),
  'utf8',
);

// ---- Storybook ids (same rule as storybook/internal/csf) -------------------

const sanitize = (s) =>
  s
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
const storyNameFromExport = (key) =>
  key
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\./g, ' ')
    .replace(/([^\n])([A-Z])([a-z])/g, (_, a, b, c) => `${a} ${b}${c}`)
    .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a} ${b}`)
    .replace(/([a-z])([0-9])/gi, (_, a, b) => `${a} ${b}`)
    .replace(/([0-9])([a-z])/gi, (_, a, b) => `${a} ${b}`)
    .replace(/(\s|^)(\w)/g, (_, a, b) => `${a}${b.toUpperCase()}`)
    .replace(/ +/g, ' ')
    .trim();
const toId = (title, exportName) =>
  `${sanitize(title)}--${sanitize(storyNameFromExport(exportName))}`;
const storyUrl = (id) => `${STORYBOOK}?path=/story/${id}`;

/** Story files by path ("features/Editing") and by meta title (lowercase). */
const byPath = new Map();
const byTitle = new Map();
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.stories.tsx')) {
      const src = fs.readFileSync(full, 'utf8');
      const title = src.match(/^\s*title:\s*['"](.+?)['"]/m)?.[1];
      if (!title) throw new Error(`no meta title in ${full}`);
      const exports = [...src.matchAll(/^export const (\w+)/gm)].map(
        (m) => m[1],
      );
      const file = { title, exports };
      byPath.set(
        path.relative(storiesDir, full).replace(/\.stories\.tsx$/, ''),
        file,
      );
      byTitle.set(title.toLowerCase(), file);
    }
  }
})(storiesDir);

/** "features/Editing / EditingEnabledEditModeModalDefault" to a story id. */
function idFromRef(ref) {
  const [filePath, exportName] = ref.split(' / ').map((s) => s.trim());
  const file = byPath.get(filePath);
  if (!file || !file.exports.includes(exportName))
    throw new Error(`story not found: ${ref}`);
  return toId(file.title, exportName);
}

/** Docs example slug to story id, as the toolbar Storybook button uses it. */
const storybookMap = Object.fromEntries(
  [
    ...fs
      .readFileSync(path.join(appDir, 'lib/storybook-map.ts'), 'utf8')
      .matchAll(/^\s*'?([a-z0-9-]+)'?:\s*'([a-z0-9-]+--[a-z0-9-]+)'/gm),
  ].map((m) => [m[1], m[2]]),
);

// ---- Markdown tables --------------------------------------------------------

const cells = (line) =>
  line
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim().replace(/^`|`$/g, ''));
const isRow = (line) =>
  line.startsWith('|') && !/^\|\s*-/.test(line) && !/^\| Example \|/.test(line);

/** A: "## <n>. Group" sections, rows Example | Today in | Docs page | Story | To do. */
function parseA(md) {
  const groups = [];
  for (const line of md.split('\n')) {
    const head = line.match(/^## \d+\. (.+)$/);
    if (head) groups.push({ name: head[1], rows: [] });
    else if (/^## /.test(line)) groups.at(-1) && (groups.at(-1).done = true);
    else if (groups.length && !groups.at(-1).done && isRow(line)) {
      const [name, , docs, story] = cells(line);
      groups.at(-1).rows.push({
        name,
        docs: docs || undefined,
        storyId: story ? idFromRef(story) : undefined,
      });
    }
  }
  return groups;
}

/** B: part 1 "### Group" docs tables, part 2 "#### <story title> (n stories...)". */
function parseB(md) {
  const groups = [];
  let part = 0;
  let file;
  for (const line of md.split('\n')) {
    if (/^## Part 1/.test(line)) part = 1;
    else if (/^## Part 2/.test(line)) part = 2;
    else if (part === 1 && /^### /.test(line)) {
      const name = line.slice(4).trim();
      // The first docs group has no label in the real sidebar.
      groups.push({ name, label: !/\(no group label\)/.test(name), rows: [] });
    } else if (part === 2 && /^#### /.test(line)) {
      const title = line
        .slice(5)
        .replace(/ \(\d+ stories.*\)$/, '')
        .trim();
      file = byTitle.get(title.toLowerCase());
      if (!file) throw new Error(`story file not found: ${title}`);
      // Storybook groups sit in the collapsible "More examples" folder.
      groups.push({ name: title, label: true, more: true, rows: [] });
    } else if (part && groups.length && isRow(line)) {
      const c = cells(line);
      if (part === 1) {
        const [name, inToday, docs] = c;
        groups.at(-1).rows.push({
          name,
          docs,
          storyId: inToday === 'Both' ? storybookMap[docs] : undefined,
        });
        if (inToday === 'Both' && !storybookMap[docs])
          throw new Error(`no storybook-map entry for ${docs}`);
      } else {
        // Row names are export names with spaces ("Loading5" stays as is).
        const exportName = file.exports.find(
          (e) =>
            e.toLowerCase() === c[0].replace(/[^a-z0-9]/gi, '').toLowerCase(),
        );
        if (!exportName) throw new Error(`story not found: ${c[0]}`);
        groups
          .at(-1)
          .rows.push({ name: c[0], storyId: toId(file.title, exportName) });
      }
    }
  }
  // Owner's Featured group (docs-layout discussion 2026-11-16): six docs
  // examples lead the sidebar under short names; each leaves its own group.
  // Docs rows drop the word "Example"; the old unlabelled rows become "Starter".
  const FEATURED = [
    ['basic', 'Basic'],
    ['filter-variants', 'Column Filters'],
    ['react-query', 'Server-Side Pagination'],
    ['editing-crud-inline-row', 'Inline Editing'],
    ['virtualized', 'Virtualization'],
    ['advanced', 'Advanced'],
  ];
  const docsGroups = groups.filter((g) => !g.more);
  const featured = { name: 'Featured', label: true, rows: [] };
  for (const [slug, name] of FEATURED) {
    const from = docsGroups.find((g) => g.rows.some((r) => r.docs === slug));
    if (!from) throw new Error(`featured example not found: ${slug}`);
    const row = from.rows.splice(
      from.rows.findIndex((r) => r.docs === slug),
      1,
    )[0];
    featured.rows.push({ ...row, name });
  }
  for (const g of docsGroups) {
    if (g.label === false) Object.assign(g, { name: 'Starter', label: true });
    for (const r of g.rows) r.name = r.name.replace(/ Example$/, '');
  }
  groups.unshift(featured);
  return groups;
}

// ---- Output -----------------------------------------------------------------

const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const yaml = (s) => JSON.stringify(s);

function write(key, groups) {
  const { dir, title } = SECTIONS[key];
  const out = path.join(docsDir, dir);
  fs.mkdirSync(out, { recursive: true });

  // A name that repeats in the section gets its group as a slug prefix.
  const counts = new Map();
  for (const g of groups)
    for (const r of g.rows)
      counts.set(kebab(r.name), (counts.get(kebab(r.name)) ?? 0) + 1);
  const used = new Set();
  const pages = [];
  // Rows of `more` groups go to the sub-folder more/ (meta.json defaultOpen
  // false): one collapsible "More examples" group below the docs groups.
  const morePages = [];
  const moreDir = path.join(out, MORE_DIR);
  let rows = 0;

  for (const g of groups) {
    const list = g.more ? morePages : pages;
    const dirOut = g.more ? moreDir : out;
    if (g.more) fs.mkdirSync(moreDir, { recursive: true });
    // Group labels carry their row count, rows a running number, so the size is visible.
    if (g.label !== false) list.push(`---${g.name} (${g.rows.length})---`);
    for (const r of g.rows) {
      let slug = kebab(r.name);
      if (counts.get(slug) > 1 || used.has(slug))
        slug = `${kebab(g.name)}-${slug}`;
      for (let n = 2; used.has(slug); n++)
        slug = `${slug.replace(/-\d+$/, '')}-${n}`;
      used.add(slug);
      list.push(slug);
      rows++;

      const links = [];
      if (r.storyId)
        links.push(`[Storybook: ${r.storyId}](${storyUrl(r.storyId)})`);
      if (r.docs)
        links.push(`[Docs page: ${r.docs}](/docs/examples/${r.docs})`);
      const where =
        r.storyId && r.docs ? 'Both' : r.docs ? 'Docs' : 'Storybook';
      fs.writeFileSync(
        path.join(dirOut, `${slug}.mdx`),
        `---\ntitle: ${yaml(`${rows}. ${r.name}`)}\ndescription: ${yaml(`Preview stub in ${g.name.replace(/ \(no group label\)$/, '')}. Today in: ${where}.`)}\n---\n\n${links.join(' | ')}\n`,
      );
    }
  }

  if (morePages.length) {
    const moreRows = morePages.filter((p) => !p.startsWith('---')).length;
    pages.push(MORE_DIR);
    fs.writeFileSync(
      path.join(moreDir, 'meta.json'),
      `${JSON.stringify(
        {
          title: `More examples (${moreRows})`,
          description:
            'PREVIEW ONLY: generated by preview-examples-ab/generate.mjs; collapsed by default (defaultOpen false), its sub-group labels do not collapse.',
          defaultOpen: false,
          pages: morePages,
        },
        null,
        2,
      )}\n`,
    );
  }

  fs.writeFileSync(
    path.join(out, 'meta.json'),
    `${JSON.stringify(
      {
        title,
        description:
          'PREVIEW ONLY: generated by preview-examples-ab/generate.mjs for the sidebar comparison; never ship.',
        root: true,
        defaultOpen: true,
        pages,
      },
      null,
      2,
    )}\n`,
  );
  console.log(`${dir}: ${groups.length} groups, ${rows} rows`);
}

write('a', parseA(mdA));
write('b', parseB(mdB));
