import { createElement } from 'react';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  ArrowDataTransferHorizontalIcon,
  ArrowDown01Icon,
  ArrowDown02Icon,
  ArrowDownDoubleIcon,
  ArrowExpand01Icon,
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
  ArrowRightToLineIcon,
  ArrowShrink01Icon,
  ArrowUp02Icon,
  ArrowUpDownIcon,
  Cancel01Icon,
  CancelCircleIcon,
  Columns3CogIcon,
  Copy01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
  EqualIcon,
  EraserIcon,
  FilterHorizontalIcon,
  FilterIcon,
  FilterRemoveIcon,
  FloppyDiskIcon,
  FrameIcon,
  Layers01Icon,
  Layout2RowIcon,
  LayoutTopIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  ListChevronsDownUpIcon,
  ListIndentDecreaseIcon,
  LockIcon,
  MinusSignIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  PencilEdit01Icon,
  PinIcon,
  PinOffIcon,
  PlusSignIcon,
  RotateLeft01Icon,
  Search01Icon,
  SearchRemoveIcon,
  SlidersHorizontalIcon,
  SortByDown01Icon,
  SquareDashedIcon,
  SquareIcon,
  TextWrapIcon,
  UnfoldMoreIcon,
  ViewOffIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import type {
  ST_IconProps,
  ST_Icons,
} from '@/components/ui-radix/shadcn-table/types';

// Hugeicons ships icons as data: each entry renders one through HugeiconsIcon,
// which takes a numeric stroke width only.
const icon = (data: IconSvgElement) => {
  const Icon = ({ strokeWidth, ...props }: ST_IconProps) =>
    createElement(HugeiconsIcon, {
      icon: data,
      strokeWidth: strokeWidth === undefined ? undefined : Number(strokeWidth),
      ...props,
    });
  return Icon;
};

const EqualVertical = (props: ST_IconProps) =>
  icon(EqualIcon)({
    ...props,
    className: cn('rotate-90', props.className),
  });

const ListIndentDecreaseFlipped = (props: ST_IconProps) =>
  icon(ListIndentDecreaseIcon)({
    ...props,
    className: cn('-scale-x-100', props.className),
  });

export const ST_Default_Icons = {
  AddIcon: icon(PlusSignIcon),
  ArrowDownwardIcon: icon(ArrowDown02Icon),
  ArrowRightIcon: icon(ArrowRight01Icon),
  ArrowUpwardIcon: icon(ArrowUp02Icon),
  CancelIcon: icon(CancelCircleIcon),
  ChevronLeftIcon: icon(ArrowLeft01Icon),
  ChevronRightIcon: icon(ArrowRight01Icon),
  ClearAllIcon: icon(EraserIcon),
  CloseIcon: icon(Cancel01Icon),
  ContentCopy: icon(Copy01Icon),
  DeleteIcon: icon(Delete02Icon),
  DensityLargeIcon: icon(UnfoldMoreIcon),
  DensityMediumIcon: ListIndentDecreaseFlipped,
  DensitySmallIcon: icon(ListChevronsDownUpIcon),
  DragHandleIcon: icon(DragDropVerticalIcon),
  DynamicFeedIcon: icon(Layers01Icon),
  EditIcon: icon(PencilEdit01Icon),
  ExpandMoreIcon: icon(ArrowDown01Icon),
  FilterAltIcon: icon(FilterIcon),
  FilterListIcon: icon(FilterHorizontalIcon),
  FilterListOffIcon: icon(FilterRemoveIcon),
  // Stands in for Lucide ChevronFirst.
  FirstPageIcon: icon(ArrowLeftDoubleIcon),
  FullscreenExitIcon: icon(ArrowShrink01Icon),
  FullscreenIcon: icon(ArrowExpand01Icon),
  GridLinesAllIcon: icon(FrameIcon),
  GridLinesColumnsIcon: EqualVertical,
  GridLinesNoneIcon: icon(SquareIcon),
  GridLinesRowsIcon: icon(EqualIcon),
  IndeterminateIcon: icon(MinusSignIcon),
  KeyboardDoubleArrowDownIcon: icon(ArrowDownDoubleIcon),
  // Stands in for Lucide ChevronLast.
  LastPageIcon: icon(ArrowRightDoubleIcon),
  LockIcon: icon(LockIcon),
  MoreHorizIcon: icon(MoreHorizontalIcon),
  MoreVertIcon: icon(MoreVerticalIcon),
  PushPinIcon: icon(PinIcon),
  PushPinOffIcon: icon(PinOffIcon),
  RestartAltIcon: icon(RotateLeft01Icon),
  RowNumbersOffIcon: icon(LeftToRightListBulletIcon),
  RowNumbersOnIcon: icon(LeftToRightListNumberIcon),
  SaveIcon: icon(FloppyDiskIcon),
  SearchIcon: icon(Search01Icon),
  SearchOffIcon: icon(SearchRemoveIcon),
  // Stands in for Lucide Settings2.
  SettingsIcon: icon(SlidersHorizontalIcon),
  SingleLineIcon: icon(ArrowRightToLineIcon),
  SortIcon: icon(SortByDown01Icon),
  // Stands in for Lucide PanelTopDashed.
  StickyHeaderOffIcon: icon(SquareIcon),
  // Stands in for Lucide PanelTop.
  StickyHeaderOnIcon: icon(LayoutTopIcon),
  // Stands in for Lucide SquareCenterlineDashedVertical.
  StripedOffIcon: icon(SquareDashedIcon),
  // Stands in for Lucide GapVertical.
  StripedOnIcon: icon(Layout2RowIcon),
  SwapVertIcon: icon(ArrowUpDownIcon),
  SyncAltIcon: icon(ArrowDataTransferHorizontalIcon),
  ViewColumnIcon: icon(Columns3CogIcon),
  VisibilityOffIcon: icon(ViewOffIcon),
  WrapTextIcon: icon(TextWrapIcon),
} satisfies ST_Icons;
