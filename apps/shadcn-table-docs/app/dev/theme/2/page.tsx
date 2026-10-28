import { archivo } from '@/components/dev-home/v4/font';
import { Nav } from '@/components/dev-home/v12/nav';
import { Stage } from '@/components/theme-demo/variants/stage';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v12/v12.css';

/** Variant 2 (stage): chips above one large table that crossfades. */
export default function Page() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav />
      <main className="v4-shell flex w-full flex-col gap-8 py-12 sm:py-16">
        <header className="flex max-w-2xl flex-col gap-3">
          <p className="v12-label">Theming</p>
          <h1 className="text-3xl font-semibold tracking-tight text-balance text-(--dh-ink) sm:text-4xl">
            Your theme, already applied.
          </h1>
          <p className="text-base text-pretty text-(--dh-ink-muted)">
            The table is built from shadcn/ui parts and reads your CSS
            variables. Change them and every part follows: surfaces, type and
            radius.
          </p>
        </header>
        <Stage />
      </main>
    </div>
  );
}
