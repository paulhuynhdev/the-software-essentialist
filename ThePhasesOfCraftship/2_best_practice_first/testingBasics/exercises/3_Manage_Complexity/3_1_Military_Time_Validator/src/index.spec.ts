import { describe, it, expect } from "@jest/globals";
import MilitaryTimeValidator from "./index";

describe("military time validator", () => {
  it("should return 'yes' when validating '01:12 - 14:32'", () => {
    const militaryTimeValidator = new MilitaryTimeValidator("01:12 - 14:32");
    const result = militaryTimeValidator.validate;
    expect(result).toEqual("yes");
  });
});
