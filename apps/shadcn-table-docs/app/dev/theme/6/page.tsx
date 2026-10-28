import type { Metadata } from 'next';
import { archivo } from '@/components/dev-home/v4/font';
import { Nav } from '@/components/dev-home/v12/nav';
import { EmptyDiff } from '@/components/theme-demo/variants/empty-diff';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v12/v12.css';

export const metadata: Metadata = { title: 'Theme demo: empty diff' };

/** Variant 6 (empty diff): globals.css changes from site to site while the
 * table's file stays at 0 changes. */
export default function Page() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav />
      <main className="flex w-full flex-col gap-8 py-12 sm:py-16">
        <header className="v4-shell flex flex-col gap-3">
          <p className="v12-label">Theming</p>
          <h1 className="text-3xl font-semibold tracking-tight text-balance text-(--dh-ink) sm:text-4xl">
            Change your theme. Not your table.
          </h1>
          <p className="max-w-2xl text-base text-pretty text-(--dh-ink-muted)">
            Whatever shadcn/ui theme your app already has, the table follows it.
            Five sites, five globals.css files, and the same data-table.tsx on
            every one.
          </p>
        </header>
        {/* wider than the shell: the full table fits beside the editor */}
        <div className="mx-auto w-full max-w-[90rem] px-(--v4-gutter)">
          <EmptyDiff />
        </div>
      </main>
    </div>
  );
}
