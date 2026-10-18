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
    // The production tables guide started out under guides.
    {
      source: '/docs/guides/server-side-data',
      destination: '/docs/getting-started/production-ready-tables',
      permanent: false,
    },
  ],
};

export default withMDX(config);
