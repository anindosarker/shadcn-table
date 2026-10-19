'use client';

import { CheckIcon, CopyIcon, SparklesIcon, TerminalIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useBase } from '@/components/base-selector';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import type { Base } from '@/lib/install';

/** How long the button reads "Copied" after a click. */
const COPIED_MS = 1500;

type Mode = 'prompt' | 'command';

/**
 * One line for agents: the prompt as visible text and Copy prompt. The
 * prompt points at /SKILL.md; the instructions live there. With `command`
 * a segmented switch on the left swaps in the manual install command, one
 * per base when the command differs (the site-wide base selector picks it).
 */
export const AgentBar = ({
  prompt,
  command: commands,
  className,
}: {
  prompt: string;
  command?: string | Record<Base, string>;
  className?: string;
}) => {
  const [mode, setMode] = useState<Mode>('prompt');
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const base = useBase();
  const command = typeof commands === 'string' ? commands : commands?.[base];
  const text = mode === 'command' && command ? command : prompt;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard blocked (permissions, insecure context): nothing to show.
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  const label = mode === 'command' ? 'Copy command' : 'Copy prompt';

  return (
    <div
      data-slot="agent-bar"
      data-mode={mode}
      className={cn(
        'not-prose flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card py-1.5 pr-1.5 pl-1.5 text-sm',
        className,
      )}
    >
      {command ? (
        <div
          role="radiogroup"
          aria-label="Install with"
          className="flex shrink-0 gap-0.5 rounded-md bg-muted p-0.5"
        >
          {(
            [
              ['prompt', 'Prompt', SparklesIcon],
              ['command', 'Command', TerminalIcon],
            ] as const
          ).map(([value, name, Icon]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={mode === value}
              onClick={() => {
                setMode(value);
                setCopied(false);
              }}
              className={cn(
                'flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium text-muted-foreground transition-colors',
                mode === value && 'bg-background text-foreground shadow-sm',
              )}
            >
              <Icon aria-hidden="true" className="size-3.5" />
              {name}
            </button>
          ))}
        </div>
      ) : (
        <span className="flex shrink-0 items-center gap-1.5 pl-2 text-muted-foreground">
          <SparklesIcon aria-hidden="true" className="size-3.5" />
          Ask your agent
        </span>
      )}
      <span aria-hidden="true" className="h-5 w-px shrink-0 bg-border" />
      <span className="min-w-0 flex-1 overflow-x-auto py-1 font-mono text-[13px] whitespace-nowrap [scrollbar-width:none]">
        {text}
      </span>
      <Button type="button" size="sm" onClick={copy} className="shrink-0">
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? 'Copied' : label}
      </Button>
    </div>
  );
};
