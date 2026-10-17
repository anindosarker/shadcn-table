import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Shadcn React Table';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';
// placeholder until the Storybook deploy exists
export const storybookUrl = 'https://storybook.shadcn-table.com';

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: 'anindosarker',
  repo: 'shadcn-react-table',
  branch: 'claude/review',
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
