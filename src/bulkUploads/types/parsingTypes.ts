import type {
  SingleKeyArrayFieldPrimaryKey,
  JointKeyArrayFieldPrimaryKey,
} from "./bulkUpdateFields";
import type {
  SingleKeyArrayFields,
  IdArrayFields,
  JointArrayFields,
} from "./lessonRecord";

export type SingleKeyArrayFieldsUpdate =
  `${keyof SingleKeyArrayFields}-${number}`;
export type IdArrayFieldsUpdate = `${keyof IdArrayFields}-${number}`;
export type JointArrayFieldsUpdate = `${keyof JointArrayFields}-${number}`;
export type JointArrayFieldsSecondaryUpdate =
  `${keyof JointArrayFields}-${number}-${string}`;

export type UpdateRecord = {
  unit_uid?: string;
  unit_title?: string;
  lesson_uid: string;
  title?: string;
  pupil_lesson_outcome?: string;
  [key: SingleKeyArrayFieldsUpdate]: string | undefined;
  [key: IdArrayFieldsUpdate]: string | undefined;
  [key: JointArrayFieldsUpdate]: string | undefined;
  [key: JointArrayFieldsSecondaryUpdate]: string | undefined;
};

export type NonIdArrayFields =
  | keyof SingleKeyArrayFields
  | keyof JointArrayFields;

export type NonIdArrayElement = Record<
  SingleKeyArrayFieldPrimaryKey | JointKeyArrayFieldPrimaryKey,
  string
>;

export type ExportErrors = {
  missingTitle: Set<string>;
  duplicateUids: Set<string>;
  nonAccessibleUids: Set<string>;
  tooLong: Map<string, { maxLength: number; uuids: Set<string> }>;
  incorrectTags: Map<string, Set<string>>;
  incorrectGuidance: Map<string, Set<string>>;
};
export type PossibleErrors = keyof ExportErrors;

export type LogOptions = {
  maxLength: number;
  key: string;
};

export type ConversionMaps = {
  guidanceMap: Map<string, number>;
  tagMap: Map<string, number>;
  tagIdToTextMap: Map<number, string>;
  guidanceIdToTextMap: Map<number, string>;
};
