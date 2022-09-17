import { faker } from '@faker-js/faker';
import mockArgv from 'mock-argv';
import process from 'node:process';

describe("src/index", () => {
  beforeEach(() => {
    jest.spyOn(console, 'error');

    // @ts-ignore
    jest.spyOn(process, 'exit').mockImplementation((exitCode: number): never => {
      // Left blank on purpose
      if (exitCode > 0) {
        throw new Error("Process exitted")
      }
    });
  })

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  })

  it("should print an error when no file provided", async () => {
    const wordSequenceCounter = jest.fn();

    const runner = async () => {
      return mockArgv([], async () => {
        jest.doMock("./lib/counter", () => ({
          __esModule: true,
          default: wordSequenceCounter
        }));

        require("./index");
      })
    }

    await expect(runner).rejects.toEqual(expect.anything());
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Missing input file"));
    expect(process.exit).toHaveBeenCalledWith(1);
    expect(wordSequenceCounter).not.toHaveBeenCalled();
  })

  it("should start the counter when file is provided", async () => {
    const wordSequenceCounter = jest.fn();
    const filePath = `/tmp/${faker.datatype.uuid()}`;

    await mockArgv([filePath], async () => {
      jest.doMock("./lib/counter", () => ({
        __esModule: true,
        default: wordSequenceCounter
      }));

      require("./index");
    })

    expect(console.error).not.toHaveBeenCalled();
    expect(process.exit).not.toHaveBeenCalled()
    expect(wordSequenceCounter).toHaveBeenCalledWith(filePath);
  })
})
