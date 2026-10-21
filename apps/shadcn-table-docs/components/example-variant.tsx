'use client';

import { Suspense, use, useSyncExternalStore, type ComponentType } from 'react';
import { useBase } from '@/components/base-selector';
import type { Base } from '@/lib/install';

type Module = { default: ComponentType };
type Loader = (name: string) => Promise<Module>;

/**
 * One chunk per example and base: each base's generated variant of
 * examples/<name>/TS, under examples/.radix/<name>/TS and
 * examples/.base/<name>/TS (lib/example-variants.mjs, folder names in
 * lib/example-variant-dir.mjs; spelled out here so the bundler sees one
 * dynamic segment). The bundler turns each template into a map of every
 * matching module, loaded on demand.
 */
const loaders: Record<Base, Loader> = {
  radix: (name) => import(`@/examples/.radix/${name}/TS`),
  base: (name) => import(`@/examples/.base/${name}/TS`),
};

/** One promise per base and example, so `use` sees a stable value. */
const modules = new Map<string, Promise<Module>>();

const load = (base: Base, name: string) => {
  const key = `${base}/${name}`;
  let promise = modules.get(key);
  if (!promise) {
    promise = loaders[base](name);
    modules.set(key, promise);
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

const Loading = () => (
  <div
    role="status"
    className="flex min-h-72 items-center justify-center text-sm text-fd-muted-foreground"
  >
    Loading example
  </div>
);

/** Suspends on the chunk, then renders the module's default export. */
const Loaded = ({ base, name }: { base: Base; name: string }) => {
  const { default: Example } = use(load(base, name));
  return <Example />;
};

/**
 * The live example for the selected base. Nothing renders on the server:
 * the base is read from storage after hydration, so only the chosen
 * variant's chunk downloads. The code view next to it shows the same
 * variant's source (components/mdx/example-snippet.tsx).
 */
export const ExampleVariant = ({ name }: { name: string }) => {
  const base = useBase();
  const mounted = useMounted();
  if (!mounted) return <Loading />;
  return (
    <Suspense fallback={<Loading />}>
      <Loaded base={base} name={name} />
    </Suspense>
  );
};
