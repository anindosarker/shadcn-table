import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({ agentRules: false });

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // A second `next dev` in the same folder refuses to start (.next/dev/lock).
  // Parallel docs agents run `NEXT_DIST_DIR=.next-<x> npx next dev -p <port>`.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
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
  ],
};

export default withMDX(config);
