import { archivo } from '@/components/dev-home/v4/font';
import { Nav } from '@/components/dev-home/v12/nav';
import { TerminalDemo } from '@/components/theme-demo/variants/terminal';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v12/v12.css';

/** Theme demo variant 1: a terminal prints the theme tokens the table
 * beside it is drawn in. */
export default function Page() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav />
      <main className="v4-shell flex w-full flex-col gap-8 py-12">
        <header className="flex max-w-2xl flex-col gap-3">
          <h1 className="v4-display text-3xl tracking-tight text-balance sm:text-4xl">
            Your tokens. Your table.
          </h1>
          <p className="text-muted-foreground text-pretty">
            shadcn-table reads the same CSS variables as every shadcn/ui
            component. Change globals.css and the table follows: colours, radius
            and font.
          </p>
        </header>
        <TerminalDemo />
      </main>
    </div>
  );
}
