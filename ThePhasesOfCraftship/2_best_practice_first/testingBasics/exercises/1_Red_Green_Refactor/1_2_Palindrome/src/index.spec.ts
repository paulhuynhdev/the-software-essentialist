import { describe, it, expect, beforeEach } from "@jest/globals";
import PalindromeChecker from "./index";

describe("palindrome checker", () => {
  let palindromeChecker: PalindromeChecker;

  beforeEach(() => {
    palindromeChecker = new PalindromeChecker();
  });

  it.each([
    ["mom", true],
    ["Mom", true],
    ["MoM", true],
    ["Momx", false],
    ["Was It A Rat I Saw", true],
    ["Never Odd or Even", true],
    ["Never Odd or Even1", false],
    ["1Never Odd or Even1", true],
  ])('should return %s when input string is "%s"', (input, expected) => {
    const result = palindromeChecker.check(input);
    expect(result).toBe(expected);
  });
});
