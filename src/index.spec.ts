import { faker } from '@faker-js/faker'
import mockArgv from 'mock-argv'
import mockFs from 'mock-fs'
import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs'

describe('src/index', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')

    jest
      .spyOn(process, 'exit')
      // @ts-ignore
      .mockImplementation((exitCode: number): never => {
        // Left blank on purpose
        if (exitCode > 0) {
          throw new Error('Process exited')
        }
      })

    mockFs({
      node_modules: mockFs.load(path.resolve(__dirname, '../node_modules')),
      src: mockFs.load(path.resolve(__dirname, '../src')),
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
    mockFs.restore()
  })

  it('should print an error when no file provided', async () => {
    const wordSequenceCounter = jest.fn().mockResolvedValue([])

    const runner = () => {
      return mockArgv([], async () => {
        jest.doMock('./lib/counter', () => ({
          __esModule: true,
          default: wordSequenceCounter,
        }))

        await require('./index')
      })
    }

    await expect(runner).rejects.toEqual(expect.anything())
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Missing input file')
    )
    expect(process.exit).toHaveBeenCalledWith(1)
    expect(wordSequenceCounter).not.toHaveBeenCalled()
  })

  it('should start the counter when file is provided', async () => {
    const wordSequenceCounter = jest.fn().mockResolvedValue([])
    const filePath = `/tmp/${faker.datatype.uuid()}`

    await mockArgv([filePath], async () => {
      jest.doMock('./lib/counter', () => ({
        __esModule: true,
        default: wordSequenceCounter,
      }))

      await require('./index')
    })

    const fileContents = fs
      .readFileSync(path.join(process.cwd(), 'results.json'))
      .toString('utf-8')

    expect(console.error).not.toHaveBeenCalled()
    expect(process.exit).not.toHaveBeenCalled()
    expect(wordSequenceCounter).toHaveBeenCalledWith(filePath)
    expect(fileContents).toEqual('[]')
  })

  it('should print the first 100 results', async () => {
    const wordSequenceCounter = jest.fn().mockResolvedValue(Array(200).fill(null).map(() => ([
      faker.lorem.words(3),
      faker.datatype.number(100)
    ])));
    const filePath = `/tmp/${faker.datatype.uuid()}`

    await mockArgv([filePath], async () => {
      jest.doMock('./lib/counter', () => ({
        __esModule: true,
        default: wordSequenceCounter,
      }))

      await require('./index')
    })

    expect(console.log).toHaveBeenCalledTimes(100)
  })
})
