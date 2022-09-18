import fs from "node:fs"
import process from "node:process"

const punctuationRegex = /[\s!\.\?,:;\[\]\(\)—¿"]/
const wordSplitRegex = /[\s]/
let wordCount: Map<string, number>;
let wordCache: string[];
let wordGroups: string[];

export default async function wordSequenceCounter(inputFilePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let inputStream: fs.ReadStream;
    wordCount = new Map();
    wordCache = [];
    wordGroups = [];

    try {
      inputStream = fs.createReadStream(inputFilePath);
    } catch (error) {
      console.error(`Could not open file ${inputFilePath} for reading`);
      return reject()
    }

    inputStream.on('error', (error: Error): void => {
      console.error(`An error occurred processing file`, error);
      return reject()
    })

    inputStream.on('data', (chunk: Buffer): void => {
      dataHandler(chunk);
    })

    inputStream.on('close', () => {
      writeResults();
      resolve();
    })
  })
}

function dataHandler(chunk: Buffer): void {
  let word = wordCache;
  chunk.forEach((charCode: number, index: number): void => {
    const char = String.fromCharCode(charCode).toLowerCase();

    // If a space, process the word
    if (wordSplitRegex.test(char)) {
      processWord(word.join(""));
      word = [];
      return;
    }

    // Remove punctuation
    if (punctuationRegex.test(char)) {
      return;
    }

    word.push(char);

    if (index === chunk.length - 1) {
      wordCache = word;
    }
  })
}

function processWord(word: string) {
  if (word.trim() === '') {
    return;
  }

  wordGroups.push(word);

  if (wordGroups.length === 3) {
    const wordGroup = wordGroups.join(" ");
    wordGroups = [];

    if (wordCount.has(wordGroup)) {
      wordCount.set(wordGroup, wordCount.get(wordGroup) as number + 1);
    } else {
      wordCount.set(wordGroup, 1);
    }
  }
}

function writeResults(): void {
  const sortedWordCount = [...wordCount]
    .sort((wordCountGroupA: [string, number], wordCountGroupB: [string, number]): number => wordCountGroupB[1] - wordCountGroupA[1])

  fs.writeFileSync('results.json', JSON.stringify(sortedWordCount));
  sortedWordCount.slice(0, 3).forEach((entry: [string, number]): void => {
    console.log(`${entry[0]} -> ${entry[1]}`);
  });
}
