'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
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
} from 'lucide-react';
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
  /** Raw source, for the copy button. */
  source: string;
  /** The highlighted source, already wrapped in a fumadocs CodeBlock. */
  node: ReactNode;
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

/**
 * Source view of an example: a file tree on the left, a path bar with a copy
 * button and the highlighted code of the active file. A single file shows
 * just the path bar and code. Under 640px the tree gives way to a file menu
 * in the path bar.
 */
export const CodeExplorer = ({ files }: Props) => {
  const [activePath, setActivePath] = useState(files[0]?.path ?? '');
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const treeRef = useRef<HTMLUListElement>(null);
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
      const indent = { paddingInlineStart: `${0.75 + depth * 0.875}rem` };
      if (node.type === 'folder') {
        const open = !collapsed.has(node.path);
        return (
          <li key={node.path}>
            <button
              type="button"
              data-tree-row
              data-folder={node.path}
              aria-expanded={open}
              onClick={() => toggleFolder(node.path)}
              style={indent}
              className="flex h-7 w-full items-center gap-2 pe-3 text-start text-fd-muted-foreground hover:bg-fd-foreground/6 hover:text-fd-foreground focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-dashed focus-visible:outline-(--docs-accent) [&>svg]:size-3.5 [&>svg]:shrink-0"
            >
              {open ? <FolderOpenIcon /> : <FolderIcon />}
              <span className="truncate">{node.name}</span>
            </button>
            {open && (
              <ul className="m-0!">{renderNodes(node.children, depth + 1)}</ul>
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
            onClick={() => setActivePath(node.path)}
            style={indent}
            className={cn(
              'flex h-7 w-full items-center gap-2 pe-3 text-start text-fd-muted-foreground hover:bg-fd-foreground/6 hover:text-fd-foreground focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-dashed focus-visible:outline-(--docs-accent) [&>svg]:size-3.5 [&>svg]:shrink-0',
              current &&
                'bg-fd-foreground/6 font-medium text-(--docs-accent) hover:text-(--docs-accent)',
            )}
          >
            <FileTypeIcon path={node.path} />
            <span className="truncate">{node.name}</span>
          </button>
        </li>
      );
    });

  return (
    <div data-slot="code-explorer" className="flex min-w-0">
      {multi && (
        <nav
          aria-label="Source files"
          className="hidden w-[220px] shrink-0 flex-col [border-inline-end:var(--docs-rule)] sm:flex"
        >
          <div className="flex h-9 shrink-0 items-center px-3 font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-fd-muted-foreground [border-bottom:var(--docs-rule)]">
            Files
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
        </nav>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-9 shrink-0 items-center justify-between gap-2 ps-3 pe-1.5 [border-bottom:var(--docs-rule)]">
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
            className="shrink-0 rounded-none text-fd-muted-foreground hover:text-fd-foreground"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </div>
        <div className="min-w-0 flex-1">{active.node}</div>
      </div>
    </div>
  );
};
