/**
 * These functions must run in the browser, do not use Node APIs.
 */

import { slugify } from "./slugify/index";
import {
  removeSpecialCharacters,
  insertSpecialCharacters,
  sanitiseForDb,
  sanitiseForTsv,
} from "./handleSpecialCharacters/index";

import {
  buildTableRows,
  parseUpdates,
  buildUnitTableRows,
  parseUnitUpdates,
} from "./bulkUploads/index";
import { createSlackReport } from "./reportToSlack/index";

export {
  slugify,
  removeSpecialCharacters,
  insertSpecialCharacters,
  buildTableRows,
  parseUpdates,
  buildUnitTableRows,
  parseUnitUpdates,
  sanitiseForDb,
  sanitiseForTsv,
  createSlackReport,
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
  buildUnitTableRows,
  parseUnitUpdates,
  sanitiseForDb,
  sanitiseForTsv,
  createSlackReport,
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
