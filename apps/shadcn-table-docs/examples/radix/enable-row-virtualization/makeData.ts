export type Person = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
};

//seeded so that server and client render the same rows
const createRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const firstNames = [
  'Alice',
  'Benjamin',
  'Carla',
  'Daniel',
  'Elena',
  'Felix',
  'Grace',
  'Hugo',
  'Isabel',
  'Jonas',
  'Kiara',
  'Leon',
  'Maya',
  'Noah',
  'Olivia',
  'Pedro',
  'Quinn',
  'Rosa',
  'Samuel',
  'Tessa',
  'Umar',
  'Vera',
  'Wesley',
  'Ximena',
  'Yusuf',
  'Zoe',
];

const lastNames = [
  'Anderson',
  'Baker',
  'Campbell',
  'Diaz',
  'Evans',
  'Fischer',
  'Garcia',
  'Hoffmann',
  'Ivanova',
  'Jensen',
  'Kowalski',
  'Lopez',
  'Murray',
  'Nguyen',
  'Okafor',
  'Patel',
  'Quintero',
  'Rossi',
  'Schmidt',
  'Tanaka',
  'Ueda',
  'Varga',
  'Weber',
  'Xu',
  'Young',
  'Zimmermann',
];

const streets = [
  'Maple Street',
  'Oak Avenue',
  'Pine Road',
  'Cedar Lane',
  'Elm Drive',
  'Birch Court',
  'Willow Way',
  'Spruce Boulevard',
  'Chestnut Place',
  'Aspen Terrace',
  'Juniper Circle',
  'Hickory Row',
  'Poplar Crossing',
  'Sycamore Square',
  'Magnolia Parkway',
  'Cypress Trail',
  'Laurel Heights',
  'Hazel Grove',
  'Linden Walk',
  'Alder Point',
];

const cities = [
  'Austin',
  'Boston',
  'Chicago',
  'Denver',
  'El Paso',
  'Fresno',
  'Greensboro',
  'Houston',
  'Indianapolis',
  'Jacksonville',
  'Kansas City',
  'Las Vegas',
  'Memphis',
  'Nashville',
  'Omaha',
  'Portland',
  'Raleigh',
  'Seattle',
  'Tucson',
  'Wichita',
];

const states = [
  'Alabama',
  'California',
  'Colorado',
  'Florida',
  'Georgia',
  'Illinois',
  'Indiana',
  'Kansas',
  'Massachusetts',
  'Michigan',
  'Nevada',
  'New York',
  'North Carolina',
  'Ohio',
  'Oregon',
  'Pennsylvania',
  'Tennessee',
  'Texas',
  'Virginia',
  'Washington',
];

const countries = [
  'Argentina',
  'Australia',
  'Brazil',
  'Canada',
  'Chile',
  'Denmark',
  'Egypt',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'India',
  'Ireland',
  'Italy',
  'Japan',
  'Kenya',
  'Mexico',
  'Netherlands',
  'Norway',
  'Peru',
  'Poland',
  'Portugal',
  'Spain',
  'Sweden',
  'Thailand',
  'Turkey',
];

export const makeData = (numberOfRows: number) => {
  const random = createRandom(10001);
  const pick = <T>(list: T[]) => list[Math.floor(random() * list.length)];
  const randomInt = (min: number, max: number) =>
    min + Math.floor(random() * (max - min + 1));
  return [...Array(numberOfRows).fill(null)].map((): Person => {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    return {
      firstName,
      middleName: pick(firstNames),
      lastName,
      email:
        `${firstName}.${lastName}${randomInt(1, 99)}@example.com`.toLowerCase(),
      address: `${randomInt(1, 9999)} ${pick(streets)}`,
      zipCode: String(randomInt(10000, 99999)),
      city: pick(cities),
      state: pick(states),
      country: pick(countries),
    };
  });
};
