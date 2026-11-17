#!/usr/bin/env node
/**
 * Story text checklist (spec 56, 1.6.7, D104): one line per story page under
 * content/docs/examples/more/, in the order of more/meta.json,
 * `- [ ] <group> / <story name>: <description> Try it: <steps joined by " / ">`.
 * The owner reads the wording of every story page from this one file.
 *
 * `pageParts` reads the three parts of a story page (the description, the
 * Try it steps directly above `<StoryExample>`, the Related guides links
 * below it); `pnpm test validate-repo` (test/validate-repo/lib/story-pages.mjs)
 * uses it to fail a page that lacks one of them.
 *
 * Usage (apps/shadcn-table-docs): node lib/story-text-checklist.mjs <output file>
 * The output file is the plan file
 * .ai/plans/v0.9.x/anindosarker/reference/docs-layout/story-text-checklist.md
 * of the checkout that holds the plans. Running it twice changes nothing.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { MORE_DIR } from './story-pages.mjs';

/** The fewest and the most Try it steps a story page has (D104). */
export const MIN_STEPS = 2;
export const MAX_STEPS = 4;

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n/;
const TRY_IT =
  /\n### Try it\s*\n\s*<TryIt>\s*\n([\s\S]*?)\n\s*<\/TryIt>\s*(<StoryExample\b)?/;
const STORY_TAG = /<StoryExample\s+id="[^"]*"\s*\/>/;
const STEP = /^\d+\.\s+(.+)$/;
const GUIDE_LINK = /^-\s+\[[^\]]+\]\([^)]+\)\s*$/;

/** A single-quoted YAML scalar as the page holds it, a quote doubled. */
function frontmatterValue(head, key) {
  const line = head.split('\n').find((l) => l.startsWith(`${key}:`));
  if (!line) return '';
  const raw = line.slice(key.length + 1).trim();
  if (raw.startsWith("'") && raw.endsWith("'"))
    return raw.slice(1, -1).replaceAll("''", "'");
  if (raw.startsWith('"') && raw.endsWith('"')) return raw.slice(1, -1);
  return raw;
}

/**
 * The three parts of a story page and what is wrong with them.
 * @param {string} text the page's .mdx text
 * @returns {{ title: string, description: string, steps: string[], guides: string[], problems: string[] }}
 */
export function pageParts(text) {
  const problems = [];
  const match = FRONTMATTER.exec(text);
  const head = match ? match[1] : '';
  const body = match ? text.slice(match[0].length) : text;
  const title = frontmatterValue(head, 'title');
  const description = frontmatterValue(head, 'description').trim();
  if (!description) problems.push('no description in the frontmatter');

  const tryIt = TRY_IT.exec(`\n${body}`);
  /** @type {string[]} */
  let steps = [];
  if (!tryIt) problems.push('no "### Try it" heading with a <TryIt> block');
  else {
    steps = tryIt[1]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => STEP.exec(line)?.[1] ?? '');
    if (steps.some((step) => !step))
      problems.push('a <TryIt> line that is not a numbered step');
    steps = steps.filter(Boolean);
    if (steps.length < MIN_STEPS || steps.length > MAX_STEPS)
      problems.push(
        `${steps.length} Try it steps, not ${MIN_STEPS} to ${MAX_STEPS}`,
      );
    if (!tryIt[2])
      problems.push('the <TryIt> block is not directly above <StoryExample>');
  }

  /** @type {string[]} */
  let guides = [];
  const tag = STORY_TAG.exec(body);
  const after = tag ? body.slice(tag.index + tag[0].length) : '';
  const heading = after.indexOf('\n## Related guides');
  if (heading < 0)
    problems.push('no "## Related guides" heading below <StoryExample>');
  else {
    const section = after.slice(heading + '\n## Related guides'.length);
    const end = section.search(/\n#{1,6} /);
    guides = (end < 0 ? section : section.slice(0, end))
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => GUIDE_LINK.test(line));
    if (!guides.length) problems.push('no link under "## Related guides"');
  }
  return { title, description, steps, guides, problems };
}

/**
 * The checklist text: a heading, then one line per page of more/meta.json,
 * under the group label the sidebar shows it in.
 */
export async function checklist() {
  const meta = JSON.parse(
    await fs.readFile(path.join(MORE_DIR, 'meta.json'), 'utf8'),
  );
  const lines = [];
  let group = '';
  for (const entry of meta.pages) {
    const label = /^---(.+)---$/.exec(entry);
    if (label) {
      group = label[1];
      continue;
    }
    const text = await fs.readFile(path.join(MORE_DIR, `${entry}.mdx`), 'utf8');
    const { title, description, steps, problems } = pageParts(text);
    if (problems.length)
      throw new Error(`more/${entry}.mdx: ${problems.join('; ')}`);
    lines.push(
      `- [ ] ${group} / ${title}: ${description} Try it: ${steps.join(' / ')}`,
    );
  }
  return `# Story text checklist

Every story page under "More examples", in sidebar order: its group, its story name, its description and its Try it steps. Written by \`node lib/story-text-checklist.mjs\` in apps/shadcn-table-docs (spec 56, 1.6.7); edit the pages, never this file. ${lines.length} pages.

${lines.join('\n')}
`;
}

async function main() {
  const out = process.argv[2];
  if (!out) {
    console.error('usage: node lib/story-text-checklist.mjs <output file>');
    process.exitCode = 1;
    return;
  }
  const text = await checklist();
  let current;
  try {
    current = await fs.readFile(out, 'utf8');
  } catch {
    current = undefined;
  }
  const count = text.split('\n').filter((l) => l.startsWith('- [ ] ')).length;
  if (current === text)
    console.log(`story text checklist: ${count} pages, unchanged`);
  else {
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, text);
    console.log(`story text checklist: ${count} pages, written to ${out}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main();
}
