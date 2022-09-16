import { faker } from '@faker-js/faker';
import wordSequenceCounter from './index';

describe("src/index", () => {
  it("should print the input parameter", () => {
    jest.spyOn(console, 'log');

    const expected = faker.system.directoryPath();
    wordSequenceCounter(expected);

    expect(console.log).toHaveBeenCalledWith(expected);
  })
})
