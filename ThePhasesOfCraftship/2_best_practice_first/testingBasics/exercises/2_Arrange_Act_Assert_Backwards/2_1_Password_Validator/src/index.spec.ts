import { describe, test, expect, beforeEach } from "@jest/globals";
import PasswordValidator from "./PasswordValidator";

describe("password validator", () => {
  let passwordValidator: PasswordValidator;

  beforeEach(() => {
    passwordValidator = new PasswordValidator();
  });

  describe("validate password length", () => {
    test.each([
      ["12345A", true, []],
      ["1234", false, ["Password length must be between 5 and 15 characters"]],
      [
        "thePhysical1234567",
        false,
        ["Password length must be between 5 and 15 characters"],
      ],
    ])("should validate password '%s'", (inputPassword, isValid, errors) => {
      const result = passwordValidator.validate(inputPassword);
      expect(result.isValid).toEqual(isValid);
      expect(result.errors[0]).toEqual(errors[0]);
    });
  });

  describe("digit requirement", () => {
    test.each([
      ["admin", false, ["Password must contain at least one digit"]],
      ["maxwellTheBe", false, ["Password must contain at least one digit"]],
    ])("should validate password '%s'", (input, isValid, errors) => {
      const result = passwordValidator.validate(input);
      expect(result.isValid).toBe(isValid);
      expect(result.errors).toContain(errors[0]);
    });
  });

  describe("uppercase letter requirement", () => {
    test.each([
      [
        "lowercase1",
        false,
        ["Password must contain at least one uppercase letter"],
      ],
      [
        "maxwell1_c",
        false,
        ["Password must contain at least one uppercase letter"],
      ],
    ])("should validate password '%s'", (input, isValid, errors) => {
      const result = passwordValidator.validate(input);
      expect(result.isValid).toBe(isValid);
      expect(result.errors).toEqual(errors);
    });
  });
});
