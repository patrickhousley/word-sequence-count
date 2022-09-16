const wordSequenceCounter = require('./dist/index').default

const originalLogger = console.log
console.log = () => {}
console.warn = () => {}
console.error = () => {}
console.debug = () => {}

const shortStart = performance.mark('short-start')
for (let i = 0; i < 1000; i++) {
  wordSequenceCounter('resources/short.txt')
}
const shortMeasure = performance.measure('short', shortStart)
originalLogger(`Processing resources/short.txt took ${shortMeasure.duration}ms`)

const mobyStart = performance.mark('moby-start')
for (let i = 0; i < 1000; i++) {
  wordSequenceCounter('resources/mobydick.txt')
}
const mobyMeasure = performance.measure('moby', mobyStart)
originalLogger(
  `Processing resources/mobydick.txt took ${mobyMeasure.duration}ms`
)

const unicodeStart = performance.mark('moby-start')
for (let i = 0; i < 1000; i++) {
  wordSequenceCounter('resources/unicode.txt')
}
const unicodeMeasure = performance.measure('unicode', unicodeStart)
originalLogger(
  `Processing resources/unicode.txt took ${unicodeMeasure.duration}ms`
)
