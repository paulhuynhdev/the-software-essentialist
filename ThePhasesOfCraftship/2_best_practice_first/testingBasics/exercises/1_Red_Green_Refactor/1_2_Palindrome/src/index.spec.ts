import { describe, it, expect, beforeEach } from "@jest/globals";
import PalindromeChecker from "./index";

describe("palindrome checker", () => {
  let palindromeChecker: PalindromeChecker;
  beforeEach(() => {
    palindromeChecker = new PalindromeChecker();
  });
  it('should return true when input string is "mom"', () => {
    const result = palindromeChecker.check("mom");
    expect(result).toBeTruthy();
  });

  it('should return true when input string is "Mom"', () => {
    const result = palindromeChecker.check("Mom");
    expect(result).toBeTruthy();
  });

  it('should return true when input string is "MoM"', () => {
    const result = palindromeChecker.check("MoM");
    expect(result).toBeTruthy();
  });

  it('should return false when input string is "Momx"', () => {
    const result = palindromeChecker.check("Momx");
    expect(result).toBeFalsy();
  });
});
