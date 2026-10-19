'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useBase } from '@/components/base-selector';
import { cn } from '@/lib/cn';
import { libraryAddCommand } from '@/lib/install';

interface InstallCommandProps {
  /** 'boxed' draws a hairline box; 'bare' is just the line + button. */
  variant?: 'boxed' | 'bare';
  /** Defaults to the library's `shadcn add` for the selected base. */
  command?: string;
  className?: string;
}

/** The install command in mono with a silent copy button. */
export function InstallCommand({
  variant = 'boxed',
  command: givenCommand,
  className,
}: InstallCommandProps) {
  const base = useBase();
  const command = givenCommand ?? libraryAddCommand(base);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-2 font-mono text-[13px] text-(--dh-ink)',
        variant === 'boxed' &&
          'rounded-lg border border-(--dh-rule) bg-(--dh-paper-2) py-1.5 pr-1.5 pl-3.5',
        className,
      )}
      style={{ fontFamily: 'var(--dh-font-mono)' }}
    >
      <span
        aria-hidden="true"
        className="shrink-0 text-(--dh-ink-faint) select-none"
      >
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto py-1 whitespace-nowrap [scrollbar-width:none]">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy install command'}
        className="relative grid size-8 shrink-0 place-items-center rounded-md text-(--dh-ink-muted) outline-2 outline-offset-2 outline-transparent transition-transform duration-150 hover:bg-(--dh-paper-3) hover:text-(--dh-ink) focus-visible:outline-(--dh-focus) active:scale-90"
      >
        <CopyIcon
          aria-hidden="true"
          className={cn(
            'col-start-1 row-start-1 size-4 transition-opacity duration-150',
            copied && 'opacity-0',
          )}
        />
        <CheckIcon
          aria-hidden="true"
          className={cn(
            'col-start-1 row-start-1 size-4 text-(--dh-accent) transition-opacity duration-150',
            !copied && 'opacity-0',
          )}
        />
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Install command copied' : ''}
      </span>
    </div>
  );
}
