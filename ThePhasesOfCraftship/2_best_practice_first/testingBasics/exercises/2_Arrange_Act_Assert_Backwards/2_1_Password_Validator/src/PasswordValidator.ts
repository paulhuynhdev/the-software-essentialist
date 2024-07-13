type ValidateResult = {
  isValid: boolean;
  errors: string[];
};

class PasswordValidator {
  public validate(password: string): ValidateResult {
    const result: ValidateResult = {
      isValid: true,
      errors: [],
    };

    if (password.length < 5 || password.length > 15) {
      result.isValid = false;
      result.errors.push("Password length must be between 5 and 15 characters");
    }

    if (!/\d/.test(password)) {
      result.isValid = false;
      result.errors.push("Password must contain at least one digit");
    }

    return result;
  }
}

export default PasswordValidator;
