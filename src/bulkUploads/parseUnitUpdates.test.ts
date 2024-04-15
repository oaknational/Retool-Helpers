/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { parseUnitUpdates } from "./parseUnitUpdates";
import { tagIdToTextMap, tagTextToIdMap } from "./fixtures/catTagMaps";
import {
  natCurricIdToTextMap,
  natCurricTextToIdMap,
} from "./fixtures/curricMap";
import { unitBulkUpdates } from "./fixtures/unitBulkUpdates";
import { currentUnits } from "./fixtures/currentUnits";
import { unitUpdateFields } from "./fixtures/updateFields";
import type { IdAndText } from "./types/lessonRecord";

describe("parseUnitUpdates", () => {
  test("parsed updates should match current values if no changes present", () => {
    const result = parseUnitUpdates(
      unitBulkUpdates,
      currentUnits,
      unitUpdateFields,
      {
        tagIdToTextMap,
        tagMap: tagTextToIdMap,
        natCurricIdToTextMap: natCurricIdToTextMap,
        natCurricMap: natCurricTextToIdMap,
        EBSIdToTextMap: new Map(),
        EBSMap: new Map(),
      }
    );

    expect(result.hasError).toBe(false);

    result.parsedUpdates.forEach((update) => {
      const current = currentUnits.get(update.unit_uid!);
      expect(current?.title).toBe(update.title);
      expect(current?.planned_number_of_lessons).toBe(
        update.planned_number_of_lessons
      );
      expect(current?.prior_knowledge_requirements).toStrictEqual(
        update.prior_knowledge_requirements
      );
      expect(current?.national_curriculum_content).toStrictEqual(
        update.national_curriculum_content?.map(
          (idAndText) => (idAndText as IdAndText).id
        )
      );

      expect(current?.exam_board_specification_content ?? []).toStrictEqual(
        update.exam_board_specification_content?.map(
          (idAndText) => (idAndText as IdAndText).id
        )
      );

      expect(current?.tags ?? []).toStrictEqual(
        update.tags?.map((idAndText) => (idAndText as IdAndText).id)
      );
    });
  });
  test("should not change anything if the fields are missing in the update", () => {
    const updates = structuredClone(unitBulkUpdates);
    for (const update of updates) {
      delete update.planned_number_of_lessons;
      delete update["prior_knowledge_requirements-1"];
      delete update["prior_knowledge_requirements-2"];
      delete update["prior_knowledge_requirements-3"];
      delete update["national_curriculum_content-1"];
      delete update["national_curriculum_content-2"];
      delete update["national_curriculum_content-3"];
      delete update["national_curriculum_content-4"];

      delete update["tags-1"];
    }
    const result = parseUnitUpdates(updates, currentUnits, unitUpdateFields, {
      tagIdToTextMap,
      tagMap: tagTextToIdMap,
      natCurricIdToTextMap: natCurricIdToTextMap,
      natCurricMap: natCurricTextToIdMap,
      EBSIdToTextMap: new Map(),
      EBSMap: new Map(),
    });

    expect(result.hasError).toBe(false);

    result.parsedUpdates.forEach((update) => {
      const current = currentUnits.get(update.unit_uid!);
      expect(current?.title).toBe(update.title);
      expect(current?.planned_number_of_lessons).toBe(
        update.planned_number_of_lessons
      );
      expect(current?.prior_knowledge_requirements).toStrictEqual(
        update.prior_knowledge_requirements
      );
      expect(current?.national_curriculum_content).toStrictEqual(
        update.national_curriculum_content?.map(
          (idAndText) => (idAndText as IdAndText).id
        )
      );

      expect(current?.exam_board_specification_content ?? []).toStrictEqual(
        update.exam_board_specification_content?.map(
          (idAndText) => (idAndText as IdAndText).id
        )
      );

      expect(current?.tags ?? []).toStrictEqual(
        update.tags?.map((idAndText) => (idAndText as IdAndText).id)
      );
    });
  });

  test("should not change anything if the fields are empty", () => {
    const updates = structuredClone(unitBulkUpdates);
    for (const update of updates) {
      update.planned_number_of_lessons = "";
      update["prior_knowledge_requirements-1"] = "";
      update["prior_knowledge_requirements-2"] = "";
      update["prior_knowledge_requirements-3"] = "";
      update["national_curriculum_content-1"] = "";
      update["national_curriculum_content-2"] = "";
      update["national_curriculum_content-3"] = "";
      update["national_curriculum_content-4"] = "";

      update["tags-1"] = "";
    }
    const result = parseUnitUpdates(updates, currentUnits, unitUpdateFields, {
      tagIdToTextMap,
      tagMap: tagTextToIdMap,
      natCurricIdToTextMap: natCurricIdToTextMap,
      natCurricMap: natCurricTextToIdMap,
      EBSIdToTextMap: new Map(),
      EBSMap: new Map(),
    });

    expect(result.hasError).toBe(false);

    result.parsedUpdates.forEach((update) => {
      const current = currentUnits.get(update.unit_uid!);
      expect(current?.title).toBe(update.title);
      expect(current?.planned_number_of_lessons).toBe(
        update.planned_number_of_lessons
      );
      expect(current?.prior_knowledge_requirements).toStrictEqual(
        update.prior_knowledge_requirements
      );
      expect(current?.national_curriculum_content).toStrictEqual(
        update.national_curriculum_content?.map(
          (idAndText) => (idAndText as IdAndText).id
        )
      );

      expect(current?.exam_board_specification_content ?? []).toStrictEqual(
        update.exam_board_specification_content?.map(
          (idAndText) => (idAndText as IdAndText).id
        )
      );

      expect(current?.tags ?? []).toStrictEqual(
        update.tags?.map((idAndText) => (idAndText as IdAndText).id)
      );
    });
  });

  test("should clear a field if null is present", () => {
    const updates = structuredClone(unitBulkUpdates);
    for (const update of updates) {
      update["prior_knowledge_requirements-1"] = "null";
      update["prior_knowledge_requirements-2"] = "Null";
      update["prior_knowledge_requirements-3"] = "NULL";
      update["national_curriculum_content-1"] = "   NULL   ";
      update["national_curriculum_content-2"] = "NULL";
      update["national_curriculum_content-3"] = "  null  ";
      update["national_curriculum_content-4"] = "null  ";

      update["tags-1"] = "";
    }
    const result = parseUnitUpdates(updates, currentUnits, unitUpdateFields, {
      tagIdToTextMap,
      tagMap: tagTextToIdMap,
      natCurricIdToTextMap: natCurricIdToTextMap,
      natCurricMap: natCurricTextToIdMap,
      EBSIdToTextMap: new Map(),
      EBSMap: new Map(),
    });

    expect(result.hasError).toBe(false);

    result.parsedUpdates.forEach((parsedUpdate) => {
      const current = currentUnits.get(parsedUpdate.unit_uid!);
      expect(current?.title).toBe(parsedUpdate.title);
      expect(current?.planned_number_of_lessons).toBe(
        parsedUpdate.planned_number_of_lessons
      );
      const [_, _a, _b, ...expectedPKR] =
        current?.prior_knowledge_requirements ?? [];
      expect(parsedUpdate.prior_knowledge_requirements).toStrictEqual(
        expectedPKR
      );

      const [_c, _d, _e, _f, ...expectedNCC] =
        current?.national_curriculum_content ?? [];

      expect(
        parsedUpdate.national_curriculum_content?.map(
          (idAndText) => (idAndText as IdAndText).id
        )
      ).toStrictEqual(expectedNCC);

      expect(current?.exam_board_specification_content ?? []).toStrictEqual(
        parsedUpdate.exam_board_specification_content?.map(
          (idAndText) => (idAndText as IdAndText).id
        )
      );

      expect(current?.tags ?? []).toStrictEqual(
        parsedUpdate.tags?.map((idAndText) => (idAndText as IdAndText).id)
      );
    });
  });

  test("should update a field if an update is given", () => {
    const updates = structuredClone(unitBulkUpdates);
    updates.forEach((update, i) => {
      update.title = `test-title-${i}`;
      update["prior_knowledge_requirements-1"] = "test-req-1";
      update["prior_knowledge_requirements-2"] = "test-req-2";
      update["prior_knowledge_requirements-3"] = "test-req-3";
      update["national_curriculum_content-1"] =
        "Read increasingly challenging Shakespeare independently";
      update["national_curriculum_content-2"] =
        "Read increasingly challenging Shakespeare independently";
      update["national_curriculum_content-3"] =
        "Read increasingly challenging Shakespeare independently";
      update["national_curriculum_content-4"] =
        "Read increasingly challenging Shakespeare independently";
    });
    const result = parseUnitUpdates(updates, currentUnits, unitUpdateFields, {
      tagIdToTextMap,
      tagMap: tagTextToIdMap,
      natCurricIdToTextMap: natCurricIdToTextMap,
      natCurricMap: natCurricTextToIdMap,
      EBSIdToTextMap: new Map(),
      EBSMap: new Map(),
    });

    expect(result.hasError).toBe(false);

    result.parsedUpdates.forEach((parsedUpdate, i) => {
      const current = currentUnits.get(parsedUpdate.unit_uid!);
      expect(parsedUpdate.title).toBe(`test-title-${i}`);
      expect(current?.planned_number_of_lessons).toBe(
        parsedUpdate.planned_number_of_lessons
      );
      const [_, _a, _b, ...expectedPKR] =
        current?.prior_knowledge_requirements ?? [];

      expect(parsedUpdate.prior_knowledge_requirements).toStrictEqual([
        "test-req-1",
        "test-req-2",
        "test-req-3",
        ...expectedPKR,
      ]);

      const [_c, _d, _e, _f, ...expectedNCC] =
        current?.national_curriculum_content ?? [];

      expect(
        parsedUpdate.national_curriculum_content?.map(
          (idAndText) => (idAndText as IdAndText).id
        )
      ).toStrictEqual([1469, 1469, 1469, 1469, ...expectedNCC]);

      expect(current?.exam_board_specification_content ?? []).toStrictEqual(
        parsedUpdate.exam_board_specification_content?.map(
          (idAndText) => (idAndText as IdAndText).id
        )
      );

      expect(current?.tags ?? []).toStrictEqual(
        parsedUpdate.tags?.map((idAndText) => (idAndText as IdAndText).id)
      );
    });
  });

  describe("Errors", () => {
    test("should catch fields that are too long", () => {
      const update = structuredClone(unitBulkUpdates[0]);

      update.title = "a".repeat(81);
      update.description = "a".repeat(301);
      update.why_this_why_now = "a".repeat(601);
      update["prior_knowledge_requirements-1"] = "a".repeat(191);

      const result = parseUnitUpdates(
        [update],
        currentUnits,
        unitUpdateFields,
        {
          tagIdToTextMap,
          tagMap: tagTextToIdMap,
          natCurricIdToTextMap: natCurricIdToTextMap,
          natCurricMap: natCurricTextToIdMap,
          EBSIdToTextMap: new Map(),
          EBSMap: new Map(),
        }
      );

      expect(result.hasError).toBe(true);
      const tooLongFields = new Set([
        "title",
        "description",
        "why_this_why_now",
        "prior_knowledge_requirements",
      ]);

      result.errors.tooLong.forEach((err, key) => {
        tooLongFields.delete(key);
        expect(err.uuids).toContain(update.unit_uid);
      });

      expect(tooLongFields.size).toBe(0);
    });
    test("should catch duplicate records", () => {
      const [one, two] = structuredClone(unitBulkUpdates);
      two.unit_uid = one.unit_uid;

      const result = parseUnitUpdates(
        [one, two],
        currentUnits,
        unitUpdateFields,
        {
          tagIdToTextMap,
          tagMap: tagTextToIdMap,
          natCurricIdToTextMap: natCurricIdToTextMap,
          natCurricMap: natCurricTextToIdMap,
          EBSIdToTextMap: new Map(),
          EBSMap: new Map(),
        }
      );

      expect(result.hasError).toBe(true);

      expect(result.errors.duplicateUids.size).toBe(1);
      expect(result.errors.duplicateUids.has(one.unit_uid)).toBe(true);
    });
    test("should catch uids that do not exist as current records ", () => {
      const [one, two] = structuredClone(unitBulkUpdates);
      one.unit_uid = "not a unit 1";
      two.unit_uid = "not a unit 2";

      const result = parseUnitUpdates(
        [one, two],
        currentUnits,
        unitUpdateFields,
        {
          tagIdToTextMap,
          tagMap: tagTextToIdMap,
          natCurricIdToTextMap: natCurricIdToTextMap,
          natCurricMap: natCurricTextToIdMap,
          EBSIdToTextMap: new Map(),
          EBSMap: new Map(),
        }
      );

      expect(result.hasError).toBe(true);

      expect(result.errors.nonAccessibleUids.size).toBe(2);
      expect(result.errors.nonAccessibleUids.has(one.unit_uid)).toBe(true);
      expect(result.errors.nonAccessibleUids.has(two.unit_uid)).toBe(true);
    });
    test("should catch invalid planned number of lessons", () => {
      const update = structuredClone(unitBulkUpdates[0]);
      update.planned_number_of_lessons = "not a number";
      const result = parseUnitUpdates(
        [update],
        currentUnits,
        unitUpdateFields,
        {
          tagIdToTextMap,
          tagMap: tagTextToIdMap,
          natCurricIdToTextMap: natCurricIdToTextMap,
          natCurricMap: natCurricTextToIdMap,
          EBSIdToTextMap: new Map(),
          EBSMap: new Map(),
        }
      );

      expect(result.hasError).toBe(true);
      expect(result.errors.invalidPlannedNumber.has(update.unit_uid)).toBe(
        true
      );
    });
    test("should catch missing titles", () => {
      const update = structuredClone(unitBulkUpdates[0]);
      update.title = "null";
      const result = parseUnitUpdates(
        [update],
        currentUnits,
        unitUpdateFields,
        {
          tagIdToTextMap,
          tagMap: tagTextToIdMap,
          natCurricIdToTextMap: natCurricIdToTextMap,
          natCurricMap: natCurricTextToIdMap,
          EBSIdToTextMap: new Map(),
          EBSMap: new Map(),
        }
      );

      expect(result.hasError).toBe(true);
      expect(result.errors.missingTitle.has(update.unit_uid)).toBe(true);
    });
    test("should catch incorrect tags", () => {
      const update = structuredClone(unitBulkUpdates[0]);
      update["tags-1"] = "not a tag";
      const result = parseUnitUpdates(
        [update],
        currentUnits,
        unitUpdateFields,
        {
          tagIdToTextMap,
          tagMap: tagTextToIdMap,
          natCurricIdToTextMap: natCurricIdToTextMap,
          natCurricMap: natCurricTextToIdMap,
          EBSIdToTextMap: new Map(),
          EBSMap: new Map(),
        }
      );

      expect(result.hasError).toBe(true);
      expect(result.errors.incorrectTags.has(update.unit_uid)).toBe(true);
    });
    test("should catch incorrect national curriculum content", () => {
      const update = structuredClone(unitBulkUpdates[0]);
      update["national_curriculum_content-1"] = "not a national curriculum";
      const result = parseUnitUpdates(
        [update],
        currentUnits,
        unitUpdateFields,
        {
          tagIdToTextMap,
          tagMap: tagTextToIdMap,
          natCurricIdToTextMap: natCurricIdToTextMap,
          natCurricMap: natCurricTextToIdMap,
          EBSIdToTextMap: new Map(),
          EBSMap: new Map(),
        }
      );

      expect(result.hasError).toBe(true);
      expect(
        result.errors.incorrectNationalCurriculumContent.has(update.unit_uid)
      ).toBe(true);
    });

    test("should catch incorrect exam board specification", () => {
      const update = structuredClone(unitBulkUpdates[0]);
      update["exam_board_specification_content-1"] =
        "not a exam board specification";
      const result = parseUnitUpdates(
        [update],
        currentUnits,
        unitUpdateFields,
        {
          tagIdToTextMap,
          tagMap: tagTextToIdMap,
          natCurricIdToTextMap: natCurricIdToTextMap,
          natCurricMap: natCurricTextToIdMap,
          EBSIdToTextMap: new Map(),
          EBSMap: new Map(),
        }
      );

      expect(result.hasError).toBe(true);
      expect(
        result.errors.incorrectExamBoardSpecificationContent.has(
          update.unit_uid
        )
      ).toBe(true);
    });
  });
});
