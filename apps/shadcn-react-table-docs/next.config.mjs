import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({ agentRules: false });

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // A second `next dev` in the same folder refuses to start (.next/dev/lock).
  // Parallel docs agents run `NEXT_DIST_DIR=.next-<x> npx next dev -p <port>`.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
};

export default withMDX(config);
