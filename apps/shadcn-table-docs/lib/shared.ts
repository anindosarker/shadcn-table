import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Shadcn Table';
/** Lowercase name used in page titles and OG/Twitter metadata. */
export const siteName = 'shadcn-table';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: 'anindosarker',
  repo: 'shadcn-table',
  branch: 'claude/review',
};

/**
 * Site origin for absolute URLs handed to tools outside the site (the copy
 * prompt): `NEXT_PUBLIC_SITE_URL` in deployments, the dev port otherwise.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:5320'
).replace(/\/$/, '');

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

/** Absolute markdown URL of a docs page, for prompts handed to agents. */
export const absoluteMarkdownUrl = (slugs: string[]) =>
  `${siteUrl}${getPageMarkdownUrl({ slugs }).url}`;

/** The library's registry item name. */
export const libraryItem = 'shadcn-table';

/**
 * `<user>/<repo>/<item>#<branch>`: the branch suffix only while the registry
 * is served from a branch other than the default.
 */
export const registryRef = (item: string) =>
  `${gitConfig.user}/${gitConfig.repo}/${item}${gitConfig.branch === 'master' ? '' : `#${gitConfig.branch}`}`;

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
