import type {
  PossibleLessonErrors,
  LogOptions,
  LessonExportErrors,
  UnitExportErrors,
} from "./types/parsingTypes";

export const handleTooLongError = (
  lessonUid: string,
  errorLog: LessonExportErrors | UnitExportErrors,
  options?: LogOptions | { value: string }
) => {
  if (!options || !("key" in options)) {
    throw new Error("Missing options for tooLong error");
  }
  const { maxLength, key } = options;
  if (errorLog.tooLong.has(key)) {
    errorLog.tooLong.get(key)?.uuids.add(lessonUid);
  } else {
    errorLog.tooLong.set(key, { maxLength, uuids: new Set([lessonUid]) });
  }
};

export const handleMapErrors = (
  errMap: Map<string, Set<string>>,
  lessonUid: string,
  options?: LogOptions | { value: string }
) => {
  if (!options || !("value" in options)) {
    throw new Error(
      "Missing options for incorrectGuidance or incorrectTags error"
    );
  }

  if (errMap.has(lessonUid)) {
    errMap.get(lessonUid)?.add(options.value);
  } else {
    errMap.set(lessonUid, new Set([options.value]));
  }
};

export const buildErrorLogger = () => {
  const allUids = new Set();
  let hasError = false;

  const errorLog: LessonExportErrors = {
    missingTitle: new Set(),
    duplicateUids: new Set(),
    nonAccessibleUids: new Set(),
    tooLong: new Map(),
    incorrectTags: new Map(),
    incorrectGuidance: new Map(),
  };

  function logError<
    T extends Exclude<
      PossibleLessonErrors,
      "tooLong" | "incorrectGuidance" | "incorrectTags"
    >
  >(error: T, lessonUid: string): void;
  function logError<T extends "incorrectGuidance" | "incorrectTags">(
    error: T,
    lessonUid: string,
    options: { value: string }
  ): void;
  function logError<T extends "tooLong">(
    error: T,
    lessonUid: string,
    options: LogOptions
  ): void;
  function logError(
    error: PossibleLessonErrors,
    lessonUid: string,
    options?: LogOptions | { value: string }
  ) {
    hasError = true;

    if (error === "tooLong") {
      handleTooLongError(lessonUid, errorLog, options);
      return;
    }

    if (error === "incorrectGuidance" || error === "incorrectTags") {
      const errMap = errorLog[error];
      handleMapErrors(errMap, lessonUid, options);
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

export type ErrorLogger = ReturnType<typeof buildErrorLogger>["logError"];
