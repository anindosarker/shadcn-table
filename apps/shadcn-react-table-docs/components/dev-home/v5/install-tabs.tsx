'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

const REGISTRY_ITEM = 'anindosarker/shadcn-react-table/shadcn-react-table';

const MANAGERS = [
  { id: 'pnpm', run: 'pnpm dlx' },
  { id: 'npm', run: 'npx' },
  { id: 'yarn', run: 'yarn dlx' },
  { id: 'bun', run: 'bunx --bun' },
] as const;

const commandFor = (run: string) => `${run} shadcn@latest add ${REGISTRY_ITEM}`;

/** shadcn CLI install command, one tab per package manager, with copy. */
export function InstallTabs({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const command = commandFor(MANAGERS[active].run);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta =
      e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : null;
    if (delta === null) return;
    e.preventDefault();
    const next = (active + delta + MANAGERS.length) % MANAGERS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={cn('v5-install', className)}>
      <div
        role="tablist"
        aria-label="Package manager"
        className="flex items-end gap-1 border-b border-(--dh-rule) px-2"
        onKeyDown={onKeyDown}
      >
        {MANAGERS.map((m, i) => (
          <button
            key={m.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${m.id}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className="v5-tab"
          >
            {m.id}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${MANAGERS[active].id}`}
        className="flex flex-col gap-4 p-4 sm:p-5"
      >
        <p className="v5-install-cmd">
          <span aria-hidden="true" className="text-(--dh-accent) select-none">
            ${' '}
          </span>
          <code>{command}</code>
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-(--dh-ink-faint)">
            Copies the source into your repo
          </span>
          <button
            type="button"
            onClick={copy}
            className="v5-copy"
            aria-label={
              copied ? 'Copied' : `Copy ${MANAGERS[active].id} command`
            }
          >
            <span className="grid">
              <CopyIcon
                aria-hidden="true"
                className={cn(
                  'col-start-1 row-start-1 size-3.5 transition-opacity duration-(--dh-dur-fast)',
                  copied && 'opacity-0',
                )}
              />
              <CheckIcon
                aria-hidden="true"
                className={cn(
                  'col-start-1 row-start-1 size-3.5 transition-opacity duration-(--dh-dur-fast)',
                  !copied && 'opacity-0',
                )}
              />
            </span>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Install command copied' : ''}
        </span>
      </div>
    </div>
  );
}
