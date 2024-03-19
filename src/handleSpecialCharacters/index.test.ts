import { removeSpecialCharacters } from "./index";

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
    ).toBe(`\ttab\ttab\ttab`);
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
    ).toBe(`\ncheck\nthe\nfeed`);
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
    ).toBe(`\rreturn\rcheck\rnow`);
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
