class PalindromeChecker {
  constructor() {}

  public check(inputStr: string): boolean {
    const reversedStr = inputStr.split("").reverse().join("");
    return inputStr.toLowerCase() === reversedStr.toLowerCase();
  }
}

export default PalindromeChecker;
