export type SingleKeyArrayFields = {
  key_learning_points: KeyLearningPoint[] | null;
  lesson_outline: LessonOutline[] | null;
  teacher_tips: TeacherTip[] | null;
  equipment_and_resources: EquipmentAndResource[] | null;
};

export type JointArrayFields = {
  misconceptions_and_common_mistakes: MisconceptionsAndCommonMistake[] | null;
  keywords: Keyword[] | null;
};

export type IdArrayFields = {
  content_guidance: number[] | null;
  tags: number[] | null;
};

export type StringFields = {
  lesson_uid: string;
  title: string;
  unit_uid: string;
  unit_title: string;
  pupil_lesson_outcome: string;
};

export type BulkFields =
  | StringFields & SingleKeyArrayFields & IdArrayFields & JointArrayFields;

export type LessonRecord = {
  lesson_id: number;
  slug: string;
  unitvariant_lessons_all_states: Unitvariantlessonsallstate[];
  lesson_order: number;
  unit_order: number;
  year_order: number;
  order: number;
  programme_fields: Programmefield[];
  display_order: number;
} & BulkFields;

type Programmefield = {
  keystage_id: number;
  subject_id: number;
};

type Unitvariantlessonsallstate = {
  order: number;
  unitvariant: Unitvariant;
};

type Unitvariant = {
  unit: Unit;
};

type Unit = {
  unit_uid: string;
  title: string;
  unit_programmes: Unitprogramme[];
};

type Unitprogramme = {
  order: number;
  programme: Programme;
};

type Programme = {
  programme_fields: Programmefields;
};

type Programmefields = {
  tier: string;
  year: string;
  phase: string;
  subject: string;
  tier_id: number;
  year_id: number;
  keystage: string;
  phase_id: number;
  tier_slug: string;
  year_slug: string;
  phase_slug: string;
  subject_id: number;
  keystage_id: number;
  subject_slug: string;
  keystage_slug: string;
  tier_description: string;
  year_description: string;
  phase_description: string;
  tier_display_order: number;
  year_display_order: number;
  phase_display_order: number;
  subject_description: string;
  keystage_description: string;
  subject_display_order: number;
  keystage_display_order: number;
};

export type EquipmentAndResource = {
  equipment: string;
};

export type TeacherTip = {
  teacher_tip: string;
};

export type MisconceptionsAndCommonMistake = {
  misconception: string;
  response: string;
};

export type LessonOutline = {
  lesson_outline: string;
};

export type Keyword = {
  description: string;
  keyword: string;
};

export type KeyLearningPoint = {
  key_learning_point: string;
};
