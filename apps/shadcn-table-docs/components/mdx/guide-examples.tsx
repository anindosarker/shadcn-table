import { promises as fs } from 'node:fs';
import path from 'node:path';
import { exampleComponents } from '@/examples/map';
import { loadExamplePages, readFrontmatter } from '@/lib/example-pages.mjs';
import { GuideExampleSwitch } from '@/components/guide-example-switch';
import { StoryExample } from '@/components/story-example';

interface Props {
  /**
   * Page slugs in picker order; the first is shown first. Either an example
   * page (`column-pinning`, /docs/examples/<slug>) or a story page under
   * "More examples" (`more/<story id>`, /docs/examples/more/<story id>).
   */
  slugs: string[];
}

/** Slug prefix of a story page under "More examples" (lib/story-pages.mjs). */
const STORY_PREFIX = 'more/';

type ExampleName = keyof typeof exampleComponents;

const isExampleName = (name: string): name is ExampleName =>
  name in exampleComponents;

/**
 * A guide's Example section: the live example of each listed page, one at a
 * time. An example page slug resolves through the examples MDX pages
 * (lib/example-pages.mjs): the page's title names it, the `<...Example />`
 * component the page renders (examples/map.tsx) is its table. A story page
 * slug (`more/<story id>`) resolves through its page under
 * content/docs/examples/more: the page's title names it, the story
 * (components/story-example.tsx) is its table. With one slug
 * the playground toolbar links the page; with several it carries the example
 * picker, which swaps the live example in place.
 */
export const GuideExamples = async ({ slugs }: Props) => {
  const examplesDir = path.join(process.cwd(), 'content', 'docs', 'examples');
  const pages = await loadExamplePages(examplesDir);
  // byComponent keeps the first page per component; invert it to the first
  // component each page renders.
  const componentOf = new Map<string, string>();
  for (const [component, page] of pages.byComponent) {
    if (!componentOf.has(page.slug)) componentOf.set(page.slug, component);
  }

  const storyEntry = async (slug: string) => {
    const id = slug.slice(STORY_PREFIX.length);
    let source: string;
    try {
      source = await fs.readFile(
        path.join(examplesDir, STORY_PREFIX, `${id}.mdx`),
        'utf8',
      );
    } catch {
      throw new Error(`<GuideExamples>: no story page for "${slug}"`);
    }
    const { title } = readFrontmatter(source);
    return {
      slug,
      title: title ?? id,
      panel: <StoryExample key={slug} id={id} />,
    };
  };

  const entries = await Promise.all(
    slugs.map(async (slug) => {
      if (slug.startsWith(STORY_PREFIX)) return storyEntry(slug);
      const page = pages.bySlug.get(slug);
      const component = componentOf.get(slug);
      if (!page || !component || !isExampleName(component)) {
        throw new Error(
          `<GuideExamples>: no example page renders an example for "${slug}"`,
        );
      }
      const Example = exampleComponents[component];
      return { slug, title: page.title ?? slug, panel: <Example key={slug} /> };
    }),
  );

  return (
    <GuideExampleSwitch
      items={entries.map(({ slug, title }) => ({ slug, title }))}
      panels={entries.map(({ panel }) => panel)}
    />
  );
};
