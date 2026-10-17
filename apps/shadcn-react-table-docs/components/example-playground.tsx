'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  CheckIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  MaximizeIcon,
  MinimizeIcon,
  SparklesIcon,
  TerminalIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTreePath } from 'fumadocs-ui/contexts/tree';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PageSwitcher } from '@/components/page-switcher';
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
  /** `shadcn add` command that installs the example into a project. */
  installCommand: string;
  /** Example folder name, used as the panel's anchor id. */
  name: string;
  /** Prompt for a coding agent: install, import, docs to read, verify. */
  prompt: string;
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

type CopyTarget = 'install' | 'prompt';

/** How long a menu item reads "Copied" after a click. */
const COPIED_MS = 1500;

/**
 * Static playground panel around a live example: Preview, Code or Split
 * view, one tab per source file, Open in GitHub, full screen. The table stays
 * mounted in every mode so its state survives switching views. On example
 * pages the header also carries the page switcher, so the reader can jump
 * between examples without leaving the panel. The caret menu next to Open in
 * GitHub copies the install command or the agent prompt to the clipboard.
 */
export const ExamplePlayground = ({
  children,
  files,
  githubUrl,
  installCommand,
  name,
  prompt,
}: Props) => {
  const [mode, setMode] = useState<Mode>('preview');
  const [file, setFile] = useState(files[0]?.name ?? '');
  const [fullscreen, setFullscreen] = useState(false);
  // The tooltip is controlled, as in the table's own toolbar button, so it
  // closes on click instead of lingering over the changed layout.
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const path = useTreePath();

  useEffect(
    () => () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    },
    [],
  );

  const copy = async (target: CopyTarget, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard blocked (permissions, insecure context): nothing to show.
      return;
    }
    setCopied(target);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(null), COPIED_MS);
  };

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

  // Full screen: lock the page behind the panel and close on Escape. Radix
  // layers (popover, menu) handle Escape first and mark the event, so an open
  // popover closes without leaving full screen.
  useEffect(() => {
    if (!fullscreen) return;
    const previous = document.body.style.overflow;
    const root = document.documentElement;
    const previousGutter = root.style.scrollbarGutter;
    document.body.style.overflow = 'hidden';
    // global.css reserves a stable scrollbar gutter on <html>; drop it while
    // the page cannot scroll so the panel reaches the right edge.
    root.style.scrollbarGutter = 'auto';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        setFullscreen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      root.style.scrollbarGutter = previousGutter;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [fullscreen]);

  const changeMode = (next: Mode) => {
    setMode(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not persisted, the panel still switches for this visit.
    }
  };

  const toggleFullscreen = () => {
    setTooltipOpen(false);
    setFullscreen((value) => !value);
  };

  const showCode = mode !== 'preview';
  const active = files.find((f) => f.name === file) ?? files[0];
  const showTabs = showCode && files.length > 0;

  // Only example pages get the switcher: inside a guide the panel is one of
  // several and switching would navigate away from the guide.
  const section = path[0];
  const current = path[path.length - 1];
  const switcher =
    pathname.startsWith('/docs/examples/') &&
    section?.type === 'folder' &&
    current?.type === 'page' ? (
      <PageSwitcher
        section={section}
        current={current}
        className="h-8 shrink-0 rounded-md border bg-fd-secondary px-2.5 text-sm font-medium text-fd-foreground"
      />
    ) : null;

  return (
    <div
      id={name}
      data-mode={mode}
      data-fullscreen={fullscreen || undefined}
      className={cn(
        'docs-playground not-prose my-8 scroll-mt-24 overflow-hidden rounded-lg bg-fd-background',
        fullscreen && 'fixed inset-0 z-50 my-0 flex flex-col rounded-none',
      )}
    >
      <header
        className={cn(
          'flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-1.5',
          fullscreen && 'shrink-0',
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          {switcher}
          {switcher && showTabs && (
            <div aria-hidden className="h-5 w-px shrink-0 bg-fd-border" />
          )}
          {showTabs && (
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
                {/* The menu stays open so the "Copied" state is visible. */}
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    void copy('install', installCommand);
                  }}
                >
                  {copied === 'install' ? <CheckIcon /> : <TerminalIcon />}
                  {copied === 'install' ? 'Copied' : 'Copy install command'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    void copy('prompt', prompt);
                  }}
                >
                  {copied === 'prompt' ? <CheckIcon /> : <SparklesIcon />}
                  {copied === 'prompt' ? 'Copied' : 'Copy prompt'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
          {/* Same button as the table toolbar's SRT_ToggleFullScreenButton. */}
          <Tooltip open={tooltipOpen}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Toggle full screen"
                aria-pressed={fullscreen}
                onBlur={() => setTooltipOpen(false)}
                onClick={toggleFullscreen}
                onFocus={() => setTooltipOpen(true)}
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
              >
                {fullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
              </Button>
            </TooltipTrigger>
            {/* While the tooltip is open or still fading out its Radix layer
                claims Escape, so leave full screen from here as well. */}
            <TooltipContent
              side="bottom"
              onEscapeKeyDown={() => setFullscreen(false)}
            >
              Toggle full screen
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
      {/* Split is code 3fr, preview 2fr from the @4xl container step (panel
          body at least 56rem wide: full-width example pages, full screen);
          narrower panels stack code above the preview. The code pane keeps
          its own scroll in Split. */}
      <div
        className={cn(
          '@container',
          fullscreen && 'min-h-0 flex-1 overflow-auto',
        )}
      >
        <div
          className={cn(mode === 'split' && 'grid @4xl:grid-cols-[3fr_2fr]')}
        >
          {showCode && active && (
            <div
              data-slot="code"
              className={cn(
                'min-w-0',
                mode === 'split' &&
                  'max-h-[32rem] overflow-auto border-b @4xl:border-r @4xl:border-b-0',
              )}
            >
              {active.node}
            </div>
          )}
          <div
            data-slot="preview"
            className={cn('min-w-0 p-4', mode === 'code' && 'hidden')}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
