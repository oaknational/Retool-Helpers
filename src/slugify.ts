/**
 * Slugify function, based on https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
 * @param input the string to slugify
 * @returns the input string modified for use as a slug
 */
export default function slugify(input: string): string {
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
