import { slugify } from "./index";

describe("Retool helper functions", () => {
  describe("slugify", () => {
    test("slugify", () => {
      expect(
        slugify("  ©𝄢𝄫🎵 Hello World µ˜∫√ ≈ & ćøḿṕæňÿ …ƒ´¬∂∑≈¬¬¬¬¬¬ --- ")
      ).toBe("hello-world-and-company");
    });
  });
});
