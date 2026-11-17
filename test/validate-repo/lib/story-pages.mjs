// story-pages, the seventh check of `pnpm test validate-repo` (spec 56,
// 1.6.5): Storybook and the docs match one to one. Every story has either an
// example page (apps/shadcn-table-docs/lib/storybook-map.ts) or a page under
// content/docs/examples/more/, every page under more/ shows a story that
// exists, the one whose id is its file name, and more/meta.json lists the
// pages in the story files' order with one label per story file. Every page
// holds the three parts of the example page format (1.6.7, D104): a
// description, 2 to 4 Try it steps directly above the story and Related guides
// below it, read by the docs app's lib/story-text-checklist.mjs. The stories
// are read with Storybook's own CSF parser through the docs app's
// lib/story-pages.mjs, the script that writes the pages; every problem names
// it. It prints one line and returns the problems; it never edits a file.
import fs from 'node:fs';
import path from 'node:path';
import {
  MORE_DIR,
  MORE_FOLDER,
  moreMeta,
  pageStories,
  readExactStories,
  readStories,
} from '../../../apps/shadcn-table-docs/lib/story-pages.mjs';
import { pageParts } from '../../../apps/shadcn-table-docs/lib/story-text-checklist.mjs';

const FIX = 'run `node lib/story-pages.mjs` in apps/shadcn-table-docs';
const STORY_TAG = /<StoryExample\s+id="([^"]+)"\s*\/>/g;

/** @param {(line: string) => void} log */
export const check = async (log) => {
  const problems = [];
  const stories = await readStories();
  const ids = new Set(stories.map((story) => story.id));
  const exact = readExactStories();
  for (const id of exact.keys()) {
    if (!ids.has(id))
      problems.push(
        `lib/storybook-map.ts names story "${id}" (${exact.get(id)}), which does not exist`,
      );
  }
  const pages = pageStories(stories);
  const files = fs.existsSync(MORE_DIR)
    ? fs.readdirSync(MORE_DIR).filter((file) => file.endsWith('.mdx'))
    : [];
  const pageIds = new Set(files.map((file) => file.slice(0, -'.mdx'.length)));
  for (const story of pages) {
    if (!pageIds.has(story.id))
      problems.push(
        `story "${story.id}" (${story.file}, ${story.exportName}) has no example page and no page more/${story.id}.mdx: ${FIX}`,
      );
  }
  for (const id of pageIds) {
    if (!ids.has(id))
      problems.push(
        `page more/${id}.mdx names a story that does not exist: ${FIX}`,
      );
    else if (exact.has(id))
      problems.push(
        `page more/${id}.mdx shows the exact story of the example page ${exact.get(id)}: ${FIX}`,
      );
    const text = fs.readFileSync(path.join(MORE_DIR, `${id}.mdx`), 'utf8');
    const tags = [...text.matchAll(STORY_TAG)].map((match) => match[1]);
    if (tags.length !== 1 || tags[0] !== id)
      problems.push(
        `page more/${id}.mdx must show <StoryExample id="${id}" /> once, found ${tags.length ? tags.join(', ') : 'none'}: ${FIX}`,
      );
    for (const problem of pageParts(text).problems)
      problems.push(
        `page more/${id}.mdx: ${problem}; write its description, Try it steps and Related guides in the example page format (spec 56, 1.6.7)`,
      );
  }
  const metaFile = path.join(MORE_DIR, 'meta.json');
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  } catch {
    meta = undefined;
  }
  const want = moreMeta(pages);
  if (!meta) problems.push(`more/meta.json is missing or not JSON: ${FIX}`);
  else if (JSON.stringify(meta.pages) !== JSON.stringify(want.pages))
    problems.push(
      `more/meta.json does not list the pages in the story files' order: ${FIX}`,
    );
  const examplesMeta = JSON.parse(
    fs.readFileSync(path.join(MORE_DIR, '..', 'meta.json'), 'utf8'),
  );
  if (!examplesMeta.pages.includes(MORE_FOLDER))
    problems.push(`examples/meta.json does not list "${MORE_FOLDER}": ${FIX}`);
  log(
    `story-pages: ${stories.length} stories, ${exact.size} example pages, ${pageIds.size} story pages`,
  );
  return problems;
};
