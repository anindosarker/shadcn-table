// The Hugeicons icon set: the keys of the Lucide map in icons.ts, drawn with
// @hugeicons/react and @hugeicons/core-free-icons. Where Hugeicons has no
// match, the closest icon stands in and its entry names the Lucide original.
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
  ArrowShrink01Icon,
  Cancel01Icon,
  CancelCircleIcon,
  Copy01Icon,
  DragDropVerticalIcon,
  EraserIcon,
  FilterHorizontalIcon,
  FilterIcon,
  FilterRemoveIcon,
  FloppyDiskIcon,
  Layers01Icon,
  LayoutThreeColumnIcon,
  MinusSignIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  PencilEdit01Icon,
  PinIcon,
  RotateLeft01Icon,
  Rows2Icon,
  Rows3Icon,
  Rows4Icon,
  Search01Icon,
  SearchRemoveIcon,
  SortByDown01Icon,
  ViewOffIcon,
} from '@hugeicons/core-free-icons';
import type {
  ST_IconProps,
  ST_Icons,
} from '@/components/ui/shadcn-table/types';

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

export const ST_Default_Icons = {
  ArrowDownwardIcon: icon(ArrowDown02Icon),
  ArrowRightIcon: icon(ArrowRight01Icon),
  CancelIcon: icon(CancelCircleIcon),
  ChevronLeftIcon: icon(ArrowLeft01Icon),
  ChevronRightIcon: icon(ArrowRight01Icon),
  ClearAllIcon: icon(EraserIcon),
  CloseIcon: icon(Cancel01Icon),
  ContentCopy: icon(Copy01Icon),
  DensityLargeIcon: icon(Rows2Icon),
  DensityMediumIcon: icon(Rows3Icon),
  DensitySmallIcon: icon(Rows4Icon),
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
  IndeterminateIcon: icon(MinusSignIcon),
  KeyboardDoubleArrowDownIcon: icon(ArrowDownDoubleIcon),
  // Stands in for Lucide ChevronLast.
  LastPageIcon: icon(ArrowRightDoubleIcon),
  MoreHorizIcon: icon(MoreHorizontalIcon),
  MoreVertIcon: icon(MoreVerticalIcon),
  PushPinIcon: icon(PinIcon),
  RestartAltIcon: icon(RotateLeft01Icon),
  SaveIcon: icon(FloppyDiskIcon),
  SearchIcon: icon(Search01Icon),
  SearchOffIcon: icon(SearchRemoveIcon),
  SortIcon: icon(SortByDown01Icon),
  SyncAltIcon: icon(ArrowDataTransferHorizontalIcon),
  ViewColumnIcon: icon(LayoutThreeColumnIcon),
  VisibilityOffIcon: icon(ViewOffIcon),
} satisfies ST_Icons;
