class PalindromeChecker {
  constructor() {}

  public check(inputStr: string): boolean {
    const cleanedString = inputStr.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
    let left = 0;
    let right = cleanedString.length - 1;

    while (left < right) {
      if (cleanedString[left] !== cleanedString[right]) {
        return false;
      }
      left++;
      right--;
    }

    return true;
  }
}

export default PalindromeChecker;
