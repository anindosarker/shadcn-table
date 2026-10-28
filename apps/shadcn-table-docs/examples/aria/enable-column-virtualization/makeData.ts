//seeded so that server and client render the same columns and names
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

const random = createRandom(500);

const randomInt = (min: number, max: number) =>
  min + Math.floor(random() * (max - min + 1));

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

const pick = <T>(list: T[]) => list[Math.floor(random() * list.length)];

export const fakeColumns = [...Array(500)].map((_, i) => {
  return {
    accessorKey: i.toString(),
    header: 'Column ' + i.toString(),
    size: randomInt(150, 249),
  };
});

export const fakeData = [...Array(10)].map(() => ({
  ...Object.fromEntries(
    fakeColumns.map((col) => [col.accessorKey, pick(firstNames)]),
  ),
}));
