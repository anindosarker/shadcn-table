export type Member = {
  firstName: string;
  lastName: string;
  state: string;
  age: number;
  joined: string; //YYYY-MM-DD
  status: string;
};

export const usStateList = [
  'California',
  'Florida',
  'New York',
  'Ohio',
  'Texas',
  'Washington',
];

export const statusList = ['Active', 'Invited', 'Suspended'];

//fixed rows, so every render shows the same table
export const data: Member[] = [
  {
    firstName: 'Olivia',
    lastName: 'Martinez',
    state: 'California',
    age: 34,
    joined: '2021-03-14',
    status: 'Active',
  },
  {
    firstName: 'Liam',
    lastName: 'Johnson',
    state: 'Texas',
    age: 28,
    joined: '2022-07-02',
    status: 'Active',
  },
  {
    firstName: 'Emma',
    lastName: 'Williams',
    state: 'New York',
    age: 45,
    joined: '2019-11-23',
    status: 'Suspended',
  },
  {
    firstName: 'Noah',
    lastName: 'Brown',
    state: 'Florida',
    age: 52,
    joined: '2018-05-09',
    status: 'Active',
  },
  {
    firstName: 'Ava',
    lastName: 'Jones',
    state: 'Washington',
    age: 23,
    joined: '2024-01-30',
    status: 'Invited',
  },
  {
    firstName: 'Ethan',
    lastName: 'Garcia',
    state: 'Texas',
    age: 39,
    joined: '2020-09-17',
    status: 'Active',
  },
  {
    firstName: 'Sophia',
    lastName: 'Miller',
    state: 'Ohio',
    age: 31,
    joined: '2023-04-05',
    status: 'Invited',
  },
  {
    firstName: 'Mason',
    lastName: 'Davis',
    state: 'California',
    age: 61,
    joined: '2017-02-21',
    status: 'Suspended',
  },
  {
    firstName: 'Isabella',
    lastName: 'Rodriguez',
    state: 'Florida',
    age: 27,
    joined: '2023-10-12',
    status: 'Active',
  },
  {
    firstName: 'Lucas',
    lastName: 'Wilson',
    state: 'New York',
    age: 36,
    joined: '2021-08-28',
    status: 'Active',
  },
  {
    firstName: 'Mia',
    lastName: 'Anderson',
    state: 'Washington',
    age: 42,
    joined: '2019-06-03',
    status: 'Active',
  },
  {
    firstName: 'James',
    lastName: 'Thomas',
    state: 'Ohio',
    age: 58,
    joined: '2016-12-15',
    status: 'Suspended',
  },
  {
    firstName: 'Charlotte',
    lastName: 'Taylor',
    state: 'Texas',
    age: 25,
    joined: '2024-06-19',
    status: 'Invited',
  },
  {
    firstName: 'Benjamin',
    lastName: 'Moore',
    state: 'California',
    age: 47,
    joined: '2020-02-07',
    status: 'Active',
  },
  {
    firstName: 'Amelia',
    lastName: 'Jackson',
    state: 'New York',
    age: 33,
    joined: '2022-11-01',
    status: 'Active',
  },
  {
    firstName: 'Henry',
    lastName: 'White',
    state: 'Florida',
    age: 64,
    joined: '2015-08-24',
    status: 'Active',
  },
  {
    firstName: 'Harper',
    lastName: 'Harris',
    state: 'Washington',
    age: 29,
    joined: '2023-01-16',
    status: 'Suspended',
  },
  {
    firstName: 'Alexander',
    lastName: 'Clark',
    state: 'Texas',
    age: 38,
    joined: '2021-05-27',
    status: 'Active',
  },
  {
    firstName: 'Evelyn',
    lastName: 'Lewis',
    state: 'Ohio',
    age: 50,
    joined: '2018-10-08',
    status: 'Invited',
  },
  {
    firstName: 'Daniel',
    lastName: 'Walker',
    state: 'California',
    age: 22,
    joined: '2024-09-03',
    status: 'Invited',
  },
];
