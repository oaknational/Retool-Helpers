import type { UpdateFields } from "../types/bulkUpdateFields";

export const updateFields: UpdateFields = {
  unit_uid: {
    key: "unit_title",
    type: "string",
  },
  unit_title: {
    key: "unit_title",
    type: "string",
  },
  lesson_uid: {
    key: "lesson_uid",
    type: "string",
  },
  title: {
    key: "title",
    type: "string",
    maxLength: 80,
  },
  pupil_lesson_outcome: {
    key: "pupil_lesson_outcome",
    type: "string",
    maxLength: 190,
  },
  key_learning_points: {
    key: "key_learning_points",
    primaryElementKey: "key_learning_point",
    type: "array",
    size: 5,
    maxLength: 120,
  },
  keywords: {
    key: "keywords",
    primaryElementKey: "keyword",
    secondaryElementKey: "description",
    type: "array",
    size: 5,
    maxLength: 30,
    maxLengthSecondary: 200,
  },
  lesson_outline: {
    key: "lesson_outline",
    primaryElementKey: "lesson_outline",
    type: "array",
    size: 4,
    maxLength: 50,
  },
  content_guidance: {
    key: "content_guidance",
    isIdField: true,
    type: "array",
    size: 5,
  },
  tags: {
    key: "tags",
    isIdField: true,
    type: "array",
    size: 5,
  },
  misconceptions_and_common_mistakes: {
    key: "misconceptions_and_common_mistakes",
    primaryElementKey: "misconception",
    secondaryElementKey: "response",
    type: "array",
    size: 1,
    maxLength: 200,
    maxLengthSecondary: 250,
  },
  teacher_tips: {
    key: "teacher_tips",
    primaryElementKey: "teacher_tip",
    type: "array",
    size: 1,
    maxLength: 300,
  },
  equipment_and_resources: {
    key: "equipment_and_resources",
    primaryElementKey: "equipment",
    type: "array",
    size: 1,
    maxLength: 200,
  },
};
