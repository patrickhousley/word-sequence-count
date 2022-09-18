# Word Sequence Counter

An app to count the number of words in an input file.

## Getting Started

Start off with installing the dependencies using `npm ci`.

### Local Development

Local development is supported via npm scripts.

- `npm start -- <file>`: Runs the app in dev mode, without build
  - `<file>`: Should be a path to an input file
  - Example: `npm start -- resources/short.txt`
- `npm test`: Runs all the tests and produces coverage map
- `npm run format`: Runs prettier to format all code
- `npm run lint`: Runs eslint again code
- `npm run build`: Runs `tsc` to build source code to JS

### Performance Testing

The `benchmark.js` runs the application using the input files from the `resources` directory and produces a very limited benchmark of the app. The output is the milliseconds it takes to process each file 1000 times

- `npm run benchmark`: Runs the benchmarks

[ClinicJS](https://clinicjs.org/) is available for creating performance usage charts and flame graphs.

- `npm run profile`: Runs clinicjs in profile mode to produce a resource usage chart
- `npm run build`: Runs clinicjs in flame mode to produce a flame graph

## Docker Build

The app includes a `Dockerfile` that builds and exposes the app as the entrypoint. To make use of the image:

```
docker build . // Outputs the image sha
docker run -it --rm -v $(pwd):/app <image sha> resources/mobydick.txt
```

## Limitations

- Only supports utf-8 encoded files and character sets
