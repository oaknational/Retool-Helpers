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
    .replaceAll(String.fromCodePoint(10), "")
    .replaceAll(String.fromCodePoint(13), "")
    .replaceAll(String.fromCodePoint(9), "\\t")
    .replaceAll(String.fromCodePoint(92), String.fromCodePoint(92, 92));
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
    .replaceAll("\\t", String.fromCodePoint(9))
    .replaceAll(String.fromCodePoint(92, 92), String.fromCodePoint(92));
};

/**
 * Removes disallowed special characters: line feeds, carriage returns, tabs and backslashes
 * and replaces single and double speech marks with their sanitised versions
 */
export const sanitiseForTsv = (text: string): string => {
  return text
    .replaceAll("'", "’")
    .replaceAll('"', "”")
    .replaceAll("\n", "")
    .replaceAll("\r", "")
    .replaceAll("\t", "")
    .replaceAll("\\", "");
};

/**
 * Removes disallowed special characters: line feeds, carriage returns, tabs and backslashes
 * and replaces sanitised single and double speech marks with their usual versions
 */
export const sanitiseForDb = (text: string): string => {
  return text
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("”", '"')
    .replaceAll("“", '"')
    .replaceAll("\n", "")
    .replaceAll("\r", "")
    .replaceAll("\t", "")
    .replaceAll("\\", "");
};
