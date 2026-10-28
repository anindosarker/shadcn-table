import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { archivo } from '@/components/dev-home/v4/font';
import { Nav } from '@/components/dev-home/v12/nav';
import { DEV_GROUPS } from './pages';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v12/v12.css';

export const metadata: Metadata = { title: 'Experiments' };

/** Index of every review page under /dev, from DEV_GROUPS. */
export default function Page() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav />
      <main className="v4-shell flex w-full flex-col gap-10 py-12">
        <h1 className="text-2xl font-semibold">Experiments</h1>
        {DEV_GROUPS.map((group) => (
          <section key={group.title} className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              {group.title}
            </h2>
            <ul className="flex flex-col divide-y border-y">
              {group.pages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="group flex items-baseline gap-4 py-4"
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:gap-4">
                      <span className="font-medium sm:w-24">{page.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {page.description}
                      </span>
                    </span>
                    <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                      {page.href}
                    </span>
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="size-4 shrink-0 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
