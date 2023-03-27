import { add, slugify } from ".";

describe("Retool helper functions", () => {
  describe("add", () => {
    test("1 + 1", () => {
      expect(add(1, 1)).toBe(2);
    });
  });
  describe("slugify", () => {
    test("slugify", () => {
      expect(
        slugify("  ©𝄢𝄫🎵 Hello World µ˜∫√ ≈ & ćøḿṕæňÿ …ƒ´¬∂∑≈¬¬¬¬¬¬ --- ")
      ).toBe("hello-world-and-company");
    });
  });
});
