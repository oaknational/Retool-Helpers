import type {
  UnitIdFields,
  UnitNumericField,
  UnitRecord,
  UnitStringArrayField,
  UnitStringFields,
} from "./unitRecord";

export type UnitStringUpdateFields = {
  maxLength?: number;
  type: "string";
  key: keyof UnitStringFields;
};

export const isUnitStringField = (
  field: keyof UnitRecord
): field is keyof UnitStringFields => {
  return ["unit_uid", "title", "description", "why_this_why_now"].includes(
    field
  );
};

export type UnitIdUpdateFields = {
  isIdField: true;
  type: "array";
  size: number;
  key: keyof UnitIdFields;
};

export const isUnitIdField = (
  field: keyof UnitRecord
): field is keyof UnitIdFields => {
  return [
    "national_curriculum_content",
    "exam_board_specification_content",
    "tags",
  ].includes(field);
};

export type UnitNumericUpdateFields = {
  type: "number";
  key: keyof UnitNumericField;
};

export const isUnitNumericField = (
  field: keyof UnitRecord
): field is keyof UnitNumericField => {
  return ["planned_number_of_lessons"].includes(field);
};

export type UnitStringArrayUpdateFields = {
  type: "array";
  size: number;
  key: keyof UnitStringArrayField;
  maxLength: number;
};

export const isUnitStringArrayField = (
  field: keyof UnitRecord
): field is keyof UnitStringArrayField => {
  return ["prior_knowledge_requirements"].includes(field);
};

export type UnitUpdateFields = {
  [key in keyof UnitStringFields]: UnitStringUpdateFields;
} & {
  [key in keyof UnitIdFields]: UnitIdUpdateFields;
} & {
  [key in keyof UnitNumericField]: UnitNumericUpdateFields;
} & {
  [key in keyof UnitStringArrayField]: UnitStringArrayUpdateFields;
};
