# retool-helpers

Retool helper functions that run in a browser environment (don't use Node APIs).

## To Do

- Add publishing to npm to release creation workflow.

## Development

Functions should be exported from [`src/index.ts`](src/index.ts). You can import them into that file from other files.

Don't use Node APIs, these functions are for use in a browser environment.

## Building

The Typescript is compiled into ESM and CJS compatible modules. The ESM modules can be imported directly into modern browsers.

## Testing

- Unit tests: `npm run test` - these run in CI, but will not throw if you accidentally include Node APIs in the library.
- Browser tests: `npm run browser-test`, this will open a local browser window and run Mocha tests in it. These don't run in CI because we can't extract the test result. Because they run in a browser they will throw if you accidentally include non-Browser APIs, e.g. Node's `process.env`.

## Publishing

We haven't done this bit yet.

## Use

The ESM modules can be imported into a `<script>` tag in a modern browser, see the [browser test file](browser_test/index.html).

## Contributions

We are not currently accepting external contributions, thank you.
