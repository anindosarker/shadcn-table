'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  FileCodeIcon,
  FileIcon,
  FileJsonIcon,
  FolderIcon,
  FolderOpenIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from 'lucide-react';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/cn';

export interface ExplorerFile {
  /** Path relative to the example folder, for example `hooks/useUsersQuery.ts`. */
  path: string;
  /** Raw source, for the copy button and the highlighter. */
  source: string;
  /** Shiki language from the extension: tsx, ts, css, json or text. */
  lang: string;
}

interface Props {
  /** In tree order: the entry file first, then folders before files. */
  files: ExplorerFile[];
}

type TreeNode =
  | { type: 'folder'; name: string; path: string; children: TreeNode[] }
  | { type: 'file'; name: string; path: string };

/** Nests the flat paths into folders, keeping the order they came in. */
function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode[] = [];
  for (const path of paths) {
    const parts = path.split('/');
    let level = root;
    parts.slice(0, -1).forEach((name, i) => {
      const folderPath = parts.slice(0, i + 1).join('/');
      let folder = level.find(
        (node): node is Extract<TreeNode, { type: 'folder' }> =>
          node.type === 'folder' && node.path === folderPath,
      );
      if (!folder) {
        folder = { type: 'folder', name, path: folderPath, children: [] };
        level.push(folder);
      }
      level = folder.children;
    });
    level.push({ type: 'file', name: parts[parts.length - 1], path });
  }
  return root;
}

const FileTypeIcon = ({ path }: { path: string }) => {
  if (path.endsWith('.json')) return <FileJsonIcon />;
  if (/\.(tsx?|jsx?|css)$/.test(path)) return <FileCodeIcon />;
  return <FileIcon />;
};

/** How long the copy button reads "Copied" after a click. */
const COPIED_MS = 1500;

/* Tree pane width and visibility, shared by every explorer on the page and
 * remembered across visits. Read through useSyncExternalStore so the server
 * render and the first client render use the defaults (no hydration
 * mismatch), then every explorer follows the stored values. */
const WIDTH_KEY = 'st-code-tree-width';
const HIDDEN_KEY = 'st-code-tree-hidden';
const DEFAULT_WIDTH = 220;
const MIN_WIDTH = 160;
const MAX_WIDTH = 420;
/** Arrow key step on the resize handle. */
const KEY_STEP = 16;

const treeListeners = new Set<() => void>();
/** Fallback when storage is blocked, so resizing and hiding still work. */
const sessionTree: { width?: number; hidden?: boolean } = {};

const subscribeTree = (onChange: () => void) => {
  treeListeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    treeListeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
};

const readStored = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Storage may be blocked (private mode, disabled cookies).
    return null;
  }
};

const writeStored = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const getWidthSnapshot = () => {
  if (sessionTree.width !== undefined) return sessionTree.width;
  const stored = Number(readStored(WIDTH_KEY));
  return Number.isFinite(stored) && stored >= MIN_WIDTH
    ? Math.min(stored, MAX_WIDTH)
    : DEFAULT_WIDTH;
};

const getHiddenSnapshot = () =>
  sessionTree.hidden ?? readStored(HIDDEN_KEY) === 'true';

const setTreeWidth = (width: number) => {
  if (!writeStored(WIDTH_KEY, String(width))) sessionTree.width = width;
  for (const listener of treeListeners) listener();
};

const setTreeHidden = (hidden: boolean) => {
  if (!writeStored(HIDDEN_KEY, String(hidden))) sessionTree.hidden = hidden;
  for (const listener of treeListeners) listener();
};

const rowClass =
  'flex h-7 w-full items-center gap-2 pe-3 text-start text-fd-muted-foreground hover:bg-fd-foreground/6 hover:text-fd-foreground focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-dashed focus-visible:outline-(--docs-accent) [&>span]:truncate [&>svg]:size-3.5 [&>svg]:shrink-0';

/** Row indent: 12px, plus 14px per level (one icon width). */
const indentRem = (depth: number) => 0.75 + depth * 0.875;

/**
 * Source view of an example: a file tree on the left, a path bar with a copy
 * button and the code of the active file. The active file is highlighted in
 * the browser by DynamicCodeBlock when the reader opens it (the server sends
 * raw strings only, which keeps the pages small); until the grammar has
 * loaded the raw source shows in a plain pre. A single file shows just the
 * path bar and code. The tree can be resized from its right edge (drag, or
 * arrow keys on the handle) and hidden; both are remembered. Under 640px the
 * tree gives way to a file menu in the path bar.
 */
export const CodeExplorer = ({ files }: Props) => {
  const [activePath, setActivePath] = useState(files[0]?.path ?? '');
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const [copied, setCopied] = useState(false);
  // Width while dragging; stored once on release.
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; width: number } | null>(null);
  const storedWidth = useSyncExternalStore(
    subscribeTree,
    getWidthSnapshot,
    () => DEFAULT_WIDTH,
  );
  const hidden = useSyncExternalStore(
    subscribeTree,
    getHiddenSnapshot,
    () => false,
  );
  const tree = useMemo(() => buildTree(files.map((f) => f.path)), [files]);

  useEffect(
    () => () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    },
    [],
  );

  const active = files.find((f) => f.path === activePath) ?? files[0];
  if (!active) return null;
  const multi = files.length > 1;
  const width = dragWidth ?? storedWidth;
  const activeFolder = active.path.includes('/')
    ? active.path.slice(0, active.path.lastIndexOf('/'))
    : '';

  /** Min 160px; max 420px or half the explorer, whichever is smaller. */
  const clampWidth = (value: number) => {
    const half = (rootRef.current?.clientWidth ?? 2 * MAX_WIDTH) / 2;
    const max = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, half));
    return Math.round(Math.min(max, Math.max(MIN_WIDTH, value)));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.source);
    } catch {
      // Clipboard blocked (permissions, insecure context): nothing to show.
      return;
    }
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  const toggleFolder = (path: string, open?: boolean) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      const isOpen = !prev.has(path);
      if (open ?? !isOpen) next.delete(path);
      else next.add(path);
      return next;
    });

  const onResizeStart = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, width };
    setDragWidth(width);
  };

  const onResizeMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setDragWidth(
      clampWidth(drag.current.width + event.clientX - drag.current.x),
    );
  };

  const onResizeEnd = () => {
    if (!drag.current) return;
    drag.current = null;
    if (dragWidth !== null) setTreeWidth(dragWidth);
    setDragWidth(null);
  };

  const onResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = {
      ArrowLeft: width - KEY_STEP,
      ArrowRight: width + KEY_STEP,
      Home: MIN_WIDTH,
      End: MAX_WIDTH,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setTreeWidth(clampWidth(next));
  };

  // Arrow keys move between visible rows; Left and Right close and open a
  // folder, Home and End jump to the first and last row.
  const onTreeKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const rows = Array.from(
      treeRef.current?.querySelectorAll<HTMLButtonElement>('[data-tree-row]') ??
        [],
    );
    const index = rows.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    const row = rows[index];
    const focus = (i: number) =>
      rows[Math.max(0, Math.min(rows.length - 1, i))]?.focus();
    switch (event.key) {
      case 'ArrowDown':
        focus(index + 1);
        break;
      case 'ArrowUp':
        focus(index - 1);
        break;
      case 'Home':
        focus(0);
        break;
      case 'End':
        focus(rows.length - 1);
        break;
      case 'ArrowRight':
        if (row.dataset.folder) toggleFolder(row.dataset.folder, true);
        break;
      case 'ArrowLeft':
        if (row.dataset.folder) toggleFolder(row.dataset.folder, false);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const renderNodes = (nodes: TreeNode[], depth: number): ReactNode =>
    nodes.map((node) => {
      const indent = { paddingInlineStart: `${indentRem(depth)}rem` };
      if (node.type === 'folder') {
        const open = !collapsed.has(node.path);
        return (
          <li key={node.path}>
            <button
              type="button"
              data-tree-row
              data-folder={node.path}
              aria-expanded={open}
              title={node.path}
              onClick={() => toggleFolder(node.path)}
              style={indent}
              className={rowClass}
            >
              {open ? <FolderOpenIcon /> : <FolderIcon />}
              <span>{node.name}</span>
            </button>
            {open && (
              // Indent guide: a 1px line under the folder icon, down the
              // children; brighter for the folder holding the active file.
              <ul
                data-guide-active={node.path === activeFolder || undefined}
                style={
                  {
                    '--guide': `calc(${indentRem(depth)}rem + 7px)`,
                  } as CSSProperties
                }
                className="relative m-0! before:pointer-events-none before:absolute before:inset-y-0 before:start-(--guide) before:w-px before:bg-fd-foreground/10 data-guide-active:before:bg-fd-foreground/25"
              >
                {renderNodes(node.children, depth + 1)}
              </ul>
            )}
          </li>
        );
      }
      const current = node.path === active.path;
      return (
        <li key={node.path}>
          <button
            type="button"
            data-tree-row
            aria-current={current ? 'true' : undefined}
            title={node.path}
            onClick={() => setActivePath(node.path)}
            style={indent}
            className={cn(
              rowClass,
              current &&
                'bg-fd-foreground/6 font-medium text-(--docs-accent) hover:text-(--docs-accent)',
            )}
          >
            <FileTypeIcon path={node.path} />
            <span>{node.name}</span>
          </button>
        </li>
      );
    });

  return (
    <div ref={rootRef} data-slot="code-explorer" className="flex min-w-0">
      {multi && !hidden && (
        <nav
          aria-label="Source files"
          style={{ width, maxWidth: '50%' }}
          className="relative hidden shrink-0 flex-col [border-inline-end:var(--docs-rule)] sm:flex"
        >
          <div className="flex h-9 shrink-0 items-center justify-between gap-2 ps-3 pe-1.5 font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-fd-muted-foreground [border-bottom:var(--docs-rule)]">
            Files
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Hide file tree"
              title="Hide file tree"
              onClick={() => setTreeHidden(true)}
              className="rounded-none text-fd-muted-foreground hover:text-fd-foreground"
            >
              <PanelLeftCloseIcon />
            </Button>
          </div>
          <ul
            ref={treeRef}
            onKeyDown={onTreeKeyDown}
            // m-0!: the docs prose list margin (#nd-page .prose ul) reaches
            // into the not-prose panel and would space out the rows.
            className="m-0! max-h-[32rem] overflow-y-auto py-1.5 font-mono text-[12.5px]"
          >
            {renderNodes(tree, 0)}
          </ul>
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize file tree"
            aria-valuemin={MIN_WIDTH}
            aria-valuemax={MAX_WIDTH}
            aria-valuenow={width}
            tabIndex={0}
            data-dragging={dragWidth !== null || undefined}
            onPointerDown={onResizeStart}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeEnd}
            onPointerCancel={onResizeEnd}
            onKeyDown={onResizeKeyDown}
            className="absolute inset-y-0 -end-[3px] z-10 w-1.5 cursor-col-resize touch-none outline-none after:absolute after:inset-y-0 after:start-[2px] after:w-px after:bg-transparent hover:after:bg-(--docs-accent) focus-visible:after:bg-(--docs-accent) data-dragging:after:bg-(--docs-accent)"
          />
        </nav>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-9 shrink-0 items-center gap-2 ps-3 pe-1.5 [border-bottom:var(--docs-rule)]">
          {multi && hidden && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Show file tree"
              title="Show file tree"
              onClick={() => setTreeHidden(false)}
              className="-ms-1.5 hidden rounded-none text-fd-muted-foreground hover:text-fd-foreground sm:inline-flex"
            >
              <PanelLeftOpenIcon />
            </Button>
          )}
          {multi && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Source file"
                  className="flex h-7 min-w-0 items-center gap-1.5 rounded-none px-2 font-mono text-xs text-fd-foreground [border:var(--docs-rule)] hover:bg-fd-foreground/6 sm:hidden [&>svg]:size-3.5 [&>svg]:shrink-0"
                >
                  <FileTypeIcon path={active.path} />
                  <span className="truncate">/{active.path}</span>
                  <ChevronDownIcon className="text-fd-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="docs-menu min-w-56">
                <DropdownMenuRadioGroup
                  value={active.path}
                  onValueChange={setActivePath}
                >
                  {files.map((f) => (
                    <DropdownMenuRadioItem
                      key={f.path}
                      value={f.path}
                      className="font-mono text-xs"
                    >
                      {f.path}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <span
            className={cn(
              'min-w-0 truncate font-mono text-xs text-fd-muted-foreground',
              multi && 'hidden sm:block',
            )}
          >
            /{active.path}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={copied ? 'Copied' : `Copy ${active.path}`}
            onClick={() => void copy()}
            className="ms-auto shrink-0 rounded-none text-fd-muted-foreground hover:text-fd-foreground"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </div>
        <div className="min-w-0 flex-1">
          <DynamicCodeBlock
            lang={active.lang}
            code={active.source}
            codeblock={{
              allowCopy: false,
              className: 'rounded-none border-0',
              viewportProps: { className: 'max-h-[32rem]' },
            }}
          />
        </div>
      </div>
    </div>
  );
};
