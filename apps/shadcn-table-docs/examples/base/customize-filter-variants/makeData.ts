export type Person = {
  isActive: boolean;
  name: string;
  hireDate: string;
  arrivalTime: string;
  departureTime: Date;
  age: number;
  salary: number;
  city: string;
  state: string;
};

//seeded so that server and client render the same times
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

const random = createRandom(314);

const randomInt = (max: number) => Math.floor(random() * (max + 1));

//random time on a fixed day, so the rows do not depend on the build date
const today = () => {
  const today = new Date(2024, 0, 15);
  today.setHours(randomInt(23));
  today.setMinutes(randomInt(59));
  today.setSeconds(randomInt(59));
  return today;
};

export const data = [
  {
    isActive: true,
    name: 'Tanner Linsley',
    hireDate: '2016-02-23T18:25:43.511Z',
    arrivalTime: '2016-02-23T18:25:43.511Z',
    departureTime: today(),
    age: 42,
    salary: 100_000,
    city: 'San Francisco',
    state: 'California',
  },
  {
    isActive: true,
    name: 'Maya Patel',
    hireDate: '2019-02-23T18:21:43.335',
    arrivalTime: '2019-02-23T18:21:43.335',
    departureTime: today(),
    age: 51,
    salary: 80_000,
    city: 'Richmond',
    state: 'Virginia',
  },
  {
    isActive: false,
    name: 'John Doe',
    hireDate: '2014-02-23T18:25:43.511Z',
    arrivalTime: '2014-02-23T18:25:43.511Z',
    departureTime: today(),
    age: 27,
    salary: 120_000,
    city: 'Riverside',
    state: 'South Carolina',
  },
  {
    isActive: true,
    name: 'Jane Doe',
    hireDate: '2015-02-25T18:25:43.511Z',
    arrivalTime: '2015-02-25T18:25:43.511Z',
    departureTime: today(),
    age: 32,
    salary: 150_000,
    city: 'San Francisco',
    state: 'California',
  },
  {
    isActive: false,
    name: 'John Smith',
    hireDate: '2023-06-11T18:25:43.511Z',
    arrivalTime: '2023-06-11T18:25:43.511Z',
    departureTime: today(),
    age: 42,
    salary: 75_000,
    city: 'Los Angeles',
    state: 'California',
  },
  {
    isActive: true,
    name: 'Jane Smith',
    hireDate: '2019-02-23T18:21:43.335',
    arrivalTime: '2019-02-23T18:21:43.335',
    departureTime: today(),
    age: 51,
    salary: 56_000,
    city: 'Blacksburg',
    state: 'Virginia',
  },
  {
    isActive: false,
    name: 'Samuel Jackson',
    hireDate: '2010-02-23T18:25:43.511Z',
    arrivalTime: '2010-02-23T18:25:43.511Z',
    departureTime: today(),
    age: 27,
    salary: 90_000,
    city: 'New York',
    state: 'New York',
  },
];

export const citiesList = [
  'San Francisco',
  'Richmond',
  'Riverside',
  'Los Angeles',
  'Blacksburg',
  'New York',
];

export const usStateList = [
  'California',
  'Virginia',
  'South Carolina',
  'New York',
  'Texas',
];
