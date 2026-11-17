import { promises as fs } from 'node:fs';
import path from 'node:path';
import { bases, type Base } from '@/lib/install';
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
 * The story index and the story files as written, from fixed paths so the
 * docs build does not trace the stories tree. Every base folder holds the
 * same two files; the base folder is read.
 */
const readJson = async <T,>(name: 'index.json' | 'sources.json') =>
  JSON.parse(
    await fs.readFile(path.join(process.cwd(), 'stories/.base', name), 'utf8'),
  ) as T;

/**
 * Server side: one Storybook story in the example playground (spec 56,
 * D106). The Preview mounts the story from the selected base's library copy
 * (components/story-variant.tsx); the Code tab shows the story file as it is
 * written in packages/shadcn-table/stories; the Storybook button opens the
 * story. A story has no registry item, so the panel has no install command
 * and no Copy prompt. The story's play and Storybook's decorator never run
 * here.
 */
export async function StoryExample({ id }: { id: string }) {
  const index = await readJson<Record<string, StoryEntry>>('index.json');
  const story = Object.hasOwn(index, id) ? index[id] : undefined;
  if (!story)
    throw new Error(`No story "${id}" in packages/shadcn-table/stories`);
  const sources = await readJson<Record<string, string>>('sources.json');
  const fileName = story.file.slice(story.file.lastIndexOf('/') + 1);
  const data: ExampleVariantData = {
    files: [{ path: fileName, source: sources[story.key] ?? '', lang: 'tsx' }],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/packages/shadcn-table/stories/${story.file}`,
  };
  const variants = Object.fromEntries(
    bases.map((base) => [base, data] as const),
  ) as Record<Base, ExampleVariantData>;

  return (
    <ExamplePlayground name={id} variants={variants} storyId={id}>
      <StoryVariant fileKey={story.key} exportName={story.exportName} />
    </ExamplePlayground>
  );
}
