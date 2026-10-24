import pkg from '../../../../packages/shadcn-table/package.json';

export const revalidate = false;

/**
 * The library version this deployment was built from, one line of text.
 * `.github/workflows/release.yml` polls it after a tag push to know that
 * production serves the tagged commit before it runs the release checks.
 */
export function GET() {
  return new Response(`${pkg.version}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
