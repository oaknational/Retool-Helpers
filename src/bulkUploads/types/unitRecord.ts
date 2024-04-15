import type { IdAndText } from "./lessonRecord";

export type UnitRecord = {
  unit_id: number;
} & UnitIdFields &
  UnitStringFields &
  UnitNumericField &
  UnitStringArrayField;

export type UnitNumericField = {
  planned_number_of_lessons: number;
};

export type UnitStringArrayField = {
  prior_knowledge_requirements: string[] | null;
};

export type UnitStringFields = {
  unit_uid: string;
  title: string;
  description: string | null;
  why_this_why_now: string | null;
};

export type UnitIdFields = {
  national_curriculum_content: IdAndText[] | number[] | null;
  exam_board_specification_content: IdAndText[] | number[] | null;
  tags: IdAndText[] | number[] | null;
};
