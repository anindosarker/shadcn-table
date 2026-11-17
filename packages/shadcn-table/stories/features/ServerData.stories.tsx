import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ShadcnTable,
  ST_Tooltip,
  useShadcnTable,
  type ST_ColumnDef,
  type ST_ColumnFilterFnsState,
  type ST_ColumnFiltersState,
  type ST_FilterOption,
  type ST_PaginationState,
  type ST_SortingState,
} from '@/components/ui/shadcn-table';
import {
  CalendarClockIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  RefreshCw,
  RefreshCwIcon,
  TextIcon,
  UserIcon,
  type LucideIcon,
} from 'lucide-react';
import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

// The docs examples that fetch their rows from the docs app's /api/data:
// react-query, remote and dynamic-columns. Each story builds the same table
// and serves the same rows from getUsers below, in place of the fetch.
const meta: Meta = {
  title: 'Features/Server Data',
};

export default meta;

//Your API response shape will probably be different. Knowing a total row count is important though.
type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

type User = {
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  phoneNumber: string;
  lastLogin: Date;
};

type DbRow = Record<string, string | Date>;

// The 200 rows of the docs app's /api/data (app/api/data/db.ts):
// first name, last name, address, state, phone number.
// prettier-ignore
const userRows: [string, string, string, string, string][] = [
  ['Hermann', 'Gusikowski', '6099 Douglas Creek', 'Georgia', '421.698.9405'],
  ['Milford', 'Torp', '410 Vicenta Radial', 'Alabama', '805-728-7771 x75361'],
  ['Alda', 'Koss', '1604 Bernardo Flats', 'Louisiana', '860.628.3618'],
  ['Eulah', 'Lockman', "7072 D'Amore Shoal", 'Tennessee', '1-394-293-7730 x512'],
  ['Justen', 'Hilpert', '386 Murray Walks', 'North Carolina', '507.430.8224 x561'],
  ['Vergie', 'Beatty', '6864 Mann Haven', 'Maryland', '1-538-794-7917'],
  ['Hosea', 'Herzog', '95688 Ada Walk', 'Alabama', '1-330-864-0222 x01172'],
  ['Dillan', 'Effertz', '94317 Hahn Causeway', 'New York', '660-433-6667'],
  ['Ambrose', 'Considine', '365 Fatima Cape', 'Washington', '(628) 694-0650'],
  ['Domenick', 'Runte', '07821 Boyle Mountain', 'New York', '444-660-8840'],
  ['Izaiah', 'Renner', '286 Kuphal Circles', 'Wyoming', '(350) 379-3779 x15509'],
  ['Ricardo', 'Ziemann', '66351 Ethan Light', 'Minnesota', '(939) 926-9074'],
  ['Clement', 'Cronin', '60065 Chris Knoll', 'Nebraska', '(981) 319-5150 x92726'],
  ['Bobby', 'Schuster', '555 Mann Trace', 'Arizona', '432-605-5021'],
  ['Alfreda', 'Sporer', '068 Nader Mountain', 'New Hampshire', '940-724-6142'],
  ['Gussie', 'Walter', '58461 Pat Grove', 'Alabama', '520-922-7671'],
  ['Javier', 'Douglas', '162 Pacocha Ranch', 'New York', '(370) 993-8299'],
  ['Sydney', 'Armstrong', '725 Stracke Landing', 'Mississippi', '910.942.8141'],
  ['Justine', 'Langworth', '772 Casimer Shoal', 'South Dakota', '(350) 810-1145'],
  ['Anabel', 'Leannon', '51230 Dewayne Camp', 'Kansas', '1-888-752-3953'],
  ['Ally', 'Goodwin', '707 Howe Mountains', 'West Virginia', '1-786-215-5832 x4409'],
  ['Tianna', 'Lang', '200 Labadie Vista', 'Montana', '697-639-3479 x6460'],
  ['Noemi', 'Marquardt', '8239 Paucek Prairie', 'North Carolina', '1-677-610-6588'],
  ['Leonardo', 'Sawayn', '12643 Howell Locks', 'Missouri', '283-273-3920 x41098'],
  ['Melany', 'Corkery', '333 Upton Manor', 'Arkansas', '(826) 688-1496 x638'],
  ['Terence', 'McLaughlin', '3742 Araceli Estate', 'Arkansas', '(212) 956-0631'],
  ['Jaime', 'Block', '4862 Estelle Hill', 'Georgia', '897-843-3047 x0425'],
  ['Bernita', 'Hagenes', '53797 Hirthe Hills', 'Pennsylvania', '814.285.1779 x462'],
  ['Friedrich', 'Bergstrom', '90573 Kihn Parkway', 'Louisiana', '1-869-704-2983'],
  ['Sarina', 'Gislason', '00854 Doyle Road', 'Idaho', '(683) 305-5712'],
  ['Florian', 'Marks', '46979 Padberg Divide', 'Mississippi', '(463) 238-4575 x226'],
  ['Clare', 'Carter', '979 Berge Isle', 'New Mexico', '895-659-5983'],
  ['Mariam', 'Fritsch', '246 Tara Mews', 'Arkansas', '1-851-297-9371 x2937'],
  ['Jamel', 'Balistreri', '1702 Reinhold Crossroad', 'New York', '382.405.3098'],
  ['Alexie', 'Blanda', '899 Mayer Forge', 'Ohio', '1-213-660-5875 x311'],
  ['Cecilia', 'Kirlin', '887 Legros Forest', 'Texas', '(463) 229-3940 x7543'],
  ['Retta', 'Gaylord', '22556 Johathan Inlet', 'Nebraska', '1-618-666-7937'],
  ['Damon', 'Conroy', '5891 Darius Ways', 'Kentucky', '723.651.0869 x86999'],
  ['Jerrod', 'Roberts', '97199 Narciso Mountain', 'Wyoming', '1-662-481-8607'],
  ['Otilia', 'Schamberger', '02131 Juvenal Squares', 'West Virginia', '1-900-962-9499'],
  ['Madilyn', 'Ratke', '2287 Howell Ways', 'West Virginia', '1-241-356-6434'],
  ['Merritt', 'Tillman', '6906 Ahmed Vista', 'Wyoming', '(830) 387-9321'],
  ['Lenna', 'Kilback', '7565 Dicki Mountains', 'Montana', '(437) 317-0476 x9463'],
  ['Justice', 'Wisozk', '632 Ahmed Camp', 'Pennsylvania', '1-594-770-7724 x090'],
  ['Laurianne', 'Ledner', '76981 Spencer Walks', 'Oklahoma', '(685) 701-3169'],
  ['Mossie', 'Prosacco', '9713 Mante Isle', 'Delaware', '(231) 851-7102'],
  ['Faye', 'Bashirian', '01586 Stamm Harbors', 'Alaska', '769-497-8752'],
  ['Myra', 'Jenkins', '201 Schowalter Plaza', 'Maryland', '(569) 376-4319 x92789'],
  ['Wyatt', 'Macejkovic', '6808 Miracle Isle', 'Nebraska', '328.615.4206'],
  ['Kamren', 'Blanda', '1674 Mueller Pass', 'Idaho', '1-907-688-9197'],
  ['Earl', 'Fadel', '692 Erdman Lock', 'Missouri', '(738) 457-8668'],
  ['Floyd', 'Quitzon', '4501 Bernhard Trafficway', 'Wyoming', '345-252-3993 x137'],
  ['Verlie', 'Blick', '448 Mandy Stream', 'Iowa', '851.213.1056 x05869'],
  ['Boyd', 'Lehner', '1745 Patricia Trail', 'Georgia', '1-823-463-7983'],
  ['Vaughn', 'Altenwerth', '86164 Stamm Trail', 'Rhode Island', '387.658.0455'],
  ['Dion', 'Dicki', '906 Hoeger Circles', 'Tennessee', '(620) 402-0926 x2534'],
  ['Maxwell', 'Turcotte', '14101 Emard Terrace', 'Oklahoma', '1-982-446-5308 x464'],
  ['Clarabelle', 'Johnston', '5691 Rogahn Junctions', 'New York', '1-355-926-0460'],
  ['Jace', 'Yost', '826 Martin Flats', 'Delaware', '(506) 572-8522 x174'],
  ['Justice', 'Bartoletti', '13767 Nicole Trace', 'Rhode Island', '958-391-0473 x05450'],
  ['Rodrigo', 'Kozey', '48814 Kilback Overpass', 'Alaska', '1-256-284-6866'],
  ['Jaida', 'Barrows', '52318 Fay Knoll', 'Maryland', '975.822.1015'],
  ['Kayleigh', "O'Connell", '178 Fermin Fall', 'New Mexico', '1-602-265-9742 x208'],
  ['Sibyl', 'Beahan', '841 Nat Mills', 'Maine', '1-998-680-4926'],
  ['Amir', 'Kreiger', '811 Geovanni Green', 'Maryland', '948-816-0748'],
  ['Freddie', 'Pouros', '69596 Ritchie Highway', 'Texas', '685.639.8084'],
  ['Luther', 'Weissnat', '21870 Doyle Plains', 'Oklahoma', '906.646.5001 x5485'],
  ['Jazlyn', 'Tromp', '02223 Gerhold Lodge', 'Texas', '620.609.8021'],
  ['Monroe', 'Gulgowski', '6507 Steuber Pass', 'Pennsylvania', '(566) 588-6599 x811'],
  ['Braeden', 'Okuneva', '89598 Kshlerin Road', 'New Jersey', '291-598-8359'],
  ['Teagan', 'Gerhold', '205 Buster Plaza', 'Iowa', '1-871-232-7926'],
  ['Helga', 'Franey', '56005 Kulas Harbor', 'Vermont', '453-807-6073'],
  ['Roma', 'Klein', '65176 Nola Vista', 'New Mexico', '767-945-8529 x8275'],
  ['Marquise', 'Cummerata', '398 Theresia View', 'Louisiana', '1-525-342-0154 x170'],
  ['Jed', 'Hayes', '63640 Donnelly Rue', 'Hawaii', '(280) 208-8411 x15197'],
  ['Caleb', 'Mante', '845 Franecki Terrace', 'Rhode Island', '1-807-393-4906'],
  ['Cameron', 'Brakus', '203 Cormier Hill', 'Tennessee', '580-437-1892'],
  ['Allie', 'Feeney', '293 Larson Rest', 'New York', '936-527-7160'],
  ['Shanon', 'Oberbrunner', '03724 Ocie Avenue', 'Mississippi', '915-519-4900 x055'],
  ['Lauriane', 'Connelly', '258 Torp Loaf', 'New York', '752.333.1992'],
  ['Jolie', 'Pacocha', '574 Lueilwitz Forge', 'Georgia', '1-255-312-1232'],
  ['Darwin', 'Schinner', '6641 Jerde Divide', 'Pennsylvania', '(449) 752-5371'],
  ['Estefania', 'Quigley', '0226 Ali Expressway', 'Oregon', '518-499-6231'],
  ['Raymundo', 'Treutel', '228 Kuhlman Freeway', 'Tennessee', '974.936.1957 x70558'],
  ['Deangelo', 'Blick', '029 Violette Station', 'Missouri', '(741) 405-3853'],
  ['Sarah', 'Labadie', '503 Leopoldo Cove', 'Colorado', '204.745.5814 x54620'],
  ['Cordell', 'Dicki', '849 Malvina Mount', 'Oklahoma', '424-610-2775 x56165'],
  ['Ibrahim', 'Torphy', '566 Aleen Ramp', 'New Mexico', '1-500-693-0802 x4695'],
  ['Nella', 'Gerlach', '2281 Leffler Village', 'Kentucky', '659-865-3149 x82226'],
  ['Madalyn', 'Wintheiser', '575 Wintheiser Common', 'West Virginia', '349.669.3708 x7744'],
  ['Heidi', 'Krajcik', '38559 Hailie Grove', 'Washington', '1-559-717-2720 x558'],
  ['Veronica', 'Flatley', '08269 Rowe Hill', 'Utah', '1-941-655-9866 x6133'],
  ['Kimberly', "O'Connell", '14894 Ashlynn Lock', 'Rhode Island', '1-484-949-4663'],
  ['Jannie', 'Douglas', '74809 Mraz Trail', 'Oregon', '461.287.3248 x66090'],
  ['Zoila', 'Connelly', '3840 Abel Manor', 'Wisconsin', '(720) 486-1238 x539'],
  ['Dino', 'Nader', '96105 Clarissa Spring', 'Texas', '1-690-682-5517 x506'],
  ['Jarrell', 'Klein', '28102 Vada Forks', 'Rhode Island', '818.967.4980'],
  ['Curt', 'Stamm', '4438 Lina Rest', 'New Jersey', '506-312-7423 x470'],
  ['Lela', 'Goodwin', '84052 Gusikowski Canyon', 'Iowa', '1-995-348-0625'],
  ['Elyse', 'Wuckert', '47743 Lamar Alley', 'Illinois', '986-502-6816'],
  ['Marlen', 'Franey', '518 Kovacek Trail', 'Alabama', '(466) 519-5017'],
  ['Laury', 'Corkery', '77904 Victoria Pine', 'Texas', '874.428.1541'],
  ['Lincoln', 'Weissnat', '5898 Rolfson Cliff', 'Washington', '1-452-236-9645'],
  ['Nadia', 'Bernier', '78167 Windler Oval', 'Arkansas', '517-783-7505'],
  ['Malcolm', 'Dach', '98782 Carroll Flats', 'Pennsylvania', '610-374-0184 x8266'],
  ['Maiya', 'Feeney', '7803 Ortiz Shore', 'Nebraska', '1-459-985-0817 x152'],
  ['Hal', 'Cronin', '914 Hellen Coves', 'Massachusetts', '276.609.6039'],
  ['Buster', 'Jacobs', '3974 Kassandra Prairie', 'Montana', '(678) 685-1364 x02125'],
  ['Garland', 'Okuneva', '7066 Catalina Prairie', 'Rhode Island', '336-881-0669 x031'],
  ['Damon', 'Ullrich', "534 O'Conner Falls", 'Louisiana', '1-377-497-8909'],
  ['Jordon', 'Steuber', '3997 Olson Lights', 'West Virginia', '(834) 340-5699'],
  ['Amparo', 'Volkman', '434 Shaun Mill', 'Michigan', '1-389-763-1458'],
  ['Brooklyn', 'Zemlak', '715 Schamberger Plain', 'California', '827.857.7624 x2547'],
  ['Carlos', 'Turner', '8309 Verlie Mount', 'Connecticut', '479.618.0627 x01411'],
  ['Jay', 'Gaylord', '19697 Stewart Unions', 'Michigan', '814.990.2558 x9948'],
  ['Jazmyne', 'Gibson', '3442 Everette Tunnel', 'Utah', '542.209.3639'],
  ['Chad', 'Bartell', '997 Alexander Village', 'Wyoming', '1-512-366-1968'],
  ['Peter', 'Kessler', '43711 Nolan Fort', 'Kentucky', '408.278.2672'],
  ['Joey', 'Koelpin', '10542 Cleveland Mills', 'Nebraska', '649.447.7594 x978'],
  ['Tod', 'Sanford', '7653 Juwan Radial', 'Wisconsin', '781-209-6459'],
  ['Nakia', 'Moen', '75115 Donnie Way', 'Arkansas', '845-690-1809 x274'],
  ['Lavonne', 'Cronin', '3545 Bulah Circles', 'Alaska', '(381) 522-1962 x15573'],
  ['Alfredo', 'Treutel', '90919 Jenkins Stravenue', 'Mississippi', '262.483.1238 x2432'],
  ['Savanah', 'Graham', '55171 Johnston Wall', 'Washington', '1-502-827-8410'],
  ['Esteban', 'Rosenbaum', '642 Raquel Common', 'New York', '782-792-6555 x6278'],
  ['Ted', 'Schmeler', '83783 Alek Summit', 'Iowa', '415.509.0261'],
  ['Roselyn', 'Doyle', '0928 Bradly Ridges', 'Georgia', '1-726-794-4130 x43166'],
  ['Idell', 'Kirlin', '8527 Hoeger Plains', 'New Jersey', '1-261-430-1323'],
  ['Oswaldo', 'Koepp', '000 Camden Land', 'Massachusetts', '(485) 381-8750'],
  ['Raleigh', 'Dicki', '84142 Wiza Bridge', 'Nebraska', '(478) 658-7018 x6805'],
  ['Norma', 'Heller', '755 Jaskolski Square', 'Connecticut', '(295) 876-3062'],
  ['Kayla', 'Herzog', '4739 Parisian Corners', 'Idaho', '504-458-4377 x34542'],
  ['Adriana', 'Graham', '2765 Hettinger Mission', 'Nevada', '691-938-4227'],
  ['Cassie', 'Zemlak', '10136 Brown Well', 'Mississippi', '1-886-407-5724'],
  ['Lyric', 'Botsford', '9858 Bridgette Ways', 'New York', '921-941-9707 x97387'],
  ['Jalon', 'Auer', '1337 Spencer Shoals', 'Arizona', '626.664.1307 x7251'],
  ['Ludwig', 'Olson', '969 Smith Isle', 'Utah', '460.363.0230 x433'],
  ['Bridie', 'Brown', '40022 Herman Fall', 'Colorado', '(488) 464-2590 x006'],
  ['Catalina', 'Rippin', '43734 Nitzsche Groves', 'Colorado', '705-543-3151 x793'],
  ['Carolanne', 'Turcotte', '7259 Lockman Flats', 'Oregon', '1-682-446-8574'],
  ['Scotty', 'Williamson', '61776 Rebeka Summit', 'Colorado', '829-632-3726 x9232'],
  ['Forest', 'Rau', '84797 Prohaska Route', 'Oklahoma', '1-506-693-4479 x7363'],
  ['Mustafa', 'Glover', '8784 Gilda Ferry', 'Texas', '(221) 701-4090 x6545'],
  ['Alexa', 'Schaden', '216 Bashirian Common', 'Arizona', '(794) 997-1491'],
  ['Valentine', 'Weimann', '813 Augustus Spur', 'Utah', '206.690.2919'],
  ['Isabell', 'Senger', '37201 Corkery Ranch', 'Iowa', '1-531-713-5087'],
  ['Jakob', 'Jacobs', '336 Itzel Viaduct', 'Hawaii', '(652) 827-4708 x04803'],
  ['Adell', 'Bergstrom', '3844 Cormier Island', 'Georgia', '647-786-3685 x498'],
  ['Enid', 'Turner', '9124 Bella Parkway', 'California', '898.625.2245'],
  ['Jazmyn', 'Bayer', '994 Vandervort Freeway', 'Michigan', '1-525-851-3729'],
  ['Wallace', 'Schultz', '991 Cynthia Islands', 'South Dakota', '276.486.9138 x19749'],
  ['Ronaldo', 'Bergnaum', '793 Harvey Cliffs', 'Minnesota', '(763) 924-8113 x909'],
  ['Jamarcus', 'Dickens', '458 Raoul Crossing', 'Minnesota', '1-977-491-1174 x12903'],
  ['Ozella', 'Walsh', '28623 Imani Mission', 'Iowa', '1-803-233-1722 x94688'],
  ['Vergie', 'Stokes', '57283 Dahlia Ranch', 'New York', '1-974-656-0663 x201'],
  ['Juvenal', 'Rogahn', '016 Wiegand Plains', 'Florida', '(569) 709-7816'],
  ['Marisa', "O'Connell", '9075 Schowalter Crossing', 'Indiana', '(368) 695-6801 x6567'],
  ['Renee', 'MacGyver', '28801 Melody Locks', 'South Carolina', '217-885-0010 x51327'],
  ['Luz', 'Labadie', '7427 Marvin Lock', 'Iowa', '1-475-395-9892'],
  ['Thurman', 'Quitzon', '1451 Houston Center', 'California', '(606) 818-4644 x897'],
  ['Jerrold', 'Grant', '26488 Leonel Place', 'Massachusetts', '1-949-823-5546 x320'],
  ['Charlene', 'Kautzer', '026 Koch Squares', 'Delaware', '1-819-452-4832'],
  ['Bennie', 'White', '8838 Ruthe Lodge', 'Oregon', '1-326-766-9776 x5871'],
  ['Serena', 'Howell', '50451 Stephanie Lane', 'North Dakota', '494.371.8192 x3198'],
  ['Christian', 'Zulauf', '0536 Marcelino Stravenue', 'South Dakota', '311.287.5546 x634'],
  ['Trenton', 'Gutmann', '1794 Friedrich Drives', 'North Dakota', '587.472.6191 x90105'],
  ['Julianne', 'Reichert', '39854 Herman Overpass', 'Missouri', '1-921-342-5327 x91377'],
  ['Arne', 'Jerde', '73182 Camryn Mills', 'Ohio', '1-886-609-1117 x1213'],
  ['Russel', 'Prosacco', '733 Fausto Harbors', 'Alaska', '(768) 434-0549 x046'],
  ['Sylvan', 'Pacocha', '1666 Kayden Knolls', 'Virginia', '890.970.7412 x99529'],
  ['Avis', 'Kemmer', '067 Dicki Spring', 'Minnesota', '1-470-276-6628 x7318'],
  ['Vinnie', 'Erdman', '266 West Parks', 'Ohio', '295.883.0344 x9687'],
  ['Retha', 'Shanahan', '92874 Burnice Rest', 'West Virginia', '1-989-842-2804'],
  ['Sophia', 'Durgan', '33093 Kris Highway', 'West Virginia', '257-311-0156 x02940'],
  ['Geovany', 'Tromp', '04085 Vesta Corners', 'Oregon', '366.420.6148 x9787'],
  ['Abdullah', 'Williamson', '2785 Karlie Run', 'Florida', '(689) 794-2642 x8431'],
  ['Bo', 'Hettinger', '11099 Dare Isle', 'Florida', '(359) 794-0686 x05810'],
  ['Lois', 'Reichel', '41309 Abernathy Valley', 'Rhode Island', '(444) 941-5900 x2001'],
  ['Elmer', 'Cummerata', '184 Katrine Shore', 'Iowa', '372.603.3205 x712'],
  ['Nella', 'Von', '1350 Stoltenberg Brooks', 'Texas', '1-925-845-7429 x0536'],
  ['Tyler', 'Orn', '33097 VonRueden Camp', 'Iowa', '(930) 397-6101'],
  ['Joy', 'Lockman', '3235 Isabell Terrace', 'Louisiana', '(988) 273-5397 x17397'],
  ['Jarret', 'Kulas', '364 Gorczany Bypass', 'Georgia', '1-909-780-0982 x92779'],
  ['Pedro', 'Friesen', '20032 Waylon Hollow', 'Indiana', '(268) 387-1965'],
  ['Dedric', 'Senger', '818 Borer Dam', 'Alaska', '1-462-853-3223'],
  ['Jess', 'Powlowski', '169 Marion Ridges', 'South Carolina', '445-623-4865 x41525'],
  ['Herta', 'Schultz', '46393 Roberta Landing', 'Minnesota', '798.446.4800'],
  ['Maurine', 'Boyle', '243 Wade Point', 'Arkansas', '1-932-491-9223'],
  ['Marjory', 'McClure', '350 Cheyanne Camp', 'West Virginia', '1-413-868-6859 x24987'],
  ['Darion', 'Wisozk', '232 Berge Junctions', 'Arizona', '1-887-450-7810'],
  ['Freda', 'Boyer', '4092 Lakin Passage', 'Arizona', '868-901-8673 x19014'],
  ['Daija', 'Cole', '998 Feil Causeway', 'Colorado', '591.689.7935'],
  ['Isidro', 'Barton', '692 Hannah Harbors', 'Louisiana', '1-521-632-7204'],
  ['Ada', 'McLaughlin', '841 Chanelle Canyon', 'Arkansas', '206.847.6733'],
  ['Sarah', 'Kuhlman', '473 Ahmed Knoll', 'North Carolina', '483-459-2066 x0169'],
  ['Branson', 'Boyer', '0789 Jo Circle', 'New Mexico', '230.651.5955'],
  ['Humberto', 'Beahan', '16065 Herman Freeway', 'Washington', '555-464-7388'],
  ['Domenic', 'Bernier', '83684 Hagenes Crest', 'New Mexico', '207.846.6268 x29983'],
  ['Alayna', 'Hand', '51016 Wisozk Grove', 'New York', '317-783-7334 x538'],
  ['Henri', 'Gottlieb', '6075 Doyle Tunnel', 'Colorado', '(691) 295-0631 x8778'],
];

//random date from last year
const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

//built once, as the docs server builds them once per process, so every request sees the same lastLogin dates
const dbRows: DbRow[] = userRows.map(
  ([firstName, lastName, address, state, phoneNumber]) => ({
    firstName,
    lastName,
    address,
    state,
    phoneNumber,
    lastLogin: randomDate(new Date(2019, 0, 1), new Date()),
  }),
);

const isLessThan = (a: string | Date, b: string | Date) =>
  a instanceof Date && b instanceof Date
    ? a.getTime() < b.getTime()
    : String(a) < String(b);

//each filter may carry the column's filter mode; without one, lastLogin keeps 'greaterThan'
type ColumnFilterWithMode = ST_ColumnFiltersState[number] & {
  mode?: ST_FilterOption;
};

//a date-only filter value ('2025-11-02') is that day's local midnight, and the
//row date is cut to its own local day, so equals matches the whole day
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

const toTime = (value: unknown, dayOnly: boolean) => {
  const date = value instanceof Date ? value : new Date(value as string);
  return dayOnly
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    : date.getTime();
};

const filterTime = (value: unknown) => {
  const day = typeof value === 'string' ? DATE_ONLY.exec(value) : null;
  return day
    ? new Date(+day[1], +day[2] - 1, +day[3]).getTime()
    : new Date(value as string).getTime();
};

const isDayOnly = (value: unknown) =>
  typeof value === 'string' && DATE_ONLY.test(value);

//compares a row date with the filter value in the column's filter mode
const matchesDate = (
  rowValue: unknown,
  filterValue: unknown,
  mode: ST_FilterOption = 'greaterThan',
): boolean => {
  if (mode === 'between' || mode === 'betweenInclusive') {
    const [min, max] = Array.isArray(filterValue) ? filterValue : [];
    const inclusive = mode === 'betweenInclusive';
    //an empty bound (undefined, null or '') leaves that side open
    return (
      (min == null ||
        min === '' ||
        matchesDate(
          rowValue,
          min,
          inclusive ? 'greaterThanOrEqualTo' : 'greaterThan',
        )) &&
      (max == null ||
        max === '' ||
        matchesDate(
          rowValue,
          max,
          inclusive ? 'lessThanOrEqualTo' : 'lessThan',
        ))
    );
  }
  const filter = filterTime(filterValue);
  const row = toTime(rowValue, isDayOnly(filterValue));
  if (Number.isNaN(filter) || Number.isNaN(row)) return true;
  switch (mode) {
    case 'equals':
      return row === filter;
    case 'notEquals':
      return row !== filter;
    case 'greaterThanOrEqualTo':
      return row >= filter;
    case 'lessThan':
      return row < filter;
    case 'lessThanOrEqualTo':
      return row <= filter;
    default:
      return row > filter;
  }
};

/**
 * The docs app's GET /api/data (app/api/data/route.ts) as a function: the
 * same paging, filtering and sorting over the same rows, answered as JSON
 * after a short wait.
 */
const getUsers = async (url: URL): Promise<UserApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let dbData = [...dbRows];
  const { searchParams } = url;
  const start = searchParams.get('start') ?? '0';
  const size = searchParams.get('size') ?? '10';
  const filters = searchParams.get('filters') ?? '[]';
  const sorting = searchParams.get('sorting') ?? '[]';
  const globalFilter = searchParams.get('globalFilter') ?? '';

  const parsedColumnFilters = JSON.parse(filters) as ColumnFilterWithMode[];
  if (parsedColumnFilters?.length) {
    parsedColumnFilters.forEach((filter) => {
      const { id: columnId, value: filterValue, mode } = filter;
      dbData = dbData.filter((row) => {
        if (columnId === 'lastLogin') {
          return matchesDate(row[columnId], filterValue, mode);
        }
        return row[columnId]
          ?.toString()
          ?.toLowerCase()
          ?.includes?.((filterValue as string).toLowerCase());
      });
    });
  }

  if (globalFilter) {
    dbData = dbData.filter((row) =>
      Object.keys(row).some((columnId) =>
        row[columnId]
          ?.toString()
          ?.toLowerCase()
          ?.includes?.(globalFilter.toLowerCase()),
      ),
    );
  }

  const parsedSorting = JSON.parse(sorting) as ST_SortingState;
  if (parsedSorting?.length) {
    const { id, desc } = parsedSorting[0];
    dbData.sort((a, b) => {
      if (desc) {
        return isLessThan(a[id], b[id]) ? 1 : -1;
      }
      return isLessThan(b[id], a[id]) ? 1 : -1;
    });
  }

  //through JSON, as a fetch would deliver it: dates arrive as strings
  return JSON.parse(
    JSON.stringify({
      data: dbData.slice(parseInt(start), parseInt(start) + parseInt(size)),
      meta: { totalRowCount: dbData.length },
    }),
  ) as UserApiResponse;
};

// react-query: the server pages, filters and sorts; React Query fetches.
const ReactQueryExample = () => {
  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);
  //the filter mode of each column, sent with its filter so the API compares the same way
  const [columnFilterFns, setColumnFilterFns] =
    useState<ST_ColumnFilterFnsState>({ lastLogin: 'greaterThan' });
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<ST_SortingState>([]);
  const [pagination, setPagination] = useState<ST_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //consider storing this code in a custom hook (i.e useFetchUsers)
  const {
    data: { data = [], meta } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<UserApiResponse>({
    queryKey: [
      'users-list',
      {
        columnFilters, //refetch when columnFilters changes
        columnFilterFns, //refetch when a filter mode changes
        globalFilter, //refetch when globalFilter changes
        pagination, //refetch when pagination changes
        sorting, //refetch when sorting changes
      },
    ],
    queryFn: async () => {
      const fetchURL = new URL('/api/data', location.origin);

      //read our state and pass it to the API as query params
      fetchURL.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      fetchURL.searchParams.set('size', `${pagination.pageSize}`);
      fetchURL.searchParams.set(
        'filters',
        JSON.stringify(
          (columnFilters ?? []).map((filter) => ({
            ...filter,
            mode: columnFilterFns[filter.id],
          })),
        ),
      );
      fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
      fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      //the story answers in place of the docs app's API route
      return getUsers(fetchURL);
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  const columns = useMemo<ST_ColumnDef<User>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
        columnFilterModeOptions: ['contains'], //the API matches text by contains
        filterFn: 'contains',
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
        columnFilterModeOptions: ['contains'],
        filterFn: 'contains',
      },
      {
        accessorKey: 'address',
        icon: MapPinIcon,
        header: 'Address',
        columnFilterModeOptions: ['contains'],
        filterFn: 'contains',
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
        columnFilterModeOptions: ['contains'],
        filterFn: 'contains',
      },
      {
        accessorKey: 'phoneNumber',
        icon: PhoneIcon,
        header: 'Phone Number',
        columnFilterModeOptions: ['contains'],
        filterFn: 'contains',
      },
      {
        accessorFn: (row) => new Date(row.lastLogin),
        id: 'lastLogin',
        icon: CalendarClockIcon,
        header: 'Last Login',
        Cell: ({ cell }) => new Date(cell.getValue<Date>()).toLocaleString(),
        filterFn: 'greaterThan',
        filterVariant: 'date',
        //the date modes the API compares
        columnFilterModeOptions: [
          'equals',
          'notEquals',
          'greaterThan',
          'greaterThanOrEqualTo',
          'lessThan',
          'lessThanOrEqualTo',
          'between',
          'betweenInclusive',
        ],
        enableGlobalFilter: false,
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    stToolbarAlertBannerProps: isError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    //the docs example draws this tooltip with each base's own Tooltip parts;
    //ST_Tooltip is the same tooltip on every base
    renderTopToolbarCustomActions: () => (
      <ST_Tooltip title="Refresh Data">
        <Button size="icon" variant="ghost" onClick={() => refetch()}>
          <RefreshCw />
        </Button>
      </ST_Tooltip>
    ),
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilterFns,
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <ShadcnTable table={table} />;
};

// remote: the server pages, filters and sorts; a useEffect fetches.
const RemoteExample = () => {
  //data and fetching state
  const [data, setData] = useState<User[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<ST_SortingState>([]);
  const [pagination, setPagination] = useState<ST_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = new URL('/api/data', location.origin);
      url.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      url.searchParams.set('size', `${pagination.pageSize}`);
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      try {
        //the story answers in place of the docs app's API route
        const json = await getUsers(url);
        setData(json.data);
        setRowCount(json.meta.totalRowCount);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters, //re-fetch when column filters change
    globalFilter, //re-fetch when global filter changes
    pagination.pageIndex, //re-fetch when page index changes
    pagination.pageSize, //re-fetch when page size changes
    sorting, //re-fetch when sorting changes
  ]);

  const columns = useMemo<ST_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
      },
      //column definitions...
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
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        icon: PhoneIcon,
        header: 'Phone Number',
      },
      //end
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => row.phoneNumber,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    stToolbarAlertBannerProps: isError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <ShadcnTable table={table} />;
};

const columnNames = {
  firstName: 'First Name',
  lastName: 'Last Name',
  address: 'Address',
  state: 'State',
  phoneNumber: 'Phone Number',
  lastLogin: 'Last Login',
} as const;

//one icon per column, looked up by key; a column the API adds later gets the fallback
const columnIcons: Record<string, LucideIcon> = {
  firstName: UserIcon,
  lastName: UserIcon,
  address: MapPinIcon,
  state: MapIcon,
  phoneNumber: PhoneIcon,
  lastLogin: CalendarClockIcon,
};

// dynamic-columns: the columns are built from the keys of the fetched rows.
const DynamicColumnsExample = () => {
  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<ST_SortingState>([]);
  const [pagination, setPagination] = useState<ST_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //consider storing this code in a custom hook (i.e useFetchUsers)
  const {
    data: { data = [], meta } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<UserApiResponse>({
    queryKey: [
      'users-list',
      {
        columnFilters, //refetch when columnFilters changes
        globalFilter, //refetch when globalFilter changes
        pagination, //refetch when pagination changes
        sorting, //refetch when sorting changes
      },
    ],
    queryFn: async () => {
      const fetchURL = new URL('/api/data', location.origin);

      //read our state and pass it to the API as query params
      fetchURL.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      fetchURL.searchParams.set('size', `${pagination.pageSize}`);
      fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
      fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      //the story answers in place of the docs app's API route
      return getUsers(fetchURL);
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  //create columns from data
  const columns = useMemo<ST_ColumnDef<User>[]>(
    () =>
      data.length
        ? Object.keys(data[0]).map((columnId) => ({
            header: columnNames[columnId as keyof User] ?? columnId,
            accessorKey: columnId,
            icon: columnIcons[columnId] ?? TextIcon,
            id: columnId,
          }))
        : [],
    [data],
  );

  const table = useShadcnTable({
    columns,
    data,
    enableRowSelection: true,
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    //give loading spinner somewhere to go while loading
    stTableBodyProps: {
      children: isLoading ? (
        <tr style={{ height: '200px' }}>
          <td />
        </tr>
      ) : undefined,
    },
    stToolbarAlertBannerProps: isError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <ST_Tooltip title="Refresh Data">
        <Button variant="ghost" size="icon" onClick={() => refetch()}>
          <RefreshCwIcon />
        </Button>
      </ST_Tooltip>
    ),
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <ShadcnTable table={table} />;
};

//react query setup in App.tsx; one client per mount, so each story run starts with an empty cache
const WithQueryClient = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const firstNames = (canvasElement: HTMLElement) =>
  [
    ...canvasElement.querySelectorAll(
      'tbody tr td[data-flip-column="firstName"]',
    ),
  ].map((cell) => (cell.textContent ?? '').trim());

/** Waits for the server's answer: these first names, in this order. */
const showsRows = (canvasElement: HTMLElement, names: string[]) =>
  waitFor(() => expect(firstNames(canvasElement)).toEqual(names), {
    timeout: 5000,
  });

const nextPage = (canvasElement: HTMLElement) =>
  userEvent.click(
    within(canvasElement).getAllByLabelText('Go to next page')[0]!,
  );

const rowNames = (from: number, to: number) =>
  userRows.slice(from, to).map(([firstName]) => firstName);

export const ServerSidePagination = {
  name: 'Server-Side Pagination',
  render: () => (
    <WithQueryClient>
      <ReactQueryExample />
    </WithQueryClient>
  ),
  play: async ({ canvasElement, step }: StoryContext) => {
    const canvas = within(canvasElement);
    await showsRows(canvasElement, rowNames(0, 10));

    await step('Page 2 shows rows 11 to 20', async () => {
      await nextPage(canvasElement);
      await showsRows(canvasElement, rowNames(10, 20));
    });

    await step('The search leaves one row', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: 'Show/Hide search' }),
      );
      await userEvent.keyboard('Hermann');
      await showsRows(canvasElement, ['Hermann']);
    });
  },
};

export const RemoteDataFetching = {
  render: () => <RemoteExample />,
  play: async ({ canvasElement, step }: StoryContext) => {
    const canvas = within(canvasElement);
    await showsRows(canvasElement, rowNames(0, 10));

    await step('Page 2 shows rows 11 to 20', async () => {
      await nextPage(canvasElement);
      await showsRows(canvasElement, rowNames(10, 20));
    });

    await step('A ticked row stays ticked across pages', async () => {
      const checkbox = () =>
        canvas.getAllByRole('checkbox', { name: 'Toggle select row' })[0]!;
      await userEvent.click(checkbox());
      await waitFor(() => expect(checkbox()).toBeChecked());
      await nextPage(canvasElement);
      await showsRows(canvasElement, rowNames(20, 30));
      expect(checkbox()).not.toBeChecked();
      await userEvent.click(
        canvas.getAllByLabelText('Go to previous page')[0]!,
      );
      await showsRows(canvasElement, rowNames(10, 20));
      await waitFor(() => expect(checkbox()).toBeChecked());
    });
  },
};

export const DynamicColumns = {
  render: () => (
    <WithQueryClient>
      <DynamicColumnsExample />
    </WithQueryClient>
  ),
  play: async ({ canvasElement, step }: StoryContext) => {
    await showsRows(canvasElement, rowNames(0, 10));

    await step('The columns come from the fetched rows', async () => {
      for (const name of Object.values(columnNames)) {
        expect(
          within(canvasElement).getByRole('columnheader', {
            name: new RegExp(name),
          }),
        ).toBeInTheDocument();
      }
    });

    await step('Page 2 shows rows 11 to 20', async () => {
      await nextPage(canvasElement);
      await showsRows(canvasElement, rowNames(10, 20));
    });
  },
};
