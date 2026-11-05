import {
  type ST_DensityState,
  type ST_ViewSettingsState,
} from '@/components/ui/shadcn-table/types';

/** The part of a table's view `persistViewSettings` saves. */
export interface ST_StoredView {
  readonly columnOrder?: readonly string[];
  readonly columnPinning?: {
    end?: readonly string[];
    start?: readonly string[];
  };
  readonly columnVisibility?: Readonly<Record<string, boolean>>;
  readonly density?: ST_DensityState;
  readonly viewSettings?: Partial<ST_ViewSettingsState>;
}

/** djb2 over the text, as a short base-36 string. */
const hashText = (text: string) => {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (Math.imul(hash, 33) + text.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
};

/**
 * The storage key of a table's view, or `null` when the view is not
 * persisted: the option value when it is a string, else
 * `shadcn-table:<id>:view` with the caller's `id`, or a hash of the leaf
 * column ids in definition order when there is none.
 */
export const getViewSettingsKey = ({
  idInput,
  leafColumnIds,
  persistViewSettings,
}: {
  idInput: string | undefined;
  leafColumnIds: readonly string[];
  persistViewSettings: boolean | string | undefined;
}): string | null => {
  if (!persistViewSettings) return null;
  if (typeof persistViewSettings === 'string') return persistViewSettings;
  return `shadcn-table:${idInput ?? hashText(JSON.stringify(leafColumnIds))}:view`;
};

// Bundlers replace `process.env.NODE_ENV`; without one the read throws.
declare const process: { env: { NODE_ENV?: string } };

const isDevelopment = () => {
  try {
    return process.env.NODE_ENV !== 'production';
  } catch {
    return false;
  }
};

const listeners = new Map<string, Set<() => void>>();

const notify = (key: string) => listeners.get(key)?.forEach((cb) => cb());

/** The raw stored text for `key`, or `null` when storage is empty or blocked. */
export const getStoredViewSnapshot = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

/** Server HTML and hydration render the defaults. */
export const getServerSnapshot = (): string | null => null;

/** Calls `cb` when the view under `key` changes, in this tab or another. */
export const subscribeStoredView = (key: string, cb: () => void) => {
  const keyListeners = listeners.get(key) ?? new Set();
  keyListeners.add(cb);
  listeners.set(key, keyListeners);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) cb();
  };
  window.addEventListener('storage', handleStorage);
  return () => {
    keyListeners.delete(cb);
    if (!keyListeners.size) listeners.delete(key);
    window.removeEventListener('storage', handleStorage);
  };
};

export const removeStoredView = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Blocked storage keeps nothing to remove.
  }
  notify(key);
};

export const writeStoredView = (key: string, view: ST_StoredView) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(view));
  } catch {
    // Blocked or full storage: the view lives for this page only.
  }
  notify(key);
};

/**
 * The view stored under `key`, or `null`. With `columnIds`, a view whose
 * column order or visibility names a column the table lacks is dropped as a
 * whole.
 */
export const readStoredView = (
  key: string,
  columnIds?: readonly string[],
): ST_StoredView | null => {
  const text = getStoredViewSnapshot(key);
  if (!text) return null;
  let view: ST_StoredView;
  try {
    view = JSON.parse(text) as ST_StoredView;
  } catch {
    return null;
  }
  if (!view || typeof view !== 'object') return null;
  if (columnIds) {
    const known = new Set(columnIds);
    const names = [
      ...(view.columnOrder ?? []),
      ...Object.keys(view.columnVisibility ?? {}),
    ];
    if (names.some((id) => !known.has(id))) {
      removeStoredView(key);
      if (isDevelopment()) {
        console.info(
          `shadcn-table: the stored view "${key}" names a column this table lacks, so the view was reset.`,
        );
      }
      return null;
    }
  }
  return view;
};

/** Escapes text for a JSON string inside an inline script: every `<` becomes the six characters backslash, u, 0, 0, 3, c. */
export const escapeForScript = (text: string) => text.replace(/</g, '\\u003c');
