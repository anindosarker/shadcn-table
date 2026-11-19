import { promises as fs } from 'node:fs';
import path from 'node:path';
import { buildExamplePrompt } from '@/lib/example-prompt';
import { readExampleFiles } from '@/lib/example-source';
import { bases, exampleAddCommand, type Base } from '@/lib/install';
import { gitConfig } from '@/lib/shared';
import {
  ExamplePlayground,
  type ExampleVariantData,
} from '@/components/example-playground';
import { StoryVariant } from '@/components/story-variant';

/** One story in stories/.<base>/index.json (lib/story-variants.mjs). */
interface StoryEntry {
  /** The copy's file key: stories/.<base>/<key>.stories.tsx. */
  key: string;
  exportName: string;
  name: string;
  title: string;
  /** The story file under packages/shadcn-table/stories. */
  file: string;
}

/**
 * The story index (lib/story-variants.mjs), from a fixed path so the docs
 * build does not trace the stories tree; it is the same for every base.
 */
const readIndex = async () =>
  JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), 'stories/.base/index.json'),
      'utf8',
    ),
  ) as Record<string, StoryEntry>;

/**
 * Each story's own code text by story id, per base (stories/.<base>/
 * sources.json, tools/story-source via lib/story-variants.mjs): the text the
 * Storybook Code tab of that base shows (spec 66, D142). One literal path
 * per base, as lib/example-source.ts reads the example sources.
 */
const SOURCES: Record<Base, () => Promise<string>> = {
  base: () =>
    fs.readFile(path.join(process.cwd(), 'stories/.base/sources.json'), 'utf8'),
  radix: () =>
    fs.readFile(
      path.join(process.cwd(), 'stories/.radix/sources.json'),
      'utf8',
    ),
  aria: () =>
    fs.readFile(path.join(process.cwd(), 'stories/.aria/sources.json'), 'utf8'),
};

/** The parsed texts per base, read once per build worker. */
const sourcesByBase = new Map<Base, Promise<Record<string, string>>>();

const readStoryCode = async (id: string, base: Base) => {
  let pending = sourcesByBase.get(base);
  if (!pending) {
    pending = SOURCES[base]().then(
      (text) => JSON.parse(text) as Record<string, string>,
    );
    sourcesByBase.set(base, pending);
  }
  const sources = await pending;
  const text = Object.hasOwn(sources, id) ? sources[id] : undefined;
  if (text === undefined)
    throw new Error(`No code text for story "${id}" in stories/.${base}`);
  return text;
};

/**
 * Server side: one Storybook story in the example playground (spec 56,
 * D106). The Preview mounts the story from the selected base's library copy
 * (components/story-variant.tsx); the Code tab shows the story's own code
 * text on that base, `<StoryExport>.tsx` (spec 66, D142: the table with its
 * columns, data and imports, never the test); the Storybook button opens the
 * story. A story has no registry item, so the panel has no install command
 * and no Copy prompt. The story's play and Storybook's decorator never run
 * here. With `codeFrom`, the Code tab shows the files of that docs example
 * (examples/<base>/<codeFrom>) in place of the story's text, for a guide
 * whose text walks through those files (D131), and the panel carries that
 * example's install command and Copy prompt, so it installs the files it
 * lists.
 */
export async function StoryExample({
  id,
  codeFrom,
}: {
  id: string;
  codeFrom?: string;
}) {
  const index = await readIndex();
  const story = Object.hasOwn(index, id) ? index[id] : undefined;
  if (!story)
    throw new Error(`No story "${id}" in packages/shadcn-table/stories`);
  const storyData = async (base: Base): Promise<ExampleVariantData> => ({
    files: [
      {
        path: `${story.exportName}.tsx`,
        source: await readStoryCode(id, base),
        lang: 'tsx',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/packages/shadcn-table/stories/${story.file}`,
  });
  const exampleData = async (
    name: string,
    base: Base,
  ): Promise<ExampleVariantData> => ({
    files: (await readExampleFiles(name, base)).map((file) => ({
      path: file.path,
      source: file.source,
      lang: path.extname(file.path).slice(1) || 'text',
    })),
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}/tree/${gitConfig.branch}/apps/shadcn-table-docs/examples/${base}/${name}`,
    installCommand: exampleAddCommand(name, base),
    installItem: `example-${name}`,
    prompt: await buildExamplePrompt({ name, base }),
  });
  const variants = Object.fromEntries(
    await Promise.all(
      bases.map(
        async (base) =>
          [
            base,
            codeFrom
              ? await exampleData(codeFrom, base)
              : await storyData(base),
          ] as const,
      ),
    ),
  ) as Record<Base, ExampleVariantData>;

  return (
    <ExamplePlayground name={id} variants={variants} storyId={id}>
      <StoryVariant fileKey={story.key} exportName={story.exportName} />
    </ExamplePlayground>
  );
}
