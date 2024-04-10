/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { bulkUpdates, currentRecordsMap } from "./fixtures/bulkUpdates";
import { lessonUpdateFields } from "./fixtures/updateFields";
import { parseUpdates } from "./parseUpdates";
import { catTagMap, tagIdToTextMap } from "./fixtures/catTagMaps";
import {
  descriptionToId,
  contentGuidanceMap,
} from "./fixtures/contentGuidanceMaps";
import { type LessonUpdateFields, isIdField } from "./types/bulkUpdateFields";
import type { IdAndText, IdArrayFields } from "./types/lessonRecord";

const conversionMaps = {
  guidanceMap: descriptionToId,
  guidanceIdToTextMap: contentGuidanceMap,
  tagMap: catTagMap,
  tagIdToTextMap,
};
describe("parseUpdates", () => {
  test("should parse the updates (with no changes), the parsed update values should match the current values", () => {
    const { parsedUpdates } = parseUpdates(
      bulkUpdates,
      currentRecordsMap,
      lessonUpdateFields,
      conversionMaps
    );

    parsedUpdates.forEach((update) => {
      const current = currentRecordsMap.get(update.lesson_uid!);

      Object.entries(update).forEach(([key, value]) => {
        const currentField = current?.[key as keyof IdArrayFields] ?? [];

        if (isIdField(key as keyof LessonUpdateFields)) {
          const actual = (value as IdAndText[]).map(({ id }) => id);

          expect(actual).toEqual((current as any)?.[key] ?? []);
          return;
        }

        expect(value).toEqual(currentField);
      });
    });
  });

  test("should parse the updates, when the field is  missing or empty, the parsed update values should match the current values", () => {
    const { parsedUpdates } = parseUpdates(
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
      lessonUpdateFields,
      conversionMaps
    );

    parsedUpdates.forEach((update) => {
      const current = currentRecordsMap.get(update.lesson_uid!);

      Object.entries(update).forEach(([key, value]) => {
        const currentField = current?.[key as keyof IdArrayFields] ?? [];

        if (isIdField(key as keyof LessonUpdateFields)) {
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

    const { parsedUpdates } = parseUpdates(
      customBulkUpdates,
      currentRecordsMap,
      lessonUpdateFields,
      conversionMaps
    );

    const [parsedOne, parsedTwo, parsedThree] = parsedUpdates;

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

  test("should include the lesson ID in the parsed updates", () => {
    const { parsedUpdates } = parseUpdates(
      bulkUpdates,
      currentRecordsMap,
      lessonUpdateFields,
      conversionMaps
    );

    parsedUpdates.forEach((update) => {
      const current = currentRecordsMap.get(update.lesson_uid!);

      expect(update.lesson_id).toEqual(current?.lesson_id);
    });
  });

  describe("Errors", () => {
    test("should log the error if a field is longer than its max length", () => {
      const customBulkUpdates = [...bulkUpdates];
      const [first] = customBulkUpdates;
      const one = structuredClone(first);

      one.title = "a".repeat(81);
      one.pupil_lesson_outcome = "a".repeat(191);
      one["key_learning_points-1"] = "a".repeat(121);
      one["keywords-1-description"] = "a".repeat(201);
      one["lesson_outline-1"] = "a".repeat(51);
      one["teacher_tips-1"] = "a".repeat(301);
      one["misconceptions_and_common_mistakes-1"] = "a".repeat(251);

      const { errors } = parseUpdates(
        [one],
        currentRecordsMap,
        lessonUpdateFields,
        conversionMaps
      );

      expect(errors).toEqual({
        duplicateUids: new Set(),
        tooLong: new Map([
          ["title", { maxLength: 80, uuids: new Set([one.lesson_uid]) }],
          [
            "pupil_lesson_outcome",
            { maxLength: 190, uuids: new Set([one.lesson_uid]) },
          ],
          [
            "key_learning_points",
            { maxLength: 120, uuids: new Set([one.lesson_uid]) },
          ],
          ["description", { maxLength: 200, uuids: new Set([one.lesson_uid]) }],
          [
            "lesson_outline",
            { maxLength: 50, uuids: new Set([one.lesson_uid]) },
          ],
          [
            "teacher_tips",
            { maxLength: 300, uuids: new Set([one.lesson_uid]) },
          ],
          [
            "misconceptions_and_common_mistakes",
            { maxLength: 200, uuids: new Set([one.lesson_uid]) },
          ],
        ]),
        incorrectGuidance: new Map(),
        incorrectTags: new Map(),
        nonAccessibleUids: new Set(),
        missingTitle: new Set(),
      });
    });

    test("should log the error if multiple records with the same uid are in the update", () => {
      const { errors } = parseUpdates(
        [bulkUpdates[0], bulkUpdates[0], bulkUpdates[2], bulkUpdates[2]],
        currentRecordsMap,
        lessonUpdateFields,
        conversionMaps
      );

      expect(errors).toEqual({
        duplicateUids: new Set([
          bulkUpdates[0].lesson_uid,
          bulkUpdates[2].lesson_uid,
        ]),
        tooLong: new Map(),
        incorrectGuidance: new Map(),
        incorrectTags: new Map(),
        nonAccessibleUids: new Set(),
        missingTitle: new Set(),
      });
    });

    test("should log the error if the lesson_uid is not in the current records", () => {
      const { errors } = parseUpdates(
        [
          { ...bulkUpdates[0], lesson_uid: "not-a-uid" },
          { ...bulkUpdates[1], lesson_uid: "not-a-uid" },
        ],
        currentRecordsMap,
        lessonUpdateFields,
        conversionMaps
      );

      expect(errors).toEqual({
        duplicateUids: new Set(),
        tooLong: new Map(),
        incorrectGuidance: new Map(),
        incorrectTags: new Map(),
        nonAccessibleUids: new Set(["not-a-uid"]),
        missingTitle: new Set(),
      });
    });

    test("should log the error if the title is missing", () => {
      const { errors } = parseUpdates(
        [
          { ...bulkUpdates[0], title: "null" },
          { ...bulkUpdates[1], title: "null" },
        ],
        currentRecordsMap,
        lessonUpdateFields,
        conversionMaps
      );

      expect(errors).toEqual({
        duplicateUids: new Set(),
        tooLong: new Map(),
        incorrectGuidance: new Map(),
        incorrectTags: new Map(),
        nonAccessibleUids: new Set(),
        missingTitle: new Set([
          bulkUpdates[0].lesson_uid,
          bulkUpdates[1].lesson_uid,
        ]),
      });
    });

    test("should log the error if the tag is not in the tag map", () => {
      const { errors } = parseUpdates(
        [
          { ...bulkUpdates[0], "tags-1": "not-a-tag" },
          { ...bulkUpdates[1], "tags-1": "not-a-tag-two" },
        ],
        currentRecordsMap,
        lessonUpdateFields,
        conversionMaps
      );

      expect(errors).toEqual({
        duplicateUids: new Set(),
        tooLong: new Map(),
        incorrectGuidance: new Map(),
        incorrectTags: new Map([
          [bulkUpdates[0].lesson_uid, new Set(["not-a-tag"])],
          [bulkUpdates[1].lesson_uid, new Set(["not-a-tag-two"])],
        ]),
        nonAccessibleUids: new Set(),
        missingTitle: new Set(),
      });
    });

    test("should log the error if the guidance is not in the guidance map", () => {
      const { errors } = parseUpdates(
        [
          { ...bulkUpdates[0], "content_guidance-1": "not-a-guidance" },
          { ...bulkUpdates[1], "content_guidance-1": "not-a-guidance-two" },
        ],
        currentRecordsMap,
        lessonUpdateFields,
        conversionMaps
      );

      expect(errors).toEqual({
        duplicateUids: new Set(),
        tooLong: new Map(),
        incorrectGuidance: new Map([
          [bulkUpdates[0].lesson_uid, new Set(["not-a-guidance"])],
          [bulkUpdates[1].lesson_uid, new Set(["not-a-guidance-two"])],
        ]),
        incorrectTags: new Map(),
        nonAccessibleUids: new Set(),
        missingTitle: new Set(),
      });
    });

    test("should log all errors if they are present", () => {
      const customBulkUpdates = [...bulkUpdates];
      const [first, second, third] = customBulkUpdates;
      const one = structuredClone(first);
      const two = structuredClone(second);
      const three = structuredClone(third);

      one.pupil_lesson_outcome = "a".repeat(191);
      one["teacher_tips-1"] = "a".repeat(301);
      one["tags-1"] = "not-a-tag";
      one["content_guidance-1"] = "not-a-guidance";

      two.lesson_uid = "not-a-uid";

      three.title = "null";

      const { errors } = parseUpdates(
        [one, one, two, three],
        currentRecordsMap,
        lessonUpdateFields,
        conversionMaps
      );

      expect(errors).toEqual({
        duplicateUids: new Set([one.lesson_uid]),
        tooLong: new Map([
          [
            "pupil_lesson_outcome",
            { maxLength: 190, uuids: new Set([one.lesson_uid]) },
          ],
          [
            "teacher_tips",
            { maxLength: 300, uuids: new Set([one.lesson_uid]) },
          ],
        ]),
        incorrectGuidance: new Map([
          [one.lesson_uid, new Set(["not-a-guidance"])],
        ]),
        incorrectTags: new Map([[one.lesson_uid, new Set(["not-a-tag"])]]),
        nonAccessibleUids: new Set([two.lesson_uid]),
        missingTitle: new Set([three.lesson_uid]),
      });
    });
  });
});
