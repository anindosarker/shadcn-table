import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Subscribe } from '@tanstack/react-table';
import { useSelector } from '@tanstack/react-store';
import { Collapsible, CollapsibleContent } from '@/components/ui-radix/collapsible';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui-radix/input-group';
import {
  type InputProps,
  type ST_RowData,
} from '@/components/ui-radix/shadcn-table/types';
import {
  debounce,
  parseFromValuesOrFunc,
} from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-radix/shadcn-table/components/buttons/ST_Tooltip';
import { ST_FilterOptionMenu } from '@/components/ui-radix/shadcn-table/components/menus/ST_FilterOptionMenu';
import { useSTContext } from '@/components/ui-radix/shadcn-table/hooks/stTableHook';
import { stCollapsibleKeyframes } from '@/components/ui-radix/shadcn-table/shared/utils/style.utils';

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
  } = table;
  // Feeds the search value state and its sync effect, so it is a hook
  // subscription.
  const globalFilter = useSelector(table.atoms.globalFilter);

  const textFieldProps = {
    ...parseFromValuesOrFunc(stSearchTextFieldProps, {
      table,
    }),
    ...rest,
  };

  const isMounted = useRef(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchValue, setSearchValue] = useState(globalFilter ?? '');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeDebounced = useCallback(
    debounce(
      (event: ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(event.target.value ?? undefined);
      },
      manualFiltering ? 500 : 250,
    ),
    [],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    handleChangeDebounced(event);
  };

  const handleGlobalFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClear = () => {
    setSearchValue('');
    setGlobalFilter(undefined);
  };

  useEffect(() => {
    if (isMounted.current) {
      if (globalFilter === undefined) {
        handleClear();
      } else {
        setSearchValue(globalFilter);
      }
    }
    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter]);

  return (
    <Subscribe source={table.atoms.showGlobalFilter}>
      {(showGlobalFilter) => (
        // The st-collapsible-* keyframes ship in the hoisted style below.
        <Collapsible open={showGlobalFilter}>
          <style href="st-collapsible" precedence="low">
            {stCollapsibleKeyframes}
          </style>
          <CollapsibleContent className="data-[state=closed]:animate-[st-collapsible-left_300ms_var(--ease-in-out)] data-[state=open]:animate-[st-collapsible-right_300ms_var(--ease-in-out)]">
            <InputGroup>
              {enableGlobalFilterModes ? (
                <InputGroupAddon align="inline-start">
                  <ST_Tooltip title={localization.changeSearchMode}>
                    <InputGroupButton
                      aria-label={localization.changeSearchMode}
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
      )}
    </Subscribe>
  );
};
