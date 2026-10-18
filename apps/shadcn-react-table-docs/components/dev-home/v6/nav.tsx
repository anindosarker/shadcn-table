import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import {
  GET_STARTED_HREF,
  NAV_LINKS,
  SpecMark,
} from '@/components/dev-home/v3/spec-nav';

/** v3's thin sheet bar, pointed at this page and its sections. */
export function BlueprintNav() {
  return (
    <header className="v3-nav">
      <div className="relative flex h-12 items-stretch">
        <Link
          href="/dev/6"
          aria-label="shadcn-react-table home"
          className="v3-navlink h-auto! shrink-0 gap-2.5 border-r border-dashed border-(--v3-dash) px-4! text-(--dh-ink)! normal-case! tracking-normal!"
        >
          <SpecMark className="size-5 text-(--dh-accent)" />
          <span className="text-[13px] sm:hidden">SRT</span>
          <span className="hidden text-[13px] sm:inline">
            shadcn-react-table
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden min-w-0 flex-1 items-center gap-1 px-3 md:flex"
        >
          {NAV_LINKS.map((l) =>
            'external' in l ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="v3-navlink gap-1"
              >
                {l.label}
                <ArrowUpRightIcon aria-hidden="true" className="size-3" />
              </a>
            ) : (
              <Link key={l.label} href={l.href} className="v3-navlink">
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <details className="v3-menu ml-auto flex md:hidden">
          <summary className="v3-navlink h-full! border-l border-dashed border-(--v3-dash) px-4!">
            Menu
          </summary>
          <ul className="absolute inset-x-0 top-full z-10 flex flex-col border-y border-dashed border-(--v3-dash) bg-(--dh-paper)">
            {NAV_LINKS.map((l, i) => (
              <li
                key={l.label}
                className={
                  i > 0
                    ? 'border-t border-dashed border-(--v3-dash-soft)'
                    : undefined
                }
              >
                <Link
                  href={l.href}
                  {...('external' in l
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                  className="flex h-11 items-center justify-between px-4 font-mono text-xs tracking-[0.12em] whitespace-nowrap text-(--dh-ink-muted) uppercase hover:text-(--dh-ink)"
                >
                  {l.label}
                  <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </details>

        <Link
          href={GET_STARTED_HREF}
          className="v3-block shrink-0 px-3.5! sm:px-5! md:ml-auto"
        >
          Get started
          <ArrowRightIcon
            aria-hidden="true"
            className="hidden size-3.5 sm:block"
          />
        </Link>
      </div>
    </header>
  );
}
