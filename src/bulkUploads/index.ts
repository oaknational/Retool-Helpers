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
      row.push(cat_tags_map.get(value[i]) ?? "");
    }
    if (key === "content_guidance") {
      row.push(guidanceMap.get(value[i]) ?? "");
    }
  }
};

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
