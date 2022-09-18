const process = require('node:process')
const child_process = require('node:child_process')

// const wordSequenceCounter = require('./dist/lib/counter').default

;(async () => {
  const originalLogger = console.log
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}
  console.debug = () => {}

  const shortStart = performance.mark('short-start')
  for (let i = 0; i < 1000; i++) {
    // await wordSequenceCounter('resources/short.txt')
    await run('resources/short.txt')
  }
  const shortMeasure = performance.measure('short', shortStart)
  originalLogger(
    `Processing resources/short.txt took ${shortMeasure.duration}ms`
  )

  const mobyStart = performance.mark('moby-start')
  for (let i = 0; i < 1000; i++) {
    // await wordSequenceCounter('resources/mobydick.txt')
    await run('resources/mobydick.txt')
  }
  const mobyMeasure = performance.measure('moby', mobyStart)
  originalLogger(
    `Processing resources/mobydick.txt took ${mobyMeasure.duration}ms`
  )

  const unicodeStart = performance.mark('moby-start')
  for (let i = 0; i < 1000; i++) {
    // await wordSequenceCounter('resources/unicode.txt')
    await run('resources/unicode.txt')
  }
  const unicodeMeasure = performance.measure('unicode', unicodeStart)
  originalLogger(
    `Processing resources/unicode.txt took ${unicodeMeasure.duration}ms`
  )
})()

async function run(filePath) {
  return new Promise((resolve, reject) => {
    child_process.exec(
      `node bin/cli.js ${filePath}`,
      {
        cwd: process.cwd(),
      },
      (error) => {
        if (error) {
          return reject(error)
        }

        resolve()
      }
    )
  })
}
