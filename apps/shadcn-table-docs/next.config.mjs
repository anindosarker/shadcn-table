import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({ agentRules: false });

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // A second `next dev` in the same folder refuses to start (.next/dev/lock).
  // A second dev server uses `PORT=<port> pnpm dev` (own .next-<port>, own
  // tsconfig.<port>.json written by lib/dev-tsconfig.mjs); NEXT_DEV=1, set by
  // the dev script, limits that to `next dev`. `next start` uses .next on any
  // port.
  distDir:
    process.env.NEXT_DIST_DIR ??
    (process.env.NEXT_DEV && process.env.PORT && process.env.PORT !== '5320'
      ? `.next-${process.env.PORT}`
      : '.next'),
  // Any `<distDir>/types` edit Next makes to the tsconfig it reads lands in
  // the second server's git-ignored copy, not tsconfig.json.
  typescript: {
    tsconfigPath:
      process.env.PORT && process.env.PORT !== '5320'
        ? `tsconfig.${process.env.PORT}.json`
        : 'tsconfig.json',
  },
  // Hosted registry (public/r/<base>/<name>.json, written by
  // tools/registry/hosted.mjs, `pnpm registry:hosted`):
  // the namespace form
  // `@shadcn-table=https://www.shadcn-table.com/r/{style}/{name}.json` sends the
  // project's shadcn style (`radix-nova`, `base-sera`, `aria-nova`, ...),
  // which maps onto the base directory. `/r/radix/*`, `/r/base/*` and
  // `/r/aria/*` are served as they are, the catalogs
  // `/r/<base>/registry.json` included.
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
      {
        source: '/r/:style(aria-.*)/:name.json',
        destination: '/r/aria/:name.json',
      },
      // PostHog ingest reverse proxy (components/posthog-provider.tsx sets
      // api_host '/ingest'): the events leave from this origin, so ad
      // blockers that drop posthog.com requests do not drop them. External
      // rewrites run on the edge, no function invocations.
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ],
  }),
  // Security response headers on every path, the root included (D57). No
  // Content-Security-Policy: it needs nonces for Next's inline scripts,
  // PostHog and fonts. Vercel sets Strict-Transport-Security itself.
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ],
  // PostHog paths end with a slash (/ingest/e/, /ingest/batch/); without
  // this Next would redirect them to the slash-less form.
  skipTrailingSlashRedirect: true,
  // MRT's docs index is a table of contents page; the sidebar already is one.
  redirects: async () => [
    // skipTrailingSlashRedirect turns Next's own slash redirect off for every
    // path; this puts it back for all but the PostHog proxy (D53).
    {
      source: '/:path((?!ingest).*)/',
      destination: '/:path',
      permanent: true,
    },
    {
      source: '/docs',
      destination: '/docs/getting-started/introduction',
      permanent: true,
    },
    // The getting-started overview was two links; the sidebar lists them.
    {
      source: '/docs/getting-started',
      destination: '/docs/getting-started/introduction',
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
