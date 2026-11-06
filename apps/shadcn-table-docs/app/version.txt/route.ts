import pkg from '../../../../packages/shadcn-table/package.json';

export const revalidate = false;

/**
 * The library version this deployment was built from, one line of text.
 * The Verify Deployment job of `.github/workflows/release.yml` polls it
 * and tags the release once production serves the new version.
 */
export function GET() {
  return new Response(`${pkg.version}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
