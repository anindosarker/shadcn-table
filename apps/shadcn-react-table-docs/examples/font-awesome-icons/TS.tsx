'use client';

import { useMemo } from 'react';
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
  type SRT_Icons,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownWideShort,
  faBars,
  faBarsStaggered,
  faColumns,
  faCompress,
  faEllipsisH,
  faEllipsisVertical,
  faExpand,
  faEyeSlash,
  faFilter,
  faFilterCircleXmark,
  faGripLines,
  faSearch,
  faSearchMinus,
  faSortDown,
  faThumbTack,
} from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

/**
 * These are just some of the icons visible in this table's feature set.
 * If you skip customizing some icons, those particular icons will fallback the the default Material UI icons.
 */
const fontAwesomeIcons: Partial<SRT_Icons> = {
  ArrowDownwardIcon: (props: any) => (
    <FontAwesomeIcon icon={faSortDown} {...props} />
  ),
  ClearAllIcon: () => <FontAwesomeIcon icon={faBarsStaggered} />,
  DensityLargeIcon: () => <FontAwesomeIcon icon={faGripLines} />,
  DensityMediumIcon: () => <FontAwesomeIcon icon={faBars} />,
  DensitySmallIcon: () => <FontAwesomeIcon icon={faBars} />,
  DragHandleIcon: () => <FontAwesomeIcon icon={faGripLines} />,
  FilterListIcon: (props: any) => (
    <FontAwesomeIcon icon={faFilter} {...props} />
  ),
  FilterListOffIcon: () => <FontAwesomeIcon icon={faFilterCircleXmark} />,
  FullscreenExitIcon: () => <FontAwesomeIcon icon={faCompress} />,
  FullscreenIcon: () => <FontAwesomeIcon icon={faExpand} />,
  SearchIcon: (props: any) => <FontAwesomeIcon icon={faSearch} {...props} />,
  SearchOffIcon: () => <FontAwesomeIcon icon={faSearchMinus} />,
  ViewColumnIcon: () => <FontAwesomeIcon icon={faColumns} />,
  MoreVertIcon: () => <FontAwesomeIcon icon={faEllipsisVertical} />,
  MoreHorizIcon: () => <FontAwesomeIcon icon={faEllipsisH} />,
  SortIcon: (props: any) => (
    <FontAwesomeIcon icon={faArrowDownWideShort} {...props} /> //props so that style rotation transforms are applied
  ),
  PushPinIcon: (props: any) => (
    <FontAwesomeIcon icon={faThumbTack} {...props} /> //props so that style rotation transforms are applied
  ),
  VisibilityOffIcon: () => <FontAwesomeIcon icon={faEyeSlash} />,
};

const Example = () => {
  const columns = useMemo(
    //column definitions...
    () =>
      [
        {
          accessorKey: 'firstName',
          header: 'First Name',
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
        },

        {
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'city',
          header: 'City',
        },

        {
          accessorKey: 'state',
          header: 'State',
        },
      ] as SRT_ColumnDef<Person>[],
    [], //end
  );

  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      enableColumnOrdering
      enableColumnPinning
      icons={fontAwesomeIcons}
    />
  );
};

export default Example;
