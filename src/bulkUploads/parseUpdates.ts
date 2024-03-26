import { buildErrorLogger } from "./parsingErrors";
import {
  isSingleKeyArrayField,
  type UpdateFields,
  type SingleKeyArrayFieldPrimaryKey,
  type JointKeyArrayFieldPrimaryKey,
  isJointArrayField,
  isIdField,
} from "./types/bulkUpdateFields";

import type {
  LessonRecord,
  SingleKeyArrayFields,
  IdArrayFields,
  JointArrayFields,
  IdAndText,
} from "./types/lessonRecord";

type SingleKeyArrayFieldsUpdate = `${keyof SingleKeyArrayFields}-${number}`;
type IdArrayFieldsUpdate = `${keyof IdArrayFields}-${number}`;
type JointArrayFieldsUpdate = `${keyof JointArrayFields}-${number}`;
type JointArrayFieldsSecondaryUpdate =
  `${keyof JointArrayFields}-${number}-${string}`;

export type UpdateRecord = {
  unit_uid?: string;
  unit_title?: string;
  lesson_uid: string;
  title?: string;
  pupil_lesson_outcome?: string;
  [key: SingleKeyArrayFieldsUpdate]: string | undefined;
  [key: IdArrayFieldsUpdate]: string | undefined;
  [key: JointArrayFieldsUpdate]: string | undefined;
  [key: JointArrayFieldsSecondaryUpdate]: string | undefined;
};

type NonIdArrayFields = keyof SingleKeyArrayFields | keyof JointArrayFields;

type NonIdArrayElement = Record<
  SingleKeyArrayFieldPrimaryKey | JointKeyArrayFieldPrimaryKey,
  string
>;

export const handleNonIdArrayFields = (
  bulkUpdateFields: UpdateFields,
  key: NonIdArrayFields,
  update: UpdateRecord,
  currentField: LessonRecord[NonIdArrayFields]
) => {
  const fieldDetails = bulkUpdateFields[key];
  const arrayUpdate: NonIdArrayElement[] = [];
  const secondaryKey =
    "secondaryElementKey" in fieldDetails
      ? fieldDetails.secondaryElementKey
      : undefined;

  for (let i = 0; i < fieldDetails.size; i++) {
    const updateValue = update[`${key}-${i + 1}` as keyof UpdateRecord];
    const secondaryUpdateValue =
      update[`${key}-${i + 1}-${secondaryKey}` as keyof UpdateRecord];

    if (typeof updateValue !== "string" || updateValue === "") {
      const currentValue = currentField?.[i] as NonIdArrayElement | undefined;

      if (currentValue) {
        if (secondaryKey && secondaryUpdateValue) {
          currentValue[secondaryKey] = secondaryUpdateValue;
          if (secondaryUpdateValue.toLowerCase().trim() === "null") {
            currentValue[secondaryKey] = "";
          }
        }
        arrayUpdate.push(currentValue);
      }
      continue;
    }

    if (updateValue.toLowerCase().trim() === "null") {
      continue;
    }

    const val = {
      [fieldDetails.primaryElementKey]: updateValue,
    } as NonIdArrayElement;

    if (secondaryUpdateValue?.toLowerCase().trim() === "null" && secondaryKey) {
      val[secondaryKey] = "";
    } else if (secondaryKey && secondaryUpdateValue) {
      val[secondaryKey] = secondaryUpdateValue;
    }

    arrayUpdate.push(val);
  }

  return arrayUpdate;
};

export const parseUpdates = (
  updates: UpdateRecord[],
  currentRecords: Map<string, LessonRecord>,
  bulkUpdateFields: UpdateFields,
  conversionMaps: {
    guidanceMap: Map<string, number>;
    tagMap: Map<string, number>;
    tagIdToTextMap: Map<number, string>;
    guidanceIdToTextMap: Map<number, string>;
  }
) => {
  const errorLogger = buildErrorLogger();
  return updates.map((update) => {
    const currentRecord = currentRecords.get(update.lesson_uid);
    if (!currentRecord) {
      throw new Error(`Lesson with uid ${update.lesson_uid} not found`);
    }
    const updateAsRecord: Partial<LessonRecord> = {
      lesson_uid: update.lesson_uid,
      title: currentRecord.title,
      pupil_lesson_outcome: currentRecord.pupil_lesson_outcome,
    };

    let key: keyof UpdateFields;
    for (key in bulkUpdateFields) {
      if (key === "title" || key === "pupil_lesson_outcome") {
        const updateValue = update[key];
        if (typeof updateValue !== "string" || updateValue === "") {
          continue;
        }

        if (updateValue.toLowerCase().trim() === "null") {
          if (key === "title") {
            errorLogger("missingTitle");
          }
          updateAsRecord[key] = "";
          continue;
        }
        updateAsRecord[key] = updateValue;
        continue;
      }

      if (isSingleKeyArrayField(key) || isJointArrayField(key)) {
        const currentField = currentRecord[key] ?? [];
        const arrayUpdate = handleNonIdArrayFields(
          bulkUpdateFields,
          key,
          update,
          currentField
        );
        updateAsRecord[key] = arrayUpdate;
      }

      if (isIdField(key)) {
        const currentField = currentRecord[key] ?? [];
        const fieldDetails = bulkUpdateFields[key];
        const arrayUpdate: IdAndText[] = [];

        for (let i = 0; i < fieldDetails.size; i++) {
          const updateValue = update[`${key}-${i + 1}` as keyof UpdateRecord];
          const currentValue = currentField[i];
          const idToTextMap =
            key === "content_guidance"
              ? conversionMaps.guidanceIdToTextMap
              : conversionMaps.tagIdToTextMap;

          if (typeof updateValue !== "string" || updateValue === "") {
            if (currentValue && typeof currentValue === "number") {
              const text = idToTextMap.get(currentValue);
              if (!text) {
                throw new Error("no text found");
              }
              arrayUpdate.push({ id: currentValue, text });
            }
            continue;
          }

          if (updateValue.toLowerCase().trim() === "null") {
            continue;
          }

          const conversionMap =
            key === "content_guidance"
              ? conversionMaps.guidanceMap
              : conversionMaps.tagMap;

          const val = conversionMap.get(updateValue);
          if (val) {
            arrayUpdate.push({ id: val, text: updateValue });
          }
        }

        updateAsRecord[key] = arrayUpdate;
      }
    }
    return updateAsRecord;
  });
};
