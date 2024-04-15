/**
 * Removes special characters
 * replaces the first instance of the single and double speech marks with sanitised versions
 * replaces all tabs and backslashes with their escape characters
 * removes all line feeds and carriage returns
 * @param text string to remove special characters from
 */
export const removeSpecialCharacters = (text: string): string => {
  return text
    .replace("'", "’")
    .replace('"', "”")
    .replaceAll(String.fromCharCode(10), "")
    .replaceAll(String.fromCharCode(13), "")
    .replaceAll(String.fromCharCode(9), "\\t")
    .replaceAll(String.fromCharCode(92), String.fromCharCode(92, 92));
};

/**
 * Inserts special characters
 * replaces the first instance of the sanitised versions with the original single and/or double speech marks
 * replaces all escape characters with the original tabs and backslashes
 * removes all line feeds and carriage returns
 * @param text string to insert original special characters
 */
export const insertSpecialCharacters = (text: string): string => {
  return text
    .replace("’", "'")
    .replace("”", '"')
    .replaceAll("\n", "")
    .replaceAll("\r", "")
    .replaceAll("\\t", String.fromCharCode(9))
    .replaceAll(String.fromCharCode(92, 92), String.fromCharCode(92));
};
