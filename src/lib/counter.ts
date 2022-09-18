import fs from 'node:fs'
import process from 'node:process'

const wordSplitRegex = /[\s!\.\?,:;\[\]\(\)\{\}—¿"“”]/
let wordCount: Map<string, number>
let wordCache: string[]
let wordGroups: string[]
let chunkCache: string[][];

export default async function wordSequenceCounter(
  inputFilePath: string
): Promise<[string, number][]> {
  return new Promise((resolve, reject) => {
    let inputStream: fs.ReadStream
    wordCount = new Map()
    wordCache = []
    wordGroups = []
    chunkCache = []

    try {
      inputStream = fs.createReadStream(inputFilePath, {
        encoding: 'utf-8'
      })
    } catch (error) {
      console.error(`Could not open file ${inputFilePath} for reading`)
      return reject()
    }

    inputStream.on('error', (error: Error): void => {
      console.error(`An error occurred processing file`, error)
      return reject()
    })

    inputStream.on('data', (chunk: Buffer | string): void => {
      dataHandler(chunk.toString('utf-8').split(''))
    })

    inputStream.on('close', () => {
      if (wordCache.length > 0) {
        processWord(wordCache.join(''))
      }

      if (wordCount.size === 0) {
        console.warn(
          `No three word combinations found. Ensure the input file has at least three words.`
        )
      }

      const sortedWordCount = [...wordCount].sort(
        (
          wordCountGroupA: [string, number],
          wordCountGroupB: [string, number]
        ): number => wordCountGroupB[1] - wordCountGroupA[1]
      )

      resolve(sortedWordCount)
    })
  })
}

function dataHandler(chunk: string[]): void {
  chunk.forEach((char: string, index: number): void => {
    char = char.toLowerCase()

    // If a space, process the word
    if (wordSplitRegex.test(char)) {
      processWord(wordCache.join(''))
      wordCache = []
    } else {
      wordCache.push(char)
    }
  })
}

function processWord(word: string) {
  if (word.trim() === '') {
    return
  }

  wordGroups.push(word)

  if (wordGroups.length === 3) {
    const wordGroup = wordGroups.join(' ')

    if (wordCount.has(wordGroup)) {
      wordCount.set(wordGroup, (wordCount.get(wordGroup) as number) + 1)
    } else {
      wordCount.set(wordGroup, 1)
    }

    wordGroups.splice(0, 1)
  }
}
