import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { archivo } from '@/components/dev-home/v4/font';
import { Nav } from '@/components/dev-home/v12/nav';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v12/v12.css';

export const metadata: Metadata = { title: 'Theme demo variants' };

const VARIANTS = [
  {
    n: 1,
    name: 'Terminal',
    description:
      'A terminal types the install and a globals.css block whose values swap per theme; the table follows.',
  },
  {
    n: 2,
    name: 'Stage',
    description:
      'Theme chips above one large table that crossfades on change; a caption names theme, font and radius.',
  },
  {
    n: 3,
    name: 'Tokens',
    description:
      'The current theme as a token list beside the table; changed tokens flash.',
  },
  {
    n: 4,
    name: 'Grid',
    description: 'Three compact tables in three themes at once, no autoplay.',
  },
] as const;

/** Index of the theme demo variants, for review before one goes live. */
export default function Page() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav />
      <main className="v4-shell flex w-full flex-col gap-6 py-12">
        <h1 className="text-2xl font-semibold">Theme demo variants</h1>
        <ul className="flex flex-col divide-y border-y">
          {VARIANTS.map((v) => (
            <li key={v.n}>
              <Link
                href={`/dev/theme/${v.n}`}
                className="group flex items-baseline gap-4 py-4"
              >
                <span className="font-mono text-sm text-muted-foreground">
                  {v.n}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:gap-4">
                  <span className="font-medium sm:w-24">{v.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {v.description}
                  </span>
                </span>
                <ArrowRightIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
