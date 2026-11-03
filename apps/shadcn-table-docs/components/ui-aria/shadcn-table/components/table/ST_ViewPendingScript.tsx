import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-aria/shadcn-table/types';
import {
  escapeForScript,
  getViewSettingsKey,
  type ST_StoredView,
} from '@/components/ui-aria/shadcn-table/shared/utils/viewSettingsStorage.utils';

/** Marks the table root while a stored view waits for hydration. */
export const ST_VIEW_PENDING_ATTR = 'data-st-view-pending';

/**
 * The storage key of the table's view, or `null` when `persistViewSettings`
 * is off: the data column ids in definition order, display columns left out,
 * so turning one on or off keeps the key.
 */
export const getST_ViewSettingsKey = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
): string | null =>
  getViewSettingsKey({
    idInput: table.options.viewSettingsKeyInput,
    leafColumnIds: table
      .getAllLeafColumns()
      .filter((column) => column.columnDef.columnDefType !== 'display')
      .map((column) => column.id),
    persistViewSettings: table.options.persistViewSettings,
  });

/** The view a stock render shows, in the stored form. */
export const getST_DefaultStoredView = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
): ST_StoredView => {
  const {
    columnOrder,
    columnPinning,
    columnVisibility,
    density,
    viewSettings,
  } = table.initialState;
  return {
    columnOrder,
    columnPinning,
    columnVisibility,
    density,
    viewSettings,
  };
};

/**
 * The inline script that marks the table root `data-st-view-pending` and
 * `aria-busy` before first paint when storage holds a view for `storageKey`
 * that differs from the defaults. It runs from the server HTML only: on the
 * client its type is `text/plain`, so a client render never runs it.
 */
export const ST_ViewPendingScript = <TData extends ST_RowData>({
  storageKey,
  table,
}: {
  storageKey: string;
  table: ST_TableInstance<TData>;
}) => {
  const key = escapeForScript(JSON.stringify(storageKey));
  const defaults = escapeForScript(
    JSON.stringify(JSON.stringify(getST_DefaultStoredView(table))),
  );
  const script = `try{var s=window.localStorage.getItem(${key});if(s!==null&&s!==${defaults}){var r=document.currentScript.parentElement;r.setAttribute(${JSON.stringify(ST_VIEW_PENDING_ATTR)},'');r.setAttribute('aria-busy','true')}}catch(e){}`;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      nonce={table.options.nonce}
      suppressHydrationWarning
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
    />
  );
};
