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

  test("should return isValid false and errors for 1234 password", () => {
    // arrange
    const inputPassword = "1234";
    const passwordValidator = new PasswordValidator();
    // act
    const result = passwordValidator.validate(inputPassword);
    // assert
    expect(result.isValid).toBeFalsy();
    expect(result.errors[0]).toEqual(
      "Password length must be between 5 and 15 characters"
    );
  });

  test("should return isValid false and error for sixteencharacter password", () => {
    // arrange
    const inputPassword = "sixteencharacter";
    const passwordValidator = new PasswordValidator();
    // act
    const result = passwordValidator.validate(inputPassword);
    // assert
    expect(result.isValid).toBeFalsy();
    expect(result.errors[0]).toEqual(
      "Password length must be between 5 and 15 characters"
    );
  });
});
