import type { UpdateFields } from "./types/bulkUpdateFields";
import type {
  SingleKeyArrayFields,
  IdArrayFields,
  JointArrayFields,
  LessonRecord,
} from "./types/lessonRecord";

import {
  isIdField,
  isJointArrayField,
  isSingleKeyArrayField,
  isStringField,
} from "./types/bulkUpdateFields";

/**
 * Turns the array fields which contain an object with a single key, (i.e. teacher_tips, or key_learning_points), into a row of strings.
 *
 * @example
 * ```
 * // Given the following joint key array field:
 * [{key_learning_point: "key learning one"}, {key_learning_point: "key learning two"}]
 * // The row would look like this:
 * ["key learning one", "key learning two"]
 *
 * ```
 *
 * @param record The lesson record to extract the data from
 * @param key The key of the field to extract
 * @param row The row to add the data to
 * @param updateFields The store of metadata related to each field
 */
export const handleSingleKeyArrayField = (
  record: LessonRecord,
  key: keyof SingleKeyArrayFields,
  row: string[],
  updateFields: UpdateFields
) => {
  for (let i = 0; i < updateFields[key].size; i++) {
    const value = (record[key] ?? [])[i] ?? {};
    const valueIndex = updateFields[key].primaryElementKey;

    if ("key_learning_point" in value && valueIndex === "key_learning_point") {
      row.push(value[valueIndex]);
      continue;
    }
    if ("lesson_outline" in value && valueIndex === "lesson_outline") {
      row.push(value[valueIndex]);
      continue;
    }
    if ("teacher_tip" in value && valueIndex === "teacher_tip") {
      row.push(value[valueIndex]);
      continue;
    }
    if ("equipment" in value && valueIndex === "equipment") {
      row.push(value[valueIndex]);
      continue;
    }

    row.push("");
  }
};

/**
 * Turns the array fields which contain an object with a two keys, (i.e. keywords, or misconceptions and common mistakes), into a row of strings where the secondary key follows the primary key.
 *
 * @example
 * ```
 * // Given the following joint key array field:
 * [{keyword: "keyword1", description: "description1"}, {keyword: "keyword2", description: "description2"}]
 * // The row would look like this:
 * ["keyword1", "description1", "keyword2", "description2"]
 * ```
 * @param record The lesson record to extract the data from
 * @param key The key of the field to extract
 * @param row The row to add the data to
 * @param updateFields The store of metadata related to each field
 */
export const handleJointKeyArrayField = (
  record: LessonRecord,
  key: keyof JointArrayFields,
  row: string[],
  updateFields: UpdateFields
) => {
  for (let i = 0; i < updateFields[key].size; i++) {
    const value = (record[key] ?? [])[i] ?? {};
    const primaryKey = updateFields[key].primaryElementKey;
    const secondaryKey = updateFields[key].secondaryElementKey;

    if ("keyword" in value && primaryKey === "keyword") {
      row.push(value[primaryKey]);

      if ("description" in value && secondaryKey === "description") {
        row.push(value[secondaryKey]);
        continue;
      }

      row.push("");
      continue;
    }

    if ("misconception" in value && primaryKey === "misconception") {
      row.push(value[primaryKey]);

      if ("response" in value && secondaryKey === "response") {
        row.push(value[secondaryKey]);
        continue;
      }

      row.push("");
      continue;
    }

    row.push("");
    row.push("");
  }
};

/**
 * Turns the array fields which contains IDs (i.e tags or content guidance ) into the corresponding strings.
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
 * @param cat_tags_map The map to convert the cat tag IDs to strings
 * @param guidanceMap The map to convert the content guidance IDs to strings
 */
export const handleIdField = (
  record: LessonRecord,
  key: keyof IdArrayFields,
  row: string[],
  updateFields: UpdateFields,
  cat_tags_map: Map<number, string>,
  guidanceMap: Map<number, string>
) => {
  const value = record[key] ?? [];
  for (let i = 0; i < updateFields[key].size; i++) {
    if (key === "tags") {
      row.push(cat_tags_map.get(value[i] as number) ?? "");
    }
    if (key === "content_guidance") {
      row.push(guidanceMap.get(value[i] as number) ?? "");
    }
  }
};

/**
 * Adds the header row to the table.
 *
 * @param values The table to add the header row to
 * @param updateFields The store of metadata related to each field
 */
export const handleHeaderRow = (
  values: string[][],
  updateFields: UpdateFields
) => {
  const headers: string[] = [];
  const keys = Object.keys(updateFields) as (keyof UpdateFields)[];

  keys.forEach((key) => {
    if (isStringField(key)) {
      headers.push(key);
      return;
    }

    if (isJointArrayField(key)) {
      for (let i = 0; i < updateFields[key].size; i++) {
        headers.push(`${key}-${i + 1}`);
        headers.push(
          `${key}-${i + 1}-${updateFields[key].secondaryElementKey}`
        );
      }
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
 * @param data The lesson records to build the table from
 * @param updateFields The store of metadata related to each field
 * @param cat_tags_map The map to convert the cat tag IDs to strings
 * @param guidanceMap The map to convert the content guidance IDs to strings
 * @returns The table rows
 */

export const buildTableRows = (
  data: LessonRecord[],
  updateFields: UpdateFields,
  cat_tags_map: Map<number, string>,
  guidanceMap: Map<number, string>
): string[][] => {
  return data.reduce<string[][]>((values, record, i) => {
    if (i === 0) {
      handleHeaderRow(values, updateFields);
    }
    const row: string[] = [];
    let field: keyof UpdateFields;
    for (field in updateFields) {
      if (isStringField(field)) {
        row.push(record[field]);
      }
      if (isSingleKeyArrayField(field)) {
        handleSingleKeyArrayField(record, field, row, updateFields);
      }
      if (isJointArrayField(field)) {
        handleJointKeyArrayField(record, field, row, updateFields);
      }

      if (isIdField(field)) {
        handleIdField(
          record,
          field,
          row,
          updateFields,
          cat_tags_map,
          guidanceMap
        );
      }
    }
    values.push(row);
    return values;
  }, []);
};
