import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import wordSequenceCounter from './lib/counter'

if (process.argv.length <= 2) {
  console.error(
    'Missing input file. Please provide an input file as the sole argument.'
  )
  process.exit(1)
}

;(async () => {
  const results = await wordSequenceCounter(process.argv[2])

  fs.writeFileSync(
    path.join(process.cwd(), 'results.json'),
    JSON.stringify(results, null, 2)
  )

  for (let i = 0; i < Math.min(results.length, 100); i++) {
    const entry = results[i]
    console.log(`${entry[0]} -> ${entry[1]}`)
  }
})()
