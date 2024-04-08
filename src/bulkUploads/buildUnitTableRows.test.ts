import { readFileSync } from "fs";

import { unitUpdateFields } from "./fixtures/updateFields";
import { tagIdToTextMap } from "./fixtures/catTagMaps";
import type { UnitRecord } from "./types/unitRecord";
import {
  buildUnitTableRows,
  handleUnitHeaderRow,
  handleUnitIdField,
} from "./buildUnitTableRows";
import { natCurricMap } from "./fixtures/curricMap";

describe("bulkUploads (unit)", () => {
  const units = JSON.parse(
    readFileSync("src/bulkUploads/fixtures/units.json", "utf-8")
  ) as UnitRecord[];
  let row: (string | number)[];

  beforeEach(() => {
    row = [];
  });

  describe("handleUnitIdField", () => {
    test("should return an array with a length equal to the size of the updateField", () => {
      handleUnitIdField(
        units[0],
        "exam_board_specification_content",
        row,
        unitUpdateFields,
        natCurricMap,
        new Map(),
        tagIdToTextMap
      );
      expect(row.length).toEqual(
        unitUpdateFields.exam_board_specification_content.size
      );

      row = [];
      handleUnitIdField(
        units[1],
        "national_curriculum_content",
        row,
        unitUpdateFields,
        natCurricMap,
        new Map(),
        tagIdToTextMap
      );
      expect(row.length).toEqual(
        unitUpdateFields.national_curriculum_content.size
      );

      row = [];
      handleUnitIdField(
        units[0],
        "tags",
        row,
        unitUpdateFields,
        natCurricMap,
        new Map(),
        tagIdToTextMap
      );
      expect(row.length).toEqual(unitUpdateFields.tags.size);
    });

    test("should return an array with values equal to the equivalent key in the lesson record", () => {
      handleUnitIdField(
        units[2],
        "tags",
        row,
        unitUpdateFields,
        natCurricMap,
        new Map(),
        tagIdToTextMap
      );
      units[2].tags?.forEach((id, i) => {
        expect(row[i]).toBe(tagIdToTextMap.get(id));
      });
    });
  });

  describe("handleHeaderRow", () => {
    test("should return an array with the correct headers", () => {
      const values: string[][] = [];
      handleUnitHeaderRow(values, unitUpdateFields);

      expect(values[0]).toEqual([
        "unit_uid",
        "title",
        "planned_number_of_lessons",
        "description",
        "why_this_why_now",
        "prior_knowledge_requirements-1",
        "prior_knowledge_requirements-2",
        "prior_knowledge_requirements-3",
        "prior_knowledge_requirements-4",
        "prior_knowledge_requirements-5",
        "prior_knowledge_requirements-6",
        "prior_knowledge_requirements-7",
        "prior_knowledge_requirements-8",
        "prior_knowledge_requirements-9",
        "prior_knowledge_requirements-10",
        "national_curriculum_content-1",
        "national_curriculum_content-2",
        "national_curriculum_content-3",
        "national_curriculum_content-4",
        "national_curriculum_content-5",
        "national_curriculum_content-6",
        "national_curriculum_content-7",
        "national_curriculum_content-8",
        "national_curriculum_content-9",
        "national_curriculum_content-10",
        "exam_board_specification_content-1",
        "exam_board_specification_content-2",
        "exam_board_specification_content-3",
        "exam_board_specification_content-4",
        "exam_board_specification_content-5",
        "exam_board_specification_content-6",
        "exam_board_specification_content-7",
        "exam_board_specification_content-8",
        "exam_board_specification_content-9",
        "exam_board_specification_content-10",
        "exam_board_specification_content-11",
        "exam_board_specification_content-12",
        "exam_board_specification_content-13",
        "exam_board_specification_content-14",
        "exam_board_specification_content-15",
        "exam_board_specification_content-16",
        "exam_board_specification_content-17",
        "exam_board_specification_content-18",
        "exam_board_specification_content-19",
        "exam_board_specification_content-20",
        "tags-1",
        "tags-2",
        "tags-3",
        "tags-4",
        "tags-5",
      ]);
    });
  });

  describe("buildTableRows", () => {
    test("should return an array with the correct values", () => {
      const tableRows = buildUnitTableRows(
        units,
        unitUpdateFields,
        natCurricMap,
        new Map(),
        tagIdToTextMap
      );

      const expected = readFileSync(
        "src/bulkUploads/fixtures/expectedUnitResult.tsv",
        "utf-8"
      );

      expect(tableRows.map((row) => row.join("\t")).join("\n")).toEqual(
        expected
      );
    });
  });
});
