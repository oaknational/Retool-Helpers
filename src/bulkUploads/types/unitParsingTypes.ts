import type { JointErrors } from "./parsingTypes";
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

export type UnitExportErrors = {
  incorrectNationalCurriculumContent: Map<string, Set<string>>;
  incorrectExamBoardSpecificationContent: Map<string, Set<string>>;
} & JointErrors;

export type PossibleUnitErrors = keyof UnitExportErrors;
