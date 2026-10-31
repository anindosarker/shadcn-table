import {
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from '@tanstack/react-store';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  type InputProps,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import {
  debounce,
  parseFromValuesOrFunc,
} from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_FilterOptionMenu } from '@/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';
import { useST_MenuAnchor } from '@/components/ui/shadcn-table/hooks/useST_MenuAnchor';

export type ST_GlobalFilterTextFieldProps = InputProps;

export const ST_GlobalFilterTextField = <TData extends ST_RowData>({
  ...rest
}: ST_GlobalFilterTextFieldProps) => {
  const table = useSTContext<TData>();
  const {
    options: {
      enableGlobalFilterModes,
      icons: { CloseIcon, SearchIcon },
      localization,
      manualFiltering,
      stSearchTextFieldProps,
    },
    refs: { searchInputRef },
    setGlobalFilter,
    setShowGlobalFilter,
  } = table;
  const globalFilter = useSelector(table.atoms.globalFilter);
  const showGlobalFilter = useSelector(table.atoms.showGlobalFilter);

  const textFieldProps = {
    ...parseFromValuesOrFunc(stSearchTextFieldProps, {
      table,
    }),
    ...rest,
  };

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openerProps, toggle } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl,
  });
  const [searchValue, setSearchValue] = useState(globalFilter ?? '');

  const handleChangeDebounced = useMemo(
    () =>
      debounce(
        (event: ChangeEvent<HTMLInputElement>) => {
          setGlobalFilter(event.target.value ?? undefined);
        },
        manualFiltering ? 500 : 250,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one debounced function per mount; a new one drops the pending call
    [],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    handleChangeDebounced(event);
  };

  const handleGlobalFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    toggle(event.currentTarget);
  };

  const handleClear = () => {
    setSearchValue('');
    setGlobalFilter(undefined);
  };

  // The field focuses its input when it opens and hands focus back to the
  // element that opened it when Escape closes it.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasShownRef = useRef(showGlobalFilter);
  useEffect(() => {
    if (showGlobalFilter && !wasShownRef.current) {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      searchInputRef.current?.focus({ preventScroll: true });
    }
    wasShownRef.current = showGlobalFilter;
  }, [searchInputRef, showGlobalFilter]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    textFieldProps.onKeyDown?.(event);
    if (event.key !== 'Escape' || event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    // Escape clears a value first, then closes the empty field.
    if (searchValue) {
      handleClear();
      return;
    }
    setShowGlobalFilter(false);
    returnFocusRef.current?.focus();
  };

  // An outside change to the global filter resets the search value; the store
  // is not written here.
  const [prevGlobalFilter, setPrevGlobalFilter] = useState(globalFilter);
  if (globalFilter !== prevGlobalFilter) {
    setPrevGlobalFilter(globalFilter);
    setSearchValue(globalFilter ?? '');
  }

  return (
    <Collapsible className="[--st-search-width:14rem]" open={showGlobalFilter}>
      <CollapsibleContent
        className="overflow-hidden w-(--st-search-width) transition-[width,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none data-closed:w-12 data-closed:opacity-0 data-starting-style:w-12 data-starting-style:opacity-0"
        inert={!showGlobalFilter}
        keepMounted
      >
        <InputGroup>
          {enableGlobalFilterModes ? (
            <InputGroupAddon align="inline-start">
              <ST_Tooltip title={localization.changeSearchMode}>
                <InputGroupButton
                  aria-label={localization.changeSearchMode}
                  {...openerProps}
                  onClick={handleGlobalFilterMenuOpen}
                  size="icon-sm"
                  className="size-7"
                >
                  <SearchIcon />
                </InputGroupButton>
              </ST_Tooltip>
            </InputGroupAddon>
          ) : (
            <InputGroupAddon align="inline-start">
              <SearchIcon />
            </InputGroupAddon>
          )}
          <InputGroupInput
            autoComplete="off"
            onChange={handleChange}
            placeholder={localization.search}
            value={searchValue ?? ''}
            {...textFieldProps}
            onKeyDown={handleKeyDown}
            ref={(inputRef) => {
              searchInputRef.current = inputRef;
            }}
          />
          <InputGroupAddon align="inline-end">
            <ST_Tooltip title={localization.clearSearch ?? ''}>
              <span>
                <InputGroupButton
                  aria-label={localization.clearSearch}
                  disabled={!searchValue?.length}
                  onClick={handleClear}
                  size="icon-sm"
                >
                  <CloseIcon />
                </InputGroupButton>
              </span>
            </ST_Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <ST_FilterOptionMenu
          anchorEl={anchorEl}
          onSelect={handleClear}
          setAnchorEl={setAnchorEl}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
