/**
 * These functions must run in the browser, do not use Node APIs.
 */

import { slugify } from "./slugify/index";
import {
  removeSpecialCharacters,
  insertSpecialCharacters,
} from "./handleSpecialCharacters/index";

import { buildTableRows, parseUpdates } from "./bulkUploads/index";

export {
  slugify,
  removeSpecialCharacters,
  insertSpecialCharacters,
  buildTableRows,
  parseUpdates,
};

// When bundled for the browser, this object
// will be exposed on the Window object as
// `OakRetoolHelpers`.
const oakRetoolHelpers = {
  slugify,
  removeSpecialCharacters,
  insertSpecialCharacters,
  buildTableRows,
  parseUpdates,
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    OakRetoolHelpers: typeof oakRetoolHelpers;
  }
}
if (typeof window !== "undefined") {
  window.OakRetoolHelpers = oakRetoolHelpers;
}

// Expose a default export for convenience.
export default oakRetoolHelpers;
