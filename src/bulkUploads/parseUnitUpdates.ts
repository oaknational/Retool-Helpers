import {
  isUnitIdField,
  isUnitStringArrayField,
  isUnitStringField,
  type UnitUpdateFields,
} from "./types/unitBulkUpdateFields";
import type { UnitIdFields, UnitRecord } from "./types/unitRecord";
import type { IdAndText } from "./types/lessonRecord";
import type { UnitUpdateRecord } from "./types/unitParsingTypes";

import { buildUnitErrorLogger } from "./parsingUnitErrors";
import { checkStringValue } from "./parseUpdates";

type ConversionMaps = {
  natCurricMap: Map<string, number>;
  natCurricIdToTextMap: Map<number, string>;
  EBSMap: Map<string, number>;
  EBSIdToTextMap: Map<number, string>;
  tagMap: Map<string, number>;
  tagIdToTextMap: Map<number, string>;
};

const chooseMaps = (
  conversionMaps: ConversionMaps,
  key: keyof UnitIdFields
): { idToText: Map<number, string>; textToId: Map<string, number> } => {
  if (key === "exam_board_specification_content") {
    return {
      idToText: conversionMaps.EBSIdToTextMap,
      textToId: conversionMaps.EBSMap,
    };
  }

  if (key === "national_curriculum_content") {
    return {
      idToText: conversionMaps.natCurricIdToTextMap,
      textToId: conversionMaps.natCurricMap,
    };
  }

  return {
    idToText: conversionMaps.tagIdToTextMap,
    textToId: conversionMaps.tagMap,
  };
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

export const parseUnitUpdates = (
  updates: UnitUpdateRecord[],
  currentRecords: Map<string, UnitRecord>,
  bulkUpdateFields: UnitUpdateFields,
  conversionMaps: ConversionMaps
) => {
  const { logError, checkUid, hasError, getErrors } = buildUnitErrorLogger();

  const parsedUpdates = updates
    .map((update) => {
      const currentRecord = currentRecords.get(update.unit_uid);
      if (!currentRecord) {
        logError("nonAccessibleUids", update.unit_uid);
        return;
      }

      checkUid(update.unit_uid);
      const updateAsRecord: Partial<UnitRecord> = {
        unit_id: currentRecord.unit_id,
        unit_uid: update.unit_uid,
        title: currentRecord.title,
        planned_number_of_lessons: currentRecord.planned_number_of_lessons,
      };

      if (currentRecord.description) {
        updateAsRecord.description = currentRecord.description;
      }

      if (currentRecord.why_this_why_now) {
        updateAsRecord.why_this_why_now = currentRecord.why_this_why_now;
      }

      let key: keyof UnitUpdateFields;
      for (key in bulkUpdateFields) {
        if (key === "planned_number_of_lessons") {
          const updateValue = update[key];
          if (typeof updateValue !== "string" || updateValue === "") {
            continue;
          }

          if (updateValue.toLowerCase().trim() === "null") {
            logError("invalidPlannedNumber", update.unit_uid);
            continue;
          }

          const num = Number(updateValue);

          if (isNaN(num)) {
            logError("invalidPlannedNumber", update.unit_uid);
            continue;
          }

          updateAsRecord[key] = num;
        }

        if (isUnitStringField(key)) {
          const fieldDetails = bulkUpdateFields[key];
          const updateValue = update[key];

          if (typeof updateValue !== "string" || updateValue === "") {
            continue;
          }

          if (
            checkStringValue(
              updateValue,
              key,
              logError,
              update.unit_uid,
              updateAsRecord,
              fieldDetails.maxLength
            )
          ) {
            updateAsRecord[key] = updateValue;
          }
          continue;
        }

        if (isUnitStringArrayField(key)) {
          const currentField = currentRecord[key] ?? [];
          const fieldDetails = bulkUpdateFields[key];
          const updateCollection: string[] = [];

          for (let i = 0; i < fieldDetails.size; i++) {
            const updateValue = update[`${key}-${i + 1}`];
            const currentValue = currentField[i];

            if (typeof updateValue !== "string" || updateValue === "") {
              if (currentValue) {
                updateCollection.push(currentValue);
              }
              continue;
            }

            if (updateValue.toLowerCase().trim() === "null") {
              continue;
            }
            if (updateValue.length > fieldDetails.maxLength) {
              logError("tooLong", update.unit_uid, {
                maxLength: fieldDetails.maxLength,
                key,
              });
              continue;
            }

            updateCollection.push(updateValue);
          }

          updateAsRecord[key] = updateCollection;
        }

        if (isUnitIdField(key)) {
          const currentField = currentRecord[key] ?? [];
          const fieldDetails = bulkUpdateFields[key];
          const updateCollection: IdAndText[] = [];
          const { idToText, textToId } = chooseMaps(conversionMaps, key);
          for (let i = 0; i < fieldDetails.size; i++) {
            const updateValue = update[`${key}-${i + 1}`];
            const currentValue = currentField[i];

            if (typeof updateValue !== "string" || updateValue === "") {
              if (typeof currentValue === "number") {
                const text = idToText.get(currentValue);

                if (!text) {
                  continue;
                }

                updateCollection.push({ id: currentValue, text });
              }
              continue;
            }

            if (updateValue.toLowerCase().trim() === "null") {
              continue;
            }

            const val = textToId.get(updateValue);

            if (val) {
              updateCollection.push({ id: val, text: updateValue });

              continue;
            } else {
              let errorKey;

              if (key === "national_curriculum_content") {
                errorKey = "incorrectNationalCurriculumContent" as const;
              } else if (key === "exam_board_specification_content") {
                errorKey = "incorrectExamBoardSpecificationContent" as const;
              } else {
                errorKey = "incorrectTags" as const;
              }

              logError(errorKey, update.unit_uid, {
                value: updateValue,
              });
            }
          }
          updateAsRecord[key] = updateCollection;
        }
      }

      return updateAsRecord;
    })
    .filter((update) => update !== undefined) as Partial<UnitRecord>[];

  return {
    hasError: hasError(),
    errors: getErrors(),
    parsedUpdates,
  };
};
