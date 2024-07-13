import { describe, test, expect, beforeEach } from "@jest/globals";
import PasswordValidator from "./PasswordValidator";

describe("password validator", () => {
  let passwordValidator: PasswordValidator;

  beforeEach(() => {
    passwordValidator = new PasswordValidator();
  });

  test("should return isValid true and empty errors for 12345", () => {
    // arrange
    const inputPassword = "12345";
    // act
    const result = passwordValidator.validate(inputPassword);
    // assert
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toEqual([]);
  });

  test("should return isValid false and errors for 1234 password", () => {
    // arrange
    const inputPassword = "1234";
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
    // act
    const result = passwordValidator.validate(inputPassword);
    // assert
    expect(result.isValid).toBeFalsy();
    expect(result.errors[0]).toEqual(
      "Password length must be between 5 and 15 characters"
    );
  });

  test("return is isValid false and error when not contain at least one digit", () => {
    // arrange
    const inputPassword = "admin";
    // act
    const result = passwordValidator.validate(inputPassword);
    // assert
    expect(result.isValid).toBeFalsy();
    expect(result.errors[0]).toEqual(
      "Password must contain at least one digit"
    );
  });
});
