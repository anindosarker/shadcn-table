'use client';

import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  SparklesIcon,
  TerminalIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { setBase, useBase } from '@/components/base-selector';
import { Button } from '@/components/ui-radix/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui-radix/dropdown-menu';
import { cn } from '@/lib/cn';
import { baseLabels, bases, isBase, type Base } from '@/lib/install';
import { libraryItem } from '@/lib/shared';
import { trackBaseSwitched, trackInstallCommandCopied } from '@/lib/analytics';

/** How long the button reads "Copied" after a click. */
const COPIED_MS = 1500;

type Mode = 'prompt' | 'command';

/**
 * One line for agents: the prompt as visible text and Copy prompt. The
 * prompt points at /SKILL.md; the instructions live there. With `command`
 * a segmented switch on the left swaps in the manual install command, one
 * per base when the command differs: the Command tab then names the
 * site-wide base and a chevron next to it opens a menu that sets it (the
 * same group the docs header pill drives). The prompt is base-agnostic, so
 * the Prompt tab shows no base. The command is the library's `shadcn add`
 * with pnpm (components/dev-home/v12/home-page.tsx), which is what a copy
 * of it reports. Below `sm` the bar stacks: the switch on the first row with
 * the short base name, the text and an icon-only copy button on the second.
 * The text scrolls sideways under a right-edge fade.
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
  const perBase = typeof commands === 'object';
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
    if (mode === 'command' && command) {
      trackInstallCommandCopied({
        item: libraryItem,
        base,
        package_manager: 'pnpm',
        surface: 'home',
      });
    }
  };

  const label = mode === 'command' ? 'Copy command' : 'Copy prompt';

  const select = (value: Mode) => {
    setMode(value);
    setCopied(false);
  };

  const tabClass = (value: Mode) =>
    cn(
      'flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium text-muted-foreground transition-colors',
      mode === value && 'bg-background text-foreground shadow-sm',
    );

  return (
    <div
      data-slot="agent-bar"
      data-mode={mode}
      className={cn(
        'not-prose flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-card py-1.5 pr-1.5 pl-1.5 text-sm sm:flex-nowrap',
        className,
      )}
    >
      {command ? (
        <div
          role="radiogroup"
          aria-label="Install with"
          className="flex shrink-0 gap-0.5 rounded-md bg-muted p-0.5"
        >
          <button
            type="button"
            role="radio"
            aria-checked={mode === 'prompt'}
            onClick={() => select('prompt')}
            className={tabClass('prompt')}
          >
            <SparklesIcon aria-hidden="true" className="size-3.5" />
            Prompt
          </button>
          {/* Split control: the tab switches the mode, the chevron picks
              the base the command installs on. */}
          <div className="flex items-stretch">
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'command'}
              onClick={() => select('command')}
              className={cn(tabClass('command'), perBase && 'rounded-r-none')}
            >
              <TerminalIcon aria-hidden="true" className="size-3.5" />
              {perBase ? (
                <>
                  <span className="sm:hidden">
                    {baseLabels[base].replace(/ UI$/, '')}
                  </span>
                  <span className="max-sm:hidden">
                    Command: {baseLabels[base]}
                  </span>
                </>
              ) : (
                'Command'
              )}
            </button>
            {perBase && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Choose base"
                    data-active={mode === 'command' || undefined}
                    className={cn(
                      tabClass('command'),
                      'rounded-l-none border-l border-border/60 px-1',
                    )}
                  >
                    <ChevronDownIcon aria-hidden="true" className="size-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="docs-menu w-40">
                  <DropdownMenuRadioGroup
                    value={base}
                    onValueChange={(value) => {
                      if (!isBase(value) || value === base) return;
                      trackBaseSwitched({
                        from: base,
                        to: value,
                        surface: 'command_bar',
                      });
                      setBase(value);
                    }}
                  >
                    {bases.map((b) => (
                      <DropdownMenuRadioItem key={b} value={b}>
                        {baseLabels[b]}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      ) : (
        <span className="flex shrink-0 items-center gap-1.5 pl-2 text-muted-foreground">
          <SparklesIcon aria-hidden="true" className="size-3.5" />
          Ask your agent
        </span>
      )}
      {/* Below sm the divider turns into a zero-height full-width break that
          pushes the text and the button onto the second row. */}
      <span
        aria-hidden="true"
        className="h-5 w-px shrink-0 bg-border max-sm:h-0 max-sm:basis-full"
      />
      {/* The end padding matches the fade, so text that fits never sits
          under it and the last characters stay readable once scrolled. */}
      <span className="min-w-0 flex-1 overflow-x-auto py-1 pr-6 font-mono text-[13px] whitespace-nowrap [mask-image:linear-gradient(to_right,black_calc(100%-1.5rem),transparent)] [scrollbar-width:none]">
        {text}
      </span>
      <Button
        type="button"
        size="sm"
        onClick={copy}
        aria-label={copied ? 'Copied' : label}
        className="shrink-0 max-sm:size-7 max-sm:px-0"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span className="max-sm:hidden">{copied ? 'Copied' : label}</span>
      </Button>
    </div>
  );
};
