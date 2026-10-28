import { archivo } from '@/components/dev-home/v4/font';
import { Nav } from '@/components/dev-home/v12/nav';
import { NoStep3Demo } from '@/components/theme-demo/variants/no-step-3';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v12/v12.css';

/** Variant 7 (no step 3): the install changes nothing in globals.css, and
 * the table beside it follows the site theme picker. */
export default function Page() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav />
      <main className="flex w-full flex-col gap-8 py-12 sm:py-16">
        <header className="v4-shell flex flex-col gap-3">
          <p className="v12-label">Theming</p>
          <h1 className="v4-display text-3xl tracking-tight text-balance text-(--dh-ink) sm:text-5xl">
            One command. No step 3.
          </h1>
          <p className="max-w-2xl text-base text-pretty text-(--dh-ink-muted)">
            Whatever shadcn/ui theme your app already has, the table follows it.
            You change nothing: no theme file, no provider, no overrides.
          </p>
        </header>
        {/* wider than the shell: the full table fits beside the terminal */}
        <div className="mx-auto w-full max-w-[90rem] px-(--v4-gutter)">
          <NoStep3Demo />
        </div>
      </main>
    </div>
  );
}
