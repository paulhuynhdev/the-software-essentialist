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

  describe("NOT operator", () => {
    it("should return true for NOT TRUE", () => {
      const booleanCalculator = new BooleanCalculator();
      expect(booleanCalculator.evaluate("NOT TRUE")).toBe(false);
    });
    it("should return false for NOT FALSE", () => {
      const booleanCalculator = new BooleanCalculator();
      expect(booleanCalculator.evaluate("NOT FALSE")).toBe(true);
    });
  });
});
