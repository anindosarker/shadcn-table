import type { Metadata } from 'next';
import { archivo } from '@/components/dev-home/v4/font';
import { Nav } from '@/components/dev-home/v12/nav';
import { WholeApp } from '@/components/theme-demo/variants/whole-app';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v12/v12.css';

export const metadata: Metadata = { title: 'Theme demo: whole app' };

/** Variant 9 (whole app): a prompt restyles the whole app, globals.css changes
 * and the table follows with its file at 0 changes. */
export default function Page() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav />
      <main className="flex w-full flex-col gap-8 py-12 sm:py-16">
        <header className="v4-shell flex flex-col gap-3">
          <p className="v7-eyebrow v12-eyebrow">
            <span>{'//'}</span> theming
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-balance text-(--dh-ink) sm:text-4xl">
            Change the theme. Not the table.
          </h1>
          <p className="max-w-2xl text-base text-pretty text-(--dh-ink-muted)">
            Your table automatically adapts to your shadcn/ui theme. No extra
            configuration or code changes needed.
          </p>
        </header>
        {/* wider than the shell: the whole app fits beside the editor */}
        <div className="mx-auto w-full max-w-[90rem] px-(--v4-gutter)">
          <WholeApp />
        </div>
      </main>
    </div>
  );
}
