import { describe, it, expect } from "@jest/globals";

describe("palindrome checker", () => {
  it('should return true when input string is "mom"', () => {
    const palindromeChecker = new PalindromeChecker();
    const result = palindromeChecker.check("mom");
    expect(result).toBeTruthy();
  });
});
