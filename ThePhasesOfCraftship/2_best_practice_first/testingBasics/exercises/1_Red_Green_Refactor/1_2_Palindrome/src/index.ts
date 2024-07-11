class PalindromeChecker {
  constructor() {}

  public check(inputStr: string): boolean {
    const reversedStr = inputStr.split("").reverse().join("");
    const isSameString = inputStr.toLowerCase() === reversedStr.toLowerCase();
    return isSameString ? true : false;
  }
}

export default PalindromeChecker;
