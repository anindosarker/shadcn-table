'use client';

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useBase } from '@/components/base-selector';
import { CodeExplorer, type ExplorerFile } from '@/components/code-explorer';
import { ExampleSwitcher } from '@/components/example-switcher';
import { GitHubIcon } from '@/components/github-icon';
import { cn } from '@/lib/cn';
import type { Base } from '@/lib/install';

/** What differs per base: the sources (import paths) and the commands. */
export interface ExampleVariantData {
  /** Source files for the code explorer, in tree order. */
  files: ExplorerFile[];
  /** `shadcn add` command that installs the example into a project. */
  installCommand: string;
  /** Prompt for a coding agent: install, import, docs to read, verify. */
  prompt: string;
}

interface Props {
  /** The live example (components/example-variant.tsx picks the base). */
  children: ReactNode;
  /** Link to the example folder on GitHub. */
  githubUrl: string;
  /** Example folder name, used as the panel's anchor id. */
  name: string;
  /** Sources and commands per base; the site-wide selector picks one. */
  variants: Record<Base, ExampleVariantData>;
}

type Mode = 'preview' | 'code' | 'both';

const MODES: { label: string; value: Mode }[] = [
  { label: 'Preview', value: 'preview' },
  { label: 'Code', value: 'code' },
  { label: 'Both', value: 'both' },
];

/** The reader's last view mode, shared by every example panel. */
const STORAGE_KEY = 'st-example-mode';
const DEFAULT_MODE: Mode = 'preview';

const isMode = (value: unknown): value is Mode =>
  MODES.some((mode) => mode.value === value);

/* The stored mode as an external store: every panel on the page reads the
 * same value, and the server render (and first client render) use Preview.
 * 'split' was the old name for 'both'. */
const modeListeners = new Set<() => void>();

/** Fallback when storage is blocked, so a click still switches the view. */
let sessionMode: Mode | null = null;

const subscribeMode = (onChange: () => void) => {
  modeListeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    modeListeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
};

const readMode = (): Mode => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'split') return 'both';
    return isMode(stored) ? stored : DEFAULT_MODE;
  } catch {
    // Storage may be blocked (private mode, disabled cookies); keep Preview.
    return DEFAULT_MODE;
  }
};

const writeMode = (next: Mode) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not persisted; the panels still switch for this visit.
    sessionMode = next;
  }
  for (const listener of modeListeners) listener();
};

const getModeSnapshot = () => sessionMode ?? readMode();
const getModeServerSnapshot = () => DEFAULT_MODE;

type CopyTarget = 'install' | 'prompt';

/** How long a copy action reads "Copied" after a click. */
const COPIED_MS = 1500;

/**
 * Static playground panel around a live example: Preview, Code or Both
 * (the example, then its code below) view, a file tree code explorer, Copy
 * prompt, full screen. The table stays
 * mounted in every mode so its state survives switching views. On example
 * pages the header also carries the example switcher (previous / next and
 * the page combobox), so the reader can step through examples without
 * leaving the panel. Copy prompt writes the agent prompt to the clipboard;
 * the caret menu next to it copies the install command or opens the
 * example in GitHub. Code, prompt and command are those of the selected
 * base (the header switch), as is the live example.
 */
export const ExamplePlayground = ({
  children,
  githubUrl,
  name,
  variants,
}: Props) => {
  const base = useBase();
  const { files, installCommand, prompt } = variants[base];
  const mode = useSyncExternalStore(
    subscribeMode,
    getModeSnapshot,
    getModeServerSnapshot,
  );
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

  const changeMode = (next: Mode) => writeMode(next);

  const toggleFullscreen = () => {
    setTooltipOpen(false);
    setFullscreen((value) => !value);
  };

  const showCode = mode !== 'preview' && files.length > 0;

  // Only example pages get the switcher: inside a guide the panel is one of
  // several and switching would navigate away from the guide.
  const section = path[0];
  const current = path[path.length - 1];
  const switcher =
    pathname.startsWith('/docs/examples/') &&
    section?.type === 'folder' &&
    current?.type === 'page' ? (
      <ExampleSwitcher section={section} current={current} />
    ) : null;

  return (
    <div
      // Prefixed like the registry item so a guide heading whose slug is
      // the example name ("Customize Filter Modes") cannot share the id.
      id={`example-${name}`}
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
        {switcher}
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
            className="st-page-actions inline-flex h-8 shrink-0 items-stretch overflow-hidden rounded-md border bg-fd-secondary [&>*]:h-full [&>*]:rounded-none [&>*]:border-0"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2.5"
              onClick={() => void copy('prompt', prompt)}
            >
              {copied === 'prompt' ? (
                <CheckIcon data-icon="inline-start" />
              ) : (
                <SparklesIcon data-icon="inline-start" />
              )}
              {/* Both labels share one cell so the button keeps its width
                  while it reads "Copied"; the hidden one is not announced. */}
              <span className="grid justify-items-start">
                <span
                  className={cn(
                    'col-start-1 row-start-1',
                    copied === 'prompt' && 'invisible',
                  )}
                >
                  Copy prompt
                </span>
                <span
                  className={cn(
                    'col-start-1 row-start-1',
                    copied !== 'prompt' && 'invisible',
                  )}
                >
                  Copied
                </span>
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="w-7 border-l"
                  aria-label="More actions"
                >
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="docs-menu w-52">
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
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={githubUrl} target="_blank" rel="noreferrer">
                    <GitHubIcon />
                    Open in GitHub
                    <ExternalLinkIcon className="ml-auto text-fd-muted-foreground" />
                  </a>
                </DropdownMenuItem>
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
          {/* Same button as the table toolbar's ST_ToggleFullScreenButton. */}
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
      {/* Both stacks the live example above its code, full width at every
          size. The example comes first in every mode so the table stays
          mounted (hidden in Code) and keeps its state across views. */}
      <div className={cn(fullscreen && 'min-h-0 flex-1 overflow-auto')}>
        <div
          data-slot="preview"
          className={cn('min-w-0 p-4', mode === 'code' && 'hidden')}
        >
          {children}
        </div>
        {showCode && (
          <div
            data-slot="code"
            className={cn(
              'min-w-0',
              mode === 'both' && '[border-top:var(--docs-rule)]',
            )}
          >
            <CodeExplorer files={files} />
          </div>
        )}
      </div>
    </div>
  );
};
