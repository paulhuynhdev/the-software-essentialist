import { describe, expect, it } from "@jest/globals";
import StatsCalculator from "./index";
describe("stats calculator", () => {
  it("should return -8 as minimum value from sequence [2, 4, 21, -8, 53, 40]", () => {
    // arrange
    const sequence = [2, 4, 21, -8, 53, 40];
    const statsCalculator = new StatsCalculator(sequence);
    // act
    const result = statsCalculator.min();
    // assert
    expect(result).toEqual(-8);
  });
});
