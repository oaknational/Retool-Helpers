# retool-helpers

Retool helper functions that run in a browser environment (don't use Node APIs).

## Development

Functions should be imported into, then exported from, [`src/index.ts`](src/index.ts).

Don't use Node APIs, these functions are for use in a browser environment.

## Building

The Typescript is compiled into ESM and CJS compatible modules. The ESM modules are then bundled using `esbundler` and exposed on the browser `Window` object under the `OakRetoolHelpers` object.

### CI/CD

#### GitHub Secrets Required for Workflows

- `secrets.SONAR_TOKEN` required for running Sonar Cloud with test coverage report uploading.

## Testing

- Unit tests: `npm run test` - these run in CI, but will not throw if you accidentally include Node APIs in the library.
- Browser tests: `npm run browser-test`, this will open a local browser window and run Mocha tests in it. These don't run in CI because we can't extract the test result. Because they run in a browser they will throw if you accidentally include non-Browser APIs, e.g. Node's `process.env`.

## Publishing

New GitHub releases are automatically created with the [Semantic Release](https://www.npmjs.com/package/semantic-release) package on merging a PR, and automatically released to [npmjs.com](https://www.npmjs.com/package/@oaknational/retool-helpers).

## Use

The bundled code can be included on a page as a `<script>` tag. Once loaded the functions will be available on the `OakRetoolHelpers` object attached to the global `Window` scope, e.g. `OakRetoolHelpers.slugify(myString)`. See the [browser test file](browser_test/index.html) for an example.

## Documentation

Documentation can be read locally by using the command `npm run open-docs`

## Contributions

We are not currently accepting external contributions, thank you.
