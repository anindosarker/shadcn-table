'use client';

import type { ReactNode } from 'react';
import { useBase } from '@/components/base-selector';
import type { Base } from '@/lib/install';
import { trackStorybookOpened } from '@/lib/analytics';

/**
 * One Storybook host serves every tree, each build under its base: /base/,
 * /radix/ and /aria/ (packages/shadcn-table `storybook:build:base`,
 * `storybook:build:radix`, `storybook:build:aria`); the root redirects to
 * /base/.
 *
 * Under the dev server (`pnpm dev`) every Storybook link points at the local
 * Storybooks instead (packages/shadcn-table `storybook:base` on 6007,
 * `storybook:radix` on 6006, `storybook:aria` on 6008), so the button can be
 * checked against stories the deployed Storybook does not have yet. Next
 * inlines `process.env.NODE_ENV` in server and client code; a production
 * build drops the local branch.
 */
export const storybookUrl: Record<Base, string> =
  process.env.NODE_ENV === 'development'
    ? {
        radix: 'http://localhost:6006/',
        base: 'http://localhost:6007/',
        aria: 'http://localhost:6008/',
      }
    : {
        radix: 'https://storybook.shadcn-table.com/radix/',
        base: 'https://storybook.shadcn-table.com/base/',
        aria: 'https://storybook.shadcn-table.com/aria/',
      };

/**
 * Link to the Storybook of the selected base. The guide and example pages
 * end with "View Extra Storybook <StorybookLink>Examples</StorybookLink>".
 */
export const StorybookLink = ({ children }: { children?: ReactNode }) => {
  const base = useBase();
  return (
    <a
      href={storybookUrl[base]}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackStorybookOpened({ base, surface: 'mdx_link' })}
    >
      {children ?? 'Examples'}
    </a>
  );
};
