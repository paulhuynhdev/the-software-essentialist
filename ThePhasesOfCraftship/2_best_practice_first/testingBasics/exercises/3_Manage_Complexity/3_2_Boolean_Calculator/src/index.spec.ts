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

  describe("OR operator", () => {
    it("should return true for TRUE OR FALSE", () => {
      expect(booleanCalculator.evaluate("TRUE OR FALSE")).toBe(true);
    });
    it("should return false for FALSE OR FALSE", () => {
      expect(booleanCalculator.evaluate("FALSE OR FALSE")).toBe(false);
    });
    it("should return true for TRUE OR TRUE", () => {
      expect(booleanCalculator.evaluate("TRUE OR TRUE")).toBe(true);
    });
  });

  describe("precedence NOT -> AND -> OR", () => {
    it("should return true for TRUE OR TRUE OR TRUE AND FALSE", () => {
      expect(booleanCalculator.evaluate("TRUE OR TRUE OR TRUE AND FALSE")).toBe(true);
    });
    it("should return true for TRUE OR FALSE AND NOT FALSE", () => {
      expect(booleanCalculator.evaluate("TRUE OR FALSE AND NOT FALSE")).toBe(true);
    });
    it("should return false for NOT TRUE AND TRUE OR FALSE", () => {
      expect(booleanCalculator.evaluate("NOT TRUE AND TRUE OR FALSE")).toBe(false);
    });
    it("should return true for TRUE OR FALSE OR FALSE OR FALSE", () => {
      expect(booleanCalculator.evaluate("TRUE OR FALSE OR FALSE OR FALSE")).toBe(true);
    });
  });
});
