/**
 * Site checks (spec 59): what holds across the docs site rather than on one
 * section's pages. Each entry: async ({ page, check }) => void, run after
 * load at the first width, as in the other section lists.
 *
 * - `/sitemap.xml`: every guide page the sitemap lists is fetched as served
 *   HTML, before any script runs, and holds no element id twice (D113: an
 *   example shown twice on one guide carries two ids from the server on).
 */

/** Element ids of served HTML, script bodies left out (their JSON is no markup). */
const servedIds = (html) => {
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return [...markup.matchAll(/\sid="([^"]*)"/g)].map((m) => m[1]);
};

/** The ids that occur more than once in `ids`, each named once. */
const repeatedIds = (ids) =>
  [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))].sort();

/**
 * D113: every guide page in the sitemap, fetched without running scripts,
 * holds each element id once. Names the guides that repeat one, with the
 * repeated ids.
 */
async function guideIdsUnique(page, check) {
  const origin = new URL(page.url()).origin;
  const xml = await (await fetch(`${origin}/sitemap.xml`)).text();
  const guides = [
    ...new Set(
      [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((m) => new URL(m[1]).pathname)
        .filter((p) => p === '/docs/guides' || p.startsWith('/docs/guides/')),
    ),
  ];
  check('sitemap: guide pages', guides.length > 0, String(guides.length));
  const offenders = [];
  for (const route of guides) {
    const res = await fetch(origin + route);
    if (!res.ok) {
      offenders.push(`${route} (status ${res.status})`);
      continue;
    }
    const repeated = repeatedIds(servedIds(await res.text()));
    if (repeated.length) offenders.push(`${route} (${repeated.join(' ')})`);
  }
  check(
    'served guide HTML: no element id twice',
    offenders.length === 0,
    offenders.join(', '),
  );
}

const checks = {
  '/sitemap.xml': async ({ page, check }) => guideIdsUnique(page, check),
};

export default checks;
