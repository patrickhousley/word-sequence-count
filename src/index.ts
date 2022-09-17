import process from "node:process"
import wordSequenceCounter from "./lib/counter";

if (process.argv.length <= 2) {
  console.error(
    'Missing input file. Please provide an input file as the sole argument.'
  )
  process.exit(1)
}

wordSequenceCounter(process.argv[2])
