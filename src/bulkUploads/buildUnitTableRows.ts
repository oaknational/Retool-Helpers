import type { UnitIdFields, UnitRecord } from "./types/unitRecord";
import {
  type UnitUpdateFields,
  isUnitNumericField,
  isUnitStringField,
  isUnitStringArrayField,
  isUnitIdField,
} from "./types/unitBulkUpdateFields";
import { removeSpecialCharacters } from "../index";

/**
 * Turns the array fields which contains IDs (i.e tags or national curriculum content ) into the corresponding strings.
 *
 * @example
 * ```
 * // Given the following ID Array:
 * [1,2]
 * // The row would look like this:
 * ["tag1", "tag2"]
 * ```
 * @param record The lesson record to extract the data from
 * @param key The key of the field to extract
 * @param row The row to add the data to
 * @param updateFields The store of metadata related to each field
 * @param natCurricMap The map to convert the national curriculum content IDs to strings
 * @param EBSMap The map to convert the exam board specification content IDs to strings
 * @param tagMap The map to convert the cat tag IDs to strings
 */
export const handleUnitIdField = (
  record: UnitRecord,
  key: keyof UnitIdFields,
  row: (string | number)[],
  updateFields: UnitUpdateFields,
  natCurricMap: Map<number, string>,
  EBSMap: Map<number, string>,
  tagMap: Map<number, string>
) => {
  const value = record[key] ?? [];
  for (let i = 0; i < updateFields[key].size; i++) {
    if (key === "exam_board_specification_content") {
      row.push(EBSMap.get(value[i] as number) ?? "");
    }
    if (key === "national_curriculum_content") {
      row.push(natCurricMap.get(value[i] as number) ?? "");
    }
    if (key === "tags") {
      row.push(tagMap.get(value[i] as number) ?? "");
    }
  }
};

/**
 * Adds the header row to the table.
 *
 * @param values The table to add the header row to
 * @param updateFields The store of metadata related to each field
 */
export const handleUnitHeaderRow = (
  values: (string | number)[][],
  updateFields: UnitUpdateFields
) => {
  const headers: string[] = [];
  const keys = Object.keys(updateFields) as (keyof UnitUpdateFields)[];

  keys.forEach((key) => {
    if (isUnitStringField(key) || isUnitNumericField(key)) {
      headers.push(key);
      return;
    }

    for (let i = 0; i < updateFields[key].size; i++) {
      headers.push(`${key}-${i + 1}`);
    }
  });

  values.push(headers);
};

/**
 * Builds the table rows for the bulk upload.
 *
 * @param data The unit records to build the table from
 * @param updateFields The store of metadata related to each field
 * @param natCurricMap The map to convert the national curriculum content IDs to strings
 * @param EBSMap The map to convert the exam board specification content IDs to strings
 * @param tagMap The map to convert the cat tag IDs to strings
 * @returns The table rows
 */
export const buildUnitTableRows = (
  data: UnitRecord[],
  updateFields: UnitUpdateFields,
  natCurricMap: Map<number, string>,
  EBSMap: Map<number, string>,
  tagMap: Map<number, string>
): (string | number)[][] => {
  return data.reduce<(string | number)[][]>((values, record, i) => {
    const row: (string | number)[] = [];

    if (i === 0) {
      handleUnitHeaderRow(values, updateFields);
    }

    let field: keyof UnitUpdateFields;
    for (field in updateFields) {
      if (isUnitStringField(field) || isUnitNumericField(field)) {
        const value = isUnitStringField(field)
          ? removeSpecialCharacters(record[field] ?? "")
          : record[field];

        row.push(value);
      }

      if (isUnitStringArrayField(field)) {
        const options = updateFields[field];
        for (let i = 0; i < options.size; i++) {
          row.push(removeSpecialCharacters(record[field]?.[i] ?? ""));
        }
      }

      if (isUnitIdField(field)) {
        handleUnitIdField(
          record,
          field,
          row,
          updateFields,
          natCurricMap,
          EBSMap,
          tagMap
        );
      }
    }
    values.push(row);
    return values;
  }, []);
};
