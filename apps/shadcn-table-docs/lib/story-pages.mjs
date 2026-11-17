#!/usr/bin/env node
/**
 * Story pages (spec 56, D106, D103): every Storybook story that is not the
 * exact story of an example page (lib/storybook-map.ts) gets a docs page
 * under content/docs/examples/more/<story id>.mdx, and more/meta.json lists
 * them in Storybook's order, one "---<story title>---" sub-group per story
 * file. The stories are read from packages/shadcn-table/stories with
 * Storybook's own CSF parser, so ids, names and order are the ones
 * Storybook gives them (storybook-static/<base>/index.json).
 *
 * A new page holds the title, the sidebar label and the
 * `<StoryExample id="..." />` tag (components/story-example.tsx). A page that
 * exists keeps everything it holds (its description, its body text); only
 * `title` and `sidebarTitle` follow the story's name. A page whose story is
 * gone is removed. Running it twice changes nothing.
 *
 * `pnpm test validate-repo` (test/validate-repo/lib/story-pages.mjs) fails
 * when the pages and the stories differ; this script fixes that.
 *
 * Usage (apps/shadcn-table-docs): node lib/story-pages.mjs
 */
import { promises as fs, readFileSync } from 'node:fs';
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
 * lib/storybook-map.ts (`'<slug>': '<story id>'` lines).
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

/** A YAML scalar for the frontmatter: single quotes, a quote doubled. */
const yamlString = (value) => `'${value.replaceAll("'", "''")}'`;

/** The text of a new page: title, sidebar label and the story. */
export function newPage(story) {
  return `---
title: ${yamlString(story.name)}
sidebarTitle: ${yamlString(story.name)}
---

<StoryExample id="${story.id}" />
`;
}

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n/;

/**
 * A page that exists, with its `title` and `sidebarTitle` set to the
 * story's name; every other line (description, body) is kept as it is.
 * @param {string} text
 * @param {Story} story
 */
export function updatePage(text, story) {
  const match = FRONTMATTER.exec(text);
  if (!match) return newPage(story) + text;
  const lines = match[1]
    .split('\n')
    .filter((line) => !/^(title|sidebarTitle):/.test(line));
  const head = [
    `title: ${yamlString(story.name)}`,
    `sidebarTitle: ${yamlString(story.name)}`,
    ...lines,
  ];
  return `---\n${head.join('\n')}\n---\n${text.slice(match[0].length)}`;
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
  const kept = new Set(pages.map((story) => `${story.id}.mdx`));
  const removed = [];
  for (const entry of await fs.readdir(MORE_DIR)) {
    if (entry.endsWith('.mdx') && !kept.has(entry)) {
      await fs.rm(path.join(MORE_DIR, entry));
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
      `${metaChanged ? ', more/meta.json written' : ''}${examplesChanged ? ', "more" added to examples/meta.json' : ''}`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main();
}
