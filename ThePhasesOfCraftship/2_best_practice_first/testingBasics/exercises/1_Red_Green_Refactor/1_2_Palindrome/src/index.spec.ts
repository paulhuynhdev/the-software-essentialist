import { describe, it, expect } from "@jest/globals";
import PalindromeChecker from "./index";

describe("palindrome checker", () => {
  it('should return true when input string is "mom"', () => {
    const palindromeChecker = new PalindromeChecker();
    const result = palindromeChecker.check("mom");
    expect(result).toBeTruthy();
  });

  it('should return true when input string is "Mom"', () => {
    const palindromeChecker = new PalindromeChecker();
    const result = palindromeChecker.check("Mom");
    expect(result).toBeTruthy();
  });

  it('should return true when input string is "MoM"', () => {
    const palindromeChecker = new PalindromeChecker();
    const result = palindromeChecker.check("MoM");
    expect(result).toBeTruthy();
  });

  it('should return false when input string is "Momx"', () => {
    const palindromeChecker = new PalindromeChecker();
    const result = palindromeChecker.check("Momx");
    expect(result).toBeFalsy();
  });
});
