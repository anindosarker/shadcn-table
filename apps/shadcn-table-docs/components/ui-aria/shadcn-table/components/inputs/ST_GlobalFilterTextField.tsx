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
import { type FocusableElement } from 'react-aria-components';
import { Collapsible, CollapsibleContent } from '@/components/ui-aria/collapsible';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui-aria/input-group';
import {
  type InputProps,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';
import {
  debounce,
  parseFromValuesOrFunc,
} from '@/components/ui-aria/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-aria/shadcn-table/components/buttons/ST_Tooltip';
import { ST_FilterOptionMenu } from '@/components/ui-aria/shadcn-table/components/menus/ST_FilterOptionMenu';
import { useSTContext } from '@/components/ui-aria/shadcn-table/hooks/stTableHook';
import { useST_MenuAnchor } from '@/components/ui-aria/shadcn-table/hooks/useST_MenuAnchor';

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

  const handleGlobalFilterMenuOpen = (event: MouseEvent<FocusableElement>) => {
    if (event.currentTarget instanceof HTMLElement) {
      toggle(event.currentTarget);
    }
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
    if (event.key !== 'Escape' || event.defaultPrevented || searchValue) {
      return;
    }
    event.preventDefault();
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
    <Collapsible
      className="[--st-search-width:14rem]"
      isExpanded={showGlobalFilter}
    >
      {/* No trigger renders inside the Collapsible, so the panel group names
          itself; React Aria allows only the group and region roles here. */}
      <CollapsibleContent
        aria-label={localization.search}
        className="overflow-hidden w-(--st-search-width) transition-[width,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none aria-hidden:w-12 aria-hidden:opacity-0"
        inert={!showGlobalFilter}
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
                  isDisabled={!searchValue?.length}
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
