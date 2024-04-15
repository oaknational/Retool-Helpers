import { removeSpecialCharacters, insertSpecialCharacters } from "./index";

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
});
