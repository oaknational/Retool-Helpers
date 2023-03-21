# retool-helpers

Retool helper functions that run in a browser environment (don't use Node APIs).

## To Do

- Use an actual browser compatible test framework for the browser tests.

## Development

Functions should be exported from [`src/index.ts`](src/index.ts). You can import them into that file from other files.

Don't use Node APIs, these functions are for use in a browser environment.

## Building

The Typescript is compiled into ESM and CJS compatible modules. The ESM modules can be imported directly into modern browsers.

## Testing

- Unit tests: `npm run test`
- Browser tests: `npm run browser-test`, you will need to open the console to check that the function has been imported and run.

## Publishing

We haven't done this bit yet.

## Use

The ESM modules can be imported into a `<script>` tag in a modern browser, see the [browser test file](browser_test/index.html).
