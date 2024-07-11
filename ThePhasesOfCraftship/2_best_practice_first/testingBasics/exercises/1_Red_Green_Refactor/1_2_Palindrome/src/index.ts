class PalindromeChecker {
  constructor() {}

  public check(inputStr: string): boolean {
    const reversedStr = inputStr.split("").reverse().join("");
    return inputStr === reversedStr;
  }
}

export default PalindromeChecker;
