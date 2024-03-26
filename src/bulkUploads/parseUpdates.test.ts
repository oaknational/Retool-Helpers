/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { bulkUpdates, currentRecordsMap } from "./fixtures/bulkUpdates";
import { updateFields } from "./fixtures/updateFields";
import { parseUpdates } from "./parseUpdates";
import { catTagMap, tagIdToTextMap } from "./fixtures/catTagMaps";
import {
  descriptionToId,
  contentGuidanceMap,
} from "./fixtures/contentGuidanceMaps";
import { type UpdateFields, isIdField } from "./types/bulkUpdateFields";
import type { IdAndText, IdArrayFields } from "./types/lessonRecord";

const conversionMaps = {
  guidanceMap: descriptionToId,
  guidanceIdToTextMap: contentGuidanceMap,
  tagMap: catTagMap,
  tagIdToTextMap,
};
describe("parseUpdates", () => {
  test("should parse the updates (with no changes), the parsed update values should match the current values", () => {
    const parsedUpdate = parseUpdates(
      bulkUpdates,
      currentRecordsMap,
      updateFields,
      conversionMaps
    );

    parsedUpdate.forEach((update) => {
      const current = currentRecordsMap.get(update.lesson_uid!);

      Object.entries(update).forEach(([key, value]) => {
        const currentField = current?.[key as keyof IdArrayFields] ?? [];

        if (isIdField(key as keyof UpdateFields)) {
          const actual = (value as IdAndText[]).map(({ id }) => id);

          expect(actual).toEqual((current as any)?.[key] ?? []);
          return;
        }

        expect(value).toEqual(currentField);
      });
    });
  });

  test("should parse the updates, when the field is  missing or empty, the parsed update values should match the current values", () => {
    const parsedUpdate = parseUpdates(
      bulkUpdates.map((update) => ({
        title: update.title,
        lesson_uid: update.lesson_uid,
        unit_title: update.unit_title,
        unit_uid: update.unit_uid,
        pupil_lesson_outcome: "",
        "key_learning_points-2": "",
        "lesson_outline-1": "",
      })),
      currentRecordsMap,
      updateFields,
      conversionMaps
    );

    parsedUpdate.forEach((update) => {
      const current = currentRecordsMap.get(update.lesson_uid!);

      Object.entries(update).forEach(([key, value]) => {
        const currentField = current?.[key as keyof IdArrayFields] ?? [];

        if (isIdField(key as keyof UpdateFields)) {
          const actual = (value as IdAndText[]).map(({ id }) => id);

          expect(actual).toEqual((current as any)?.[key] ?? []);
          return;
        }

        expect(value).toEqual(currentField);
      });
    });
  });

  test("should allow null values to clear the related field", () => {
    const customBulkUpdates = [...bulkUpdates];
    const [one, two, three] = customBulkUpdates;

    one.pupil_lesson_outcome = "null";
    one["key_learning_points-1"] = "null";
    one["misconceptions_and_common_mistakes-1"] = "null";

    two["teacher_tips-1"] = "null";
    two["keywords-1-description"] = "null";

    three["keywords-2"] = "null";

    const [parsedOne, parsedTwo, parsedThree] = parseUpdates(
      customBulkUpdates,
      currentRecordsMap,
      updateFields,
      conversionMaps
    );

    const parsedOneCurren = currentRecordsMap.get(parsedOne.lesson_uid!);
    const oneKlp = [...(parsedOneCurren?.key_learning_points ?? [])];
    const oneMCM = [
      ...(parsedOneCurren?.misconceptions_and_common_mistakes ?? []),
    ];
    oneKlp.splice(0, 1);
    oneMCM.splice(0, 1);

    expect(parsedOne.pupil_lesson_outcome).toBe("");
    expect(parsedOne.key_learning_points).toStrictEqual(oneKlp);
    expect(parsedOne.misconceptions_and_common_mistakes).toStrictEqual(oneMCM);

    const parsedTwoCurren = currentRecordsMap.get(parsedTwo.lesson_uid!);
    const twoTT = [...(parsedTwoCurren?.teacher_tips ?? [])];
    const twoK1 = [...(parsedTwoCurren?.keywords ?? [])];
    twoTT.splice(0, 1);
    twoK1[0].description = "";

    expect(parsedTwo.teacher_tips).toStrictEqual(twoTT);
    expect(parsedTwo.keywords).toStrictEqual(twoK1);

    const parsedThreeCurren = currentRecordsMap.get(parsedThree.lesson_uid!);
    const threeK2 = [...(parsedThreeCurren?.keywords ?? [])];

    threeK2.splice(1, 1);

    expect(parsedThree.keywords).toStrictEqual(threeK2);
  });
});
