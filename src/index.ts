/**
 * These functions must run in the browser, do not use Node APIs.
 */

import { slugify } from "./slugify/index";
import {
  removeSpecialCharacters,
  insertSpecialCharacters,
} from "./handleSpecialCharacters/index";

import { buildTableRows } from "./bulkUploads/index";

export {
  slugify,
  removeSpecialCharacters,
  insertSpecialCharacters,
  buildTableRows,
};

// When bundled for the browser, this object
// will be exposed on the Window object as
// `OakRetoolHelpers`.
const oakRetoolHelpers = {
  slugify,
  removeSpecialCharacters,
  insertSpecialCharacters,
  buildTableRows,
};

declare global {
  interface Window {
    OakRetoolHelpers: typeof oakRetoolHelpers;
  }
}
if (typeof window !== "undefined") {
  window.OakRetoolHelpers = oakRetoolHelpers;
}

// Expose a default export for convenience.
export default oakRetoolHelpers;
