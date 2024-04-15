import type { UnitIdFields, UnitStringArrayField } from "./unitRecord";

export type UnitStringKeyArrayFieldsUpdate =
  `${keyof UnitStringArrayField}-${number}`;
export type IdArrayFieldsUpdate = `${keyof UnitIdFields}-${number}`;

export type UnitUpdateRecord = {
  unit_uid: string;
  title?: string;
  description?: string;
  why_this_why_now?: string;
  planned_number_of_lessons?: string;
  [key: UnitStringKeyArrayFieldsUpdate]: string | undefined;
  [key: IdArrayFieldsUpdate]: string | undefined;
};

export type NonIdArrayFields = keyof UnitStringArrayField;

export type UnitNonIdArrayElement = Record<NonIdArrayFields, string>;

export type ConversionMaps = {
  guidanceMap: Map<string, number>;
  tagMap: Map<string, number>;
  tagIdToTextMap: Map<number, string>;
  guidanceIdToTextMap: Map<number, string>;
};

export type JointErrors = {
  missingTitle: Set<string>;
  duplicateUids: Set<string>;
  nonAccessibleUids: Set<string>;
  tooLong: Map<string, { maxLength: number; uuids: Set<string> }>;
  incorrectTags: Map<string, Set<string>>;
};

export type LessonExportErrors = {
  incorrectGuidance: Map<string, Set<string>>;
} & JointErrors;

export type PossibleLessonErrors = keyof LessonExportErrors;

export type LogOptions = {
  maxLength: number;
  key: string;
};

export type UnitExportErrors = {
  incorrectNationalCurriculumContent: Map<string, Set<string>>;
  incorrectExamBoardSpecificationContent: Map<string, Set<string>>;
} & JointErrors;

export type PossibleUnitErrors = keyof UnitExportErrors;
