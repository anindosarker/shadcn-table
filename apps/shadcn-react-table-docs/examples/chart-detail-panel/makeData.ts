export type Person = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  points: number[];
  assists: number[];
  turnovers: number[];
  gamesPlayed: number[];
};

//seeded so that server and client render the same numbers
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

const random = createRandom(4201);

const randomNumbers = (num: number, multiplier: number = 1) => {
  const points: number[] = [];
  for (let i = 0; i < num; i++) {
    points.push(Math.floor(random() * 30 * multiplier + i * multiplier));
  }
  return points;
};

export const data: Person[] = [
  {
    id: '1',
    firstName: 'Dylan',
    middleName: 'Sprouse',
    lastName: 'Murray',
    points: randomNumbers(10),
    assists: randomNumbers(10, 0.6),
    turnovers: randomNumbers(10, 0.2),
    gamesPlayed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: '2',
    firstName: 'Raquel',
    middleName: 'Hakeem',
    lastName: 'Kohler',
    points: randomNumbers(6),
    assists: randomNumbers(6, 0.4),
    turnovers: randomNumbers(6, 0.2),
    gamesPlayed: [1, 2, 3, 4, 5, 9],
  },
  {
    id: '3',
    firstName: 'Ervin',
    middleName: 'Kris',
    lastName: 'Reinger',
    points: randomNumbers(13),
    assists: randomNumbers(13, 0.2),
    turnovers: randomNumbers(13, 0.1),
    gamesPlayed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14],
  },
  {
    id: '4',
    firstName: 'Brittany',
    middleName: 'Kathryn',
    lastName: 'McCullough',
    points: randomNumbers(10),
    assists: randomNumbers(10, 0.5),
    turnovers: randomNumbers(10, 0.3),
    gamesPlayed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: '5',
    firstName: 'Branson',
    middleName: 'John',
    lastName: 'Frami',
    points: randomNumbers(3),
    assists: randomNumbers(3, 1.2),
    turnovers: randomNumbers(3, 0.5),
    gamesPlayed: [4, 8, 9],
  },
];
