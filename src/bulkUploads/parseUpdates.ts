import type {
  IdArrayUpdateFields,
  LessonUpdateFields,
} from "./types/bulkUpdateFields";
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
import type { UnitRecord, UnitStringFields } from "./types/unitRecord";

import { type ErrorLogger, buildErrorLogger } from "./parsingErrors";
import {
  isSingleKeyArrayField,
  isJointArrayField,
  isIdField,
} from "./types/bulkUpdateFields";
import { sanitiseForDb } from "../index";

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
  bulkUpdateFields: LessonUpdateFields,
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
    const initialValue = update[`${key}-${i + 1}` as keyof UpdateRecord];
    const secondaryInitialValue =
      update[`${key}-${i + 1}-${secondaryKey}` as keyof UpdateRecord];

    if (typeof initialValue !== "string" || initialValue === "") {
      const currentValue = currentField?.[i] as NonIdArrayElement | undefined;

      if (currentValue) {
        if (secondaryKey && secondaryInitialValue) {
          const secondaryUpdateValue = sanitiseForDb(secondaryInitialValue);

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

          currentValue[secondaryKey] = secondaryUpdateValue;

          if (secondaryUpdateValue.toLowerCase().trim() === "null") {
            currentValue[secondaryKey] = "";
          }
        }
        arrayUpdate.push(currentValue);
      }
      continue;
    }
    const updateValue = sanitiseForDb(initialValue);

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
      secondaryInitialValue?.toLowerCase().trim() === "null";

    if (secondaryKey) {
      if (secondaryValueIsNull) {
        val[secondaryKey] = "";
      }
      if (secondaryInitialValue && !secondaryValueIsNull) {
        const secondaryUpdateValue = sanitiseForDb(secondaryInitialValue);
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

const isLessonRecord = (
  updateAsRecord: Partial<LessonRecord> | Partial<UnitRecord>
): updateAsRecord is Partial<LessonRecord> => {
  return "lesson_uid" in updateAsRecord;
};

export const checkStringValue = (
  value: string,
  key: string,
  logError: ErrorLogger,
  uid: string,
  updateAsRecord: Partial<LessonRecord> | Partial<UnitRecord>,
  maxLength?: number
) => {
  if (value.toLowerCase().trim() === "null") {
    if (key === "title") {
      logError("missingTitle", uid);
      return false;
    }

    type UnitStringKeys = keyof UnitStringFields;
    type LessonStringKeys = keyof StringFields;

    if (isLessonRecord(updateAsRecord)) {
      updateAsRecord[key as LessonStringKeys] = "";
    } else {
      updateAsRecord[key as UnitStringKeys] = "";
    }
    return false;
  }

  if (maxLength && value.length > maxLength) {
    logError("tooLong", uid, {
      maxLength: maxLength,
      key,
    });
    return false;
  }

  return true;
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
  bulkUpdateFields: LessonUpdateFields,
  logError: ErrorLogger
) => {
  const initialValue = update[key];
  const fieldDetails = bulkUpdateFields[key];

  if (typeof initialValue !== "string" || initialValue === "") {
    return;
  }

  const updateValue = sanitiseForDb(initialValue);

  if (
    checkStringValue(
      updateValue,
      key,
      logError,
      update.lesson_uid,
      updateAsRecord,
      fieldDetails.maxLength
    )
  ) {
    updateAsRecord[key] = updateValue;
    return;
  }
};

const checkIdFields = (
  updateValue: string | undefined,
  currentValue: number | IdAndText,
  idToTextMap: Map<number, string>,
  arrayUpdate: IdAndText[]
): updateValue is string => {
  if (typeof updateValue !== "string" || updateValue === "") {
    if (typeof currentValue === "number") {
      const text = idToTextMap.get(currentValue);
      if (!text) {
        throw new Error("unable to find text for ID");
      }
      arrayUpdate.push({ id: currentValue, text });
      return false;
    }
    return false;
  }

  if (updateValue.toLowerCase().trim() === "null") {
    return false;
  }

  return true;
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
  fieldDetails: IdArrayUpdateFields,
  conversionMaps: ConversionMaps,
  updateAsRecord: Partial<LessonRecord>,
  logError: ErrorLogger
) => {
  const arrayUpdate: IdAndText[] = [];

  for (let i = 0; i < fieldDetails.size; i++) {
    const updateValue = update[`${key}-${i + 1}` as keyof UpdateRecord];
    const currentValue = currentField[i];
    const idToTextMap =
      key === "content_guidance"
        ? conversionMaps.guidanceIdToTextMap
        : conversionMaps.tagIdToTextMap;
    const textToIdMap =
      key === "content_guidance"
        ? conversionMaps.guidanceMap
        : conversionMaps.tagMap;

    const shouldContinue = checkIdFields(
      updateValue,
      currentValue,
      idToTextMap,
      arrayUpdate
    );

    if (!shouldContinue) {
      continue;
    }

    const val = textToIdMap.get(updateValue);
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
  bulkUpdateFields: LessonUpdateFields,
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

      let key: keyof LessonUpdateFields;
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
            bulkUpdateFields[key],
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
