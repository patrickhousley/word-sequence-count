#!/usr/bin/env node

const process = require('node:process')
const wordSequenceCounter = require('../dist/index').default

if (process.argv.length <= 2) {
  console.error(
    'Missing input file. Please provide an input file as the sole argument.'
  )
  process.exit(999)
}

wordSequenceCounter(process.argv[2])
