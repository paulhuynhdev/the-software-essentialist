# Problem Description:

Write a function (or a stateless class) for validating passwords. Passwords must meet the following criteria:

- Between 5 and 15 characters long
- Contains at least one digit
- Contains at least one upper case letter
- Return an object containing a boolean result and an errors key that — when provided with an invalid password — contains an error message or type for all errors in occurrence. There can be multiple errors at a single time.

## UPFRONT:

1. Between 5 and 15 characters long
   - 12345 -> true
   - secretpassword1 -> true
   - 1234 -> false
2. Contains at least one digit
   - admin1 -> true
   - admin -> false
3. Contains at least one upper case letter
   - Admin1 -> true
   - admin1 -> false

4. Return an object containing a boolean result and an errors key that — when provided with an invalid password — contains an error message or type for all errors in occurrence. There can be multiple errors at a single time.
   - result: {isValid: boolean, errors: string[]}. Eg: {isValid: true, errors: []} | {isValid: false, errors: ["Password length must be between 5 to 15 characters"]}


## EMERGENT
...
## Checklist

- I have implemented the minimum requirements listed in the project description
- I have Programmed By Wishful Thinking, designing the response API before it was actually created
- I have Worked Backwards, starting at the Assert, then going to the Act and the Arrange
- I have tests that validate the following statements:
  - "maxwell1_c" returns a false-y response because of a lack of uppercase characters
  - "maxwellTheBe" returns a false-y response because of a lack of digits
  - "thePhysical1234567" returns a false-y response because of exceeding the 15 character length
- Once I have made the aforementioned tests pass, I have refactored my test specifications to use it.each() to perform parameterization if there is sufficient duplication
- There is no duplication in my test code or my production code


