import type { LessonRecord } from "./types/lessonRecord";

import { readFileSync } from "fs";

import {
  handleSingleKeyArrayField,
  handleJointKeyArrayField,
  handleIdField,
  handleHeaderRow,
  buildTableRows,
} from "./buildTableRows";
import { lessonUpdateFields } from "./fixtures/updateFields";
import { contentGuidanceIdToText } from "./fixtures/contentGuidanceMaps";
import { tagIdToTextMap } from "./fixtures/catTagMaps";

describe("bulkUploads", () => {
  const lessons = JSON.parse(
    readFileSync("src/bulkUploads/fixtures/lessons.json", "utf-8")
  ) as LessonRecord[];
  let row: string[];

  beforeEach(() => {
    row = [];
  });

  describe("handleSingleKeyArrayField", () => {
    test("should return an array with a length equal to the size of the updateField", () => {
      handleSingleKeyArrayField(
        lessons[0],
        "key_learning_points",
        row,
        lessonUpdateFields
      );
      expect(row.length).toEqual(lessonUpdateFields.key_learning_points.size);

      row = [];
      handleSingleKeyArrayField(
        lessons[1],
        "key_learning_points",
        row,
        lessonUpdateFields
      );
      expect(row.length).toEqual(lessonUpdateFields.key_learning_points.size);

      row = [];
      handleSingleKeyArrayField(
        lessons[0],
        "lesson_outline",
        row,
        lessonUpdateFields
      );
      expect(row.length).toEqual(lessonUpdateFields.lesson_outline.size);

      row = [];
      handleSingleKeyArrayField(
        lessons[2],
        "lesson_outline",
        row,
        lessonUpdateFields
      );
      expect(row.length).toEqual(lessonUpdateFields.lesson_outline.size);
    });

    test("should return an array with values equal to the equivalent key in the lesson record", () => {
      handleSingleKeyArrayField(
        lessons[0],
        "equipment_and_resources",
        row,
        lessonUpdateFields
      );

      lessons[0].equipment_and_resources?.forEach(({ equipment }, i) => {
        expect(row[i]).toEqual(equipment);
      });

      row = [];
      handleSingleKeyArrayField(
        lessons[2],
        "key_learning_points",
        row,
        lessonUpdateFields
      );
      lessons[2].key_learning_points?.forEach(({ key_learning_point }, i) => {
        expect(row[i]).toBe(key_learning_point);
      });
    });
  });

  describe("handleJointKeyArrayField", () => {
    test("should return an array with a length equal to the size of the updateField", () => {
      handleJointKeyArrayField(lessons[0], "keywords", row, lessonUpdateFields);
      expect(row.length).toEqual(lessonUpdateFields.keywords.size * 2);

      row = [];
      handleJointKeyArrayField(lessons[1], "keywords", row, lessonUpdateFields);
      expect(row.length).toEqual(lessonUpdateFields.keywords.size * 2);

      row = [];
      handleJointKeyArrayField(
        lessons[0],
        "misconceptions_and_common_mistakes",
        row,
        lessonUpdateFields
      );
      expect(row.length).toEqual(
        lessonUpdateFields.misconceptions_and_common_mistakes.size * 2
      );

      row = [];
      handleJointKeyArrayField(
        lessons[2],
        "misconceptions_and_common_mistakes",
        row,
        lessonUpdateFields
      );
      expect(row.length).toEqual(
        lessonUpdateFields.misconceptions_and_common_mistakes.size * 2
      );
    });

    test("should return an array with values equal to the equivalent key in the lesson record", () => {
      handleJointKeyArrayField(lessons[0], "keywords", row, lessonUpdateFields);
      lessons[0].keywords?.forEach(({ keyword, description }, i) => {
        const index = i * 2;
        expect(row[index]).toBe(keyword);
        expect(row[index + 1]).toBe(description);
      });

      row = [];
      handleJointKeyArrayField(
        lessons[2],
        "misconceptions_and_common_mistakes",
        row,
        lessonUpdateFields
      );
      lessons[2].misconceptions_and_common_mistakes?.forEach(
        ({ misconception, response }, i) => {
          const index = i * 2;
          expect(row[index]).toBe(misconception);
          expect(row[index + 1]).toBe(response);
        }
      );
    });
  });

  describe("handleIdField", () => {
    test("should return an array with a length equal to the size of the updateField", () => {
      handleIdField(
        lessons[0],
        "content_guidance",
        row,
        lessonUpdateFields,
        tagIdToTextMap,
        contentGuidanceIdToText
      );
      expect(row.length).toEqual(lessonUpdateFields.content_guidance.size);

      row = [];
      handleIdField(
        lessons[1],
        "content_guidance",
        row,
        lessonUpdateFields,
        tagIdToTextMap,
        contentGuidanceIdToText
      );
      expect(row.length).toEqual(lessonUpdateFields.content_guidance.size);

      row = [];
      handleIdField(
        lessons[0],
        "content_guidance",
        row,
        lessonUpdateFields,
        tagIdToTextMap,
        contentGuidanceIdToText
      );
      expect(row.length).toEqual(lessonUpdateFields.content_guidance.size);

      row = [];
      handleIdField(
        lessons[2],
        "content_guidance",
        row,
        lessonUpdateFields,
        tagIdToTextMap,
        contentGuidanceIdToText
      );
      expect(row.length).toEqual(lessonUpdateFields.content_guidance.size);
    });

    test("should return an array with values equal to the equivalent key in the lesson record", () => {
      handleIdField(
        lessons[0],
        "content_guidance",
        row,
        lessonUpdateFields,
        tagIdToTextMap,
        contentGuidanceIdToText
      );

      lessons[0].content_guidance?.forEach((id, i) => {
        expect(row[i]).toBe(contentGuidanceIdToText.get(id as number));
      });

      row = [];
      handleIdField(
        lessons[2],
        "tags",
        row,
        lessonUpdateFields,
        tagIdToTextMap,
        contentGuidanceIdToText
      );
      lessons[2].tags?.forEach((id, i) => {
        expect(row[i]).toBe(tagIdToTextMap.get(id as number));
      });
    });
  });

  describe("handleHeaderRow", () => {
    test("should return an array with the correct headers", () => {
      const values: string[][] = [];
      handleHeaderRow(values, lessonUpdateFields);

      expect(values[0]).toEqual([
        "unit_uid",
        "unit_title",
        "lesson_uid",
        "title",
        "pupil_lesson_outcome",
        "key_learning_points-1",
        "key_learning_points-2",
        "key_learning_points-3",
        "key_learning_points-4",
        "key_learning_points-5",
        "keywords-1",
        "keywords-1-description",
        "keywords-2",
        "keywords-2-description",
        "keywords-3",
        "keywords-3-description",
        "keywords-4",
        "keywords-4-description",
        "keywords-5",
        "keywords-5-description",
        "lesson_outline-1",
        "lesson_outline-2",
        "lesson_outline-3",
        "lesson_outline-4",
        "content_guidance-1",
        "content_guidance-2",
        "content_guidance-3",
        "content_guidance-4",
        "content_guidance-5",
        "tags-1",
        "tags-2",
        "tags-3",
        "tags-4",
        "tags-5",
        "misconceptions_and_common_mistakes-1",
        "misconceptions_and_common_mistakes-1-response",
        "teacher_tips-1",
        "equipment_and_resources-1",
      ]);
    });
  });

  describe("buildTableRows", () => {
    test("should return an array with the correct values", () => {
      const tableRows = buildTableRows(
        lessons,
        lessonUpdateFields,
        tagIdToTextMap,
        contentGuidanceIdToText
      );

      const expected = readFileSync(
        "src/bulkUploads/fixtures/expectedTableRows.tsv",
        "utf-8"
      );
      const expectedRows = expected.split("\n").map((row) => row.split("\t"));

      expect(tableRows).toEqual(expectedRows);
    });
  });
});
