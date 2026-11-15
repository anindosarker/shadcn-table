import path from 'node:path';
import { exampleComponents } from '@/examples/map';
import { loadExamplePages } from '@/lib/example-pages.mjs';
import { GuideExampleSwitch } from '@/components/guide-example-switch';

interface Props {
  /** Example page slugs (/docs/examples/<slug>) in picker order; the first is shown first. */
  slugs: string[];
}

type ExampleName = keyof typeof exampleComponents;

const isExampleName = (name: string): name is ExampleName =>
  name in exampleComponents;

/**
 * A guide's Example section: the live example of each listed example page,
 * one at a time. Each slug resolves through the examples MDX pages
 * (lib/example-pages.mjs): the page's title names it, the `<...Example />`
 * component the page renders (examples/map.tsx) is its table. With one slug
 * the playground toolbar links the page; with several it carries the example
 * picker, which swaps the live example in place.
 */
export const GuideExamples = async ({ slugs }: Props) => {
  const pages = await loadExamplePages(
    path.join(process.cwd(), 'content', 'docs', 'examples'),
  );
  // byComponent keeps the first page per component; invert it to the first
  // component each page renders.
  const componentOf = new Map<string, string>();
  for (const [component, page] of pages.byComponent) {
    if (!componentOf.has(page.slug)) componentOf.set(page.slug, component);
  }

  const entries = slugs.map((slug) => {
    const page = pages.bySlug.get(slug);
    const component = componentOf.get(slug);
    if (!page || !component || !isExampleName(component)) {
      throw new Error(
        `<GuideExamples>: no example page renders an example for "${slug}"`,
      );
    }
    const Example = exampleComponents[component];
    return { slug, title: page.title ?? slug, panel: <Example key={slug} /> };
  });

  return (
    <GuideExampleSwitch
      items={entries.map(({ slug, title }) => ({ slug, title }))}
      panels={entries.map(({ panel }) => panel)}
    />
  );
};
