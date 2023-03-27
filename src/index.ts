/**
 * These functions must run in the browser, do not use Node APIs.
 */

/**
 * Add two numbers
 * @param a
 * @param b
 * @returns
 */
export const add = (a: number, b: number): number => {
  return a + b;
};

// When bundled for the browser, this object
// will be exposed on the Window object as
// `OakRetoolHelpers`.
const oakRetoolHelpers = {
  add,
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
