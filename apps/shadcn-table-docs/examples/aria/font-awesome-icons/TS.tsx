'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  type ST_ColumnDef,
  type ST_IconProps,
  type ST_Icons,
} from '@/components/ui/shadcn-table';
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
import { Building2Icon, MapIcon, MapPinIcon, UserIcon } from 'lucide-react';
config.autoAddCss = false;

/**
 * These are just some of the icons visible in this table's feature set.
 * If you skip customizing some icons, those particular icons will fallback the the default Material UI icons.
 */
const fontAwesomeIcons: Partial<ST_Icons> = {
  ArrowDownwardIcon: ({ className, style }: ST_IconProps) => (
    <FontAwesomeIcon
      icon={faSortDown}
      className={className}
      style={{ ...style }}
    />
  ),
  ClearAllIcon: () => <FontAwesomeIcon icon={faBarsStaggered} />,
  DensityLargeIcon: () => <FontAwesomeIcon icon={faGripLines} />,
  DensityMediumIcon: () => <FontAwesomeIcon icon={faBars} />,
  DensitySmallIcon: () => <FontAwesomeIcon icon={faBars} />,
  DragHandleIcon: () => <FontAwesomeIcon icon={faGripLines} />,
  FilterListIcon: ({ className, style }: ST_IconProps) => (
    <FontAwesomeIcon
      icon={faFilter}
      className={className}
      style={{ ...style }}
    />
  ),
  FilterListOffIcon: () => <FontAwesomeIcon icon={faFilterCircleXmark} />,
  FullscreenExitIcon: () => <FontAwesomeIcon icon={faCompress} />,
  FullscreenIcon: () => <FontAwesomeIcon icon={faExpand} />,
  SearchIcon: ({ className, style }: ST_IconProps) => (
    <FontAwesomeIcon
      icon={faSearch}
      className={className}
      style={{ ...style }}
    />
  ),
  SearchOffIcon: () => <FontAwesomeIcon icon={faSearchMinus} />,
  ViewColumnIcon: () => <FontAwesomeIcon icon={faColumns} />,
  MoreVertIcon: () => <FontAwesomeIcon icon={faEllipsisVertical} />,
  MoreHorizIcon: () => <FontAwesomeIcon icon={faEllipsisH} />,
  SortIcon: ({ className, style }: ST_IconProps) => (
    <FontAwesomeIcon
      icon={faArrowDownWideShort}
      className={className}
      style={{ ...style }}
    /> // className and style carry the rotation
  ),
  PushPinIcon: ({ className, style }: ST_IconProps) => (
    <FontAwesomeIcon
      icon={faThumbTack}
      className={className}
      style={{ ...style }}
    /> // className and style carry the rotation
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
          icon: UserIcon,
          header: 'First Name',
        },
        {
          accessorKey: 'lastName',
          icon: UserIcon,
          header: 'Last Name',
        },

        {
          accessorKey: 'address',
          icon: MapPinIcon,
          header: 'Address',
        },
        {
          accessorKey: 'city',
          icon: Building2Icon,
          header: 'City',
        },

        {
          accessorKey: 'state',
          icon: MapIcon,
          header: 'State',
        },
      ] as ST_ColumnDef<Person>[],
    [], //end
  );

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnOrdering
      enableColumnPinning
      icons={fontAwesomeIcons}
    />
  );
};

export default Example;
