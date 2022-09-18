import { faker } from '@faker-js/faker'
import mockFs from 'mock-fs'
import path from 'node:path'
import fs from 'node:fs'
import wordSequenceCounter from './counter'

describe('counter', () => {
  beforeEach(() => {
    mockFs({
      node_modules: mockFs.load(path.resolve(__dirname, '../../node_modules')),
      src: mockFs.load(path.resolve(__dirname, '../../src')),
    })
  })

  afterEach(() => {
    mockFs.restore()
  })

  it('should report the total count for a group of 3 words', async () => {
    const filePath = `/tmp/${faker.datatype.uuid()}`
    const fileContents = faker.lorem.words(3)

    mockFs({
      [filePath]: fileContents,
    })

    const results = await wordSequenceCounter(filePath)

    expect(results[0][0]).toEqual(fileContents.toLowerCase())
    expect(results[0][1]).toEqual(1)
  })

  it('should track the increasing count of the same group of words', async () => {
    const filePath = `/tmp/${faker.datatype.uuid()}`
    const fileContents = faker.lorem.words(3)

    mockFs({
      [filePath]: `${fileContents} ${fileContents}`,
    })

    const results = await wordSequenceCounter(filePath)

    expect(results[0][0]).toEqual(fileContents.toLowerCase())
    expect(results[0][1]).toEqual(2)
  })

  it('should report multiple groups of words', async () => {
    const filePath = `/tmp/${faker.datatype.uuid()}`
    const fileContents = faker.lorem.words(4)

    mockFs({
      [filePath]: fileContents,
    })

    const results = await wordSequenceCounter(filePath)

    expect(results.length).toEqual(2)
    expect(results[0][0]).toEqual(
      fileContents.split(' ').slice(0, 3).join(' ').toLowerCase()
    )
    expect(results[1][0]).toEqual(
      fileContents.split(' ').slice(1, 4).join(' ').toLowerCase()
    )
  })

  it('should handle unicode characters', async () => {
    const filePath = `/tmp/${faker.datatype.uuid()}`
    const fileContents = 'Træk av forfatternes'

    mockFs({
      [filePath]: Buffer.from(fileContents, 'utf-8'),
    })

    const results = await wordSequenceCounter(filePath)

    expect(results[0][0]).toEqual(fileContents.toLowerCase())
    expect(results[0][1]).toEqual(1)
  })

  it.each([
    ' ',
    '\n',
    '\r',
    '\r\n',
    '\t',
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    '!',
    '?',
    '.',
    ':',
    ';',
    '¿',
  ])('should ignore punctuation characters %s', async (punctuation: string) => {
    const filePath = `/tmp/${faker.datatype.uuid()}`
    const expected = 'Lorem ipsum dolor'
    const fileContents = `${punctuation}${expected}${punctuation}`

    mockFs({
      [filePath]: Buffer.from(fileContents, 'utf-8'),
    })

    const results = await wordSequenceCounter(filePath)

    expect(results[0][0]).toEqual(expected.toLowerCase())
    expect(results[0][1]).toEqual(1)
  })

  it('should report an error when the input has less than three words', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {
      // Left blank
    })

    const filePath = `/tmp/${faker.datatype.uuid()}`
    const fileContents = faker.lorem.words(2)

    mockFs({
      [filePath]: fileContents,
    })

    const results = await wordSequenceCounter(filePath)

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('No three word combinations found')
    )
  })

  it('moby_dick bug 0001', async () => {
    const filePath = `/tmp/${faker.datatype.uuid()}`
    const fileContents = `“Vengeance on a dumb brute!” cried Starbuck`

    mockFs({
      [filePath]: fileContents,
    })

    const results = await wordSequenceCounter(filePath)

    expect(results[3][0]).toEqual('dumb brute cried')
  })

  it.each([
    `with the Sperm Whale;`,
    `
since the
sperm whale
`,
  ])('moby_dick bug 0002', async (fileContents) => {
    const filePath = `/tmp/${faker.datatype.uuid()}`

    mockFs({
      [filePath]: fileContents,
    })

    const results = await wordSequenceCounter(filePath)

    expect(results[1][0]).toEqual('the sperm whale')
  })
})
