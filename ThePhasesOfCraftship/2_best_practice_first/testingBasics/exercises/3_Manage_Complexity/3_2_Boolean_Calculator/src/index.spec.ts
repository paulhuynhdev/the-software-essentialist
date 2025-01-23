import { describe, it, expect, beforeEach } from "@jest/globals";
import { BooleanCalculator } from "./index";

describe("boolean calculator", () => {
  let booleanCalculator: BooleanCalculator;

  beforeEach(() => {
    booleanCalculator = new BooleanCalculator();
  });

  describe("single values", () => {
    it.each([
      ["TRUE", true],
      ["FALSE", false],
    ])("should evaluate %s to %s", (input, expected) => {
      expect(booleanCalculator.evaluate(input)).toBe(expected);
    });
  });

  describe("NOT operator", () => {
    it.each([
      ["NOT TRUE", false],
      ["NOT FALSE", true],
    ])("should evaluate %s to %s", (input, expected) => {
      expect(booleanCalculator.evaluate(input)).toBe(expected);
    });
  });

  describe("AND operator", () => {
    it.each([
      ["TRUE AND TRUE", true],
      ["TRUE AND FALSE", false],
      ["FALSE AND TRUE", false],
      ["FALSE AND FALSE", false],
    ])("should evaluate %s to %s", (input, expected) => {
      expect(booleanCalculator.evaluate(input)).toBe(expected);
    });
  });

  describe("OR operator", () => {
    it.each([
      ["TRUE OR FALSE", true],
      ["FALSE OR FALSE", false],
      ["TRUE OR TRUE", true],
    ])("should evaluate %s to %s", (input, expected) => {
      expect(booleanCalculator.evaluate(input)).toBe(expected);
    });
  });

  describe("precedence NOT -> AND -> OR", () => {
    it.each([
      ["TRUE OR TRUE OR TRUE AND FALSE", true],
      ["TRUE OR FALSE AND NOT FALSE", true],
      ["NOT TRUE AND TRUE OR FALSE", false],
      ["TRUE OR FALSE OR FALSE OR FALSE", true],
    ])("should evaluate %s to %s", (input, expected) => {
      expect(booleanCalculator.evaluate(input)).toBe(expected);
    });
  });

  describe("parentheses", () => {
    it.each([
      ["(TRUE OR TRUE OR TRUE) AND FALSE", false],
      ["NOT (TRUE AND TRUE)", false],
    ])("should evaluate %s to %s", (input, expected) => {
      expect(booleanCalculator.evaluate(input)).toBe(expected);
    });
  });

   describe("invalid expressions", () => {
     it.each([
       ["(TRUE", "Unmatched parentheses"],
       ["TRUE)", "Unmatched parentheses"],
       ["((TRUE)", "Unmatched parentheses"],
       ["(TRUE))", "Unmatched parentheses"],
       ["TRUE AND", "Invalid expression"],
       ["AND TRUE", "Invalid expression"],
       ["TRUE OR", "Invalid expression"],
       ["NOT", "Invalid expression"],
       ["TRUEE", "Invalid expression"],
       ["", "Empty expression"],
     ])("should throw error for %s with message %s", (input, errorMessage) => {
       expect(() => booleanCalculator.evaluate(input)).toThrow(errorMessage);
     });
   });
});
