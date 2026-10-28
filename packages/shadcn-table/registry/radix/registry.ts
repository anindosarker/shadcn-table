// Item definition of the Radix edition: `shadcn-table-radix` plus one locale
// item per language, both read by scripts/registry/build.mjs (Node strips the
// types). Every file of this tree's components/ui/shadcn-table is an item
// file and every `@/components/ui/<part>` import is a registryDependency; see
// scripts/registry/lib.mjs.
import { registryItemSchema, type Registry } from 'shadcn/schema';
import { baseItems, HOMEPAGE } from '../../scripts/registry/lib.mjs';

const items = baseItems({
  dir: import.meta.dirname,
  name: 'shadcn-table-radix',
  title: 'Shadcn Table',
  description:
    'A fully featured data table built on TanStack Table and shadcn/ui, ported from material-react-table.',
  // npm packages the library imports (bare specifiers). Pinned ones take
  // their version from package.json.
  dependencies: [
    { name: '@tanstack/react-table', pinned: true },
    { name: '@tanstack/react-store', pinned: true },
    { name: '@tanstack/react-virtual', pinned: true },
    { name: '@tanstack/match-sorter-utils', pinned: true },
    { name: 'highlight-words', pinned: true },
    { name: 'class-variance-authority' },
    { name: 'lucide-react' },
    { name: 'radix-ui' },
  ],
  devDependencies: [{ name: 'tw-animate-css' }],
});

registryItemSchema.array().parse(items);

export const registry = {
  name: 'st',
  homepage: HOMEPAGE,
  items,
} satisfies Registry;
