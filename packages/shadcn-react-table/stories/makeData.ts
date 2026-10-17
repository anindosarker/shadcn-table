import { faker } from '@faker-js/faker';

export type Person = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  address: string;
  city: string;
  state: string;
  phoneNumber: string;
  salary: number;
  subRows?: Person[];
};

faker.seed(1);

export function makePerson(): Person {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 80 }),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    phoneNumber: faker.phone.number(),
    salary: faker.number.int({ min: 30000, max: 200000 }),
  };
}

export function makeData(count: number): Person[] {
  return [...Array(count)].map(() => makePerson());
}

/** Nested data for expanding / sub-row / tree stories. */
export function makeNestedData(count: number, depth = 2): Person[] {
  return [...Array(count)].map(() => ({
    ...makePerson(),
    subRows:
      depth > 0
        ? makeNestedData(faker.number.int({ min: 0, max: 3 }), depth - 1)
        : undefined,
  }));
}
