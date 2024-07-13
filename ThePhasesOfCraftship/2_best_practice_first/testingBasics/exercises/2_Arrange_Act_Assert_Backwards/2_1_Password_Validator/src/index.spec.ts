import { describe, test, expect } from "@jest/globals";
import PasswordValidator from "./PasswordValidator";

describe("password validator", () => {
  test("should return isValid true and empty errors for 12345", () => {
    // arrange
    const inputPassword = "12345";
    const passwordValidator = new PasswordValidator();
    // act
    const result = passwordValidator.validate(inputPassword);
    // assert
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toEqual([]);
  });
});
