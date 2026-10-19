import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({ agentRules: false });

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // A second `next dev` in the same folder refuses to start (.next/dev/lock).
  // `PORT=5331 pnpm dev` runs a second server (own .next-<port>).
  distDir:
    process.env.NEXT_DIST_DIR ??
    (process.env.PORT && process.env.PORT !== '5320'
      ? `.next-${process.env.PORT}`
      : '.next'),
  // Hosted registry (public/r/<base>/<name>.json, written by
  // packages/shadcn-table/registry/hosted.mjs, `pnpm registry:hosted`):
  // the namespace form
  // `@st=https://www.shadcn-table.com/r/{style}/{name}.json` sends the
  // project's shadcn style (`radix-nova`, `base-sera`, ...), which maps onto
  // the base directory. `/r/radix/*` and `/r/base/*` are served as they are,
  // the catalogs `/r/<base>/registry.json` included.
  rewrites: async () => ({
    afterFiles: [
      {
        source: '/r/:style(radix-.*)/:name.json',
        destination: '/r/radix/:name.json',
      },
      {
        source: '/r/:style(base-.*)/:name.json',
        destination: '/r/base/:name.json',
      },
    ],
  }),
  // MRT's docs index is a table of contents page; the sidebar already is one.
  redirects: async () => [
    {
      source: '/docs',
      destination: '/docs/getting-started/install',
      permanent: false,
    },
    // The getting-started overview was two links; the sidebar lists them.
    {
      source: '/docs/getting-started',
      destination: '/docs/getting-started/install',
      permanent: false,
    },
    // The production tables guide was first published at these URLs.
    {
      source: '/docs/guides/server-side-data',
      destination: '/docs/guides/production-ready-tables',
      permanent: false,
    },
    {
      source: '/docs/getting-started/production-ready-tables',
      destination: '/docs/guides/production-ready-tables',
      permanent: false,
    },
  ],
};

export default withMDX(config);
