import fs from "node:fs"
import process from "node:process"

export default function wordSequenceCounter(inputFilePath: string): void {
  let inputStream: fs.ReadStream;

  try {
    inputStream = fs.createReadStream(inputFilePath);
  } catch (error) {
    console.error(`Could not open file ${inputFilePath} for reading`);
    process.exit(1);
  }

  inputStream.on('error', (error) => {
    console.error(`An error occurred processing file`, error);
    process.exit(1);
  })

  inputStream.on('data', (chunk) => {
    console.log(chunk);
  })
}
