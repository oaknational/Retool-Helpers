import type {
  StringFields,
  IdArrayFields,
  SingleKeyArrayFields,
  KeyLearningPoint,
  LessonOutline,
  TeacherTip,
  EquipmentAndResource,
  JointArrayFields,
  Keyword,
  MisconceptionsAndCommonMistake,
} from "./lessonRecord";

export type StringUpdateFields = {
  maxLength?: number;
  type: "string";
  key: keyof StringFields;
};

export const isStringField = (
  field: keyof UpdateFields
): field is keyof StringFields => {
  return [
    "unit_uid",
    "unit_title",
    "lesson_uid",
    "title",
    "pupil_lesson_outcome",
  ].includes(field);
};

export type IdArrayUpdateFields = {
  isIdField: true;
  type: "array";
  size: number;
  key: keyof IdArrayFields;
};

export const isIdField = (
  field: keyof UpdateFields
): field is keyof IdArrayFields => {
  return ["content_guidance", "tags"].includes(field);
};

export type SingleKeyArrayFieldPrimaryKey =
  | keyof KeyLearningPoint
  | keyof LessonOutline
  | keyof TeacherTip
  | keyof EquipmentAndResource;

export type SingleKeyUpdateFields = {
  key: keyof SingleKeyArrayFields;
  type: "array";
  size: number;
  primaryElementKey: SingleKeyArrayFieldPrimaryKey;
  maxLength: number;
};

export const isSingleKeyArrayField = (
  field: keyof UpdateFields
): field is keyof SingleKeyArrayFields => {
  return [
    "key_learning_points",
    "lesson_outline",
    "teacher_tips",
    "equipment_and_resources",
  ].includes(field);
};

export type JointKeyArrayFieldPrimaryKey =
  | keyof Keyword
  | keyof MisconceptionsAndCommonMistake;

export type JointKeyUpdateFields = {
  key: keyof JointArrayFields;
  type: "array";
  size: number;
  primaryElementKey: keyof Keyword | keyof MisconceptionsAndCommonMistake;
  secondaryElementKey: keyof Keyword | keyof MisconceptionsAndCommonMistake;
  maxLengthSecondary: number;
  maxLength: number;
};

export const isJointArrayField = (
  field: keyof UpdateFields
): field is keyof JointArrayFields => {
  return ["misconceptions_and_common_mistakes", "keywords"].includes(field);
};

export type UpdateFields = {
  [key in keyof StringFields]: StringUpdateFields;
} & {
  [key in keyof SingleKeyArrayFields]: SingleKeyUpdateFields;
} & {
  [key in keyof IdArrayFields]: IdArrayUpdateFields;
} & {
  [key in keyof JointArrayFields]: JointKeyUpdateFields;
};
