import { describe, it, expect } from "@jest/globals";
import MilitaryTimeValidator from "./index";

describe("military time validator", () => {
  it("should return 'yes' when validating '01:12 - 14:32'", () => {
    const militaryTimeValidator = new MilitaryTimeValidator("01:12 - 14:32");
    const result = militaryTimeValidator.validateTimeRange();
    expect(result).toEqual("yes");
  });

  it("should return 'yes' when validating '22:00 - 23:12'", () => {
    const militaryTimeValidator = new MilitaryTimeValidator("22:00 - 23:12");
    const result = militaryTimeValidator.validateTimeRange();
    expect(result).toEqual("yes");
  });

  it("should return 'no' when validating '25:00 - 12:23'", () => {
    const militaryTimeValidator = new MilitaryTimeValidator("25:00 - 12:23");
    const result = militaryTimeValidator.validateTimeRange();
    expect(result).toEqual("no");
  });
});
