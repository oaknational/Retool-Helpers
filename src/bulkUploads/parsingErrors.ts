import type {
  ExportErrors,
  PossibleErrors,
  LogOptions,
} from "./types/parsingTypes";

export const buildErrorLogger = () => {
  const allUids = new Set();
  let hasError = false;

  const errorLog: ExportErrors = {
    missingTitle: new Set(),
    duplicateUids: new Set(),
    nonAccessibleUids: new Set(),
    tooLong: new Map(),
    incorrectTags: new Map(),
    incorrectGuidance: new Map(),
  };

  function logError<
    T extends Exclude<
      PossibleErrors,
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
    error: PossibleErrors,
    lessonUid: string,
    options?: LogOptions | { value: string }
  ) {
    hasError = true;

    if (error === "tooLong") {
      if (!options || !("key" in options)) {
        throw new Error("Missing options for tooLong error");
      }
      const { maxLength, key } = options;
      if (errorLog.tooLong.has(key)) {
        errorLog.tooLong.get(key)?.uuids.add(lessonUid);
      } else {
        errorLog.tooLong.set(key, { maxLength, uuids: new Set([lessonUid]) });
      }
      return;
    }

    if (error === "incorrectGuidance" || error === "incorrectTags") {
      if (!options || !("value" in options)) {
        throw new Error(
          "Missing options for incorrectGuidance or incorrectTags error"
        );
      }

      if (errorLog[error].has(lessonUid)) {
        errorLog[error].get(lessonUid)?.add(options.value);
      } else {
        errorLog[error].set(lessonUid, new Set([options.value]));
      }

      return;
    }

    errorLog[error].add(lessonUid);
    return;
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
