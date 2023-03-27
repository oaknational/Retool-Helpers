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

/**
 * Slugify function, based on https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
 * @param input the string to slugify
 * @returns the input string modified for use as a slug
 */
export function slugify(input: string): string {
  const specialChars =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const replacementChars =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const specialCharRegex = new RegExp(specialChars.split("").join("|"), "g");

  return input
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(specialCharRegex, (c) =>
      replacementChars.charAt(specialChars.indexOf(c))
    ) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

// When bundled for the browser, this object
// will be exposed on the Window object as
// `OakRetoolHelpers`.
const oakRetoolHelpers = {
  add,
  slugify,
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
