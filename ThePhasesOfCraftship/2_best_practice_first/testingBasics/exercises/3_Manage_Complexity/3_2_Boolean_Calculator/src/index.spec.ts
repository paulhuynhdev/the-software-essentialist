import { describe, it, expect, beforeEach } from "@jest/globals";
import { BooleanCalculator } from "./index";

describe("boolean calculator", () => {
  let booleanCalculator: BooleanCalculator;

  beforeEach(() => {
    booleanCalculator = new BooleanCalculator();
  });

  describe("single values", () => {
    it('should return true for "TRUE"', () => {
      expect(booleanCalculator.evaluate("TRUE")).toBe(true);
    });
    it('should return false for "FALSE"', () => {
      expect(booleanCalculator.evaluate("FALSE")).toBe(false);
    });
  });

  describe("NOT operator", () => {
    it("should return true for NOT TRUE", () => {
      expect(booleanCalculator.evaluate("NOT TRUE")).toBe(false);
    });
    it("should return false for NOT FALSE", () => {
      expect(booleanCalculator.evaluate("NOT FALSE")).toBe(true);
    });
  });

  describe("AND operator", () => {
    it("should return true for TRUE AND TRUE", () => {
      expect(booleanCalculator.evaluate("TRUE AND TRUE")).toBe(true);
    });
    it("should return false for TRUE AND FALSE", () => {
      expect(booleanCalculator.evaluate("TRUE AND FALSE")).toBe(false);
    });
    it("should return false for FALSE AND TRUE", () => {
      expect(booleanCalculator.evaluate("FALSE AND TRUE")).toBe(false);
    });
    it("should return false for FALSE AND FALSE", () => {
      expect(booleanCalculator.evaluate("FALSE AND FALSE")).toBe(false);
    });
  });
});
