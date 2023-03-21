import { add } from ".";

describe("Retool helper functions", () => {
  describe("add", () => {
    test("1 + 1", () => {
      expect(add(1, 1)).toBe(2);
    });
  });
});
