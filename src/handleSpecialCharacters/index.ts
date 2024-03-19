/**
 * Removes special characters
 * replaces the first instance of the single and double speech marks with sanitised versions
 * replaces all tabs, line feeds, carriage returns and backslashes with their escape characters
 * @param text string to remove special characters from
 */
export const removeSpecialCharacters = (text: string): string => {
  return text
    .replace("'", "’")
    .replace('"', "”")
    .replaceAll(String.fromCharCode(10), "\n")
    .replaceAll(String.fromCharCode(13), "\r")
    .replaceAll(String.fromCharCode(9), "\t")
    .replaceAll(String.fromCharCode(92), String.fromCharCode(92, 92));
};

export const insertSpecialCharacters = (text: string): string => {
  return text
    .replace("’", "'")
    .replace("”", '"')
    .replaceAll("\n", String.fromCharCode(10))
    .replaceAll("\r", String.fromCharCode(13))
    .replaceAll("\t", String.fromCharCode(9))
    .replaceAll(String.fromCharCode(92, 92), String.fromCharCode(92));
};
