import { describe, it, expect } from "@jest/globals";
import MilitaryTimeValidator from "./index";

describe("military time validator", () => {
  const testCases = [
    ["01:12 - 14:32", "yes"],
    ["22:00 - 23:12", "yes"],
    ["25:00 - 12:23", "no"],
    ["24:00 - 00:00", "no"],
    ["12:00 - 12:00", "no"],
    ["12:59 - 12:00", "no"],
  ];

  it.each(testCases)(
    "should return '%s' when validating '%s'",
    (timeRange, expected) => {
      const militaryTimeValidator = new MilitaryTimeValidator(timeRange);
      const result = militaryTimeValidator.validateTimeRange();
      expect(result).toEqual(expected);
    }
  );
});
