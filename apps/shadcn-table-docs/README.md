# shadcn-table-docs

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Layout

- `components/ui-base/`, `components/ui-radix/` and `components/ui-aria/`: the installed copies of the library and the shadcn parts it uses, one per base. Never edit them; `pnpm lib:install base`, `pnpm lib:install radix` or `pnpm lib:install aria` (`scripts/install.mjs`) reinstalls one copy from the built registry in `packages/shadcn-table/public/r/`.
- `examples/base/<slug>/`, `examples/radix/<slug>/` and `examples/aria/<slug>/`: one folder per docs example and edition, importing `@/components/ui/...` like a reader's project. The code view shows the selected base's files; `pnpm check:bases` keeps the three sets in step.
- `examples/.base/`, `examples/.radix/` and `examples/.aria/`: generated copies of each edition's examples for its installed library copy, imports rewritten (`lib/example-variants.mjs`, run on `predev`, `build` and `pnpm examples:variants`), gitignored. The live examples load from here.
- The docs chrome imports its own parts from `@/components/ui-radix/...`.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

Collections are defined with the [Macro API](https://fumadocs.dev/docs/mdx/macro) in `lib/source.ts`.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
