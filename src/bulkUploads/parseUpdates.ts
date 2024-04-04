import type { UpdateFields } from "./types/bulkUpdateFields";
import type {
  LessonRecord,
  IdAndText,
  StringFields,
  IdArrayFields,
} from "./types/lessonRecord";
import type {
  NonIdArrayElement,
  NonIdArrayFields,
  UpdateRecord,
  ConversionMaps,
} from "./types/parsingTypes";

import { type ErrorLogger, buildErrorLogger } from "./parsingErrors";
import {
  isSingleKeyArrayField,
  isJointArrayField,
  isIdField,
} from "./types/bulkUpdateFields";

/**
 * Handles the non-id array fields, such as teacher_tips, key_learning_points, etc.
 *
 * @param bulkUpdateFields The store of metadata related to each field
 * @param key The key of the field to update
 * @param update The update row to condense data from
 * @param currentField The current field data to compare against
 * @param logError The error logger to log errors to
 * @returns
 */
export const handleNonIdArrayFields = (
  bulkUpdateFields: UpdateFields,
  key: NonIdArrayFields,
  update: UpdateRecord,
  currentField: LessonRecord[NonIdArrayFields],
  logError: ErrorLogger
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

    if (updateValue.length > fieldDetails.maxLength) {
      logError("tooLong", update.lesson_uid, {
        maxLength: fieldDetails.maxLength,
        key,
      });
      continue;
    }

    const val = {
      [fieldDetails.primaryElementKey]: updateValue,
    } as NonIdArrayElement;

    const secondaryValueIsNull =
      secondaryUpdateValue?.toLowerCase().trim() === "null";

    if (secondaryKey) {
      if (secondaryValueIsNull) {
        val[secondaryKey] = "";
      }
      if (secondaryUpdateValue && !secondaryValueIsNull) {
        if (
          "maxLengthSecondary" in fieldDetails &&
          secondaryUpdateValue.length > fieldDetails.maxLengthSecondary
        ) {
          logError("tooLong", update.lesson_uid, {
            maxLength: fieldDetails.maxLengthSecondary,
            key: fieldDetails.secondaryElementKey,
          });
          continue;
        }
        val[secondaryKey] = secondaryUpdateValue;
      }
    }

    arrayUpdate.push(val);
  }

  return arrayUpdate;
};

/**
 * Handles the string fields, such as title and pupil_lesson_outcome.
 *
 * @param update The update row to condense data from
 * @param key The key of the field to update
 * @param updateAsRecord The record to update
 * @param bulkUpdateFields The store of metadata related to each field
 * @param logError The error logger to log errors to
 * @returns
 */
export const handleStringFields = (
  update: UpdateRecord,
  key: keyof StringFields,
  updateAsRecord: Partial<LessonRecord>,
  bulkUpdateFields: UpdateFields,
  logError: ErrorLogger
) => {
  const updateValue = update[key];
  const fieldDetails = bulkUpdateFields[key];

  if (typeof updateValue !== "string" || updateValue === "") {
    return;
  }

  if (updateValue.toLowerCase().trim() === "null") {
    if (key === "title") {
      logError("missingTitle", update.lesson_uid);
      return;
    }
    updateAsRecord[key] = "";
    return;
  }

  if (fieldDetails.maxLength && updateValue.length > fieldDetails.maxLength) {
    logError("tooLong", update.lesson_uid, {
      maxLength: fieldDetails.maxLength,
      key,
    });
    return;
  }

  updateAsRecord[key] = updateValue;
  return;
};

/**
 * Handles the ID fields, such as content_guidance and tags.
 *
 * @param update The update row to condense data from
 * @param key The key of the field to update
 * @param currentField The current field data to compare against
 * @param bulkUpdateFields The store of metadata related to each field
 * @param conversionMaps The maps to convert IDs to text
 * @param updateAsRecord The record to update
 * @param logError The error logger to log errors to
 */
const handleIdFields = (
  update: UpdateRecord,
  key: keyof IdArrayFields,
  currentField: IdAndText[] | number[],
  bulkUpdateFields: UpdateFields,
  conversionMaps: ConversionMaps,
  updateAsRecord: Partial<LessonRecord>,
  logError: ErrorLogger
) => {
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
      if (typeof currentValue === "number") {
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
    } else {
      const errorKey =
        key === "content_guidance" ? "incorrectGuidance" : "incorrectTags";
      logError(errorKey, update.lesson_uid, { value: updateValue });
    }
  }

  updateAsRecord[key] = arrayUpdate;
};

/**
 * Parses the updates from the CSV file, converting them into a format that can be used to update the database.
 *
 * @param updates The updates to parse
 * @param currentRecords The current records to compare against
 * @param bulkUpdateFields The store of metadata related to each field
 * @param conversionMaps The maps to convert IDs to text
 * @returns The errors and parsed updates
 */

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
  const { logError, checkUid, hasError, getErrors } = buildErrorLogger();
  const parsedUpdates = updates
    .map((update) => {
      const currentRecord = currentRecords.get(update.lesson_uid);
      if (!currentRecord) {
        logError("nonAccessibleUids", update.lesson_uid);
        return;
      }

      checkUid(update.lesson_uid);
      const updateAsRecord: Partial<LessonRecord> = {
        lesson_uid: update.lesson_uid,
        title: currentRecord.title,
        pupil_lesson_outcome: currentRecord.pupil_lesson_outcome,
        lesson_id: currentRecord.lesson_id,
      };

      let key: keyof UpdateFields;
      for (key in bulkUpdateFields) {
        if (key === "title" || key === "pupil_lesson_outcome") {
          handleStringFields(
            update,
            key,
            updateAsRecord,
            bulkUpdateFields,
            logError
          );
        }

        if (isSingleKeyArrayField(key) || isJointArrayField(key)) {
          const currentField = currentRecord[key] ?? [];
          const arrayUpdate = handleNonIdArrayFields(
            bulkUpdateFields,
            key,
            update,
            currentField,
            logError
          );
          updateAsRecord[key] = arrayUpdate;
        }

        if (isIdField(key)) {
          const currentField = currentRecord[key] ?? [];
          handleIdFields(
            update,
            key,
            currentField,
            bulkUpdateFields,
            conversionMaps,
            updateAsRecord,
            logError
          );
        }
      }
      return updateAsRecord;
    })
    .filter((update) => update !== undefined) as Partial<LessonRecord>[];

  return {
    hasError: hasError(),
    errors: getErrors(),
    parsedUpdates,
  };
};
