'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { MenuIcon, SearchIcon, Table2Icon, XIcon } from 'lucide-react';
import { GITHUB_URL, NAV_LINKS } from './links';
import { GitHubIcon } from './github-icon';

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span className="grid size-7 place-items-center rounded-lg bg-(--dh-accent) text-(--dh-accent-ink)">
        <Table2Icon aria-hidden="true" className="size-4" strokeWidth={2.5} />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">
        shadcn<span className="text-(--dh-ink-faint)">/</span>react-table
      </span>
    </span>
  );
}

/** Logo left, links in a centred pill, search pill + GitHub right. */
export function Nav() {
  const { setOpenSearch } = useSearchContext();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="relative z-20 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6">
      <nav
        aria-label="Main"
        className="grid h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"
      >
        <Link
          href="/"
          aria-label="shadcn-react-table home"
          className="v2-focus rounded-lg"
        >
          <Wordmark />
        </Link>

        <ul className="hidden justify-self-center rounded-full border border-(--dh-rule) bg-(--dh-paper-2) p-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="v2-focus block rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap text-(--dh-ink-muted) hover:bg-(--dh-paper-3) hover:text-(--dh-ink)"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="col-start-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            className="v2-focus v2-press hidden items-center gap-2 rounded-full border border-(--dh-rule) bg-(--dh-paper-2) py-1.5 pr-1.5 pl-3 text-sm whitespace-nowrap text-(--dh-ink-muted) hover:border-(--dh-rule-strong) hover:text-(--dh-ink) sm:inline-flex"
          >
            <SearchIcon aria-hidden="true" className="size-3.5" />
            Search docs
            <kbd className="rounded-full border border-(--dh-rule) bg-(--dh-paper) px-2 py-0.5 font-mono text-[11px] text-(--dh-ink-faint)">
              ⌘K
            </kbd>
          </button>
          <a
            href={GITHUB_URL}
            aria-label="GitHub repository"
            className="v2-focus v2-press grid size-9 place-items-center rounded-full border border-(--dh-rule) bg-(--dh-paper-2) text-(--dh-ink-muted) hover:text-(--dh-ink)"
          >
            <GitHubIcon className="size-4" />
          </a>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className="v2-focus v2-press grid size-9 place-items-center rounded-full border border-(--dh-rule) bg-(--dh-paper-2) text-(--dh-ink-muted) hover:text-(--dh-ink) lg:hidden"
          >
            {open ? (
              <XIcon aria-hidden="true" className="size-4" />
            ) : (
              <MenuIcon aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id={menuId}
          className="v2-menu absolute inset-x-4 top-[4.75rem] rounded-2xl border border-(--dh-rule) bg-(--dh-paper-2) p-2 shadow-2xl sm:left-auto sm:w-64 lg:hidden"
        >
          <ul className="flex flex-col">
            <li className="sm:hidden">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setOpenSearch(true);
                }}
                className="v2-focus flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap text-(--dh-ink-muted) hover:bg-(--dh-paper-3) hover:text-(--dh-ink)"
              >
                <SearchIcon aria-hidden="true" className="size-3.5" />
                Search docs
              </button>
            </li>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="v2-focus block rounded-xl px-3 py-2.5 text-sm whitespace-nowrap text-(--dh-ink-muted) hover:bg-(--dh-paper-3) hover:text-(--dh-ink)"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
