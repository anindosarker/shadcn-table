'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ChevronDownIcon, ExternalLinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/cn';

export interface PlaygroundFile {
  /** File name shown on the tab, for example `TS.tsx`. */
  name: string;
  /** The highlighted source, already wrapped in a fumadocs CodeBlock. */
  node: ReactNode;
}

interface Props {
  /** The live example. */
  children: ReactNode;
  files: PlaygroundFile[];
  /** Link to the example folder on GitHub. */
  githubUrl: string;
  /** Example folder name, used as the panel's anchor id. */
  name: string;
}

type Mode = 'preview' | 'code' | 'split';

const MODES: { label: string; value: Mode }[] = [
  { label: 'Preview', value: 'preview' },
  { label: 'Code', value: 'code' },
  { label: 'Split', value: 'split' },
];

/** The reader's last view mode, shared by every example panel. */
const STORAGE_KEY = 'srt-example-mode';

const isMode = (value: unknown): value is Mode =>
  MODES.some((mode) => mode.value === value);

/**
 * Static playground panel around a live example: Preview, Code or Split
 * view, one tab per source file, Open in GitHub. The table stays mounted in
 * every mode so its state survives switching views.
 */
export const ExamplePlayground = ({
  children,
  files,
  githubUrl,
  name,
}: Props) => {
  const [mode, setMode] = useState<Mode>('preview');
  const [file, setFile] = useState(files[0]?.name ?? '');

  // The stored mode is read after mount so server and first client render
  // agree (default Preview).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isMode(stored)) setMode(stored);
    } catch {
      // Storage may be blocked (private mode, disabled cookies); keep Preview.
    }
  }, []);

  const changeMode = (next: Mode) => {
    setMode(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not persisted, the panel still switches for this visit.
    }
  };

  const showCode = mode !== 'preview';
  const active = files.find((f) => f.name === file) ?? files[0];

  return (
    <div
      id={name}
      data-mode={mode}
      className="not-prose my-8 scroll-mt-24 overflow-hidden rounded-lg border bg-fd-background"
    >
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-3 py-1.5">
        <div className="flex min-w-0 items-center">
          {showCode && files.length > 0 && (
            <Tabs value={active?.name} onValueChange={setFile}>
              <TabsList variant="line" aria-label="Source files">
                {files.map((f) => (
                  <TabsTrigger key={f.name} value={f.name}>
                    {f.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="View mode"
            className="inline-flex h-8 items-center gap-0.5 rounded-md border bg-fd-secondary p-0.5"
          >
            {MODES.map((m) => (
              <Button
                key={m.value}
                type="button"
                variant="ghost"
                size="xs"
                aria-pressed={mode === m.value}
                onClick={() => changeMode(m.value)}
                className="rounded-[min(var(--radius-md),10px)] text-fd-muted-foreground aria-pressed:bg-fd-background aria-pressed:text-fd-foreground aria-pressed:shadow-sm"
              >
                {m.label}
              </Button>
            ))}
          </div>
          <div
            role="group"
            aria-label="Open example"
            className="srt-page-actions inline-flex h-8 shrink-0 items-stretch overflow-hidden rounded-md border bg-fd-secondary [&>*]:h-full [&>*]:rounded-none [&>*]:border-0"
          >
            <Button asChild variant="ghost" size="sm" className="px-2.5">
              <a href={githubUrl} target="_blank" rel="noreferrer">
                Open in GitHub
                <ExternalLinkIcon data-icon="inline-end" />
              </a>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="w-7 border-l"
                  aria-label="More ways to open"
                >
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem disabled>
                  Open in StackBlitz
                  <span className="ml-auto text-xs text-fd-muted-foreground">
                    soon
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  Open in CodeSandbox
                  <span className="ml-auto text-xs text-fd-muted-foreground">
                    soon
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className={cn(mode === 'split' && 'grid xl:grid-cols-2')}>
        {showCode && active && (
          <div
            className={cn(
              'min-w-0',
              mode === 'split' &&
                'order-2 border-t xl:order-1 xl:border-t-0 xl:border-r',
            )}
          >
            {active.node}
          </div>
        )}
        <div
          className={cn(
            'min-w-0 p-4',
            mode === 'code' && 'hidden',
            mode === 'split' && 'order-1 xl:order-2',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
