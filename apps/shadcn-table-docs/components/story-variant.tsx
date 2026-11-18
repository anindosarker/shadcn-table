'use client';

import { Suspense, use, useSyncExternalStore, type ComponentType } from 'react';
import { composeStories } from '@storybook/react';
import { useBase } from '@/components/base-selector';
import { ExampleTableSkeleton } from '@/components/example-skeleton';
import type { Base } from '@/lib/install';

type StoryModule = Parameters<typeof composeStories>[0];
type Stories = Record<string, ComponentType>;
type Loader = (key: string) => Promise<StoryModule>;

/**
 * One chunk per story file and base: the copies under stories/.<base>/
 * (lib/story-variants.mjs), spelled out per base so the bundler sees one
 * dynamic segment, as components/example-variant.tsx loads the examples.
 */
const loaders: Record<Base, Loader> = {
  radix: (key) => import(`@/stories/.radix/${key}.stories`),
  base: (key) => import(`@/stories/.base/${key}.stories`),
  aria: (key) => import(`@/stories/.aria/${key}.stories`),
};

/** One promise per base and story file, so `use` sees a stable value. */
const files = new Map<string, Promise<Stories>>();

/**
 * The file's stories composed with their meta (args, render, decorators of
 * the story file) by Storybook's `composeStories`, without the Storybook
 * preview: no intro line, no reset after the play, and no play.
 */
const load = (base: Base, key: string) => {
  const id = `${base}/${key}`;
  let promise = files.get(id);
  if (!promise) {
    promise = loaders[base](key).then(
      (mod) => composeStories(mod) as unknown as Stories,
    );
    files.set(id, promise);
  }
  return promise;
};

const noop = () => () => {};
/** False on the server and during hydration, true after. */
const useMounted = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

const Loaded = ({
  base,
  fileKey,
  exportName,
}: {
  base: Base;
  fileKey: string;
  exportName: string;
}) => {
  const Story = use(load(base, fileKey))[exportName];
  if (!Story) throw new Error(`No story ${exportName} in ${fileKey}`);
  return <Story />;
};

/**
 * The live story for the selected base. Nothing renders on the server: the
 * base is read from storage after hydration, so only the chosen base's chunk
 * downloads.
 */
export const StoryVariant = ({
  fileKey,
  exportName,
}: {
  fileKey: string;
  exportName: string;
}) => {
  const base = useBase();
  const mounted = useMounted();
  if (!mounted) return <ExampleTableSkeleton />;
  return (
    <Suspense fallback={<ExampleTableSkeleton />}>
      {/* a new base or story mounts a fresh table */}
      <Loaded
        key={`${base}/${fileKey}/${exportName}`}
        base={base}
        fileKey={fileKey}
        exportName={exportName}
      />
    </Suspense>
  );
};
