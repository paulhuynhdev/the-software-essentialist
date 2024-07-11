class PalindromeChecker {
  constructor() {}

  public check(inputStr: string): boolean {
    const cleanedString = inputStr.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
    const reversedStr = cleanedString.split("").reverse().join("");
    const isSameString =
      cleanedString.toLowerCase() === reversedStr.toLowerCase();

    return !!isSameString;
  }
}

export default PalindromeChecker;
