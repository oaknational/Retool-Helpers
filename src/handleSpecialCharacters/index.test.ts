import {
  removeSpecialCharacters,
  insertSpecialCharacters,
  sanitiseForDb,
  sanitiseForTsv,
} from "./index";

describe("handleSpecialCharacters", () => {
  describe("removeSpecialCharacters", () => {
    test("removeSpecialCharacters - single speech mark first character only", () => {
      expect(removeSpecialCharacters(`hi' there 'hello`)).toBe(
        `hi’ there 'hello`
      );
    });
    test("removeSpecialCharacters - double speech first character only", () => {
      expect(removeSpecialCharacters(`che"ck ckc there "hello"`)).toBe(
        `che”ck ckc there "hello"`
      );
    });
    test("removeSpecialCharacters - tab all characters", () => {
      expect(
        removeSpecialCharacters(
          String.fromCharCode(9) +
            "tab" +
            String.fromCharCode(9) +
            "tab" +
            String.fromCharCode(9) +
            "tab"
        )
      ).toBe(`\\\\ttab\\\\ttab\\\\ttab`);
    });
    test("removeSpecialCharacters - line feed all characters", () => {
      expect(
        removeSpecialCharacters(
          String.fromCharCode(10) +
            "check" +
            String.fromCharCode(10) +
            "the" +
            String.fromCharCode(10) +
            "feed"
        )
      ).toBe(`checkthefeed`);
    });
    test("removeSpecialCharacters - carriage return all characters", () => {
      expect(
        removeSpecialCharacters(
          String.fromCharCode(13) +
            "return" +
            String.fromCharCode(13) +
            "check" +
            String.fromCharCode(13) +
            "now"
        )
      ).toBe(`returnchecknow`);
    });
    test("removeSpecialCharacters - backslash all characters", () => {
      expect(
        removeSpecialCharacters(
          String.fromCharCode(92) +
            "backslash" +
            String.fromCharCode(92) +
            "here" +
            String.fromCharCode(92) +
            "again"
        )
      ).toBe(`\\\\backslash\\\\here\\\\again`);
    });
  });
  describe("insertSpecialCharacters", () => {
    test("insertSpecialCharacters - single speech mark first character only", () => {
      expect(insertSpecialCharacters(`hi’ there 'hello`)).toBe(
        `hi' there 'hello`
      );
    });
    test("insertSpecialCharacters - double speech first character only", () => {
      expect(insertSpecialCharacters(`che”ck ckc there "hello"`)).toBe(
        `che"ck ckc there "hello"`
      );
    });
    test("insertSpecialCharacters - tab all characters", () => {
      expect(insertSpecialCharacters(`\\ttab\\ttab\\ttab`)).toBe(
        String.fromCharCode(9) +
          "tab" +
          String.fromCharCode(9) +
          "tab" +
          String.fromCharCode(9) +
          "tab"
      );
    });
    test("insertSpecialCharacters - line feed all characters", () => {
      expect(insertSpecialCharacters(`\ncheck\nthe\nfeed`)).toBe(
        "checkthefeed"
      );
    });
    test("insertSpecialCharacters - carriage return all characters", () => {
      expect(insertSpecialCharacters(`\rreturn\rcheck\rnow`)).toBe(
        "returnchecknow"
      );
    });
    test("insertSpecialCharacters - backslash all characters", () => {
      expect(insertSpecialCharacters(`\\\\backslash\\\\here\\\\again`)).toBe(
        String.fromCharCode(92) +
          "backslash" +
          String.fromCharCode(92) +
          "here" +
          String.fromCharCode(92) +
          "again"
      );
    });
  });
  describe("sanitiseForTsv", () => {
    test("sanitiseForTsv - single speech mark", () => {
      expect(sanitiseForTsv(`hi' there 'hello`)).toBe(`hi’ there ’hello`);
    });
    test("sanitiseForTsv - double speech mark", () => {
      expect(sanitiseForTsv(`che"ck ckc there "hello"`)).toBe(
        `che”ck ckc there ”hello”`
      );
    });
    test("sanitiseForTsv - tab", () => {
      expect(sanitiseForTsv(`\ttab\ttab\ttab`)).toBe(`tabtabtab`);
    });
    test("sanitiseForTsv - line feed", () => {
      expect(sanitiseForTsv(`\ncheck\nthe\nfeed`)).toBe(`checkthefeed`);
    });
    test("sanitiseForTsv - carriage return", () => {
      expect(sanitiseForTsv(`\rreturn\rcheck\rnow`)).toBe(`returnchecknow`);
    });
    test("sanitiseForTsv - backslash", () => {
      expect(sanitiseForTsv(`\\backslash\\here\\again`)).toBe(
        `backslashhereagain`
      );
    });
  });
  describe("sanitiseForDb", () => {
    test("sanitiseForDb - single speech mark", () => {
      expect(sanitiseForDb(`hi’ there ’hello`)).toBe(`hi' there 'hello`);
    });

    test("sanitiseForDb - double speech mark", () => {
      expect(sanitiseForDb(`che”ck ckc there ”hello`)).toBe(
        `che"ck ckc there "hello`
      );
    });

    test("sanitiseForDb - line feed", () => {
      expect(sanitiseForDb(`\ncheck\nthe\nfeed`)).toBe(`checkthefeed`);
    });

    test("sanitiseForDb - carriage return", () => {
      expect(sanitiseForDb(`\rreturn\rcheck\rnow`)).toBe(`returnchecknow`);
    });

    test("sanitiseForDb - tab", () => {
      expect(sanitiseForDb(`\ttab\ttab\ttab`)).toBe(`tabtabtab`);
    });

    test("sanitiseForDb - backslash", () => {
      expect(sanitiseForDb(`\\backslash\\here\\again`)).toBe(
        `backslashhereagain`
      );
    });
  });
});
