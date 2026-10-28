'use client';

import { archivo } from '@/components/dev-home/v4/font';
import { Nav } from '@/components/dev-home/v12/nav';
import { TokensDemo } from '@/components/theme-demo/variants/tokens';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v12/v12.css';

/** Variant 3 (tokens): the theme's token list beside the table. */
export default function Page() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav />
      <main className="v4-shell flex w-full flex-col gap-6 py-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Your tokens, your table
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            Every colour, the radius and the font come from the CSS variables on
            the left. Change them and the table follows.
          </p>
        </div>
        <TokensDemo />
      </main>
    </div>
  );
}
