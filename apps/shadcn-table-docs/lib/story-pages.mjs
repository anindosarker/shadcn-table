#!/usr/bin/env node
/**
 * Story pages (spec 56, D106, D103): every Storybook story that is not the
 * exact story of an example page (lib/storybook-map.ts) gets a docs page
 * under content/docs/examples/more/<story id>.mdx, and more/meta.json lists
 * them in Storybook's order, one "---<story title>---" sub-group per story
 * file. The stories are read from packages/shadcn-table/stories with
 * Storybook's own CSF parser, so ids, names and order are the ones
 * Storybook gives them (storybook-static/<base>/index.json). more/index.mdx,
 * the folder's index page at /docs/examples/more, links every story page
 * under the same labels (v1.0.x D5), each with its sidebar number (v1.0.x
 * D7); it is written whole on every run.
 *
 * A new page holds the title, the sidebar label, the search title when the
 * story needs one (`storySearchTitle`) and the `<StoryExample id="..." />`
 * tag (components/story-example.tsx). A page that exists keeps everything it
 * holds (its description, its body text); only `title`, `sidebarTitle` and
 * `searchTitle` follow the story. A page whose story is gone is removed when
 * it holds no text; one that holds text (a description or body text besides
 * the StoryExample tag) is kept, and the script fails naming it: its text is
 * reviewed, so a person moves it or deletes the file.
 * Running it twice changes nothing.
 *
 * `pnpm test validate-repo` (test/validate-repo/lib/story-pages.mjs) fails
 * when the pages and the stories differ; this script fixes that.
 *
 * Usage (apps/shadcn-table-docs): node lib/story-pages.mjs
 */
import { existsSync, promises as fs, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadCsf } from 'storybook/internal/csf-tools';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/** The story files, as Storybook's `stories` glob finds them (.storybook/main.ts). */
export const STORIES_DIR = path.resolve(
  APP,
  '../../packages/shadcn-table/stories',
);
export const MORE_DIR = path.join(APP, 'content/docs/examples/more');
const EXAMPLES_META = path.join(APP, 'content/docs/examples/meta.json');
const STORYBOOK_MAP = path.join(APP, 'lib/storybook-map.ts');

/** The folder name of the story pages under content/docs/examples/. */
export const MORE_FOLDER = 'more';
const STORY_SUFFIX = '.stories.tsx';

/**
 * @typedef {object} Story
 * @property {string} id Storybook's story id, `<title>--<export>` in kebab case
 * @property {string} name the story's name as Storybook shows it
 * @property {string} title the meta title, "Features/Aggregation"
 * @property {string} exportName the named export in the story file
 * @property {string} file path under packages/shadcn-table/stories, `/` separated
 */

/**
 * Every story in Storybook's order: the story files sorted by path (the
 * order Storybook's index has without a `storySort`), each file's stories in
 * export order.
 * @returns {Promise<Story[]>}
 */
export async function readStories() {
  const files = (await fs.readdir(STORIES_DIR, { recursive: true }))
    .map((file) => file.split(path.sep).join('/'))
    .filter((file) => file.endsWith(STORY_SUFFIX) && !file.startsWith('.'))
    .sort();
  /** @type {Story[]} */
  const stories = [];
  for (const file of files) {
    const code = await fs.readFile(path.join(STORIES_DIR, file), 'utf8');
    const csf = loadCsf(code, {
      fileName: file,
      makeTitle: (title) => title,
    }).parse();
    const title = csf.meta.title;
    if (!title) throw new Error(`${file}: the meta has no title`);
    // `_stories` is keyed by export name, in export order, like `stories`
    for (const [exportName, story] of Object.entries(csf._stories)) {
      stories.push({
        id: story.id,
        name: story.name ?? story.id,
        title,
        exportName,
        file,
      });
    }
  }
  return stories;
}

/**
 * The example page slug of each exact story, from the hand-kept map in
 * lib/storybook-map.ts (`'<slug>': '<story id>'` lines). The same parser is
 * `exampleSlugs` in packages/shadcn-table/.storybook/preview.tsx.
 * @returns {Map<string, string>} story id to example slug
 */
export function readExactStories() {
  const text = readFileSync(STORYBOOK_MAP, 'utf8');
  const body = text.slice(text.indexOf('storybookStoryId'));
  const block = body.slice(body.indexOf('{') + 1, body.indexOf('};'));
  const map = new Map();
  for (const match of block.matchAll(/^\s*'?([\w-]+)'?:\s*'([^']+)',?\s*$/gm)) {
    map.set(match[2], match[1]);
  }
  return map;
}

/**
 * The stories that get a page under more/, in Storybook's order: every story
 * but the exact stories of the example pages.
 * @param {Story[]} stories
 */
export function pageStories(stories) {
  const exact = readExactStories();
  return stories.filter((story) => !exact.has(story.id));
}

/**
 * more/meta.json: "More examples", closed until the visitor opens it or
 * visits a page inside it (components/sidebar-section.tsx), one
 * "---<title>---" label per story file that has a page.
 * @param {Story[]} pages
 */
export function moreMeta(pages) {
  /** @type {string[]} */
  const list = [];
  let title = '';
  for (const story of pages) {
    if (story.title !== title) {
      title = story.title;
      list.push(`---${title}---`);
    }
    list.push(story.id);
  }
  return {
    title: 'More examples',
    defaultOpen: false,
    pages: list,
  };
}

/**
 * The page `<title>` of a story page (v1.0.x D3): "<family>: <name>", the
 * family being the last part of the meta title, so two stories of the same
 * name in two files differ; undefined when the name already holds the family.
 * @param {Story} story
 * @returns {string | undefined}
 */
export function storySearchTitle(story) {
  const family = story.title.split('/').at(-1).trim();
  if (story.name.toLowerCase().includes(family.toLowerCase())) return undefined;
  return `${family}: ${story.name}`;
}

/** A YAML scalar for the frontmatter: single quotes, a quote doubled. */
const yamlString = (value) => `'${value.replaceAll("'", "''")}'`;

/** The list page of the folder, more/index.mdx (v1.0.x D5). */
export const LIST_PAGE = 'index.mdx';

/** Link text in MDX: the characters markdown or JSX would read escaped. */
const mdxText = (value) => value.replace(/[\\[\]*_`<>{}]/g, '\\$&');

/**
 * The sidebar number of the first story row (v1.0.x D7): the example pages
 * of examples/meta.json plus 1, the rule of `pageRows()` and `rowNumber()`
 * in lib/page-tree-utils.ts (separators and the folder index are no rows).
 * Fails on an entry the rule does not know.
 */
export function firstStoryNumber() {
  const { pages } = JSON.parse(readFileSync(EXAMPLES_META, 'utf8'));
  let count = 0;
  for (const entry of pages) {
    if (/^---.*---$/.test(entry) || entry === MORE_FOLDER) continue;
    if (!existsSync(path.join(path.dirname(EXAMPLES_META), `${entry}.mdx`)))
      throw new Error(
        `content/docs/examples/meta.json: the entry "${entry}" is not an example page; the story list numbers cannot be counted`,
      );
    count += 1;
  }
  return count + 1;
}

/**
 * more/index.mdx, the page at /docs/examples/more (v1.0.x D5): one plain
 * link per story page, under one h2 per "---<title>---" label of
 * `moreMeta(pages)`, in its order; the link text is the page's `title`.
 * Each group is an ordered list numbered as the sidebar rows, from `first`
 * (v1.0.x D7).
 * @param {Story[]} pages
 * @param {number} first the number of the first story, `firstStoryNumber()`
 */
export function storyListPage(pages, first) {
  const lines = [];
  let title = '';
  pages.forEach((story, i) => {
    if (story.title !== title) {
      title = story.title;
      lines.push('', `## ${title}`, '');
    }
    lines.push(
      `${first + i}. [${mdxText(story.name)}](/docs/examples/more/${story.id})`,
    );
  });
  const description = `All ${pages.length} shadcn-table Storybook stories that have a live example page under More examples, linked from one list by story file.`;
  return `---
title: More examples
description: ${yamlString(description)}
---

Each Storybook story of shadcn-table that no example page shows has a page of its own; this list links every one, grouped by its story file.
${lines.join('\n')}
`;
}

/** The frontmatter lines the story sets; the rest of a page is kept. */
const STORY_LINE = /^(title|sidebarTitle|searchTitle):/;

/**
 * The `searchTitle` line of a story's page, or undefined when it has none.
 * @param {Story} story
 */
export function searchTitleLine(story) {
  const title = storySearchTitle(story);
  return title === undefined ? undefined : `searchTitle: ${yamlString(title)}`;
}

/** @param {Story} story */
function storyLines(story) {
  const searchTitle = searchTitleLine(story);
  return [
    `title: ${yamlString(story.name)}`,
    `sidebarTitle: ${yamlString(story.name)}`,
    ...(searchTitle ? [searchTitle] : []),
  ];
}

/** The text of a new page: title, sidebar label, search title and the story. */
function newPage(story) {
  return `---
${storyLines(story).join('\n')}
---

<StoryExample id="${story.id}" />
`;
}

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n/;

/**
 * A page that exists, with its `title`, `sidebarTitle` and `searchTitle`
 * set from the story; every other line (description, body) is kept as it is.
 * @param {string} text
 * @param {Story} story
 */
function updatePage(text, story) {
  const match = FRONTMATTER.exec(text);
  if (!match) return newPage(story) + text;
  const lines = match[1].split('\n').filter((line) => !STORY_LINE.test(line));
  const head = [...storyLines(story), ...lines];
  return `---\n${head.join('\n')}\n---\n${text.slice(match[0].length)}`;
}

/**
 * True when a page holds text a person wrote: a frontmatter line besides
 * the ones the story sets (the description), or body text besides the
 * `<StoryExample>` tag.
 * @param {string} text
 */
function holdsText(text) {
  const match = FRONTMATTER.exec(text);
  const head = match
    ? match[1]
        .split('\n')
        .filter((line) => line.trim() && !STORY_LINE.test(line))
    : [];
  const body = (match ? text.slice(match[0].length) : text)
    .replace(/<StoryExample\s+id="[^"]*"\s*\/>/g, '')
    .trim();
  return head.length > 0 || body.length > 0;
}

/** The Examples meta.json with "more" as its last entry. */
async function syncExamplesMeta() {
  const meta = JSON.parse(await fs.readFile(EXAMPLES_META, 'utf8'));
  if (meta.pages.includes(MORE_FOLDER)) return false;
  meta.pages.push(MORE_FOLDER);
  await fs.writeFile(EXAMPLES_META, `${JSON.stringify(meta, null, 2)}\n`);
  return true;
}

/** Writes `text` to `file` when it differs; true when written. */
async function writeIfChanged(file, text) {
  let current;
  try {
    current = await fs.readFile(file, 'utf8');
  } catch {
    current = undefined;
  }
  if (current === text) return false;
  await fs.writeFile(file, text);
  return true;
}

async function main() {
  const pages = pageStories(await readStories());
  await fs.mkdir(MORE_DIR, { recursive: true });
  let created = 0;
  let updated = 0;
  for (const story of pages) {
    const file = path.join(MORE_DIR, `${story.id}.mdx`);
    let text;
    try {
      text = updatePage(await fs.readFile(file, 'utf8'), story);
    } catch {
      text = undefined;
    }
    if (text === undefined) {
      await fs.writeFile(file, newPage(story));
      created += 1;
    } else if (await writeIfChanged(file, text)) updated += 1;
  }
  const listChanged = await writeIfChanged(
    path.join(MORE_DIR, LIST_PAGE),
    storyListPage(pages, firstStoryNumber()),
  );
  const kept = new Set([LIST_PAGE, ...pages.map((story) => `${story.id}.mdx`)]);
  const removed = [];
  const withText = [];
  for (const entry of await fs.readdir(MORE_DIR)) {
    if (entry.endsWith('.mdx') && !kept.has(entry)) {
      const file = path.join(MORE_DIR, entry);
      if (holdsText(await fs.readFile(file, 'utf8'))) {
        withText.push(entry);
        continue;
      }
      await fs.rm(file);
      removed.push(entry);
    }
  }
  const metaChanged = await writeIfChanged(
    path.join(MORE_DIR, 'meta.json'),
    `${JSON.stringify(moreMeta(pages), null, 2)}\n`,
  );
  const examplesChanged = await syncExamplesMeta();
  console.log(
    `story pages: ${pages.length} (${created} new, ${updated} updated, ${removed.length} removed${removed.length ? `: ${removed.join(', ')}` : ''})` +
      `${listChanged ? `, more/${LIST_PAGE} written` : ''}${metaChanged ? ', more/meta.json written' : ''}${examplesChanged ? ', "more" added to examples/meta.json' : ''}`,
  );
  for (const entry of withText) {
    console.error(
      `content/docs/examples/more/${entry} shows a story that is gone and holds text: move its text to the story's new page, or delete the file by hand, then run this script again`,
    );
  }
  if (withText.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main();
}
