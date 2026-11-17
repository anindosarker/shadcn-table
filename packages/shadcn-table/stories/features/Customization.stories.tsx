import { type ComponentType, type ReactNode, useMemo, useState } from 'react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import {
  type ST_ColumnDef,
  type ST_RowSelectionState,
  ShadcnTable,
  ST_FilterChips,
  ST_GlobalFilterTextField,
  ST_SortPopover,
  ST_Table,
  ST_TableBodyCellValue,
  ST_TablePagination,
  ST_TableProvider,
  ST_ToggleFullScreenButton,
  ST_ToolbarAlertBanner,
  ST_ViewSettingsButton,
  flexRender,
  useShadcnTable,
  useST_FullScreenContainer,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
// A namespace import: the React Aria dialog has no DialogContent, and a named
// import of it would fail to load on that base.
import * as DialogParts from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  CircleUserIcon,
  DollarSignIcon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  SendIcon,
  UserIcon,
} from 'lucide-react';
import { ST_BASE } from '../../.storybook/themes';

const meta: Meta = {
  title: 'Features/Customization',
};

export default meta;

/**
 * A component whose props differ on the React Aria base, typed loosely: the
 * stories type-check against the Radix copy.
 */
type AriaComponent = ComponentType<
  Record<string, unknown> & { children?: ReactNode }
>;
const aria = (component: unknown) => component as AriaComponent;
const AriaTable = aria(Table);
const AriaTableHead = aria(TableHead);
const AriaTableRow = aria(TableRow);
const AriaDialog = aria(DialogParts.Dialog);

// The docs examples "Minimal", "Custom Headless" and "Advanced"
// (examples/base/minimal, custom-headless, advanced): their columns, options
// and rows.

interface MinimalPerson {
  address: string;
  city: string;
  firstName: string;
  lastName: string;
  state: string;
}

const minimalData: MinimalPerson[] = [
  {
    firstName: 'Dylan',
    lastName: 'Murray',
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    firstName: 'Raquel',
    lastName: 'Kohler',
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    firstName: 'Ervin',
    lastName: 'Reinger',
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    firstName: 'Brittany',
    lastName: 'McCullough',
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    firstName: 'Branson',
    lastName: 'Frami',
    address: '32188 Larkin Turnpike',
    city: 'Charleston',
    state: 'South Carolina',
  },
];

const minimalColumns: ST_ColumnDef<MinimalPerson>[] = [
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
];

const MinimalTable = () => {
  const table = useShadcnTable({
    columns: minimalColumns,
    data: minimalData,
    enableKeyboardShortcuts: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    stTableBodyRowProps: { hover: false },
    stTableProps: {
      className:
        'bg-background border border-[rgba(81,81,81,.5)] [&_caption]:caption-top',
    },
    stTableHeadCellProps: {
      className: 'border border-[rgba(81,81,81,.5)] font-normal italic',
    },
    stTableBodyCellProps: {
      className: 'border border-[rgba(81,81,81,.5)]',
    },
    renderCaption: ({ table }) =>
      `Here is a table rendered with the lighter weight ST_Table sub-component, rendering ${table.getRowModel().rows.length} rows.`,
  });
  return (
    <ST_TableProvider table={table}>
      <ST_Table />
    </ST_TableProvider>
  );
};

/** ST_Table alone: no toolbars, the caption counts the 5 rows. */
export const Minimal = {
  render: () => <MinimalTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText(/rendering 5 rows\.$/);
    expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(5);
    expect(
      canvas.queryByRole('button', { name: 'Show/Hide columns' }),
    ).toBeNull();
    expect(canvas.queryByRole('button', { name: 'Column Actions' })).toBeNull();
  },
};

interface HeadlessPerson {
  address: string;
  city: string;
  name: {
    firstName: string;
    lastName: string;
  };
  state: string;
}

const headlessData: HeadlessPerson[] = [
  {
    name: {
      firstName: 'Christopher',
      lastName: 'Lee',
    },
    address: '555 Cedar Street',
    city: 'Seattle',
    state: 'Washington',
  },
  {
    name: {
      firstName: 'Rachel',
      lastName: 'Anderson',
    },
    address: '987 Walnut Court',
    city: 'New York',
    state: 'New York',
  },
  {
    name: {
      firstName: 'David',
      lastName: 'Garcia',
    },
    address: '654 Maple Avenue',
    city: 'Los Angeles',
    state: 'California',
  },
  {
    name: {
      firstName: 'Zachary',
      lastName: 'Davis',
    },
    address: '261 Battle Ford',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Robert',
      lastName: 'Smith',
    },
    address: '566 Brakus Inlet',
    city: 'Westerville',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Yan',
    },
    address: '7777 Kuhic Knoll',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'John',
      lastName: 'Upton',
    },
    address: '722 Emie Stream',
    city: 'Huntington',
    state: 'Washington',
  },
  {
    name: {
      firstName: 'Nathan',
      lastName: 'Harris',
    },
    address: '1 Kuhic Knoll',
    city: 'Ohiowa',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Emily',
      lastName: 'Smith',
    },
    address: '123 Main Street',
    city: 'Springfield',
    state: 'Illinois',
  },
  {
    name: {
      firstName: 'Jessica',
      lastName: 'Johnson',
    },
    address: '456 Elm Avenue',
    city: 'Portland',
    state: 'Oregon',
  },
  {
    name: {
      firstName: 'Michael',
      lastName: 'Davis',
    },
    address: '789 Oak Lane',
    city: 'Austin',
    state: 'Texas',
  },
  {
    name: {
      firstName: 'Sarah',
      lastName: 'Wilson',
    },
    address: '321 Pine Road',
    city: 'Denver',
    state: 'Colorado',
  },
];

const headlessColumns: ST_ColumnDef<HeadlessPerson>[] = [
  {
    accessorKey: 'name.firstName',
    icon: UserIcon,
    header: 'First Name',
  },
  {
    accessorKey: 'name.lastName',
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
];

const CustomHeadlessTable = () => {
  // On React Aria the Table drives the selection, as in the example's aria
  // copy; the ST table reads it as its row selection state.
  const [rowSelection, setRowSelection] = useState<ST_RowSelectionState>({});
  const table = useShadcnTable({
    columns: headlessColumns,
    data: headlessData,
    enableRowSelection: true,
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      showGlobalFilter: true,
    },
    stPaginationProps: {
      rowsPerPageOptions: [5, 10, 15],
    },
    paginationDisplayMode: 'pages',
    ...(ST_BASE === 'aria'
      ? {
          onRowSelectionChange: setRowSelection,
          state: { rowSelection },
          displayColumnDefOptions: {
            'st-row-select': {
              Cell: () => <Checkbox slot="selection" />,
              Header: () => <Checkbox slot="selection" />,
            },
          },
        }
      : {}),
  });

  const { containerProps, isFullScreen } = useST_FullScreenContainer(table);

  const ariaTable = () => {
    const rowHeaderId = table
      .getVisibleLeafColumns()
      .find((column) => column.columnDef.columnDefType === 'data')?.id;
    const selectedKeys = new Set(
      Object.keys(rowSelection).filter((id) => rowSelection[id]),
    );
    return (
      <AriaTable
        aria-label="My Custom Headless Table"
        onSelectionChange={(keys: 'all' | Set<string | number>) => {
          const next = { ...rowSelection };
          for (const row of table.getRowModel().rows) {
            if (keys === 'all' || keys.has(row.id)) next[row.id] = true;
            else delete next[row.id];
          }
          setRowSelection(next);
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
      >
        <TableHeader>
          {table.getFlatHeaders().map((header) => (
            <AriaTableHead
              className="text-center"
              id={header.id}
              isRowHeader={header.column.id === rowHeaderId}
              key={header.id}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.Header ??
                      header.column.columnDef.header,
                    { ...header.getContext(), table },
                  )}
            </AriaTableHead>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, rowIndex) => (
            <AriaTableRow id={row.id} key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell className="text-center" key={cell.id}>
                  <ST_TableBodyCellValue
                    cell={cell}
                    staticRowIndex={rowIndex}
                  />
                </TableCell>
              ))}
            </AriaTableRow>
          ))}
        </TableBody>
      </AriaTable>
    );
  };

  return (
    <ST_TableProvider table={table}>
      <div
        {...containerProps}
        className={[
          'flex flex-col bg-background',
          isFullScreen ? 'overflow-auto' : 'my-8',
          containerProps.className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <h4>My Custom Headless Table</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ST_GlobalFilterTextField />
            <ST_ToggleFullScreenButton />
            <ST_ViewSettingsButton table={table} />
          </div>
          <ST_TablePagination />
        </div>
        {ST_BASE === 'aria' ? (
          ariaTable()
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead className="text-center" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.Header ??
                              header.column.columnDef.header,
                            { ...header.getContext(), table },
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-center" key={cell.id}>
                      <ST_TableBodyCellValue
                        cell={cell}
                        staticRowIndex={rowIndex}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <ST_ToolbarAlertBanner stackAlertBanner />
      </div>
    </ST_TableProvider>
  );
};

/**
 * Your own table markup around ST parts: the search field, the pagination
 * and the first page of 5 rows.
 */
export const CustomHeadless = {
  render: () => <CustomHeadlessTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('My Custom Headless Table');
    await canvas.findAllByText('Christopher');
    expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(5);
    expect(
      canvas.getAllByRole('columnheader').map((th) => th.textContent?.trim()),
    ).toEqual(
      expect.arrayContaining([
        'First Name',
        'Last Name',
        'Address',
        'City',
        'State',
      ]),
    );
  },
};

interface Employee {
  avatar: string;
  email: string;
  firstName: string;
  jobTitle: string;
  lastName: string;
  salary: number;
  signatureCatchPhrase: string;
  startDate: string;
}

// One employee per line: first name, last name, email, job title, salary,
// start date, catch phrase. The avatar URL is built from the name.
const employeeRows = `
Dusty|Kuvalis|Randy63@yahoo.com|Chief Creative Technician|52729|3/20/2014|Cross-platform disintermediate workforce
D'angelo|Moen|Andrew88@hotmail.com|Forward Response Engineer|71964|3/9/2018|Virtual local support
Devan|Reinger|Melissa_Lockman@hotmail.com|Customer Intranet Consultant|72551|8/12/2020|Pre-emptive composite hierarchy
Leonardo|Langworth|Chadrick.Goldner87@gmail.com|Senior Security Manager|57801|7/25/2017|Progressive real-time core
Douglas|Denesik|Dante.Deckow@hotmail.com|Legacy Security Assistant|23792|4/12/2020|Operative well-modulated info-mediaries
Jameson|Mayer|Rosamond_Schuster@yahoo.com|Regional Division Planner|80916|10/30/2017|Front-line intermediate firmware
Madaline|Quitzon|Alex_Grimes82@hotmail.com|Corporate Paradigm Strategist|68052|1/17/2018|Right-sized high-level algorithm
Wilfrid|Vandervort|Buddy.Torphy@gmail.com|Legacy Functionality Specialist|85573|8/4/2014|Focused interactive secured line
Chelsie|Mraz|Ladarius_Thiel70@yahoo.com|Forward Infrastructure Representative|51062|1/6/2021|Diverse attitude-oriented migration
Hassie|Bruen|Clair76@gmail.com|Human Paradigm Designer|61196|4/28/2016|Upgradable composite methodology
Daisy|Hane|Alverta7@hotmail.com|National Configuration Manager|25394|3/2/2020|Exclusive next generation initiative
Wilbert|Monahan|Cydney.Jakubowski9@yahoo.com|Internal Interactions Associate|79355|4/5/2017|Total asynchronous strategy
Heloise|Purdy|Celestino.Kassulke@yahoo.com|Global Identity Architect|109257|12/18/2020|User-friendly tertiary service-desk
Moises|McClure|Arturo29@yahoo.com|Internal Marketing Orchestrator|155037|9/23/2014|Public-key exuding complexity
Rahsaan|Bauch|Angelita39@yahoo.com|Dynamic Data Planner|158595|3/31/2015|Decentralized 6th generation archive
Lorenzo|Moore|Emma_Becker33@yahoo.com|Customer Division Representative|73983|8/22/2020|Reactive fresh-thinking local area network
Richard|Bartoletti|Hayden84@gmail.com|Future Communications Technician|169001|10/13/2018|Streamlined logistical access
Ulises|Beatty|Jessie_Kirlin39@yahoo.com|Future Markets Associate|92008|10/17/2017|Monitored object-oriented interface
Hattie|Stehr|Betty78@hotmail.com|Internal Directives Orchestrator|120554|12/17/2014|Organic bi-directional groupware
Kane|Marquardt|Myron.Schaefer45@yahoo.com|Product Research Orchestrator|95231|2/28/2020|Stand-alone holistic strategy
Brittany|Legros|Rachelle44@yahoo.com|Chief Web Specialist|40908|7/27/2016|Reactive multi-tasking internet solution
Joana|Witting|Elyssa.Wiegand@hotmail.com|Legacy Quality Strategist|136966|8/22/2017|Extended asynchronous moderator
Marshall|Gottlieb|Myron53@gmail.com|Internal Web Designer|155176|12/25/2020|Business-focused bifurcated access
Nolan|Abbott|Sigurd.Murazik17@yahoo.com|Principal Operations Strategist|161534|8/3/2021|Robust bifurcated initiative
Guadalupe|Goyette|Derek.Senger15@yahoo.com|Internal Accountability Executive|20297|6/17/2020|Networked tangible definition
Frankie|Balistreri|Gladyce85@gmail.com|District Integration Facilitator|57549|3/16/2021|Diverse 24/7 open system
Jimmie|Altenwerth|Kaya37@hotmail.com|International Brand Architect|90316|9/1/2019|Decentralized 5th generation functionalities
Ryder|O'Hara|Korey_Mueller@gmail.com|Product Intranet Developer|111388|5/8/2021|Multi-layered didactic firmware
Nolan|Mayer|Remington.DAmore63@hotmail.com|Internal Research Orchestrator|46528|2/21/2017|Open-source stable encoding
Ashley|Wolf|Polly_Parker@gmail.com|National Infrastructure Specialist|132645|9/25/2019|Open-architected well-modulated data-warehouse
Florida|Kiehn|Wilhelm_Deckow93@hotmail.com|International Applications Technician|65835|8/9/2015|Ameliorated upward-trending benchmark
Monica|Crooks|Sabina_Kerluke36@hotmail.com|Dynamic Infrastructure Representative|70473|3/27/2015|Monitored context-sensitive frame
Callie|Kub|Theo.Jakubowski57@hotmail.com|Legacy Operations Supervisor|50844|8/19/2019|Stand-alone stable moderator
Wellington|Treutel|Gail54@yahoo.com|Central Response Technician|37148|3/22/2017|Innovative background capability
Ethyl|Rempel|Joseph_Schoen96@yahoo.com|Corporate Configuration Director|139956|8/17/2016|Function-based analyzing hardware
Lora|Harvey|Jeanne25@yahoo.com|Senior Configuration Coordinator|49911|10/7/2021|Reactive 24/7 monitoring
Dock|Rolfson|Toney.Jenkins@hotmail.com|Central Data Coordinator|161196|11/8/2014|Cross-group reciprocal knowledge base
Loma|Dach|Margarette_Schumm39@hotmail.com|International Response Assistant|165993|3/8/2014|Robust 3rd generation capacity
Anibal|Ruecker|Florencio.Kunze43@hotmail.com|Principal Program Analyst|112371|5/26/2016|Sharable 24 hour info-mediaries
Javon|Kling|Tyrese28@yahoo.com|Senior Solutions Director|153271|3/2/2014|Total incremental throughput
Cassidy|Schiller|Filomena_Waters@hotmail.com|Principal Interactions Associate|144280|10/28/2020|Front-line object-oriented matrices
Laila|Olson|Marc78@yahoo.com|Lead Paradigm Planner|71824|6/16/2021|Public-key 24 hour extranet
Merle|Schultz|Calista.Leuschke56@yahoo.com|Dynamic Program Officer|63090|7/19/2019|Right-sized bi-directional utilisation
Brennan|Roberts|Anna.Schmitt@gmail.com|Internal Optimization Administrator|148660|4/2/2017|Enterprise-wide mission-critical algorithm
Derick|Lebsack|Kristin_Fisher67@gmail.com|Customer Marketing Associate|162803|2/17/2018|Visionary tertiary encoding
Brown|Deckow|Alvis78@hotmail.com|Investor Infrastructure Specialist|82617|10/27/2019|Multi-channelled high-level core
Leo|Schmidt|Lucinda.Schmitt@gmail.com|Internal Directives Facilitator|107179|7/7/2018|Assimilated 4th generation complexity
Desiree|Braun|Francis23@yahoo.com|Lead Research Orchestrator|144783|11/14/2017|Fully-configurable demand-driven hub
Grant|Sporer|Maximus.Schuppe84@gmail.com|Future Optimization Orchestrator|43339|8/13/2019|Cross-platform content-based complexity
Bertha|Watsica|Emmett.Monahan30@yahoo.com|Principal Metrics Analyst|45793|4/10/2017|Down-sized empowering infrastructure
Ashleigh|Kessler|Zoe95@gmail.com|Product Solutions Agent|94366|4/4/2018|Multi-tiered upward-trending attitude
Napoleon|Dickens|Joey_MacGyver66@gmail.com|Human Communications Developer|123117|3/20/2015|Decentralized clear-thinking budgetary management
Colin|Block|Alia97@hotmail.com|Central Mobility Associate|152432|8/28/2020|Future-proofed context-sensitive function
Dallas|Stark|Jaeden_Cole@yahoo.com|Lead Interactions Facilitator|97413|7/21/2021|Cross-group content-based budgetary management
Kirsten|Reichel|Gertrude17@yahoo.com|Future Paradigm Facilitator|135336|3/10/2015|Team-oriented heuristic neural-net
Petra|Lakin|Jimmie32@yahoo.com|Direct Paradigm Consultant|35672|6/27/2020|Business-focused attitude-oriented support
Clifton|Erdman|Mitchel_Mohr32@hotmail.com|Human Configuration Technician|138721|2/26/2016|Integrated coherent structure
Meagan|Zemlak|Alfonzo56@hotmail.com|Corporate Assurance Administrator|69790|9/12/2020|User-friendly holistic portal
Mortimer|Thompson|Josie.Marks@hotmail.com|Internal Response Developer|32300|4/10/2021|Cloned bandwidth-monitored ability
Ima|Nader|Heaven97@hotmail.com|Lead Implementation Associate|113894|1/19/2016|Multi-lateral secondary analyzer
Amani|Mills|Roel98@yahoo.com|Forward Applications Agent|43182|7/3/2020|Synchronised 3rd generation neural-net
Della|Reilly|Clay_Thompson@hotmail.com|Legacy Identity Architect|75492|9/24/2014|Optional radical migration
Erika|Hamill|Americo.Lakin91@yahoo.com|Regional Marketing Strategist|141949|4/22/2014|Monitored multi-state software
Hannah|Rutherford|Jayde.Gaylord@yahoo.com|Global Applications Coordinator|32414|1/18/2021|Expanded next generation Graphical User Interface
Bernice|Grimes|Johnson_Kris86@gmail.com|Customer Assurance Officer|131333|4/29/2018|Multi-tiered upward-trending pricing structure
Cayla|Glover|Chanel81@yahoo.com|Customer Usability Consultant|36880|11/4/2016|Phased foreground service-desk
Gerard|Dibbert|Tierra_King@gmail.com|National Research Liaison|124275|4/15/2019|Organic grid-enabled initiative
Crystel|Gutmann|Haleigh.Jenkins@gmail.com|Regional Tactics Facilitator|74744|9/11/2021|Seamless attitude-oriented pricing structure
Esther|Schamberger|Gene_Schumm7@yahoo.com|Senior Usability Coordinator|165191|11/12/2018|Multi-lateral explicit policy
Shane|Fadel|Brannon_Goyette@yahoo.com|Legacy Accounts Executive|126982|1/26/2015|Integrated fault-tolerant internet solution
Travis|Orn|Margaretta3@gmail.com|Future Intranet Consultant|117563|6/4/2019|Organic dedicated synergy
Ephraim|Jerde|Lela_Abbott@gmail.com|Global Operations Manager|64658|2/5/2018|Business-focused value-added product
Jessy|Huel|Daniella20@gmail.com|Internal Web Developer|107263|5/8/2018|Distributed impactful moratorium
Coty|Fadel|Garth20@yahoo.com|Dynamic Accountability Representative|22128|8/23/2018|De-engineered zero administration utilisation
Davin|Kreiger|Myles_Brekke83@hotmail.com|Principal Factors Analyst|54712|8/9/2021|Customer-focused mobile local area network
Ashly|Gerlach|Omari_Swaniawski@hotmail.com|Internal Response Producer|98757|3/20/2020|Multi-layered 5th generation contingency
Cristina|Hessel|Jessica_Stanton@hotmail.com|Corporate Solutions Engineer|86074|9/11/2014|Team-oriented demand-driven flexibility
Antoinette|Torp|Yesenia_Tremblay@hotmail.com|Forward Quality Orchestrator|134875|11/12/2021|Future-proofed leading edge knowledge user
Gunner|Daugherty|Alexandro7@yahoo.com|National Identity Coordinator|57932|3/27/2020|Robust hybrid approach
Lura|Stanton|Jeremie52@hotmail.com|Senior Directives Specialist|101724|11/29/2014|Assimilated clear-thinking secured line
Percy|Lebsack|Shaniya_Kozey@yahoo.com|International Creative Director|140411|10/7/2019|Future-proofed even-keeled Graphical User Interface
Reynold|Daniel|Kay_Dicki26@hotmail.com|Human Tactics Orchestrator|75114|9/5/2016|Front-line fault-tolerant contingency
Selena|Hermiston|Abe90@yahoo.com|Chief Operations Representative|85694|8/12/2018|Operative multi-tasking standardization
Waldo|Beahan|Dusty8@hotmail.com|Central Web Supervisor|106969|3/15/2018|Fundamental grid-enabled database
Delmer|Stroman|Marjory.Baumbach@hotmail.com|International Assurance Director|107387|1/10/2020|Cloned needs-based moderator
Mack|Morissette|Zachery.Cormier@gmail.com|Direct Configuration Consultant|59084|6/7/2015|Assimilated systematic parallelism
Precious|Murazik|Hillard.McKenzie66@gmail.com|Global Creative Associate|53331|8/18/2018|Managed asymmetric hierarchy
Lacy|Daugherty|Garrick.Berge@hotmail.com|Product Security Architect|158553|9/23/2019|Compatible motivating matrices
Deshawn|Abernathy|Stanton57@hotmail.com|Global Tactics Agent|84738|1/3/2021|Function-based executive conglomeration
Gregoria|Wiza|Madge.Wuckert97@hotmail.com|Global Metrics Executive|46516|9/25/2020|Automated asynchronous success
Rudy|Wisoky|Haleigh.Reichel74@hotmail.com|Central Operations Agent|23440|3/18/2014|Stand-alone systematic implementation
Otho|Leannon|Malika41@yahoo.com|Principal Accounts Coordinator|116848|6/28/2021|Stand-alone background installation
Estrella|Keeling|Meta_Ortiz78@gmail.com|Forward Applications Supervisor|90509|10/16/2015|Adaptive zero administration portal
Lori|Romaguera|Adam_White@gmail.com|Global Brand Producer|94791|11/26/2018|Networked human-resource artificial intelligence
Zack|Sipes|Kendall_Kuhlman@yahoo.com|Forward Implementation Specialist|136016|3/23/2020|Streamlined grid-enabled support
Colleen|Cassin|Brad_Wunsch@yahoo.com|Corporate Applications Administrator|72690|12/17/2015|Profound local challenge
Rosendo|Legros|Scarlett3@yahoo.com|Corporate Applications Executive|73870|11/27/2015|Diverse exuding paradigm
Bernhard|O'Conner|Kristopher52@hotmail.com|Central Metrics Designer|26864|12/12/2015|Compatible composite product
Hulda|Lakin|Tia.Tremblay43@gmail.com|Global Implementation Administrator|20393|8/19/2020|Open-architected coherent support
Pauline|Schmeler|Monroe_Murphy31@gmail.com|International Infrastructure Administrator|151997|6/30/2018|De-engineered executive migration
Jordyn|Effertz|Bria_Cruickshank26@hotmail.com|Global Brand Producer|64894|8/25/2014|Cross-group radical solution
Natalia|Flatley|Noah_Bartell@hotmail.com|Central Integration Facilitator|46753|2/23/2022|Quality-focused client-driven help-desk
Tremaine|Miller|Harvey14@gmail.com|Future Tactics Architect|41043|3/8/2021|Configurable hybrid standardization
Elroy|Stark|Adam.Schowalter2@yahoo.com|International Intranet Facilitator|139167|8/9/2015|Cross-group local projection
Betsy|Schimmel|Charity.Huel22@gmail.com|National Marketing Manager|100912|8/26/2016|Streamlined uniform toolset
Tommie|Blanda|Adella11@gmail.com|Internal Factors Developer|33687|6/19/2018|Focused didactic encryption
Savannah|Witting|Jeremie13@yahoo.com|Senior Usability Producer|32533|2/24/2018|Optional 3rd generation moderator
Caesar|Botsford|Torey.Reichert18@hotmail.com|Regional Factors Developer|70379|9/7/2020|Polarised 4th generation circuit
Thea|Schamberger|Estell_Blick6@yahoo.com|Global Accountability Director|103625|7/6/2018|Team-oriented coherent benchmark
Michele|Hermiston|Levi.Davis@gmail.com|Principal Functionality Developer|110009|3/19/2020|Public-key demand-driven budgetary management
Johanna|Johnston|Berneice97@yahoo.com|Dynamic Response Agent|45886|9/25/2017|Synergized analyzing support
Jarret|Rau|Hermann_Graham83@gmail.com|Forward Optimization Planner|87408|6/1/2021|Advanced scalable info-mediaries
Kylee|Cummings|Caroline51@gmail.com|Corporate Tactics Planner|141978|4/13/2015|Innovative 24/7 interface
Rylan|Frami|Rosalee_Bergstrom51@hotmail.com|Legacy Markets Producer|77110|4/9/2020|Ergonomic incremental attitude
Ezekiel|Russel|Johanna.Fahey24@gmail.com|Regional Accountability Consultant|108973|1/4/2022|Devolved homogeneous migration
Barney|Jast|Dameon79@yahoo.com|Investor Creative Assistant|55270|3/3/2017|Business-focused bandwidth-monitored ability
Moriah|Smitham|Albin_Parker@gmail.com|International Program Developer|98799|9/25/2019|Digitized impactful migration
Korey|Feeney|Lennie66@hotmail.com|Central Paradigm Specialist|52735|2/22/2017|Distributed system-worthy frame
Laurie|Torp|Daisha98@hotmail.com|District Research Planner|27126|6/13/2016|Reactive bi-directional paradigm
Oscar|Swaniawski|Eli64@yahoo.com|Human Implementation Manager|95518|4/5/2014|Versatile neutral leverage
Paul|O'Keefe|Dell20@hotmail.com|International Security Manager|100812|2/20/2019|Future-proofed multi-tasking secured line
Jerod|Deckow|Guy51@hotmail.com|Direct Solutions Engineer|102099|7/26/2021|Phased 3rd generation functionalities
Deion|Medhurst|Juwan0@gmail.com|District Tactics Consultant|22577|9/20/2020|Synchronised executive solution
Vida|Considine|Pearline_Legros@yahoo.com|District Markets Manager|108348|3/3/2020|Optional optimizing matrix
Rosina|Kshlerin|Aryanna85@gmail.com|Principal Response Technician|117529|7/20/2016|Profound static project
Troy|Prohaska|Tania_McLaughlin70@hotmail.com|Principal Directives Analyst|95202|7/25/2014|Virtual zero tolerance moratorium
Jadyn|Tromp|Margarette.Abshire24@yahoo.com|Product Assurance Manager|21766|7/1/2019|Re-contextualized mission-critical challenge
Jerald|Heller|Maximo28@yahoo.com|Regional Identity Orchestrator|116164|7/10/2017|Customizable even-keeled time-frame
`;

const employees: Employee[] = employeeRows
  .trim()
  .split('\n')
  .map((line) => {
    const [
      firstName,
      lastName,
      email,
      jobTitle,
      salary,
      startDate,
      signatureCatchPhrase,
    ] = line.split('|') as [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ];
    return {
      avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${`${firstName}${lastName}`.replace(/[^A-Za-z0-9]/g, '')}`,
      email,
      firstName,
      jobTitle,
      lastName,
      salary: Number(salary),
      signatureCatchPhrase,
      startDate,
    };
  });

type ActionMessage = { title: string; message: string; names: string[] };

/** The React Aria button takes `isDisabled` and `onPress`. */
const buttonProps = (disabled: boolean, onClick: () => void) =>
  (ST_BASE === 'aria'
    ? { isDisabled: disabled, onPress: onClick }
    : { disabled, onClick }) as { disabled: boolean; onClick: () => void };

const AdvancedTable = () => {
  const [action, setAction] = useState<ActionMessage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const showAction = (message: ActionMessage) => {
    setAction(message);
    setDialogOpen(true);
  };

  const columns = useMemo<ST_ColumnDef<Employee>[]>(
    () => [
      {
        id: 'employee',
        header: 'Employee',
        columns: [
          {
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            id: 'name',
            icon: UserIcon,
            header: 'Name',
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <div className="flex items-center gap-4">
                <img
                  alt="avatar"
                  className="size-[30px] shrink-0 rounded-full"
                  height={30}
                  width={30}
                  src={row.original.avatar}
                  loading="lazy"
                />
                <span>{renderedCellValue}</span>
              </div>
            ),
          },
          {
            accessorKey: 'email',
            icon: MailIcon,
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Email',
            size: 300,
          },
        ],
      },
      {
        id: 'id',
        header: 'Job Info',
        columns: [
          {
            accessorKey: 'salary',
            icon: DollarSignIcon,
            filterFn: 'between',
            header: 'Salary',
            size: 200,
            Cell: ({ cell }) => (
              <span
                className={`max-w-[9ch] rounded p-1 text-white ${
                  cell.getValue<number>() < 50_000
                    ? 'bg-red-700'
                    : cell.getValue<number>() >= 50_000 &&
                        cell.getValue<number>() < 75_000
                      ? 'bg-yellow-700'
                      : 'bg-green-700'
                }`}
              >
                {cell.getValue<number>()?.toLocaleString?.('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            ),
          },
          {
            accessorKey: 'jobTitle',
            icon: BriefcaseIcon,
            header: 'Job Title',
            size: 350,
          },
          {
            accessorFn: (row) => new Date(row.startDate),
            id: 'startDate',
            icon: CalendarIcon,
            header: 'Start Date',
            filterVariant: 'date',
            filterFn: 'lessThan',
            sortFn: 'datetime',
            Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(),
            Header: ({ column }) => <em>{column.columnDef.header}</em>,
            stFilterTextFieldProps: {
              className: 'min-w-[250px]',
            },
          },
        ],
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data: employees,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    initialState: {
      showGlobalFilter: true,
      columnPinning: {
        start: ['st-row-expand', 'st-row-select'],
        end: ['st-row-actions'],
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    stPaginationProps: {
      rowsPerPageOptions: [10, 20, 30],
    },
    renderDetailPanel: ({ row }) => (
      <div className="sticky left-[30px] flex w-full max-w-[1000px] items-center justify-around">
        <img
          alt="avatar"
          className="size-[200px] shrink-0 rounded-full"
          height={200}
          width={200}
          src={row.original.avatar}
          loading="lazy"
        />
        <div className="text-center">
          <h4>Signature Catch Phrase:</h4>
          <h1>&quot;{row.original.signatureCatchPhrase}&quot;</h1>
        </div>
      </div>
    ),
    renderRowActionMenuItems: ({ closeMenu, row }) => [
      <DropdownMenuItem
        className="m-0"
        key={0}
        onClick={() => {
          showAction({
            title: 'View profile',
            message: 'Opening the profile of',
            names: [row.getValue<string>('name')],
          });
          closeMenu();
        }}
      >
        <CircleUserIcon />
        View Profile
      </DropdownMenuItem>,
      <DropdownMenuItem
        className="m-0"
        key={1}
        onClick={() => {
          showAction({
            title: 'Send email',
            message: 'Sending an email to',
            names: [row.getValue<string>('name')],
          });
          closeMenu();
        }}
      >
        <SendIcon />
        Send Email
      </DropdownMenuItem>,
    ],
    renderTopToolbar: ({ table }) => {
      const selectedNames = () =>
        table
          .getSelectedRowModel()
          .flatRows.map((row) => row.getValue<string>('name'));
      const noneSelected = !table.getIsSomeRowsSelected();

      return (
        <div className="flex justify-between gap-2 p-2">
          <div className="flex items-center gap-2">
            <ST_GlobalFilterTextField />
            <ST_SortPopover table={table} variant="chip" />
            <ST_FilterChips table={table} />
          </div>
          <div>
            <div className="flex gap-2">
              <Button
                className="text-destructive"
                size="sm"
                variant="outline"
                {...buttonProps(noneSelected, () =>
                  showAction({
                    title: 'Deactivate',
                    message: 'Deactivating',
                    names: selectedNames(),
                  }),
                )}
              >
                Deactivate
              </Button>
              <Button
                size="sm"
                variant="default"
                {...buttonProps(noneSelected, () =>
                  showAction({
                    title: 'Activate',
                    message: 'Activating',
                    names: selectedNames(),
                  }),
                )}
              >
                Activate
              </Button>
              <Button
                size="sm"
                variant="outline"
                {...buttonProps(noneSelected, () =>
                  showAction({
                    title: 'Contact',
                    message: 'Contacting',
                    names: selectedNames(),
                  }),
                )}
              >
                Contact
              </Button>
              <ST_ViewSettingsButton table={table} />
            </div>
          </div>
        </div>
      );
    },
  });

  const dialogBody = (
    <>
      <DialogParts.DialogHeader>
        <DialogParts.DialogTitle>{action?.title}</DialogParts.DialogTitle>
        <DialogParts.DialogDescription>
          {action?.message} {action?.names.length}{' '}
          {action?.names.length === 1 ? 'person' : 'people'}:
        </DialogParts.DialogDescription>
      </DialogParts.DialogHeader>
      <ul className="list-disc ps-5">
        {action?.names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <DialogParts.DialogFooter showCloseButton />
    </>
  );

  return (
    <>
      <ShadcnTable table={table} />
      {ST_BASE === 'aria' ? (
        <AriaDialog isOpen={dialogOpen} onOpenChange={setDialogOpen}>
          {dialogBody}
        </AriaDialog>
      ) : (
        <DialogParts.Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
          <DialogParts.DialogContent>{dialogBody}</DialogParts.DialogContent>
        </DialogParts.Dialog>
      )}
    </>
  );
};

/**
 * Header groups, a custom top toolbar whose buttons wait for a selection, and
 * the first page of employees.
 */
export const Advanced = {
  render: () => <AdvancedTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText('Dusty Kuvalis');
    expect(
      canvas.getByRole('columnheader', { name: 'Employee' }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole('columnheader', { name: 'Job Info' }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Activate' })).toBeDisabled(),
    );
  },
};
