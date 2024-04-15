import { handleMapErrors, handleTooLongError } from "./parsingErrors";
import type {
  PossibleUnitErrors,
  LogOptions,
  UnitExportErrors,
} from "./types/parsingTypes";

export const buildUnitErrorLogger = () => {
  const allUids = new Set();
  let hasError = false;

  const errorLog: UnitExportErrors = {
    missingTitle: new Set(),
    duplicateUids: new Set(),
    nonAccessibleUids: new Set(),
    invalidPlannedNumber: new Set(),
    tooLong: new Map(),
    incorrectTags: new Map(),
    incorrectExamBoardSpecificationContent: new Map(),
    incorrectNationalCurriculumContent: new Map(),
  };

  function logError<
    T extends Exclude<
      PossibleUnitErrors,
      | "tooLong"
      | "incorrectExamBoardSpecificationContent"
      | "incorrectTags"
      | "incorrectNationalCurriculumContent"
    >
  >(error: T, lessonUid: string): void;
  function logError<
    T extends
      | "incorrectExamBoardSpecificationContent"
      | "incorrectTags"
      | "incorrectNationalCurriculumContent"
  >(error: T, lessonUid: string, options: { value: string }): void;
  function logError<T extends "tooLong">(
    error: T,
    lessonUid: string,
    options: LogOptions
  ): void;
  function logError(
    error: PossibleUnitErrors,
    lessonUid: string,
    options?: LogOptions | { value: string }
  ) {
    hasError = true;

    if (error === "tooLong") {
      handleTooLongError(lessonUid, errorLog, options);
      return;
    }

    if (
      error === "incorrectExamBoardSpecificationContent" ||
      error === "incorrectTags" ||
      error === "incorrectNationalCurriculumContent"
    ) {
      handleMapErrors(errorLog[error], lessonUid, options);
      return;
    }

    errorLog[error].add(lessonUid);
  }

  return {
    logError,
    checkUid: (uid: string) => {
      if (allUids.has(uid)) {
        errorLog.duplicateUids.add(uid);
        hasError = true;
        return;
      }
      allUids.add(uid);
    },
    hasError: () => hasError,
    getErrors: () => errorLog,
  };
};

export type UnitErrorLogger = ReturnType<
  typeof buildUnitErrorLogger
>["logError"];
