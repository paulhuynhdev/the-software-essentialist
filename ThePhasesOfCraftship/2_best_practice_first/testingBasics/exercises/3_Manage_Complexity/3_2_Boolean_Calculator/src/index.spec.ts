import { describe, it, expect } from "@jest/globals";
import { BooleanCalculator } from "./index";
describe("boolean calculator", () => {
  describe("single values", () => {
    it('should return true for "TRUE"', () => {
      const booleanCalculator = new BooleanCalculator();
      expect(booleanCalculator.evaluate("TRUE")).toBe(true);
    });
    it('should return false for "FALSE"', () => {
      const booleanCalculator = new BooleanCalculator();
      expect(booleanCalculator.evaluate("FALSE")).toBe(false);
    });
  });
});
