import { describe, expect, it } from "@jest/globals";
import StatsCalculator, { Sequence } from "./index";
describe("stats calculator", () => {
  it("should return -8 as minimum value from sequence [2, 4, 21, -8, 53, 40]", () => {
    // arrange
    const sequence: Sequence = [2, 4, 21, -8, 53, 40];
    const statsCalculator = new StatsCalculator(sequence);
    // act
    const result = statsCalculator.min();
    // assert
    expect(result).toEqual(-8);
  });

  it("should return undefined as minimum value from sequence []", () => {
    // arrange
    const sequence: Sequence = [];
    const statsCalculator = new StatsCalculator(sequence);
    // act
    const result = statsCalculator.min();
    // assert
    expect(result).toEqual(undefined);
  });

  it("should return 53 as maximum value from sequence [2, 4, 21, -8, 53, 40]", () => {
    // arrange
    const sequence: Sequence = [2, 4, 21, -8, 53, 40];
    const statsCalculator = new StatsCalculator(sequence);
    // act
    const result = statsCalculator.max();
    // assert
    expect(result).toEqual(53);
  });

  it("should return undefined as maximum value from sequence []", () => {
    // arrange
    const sequence: Sequence = [];
    const statsCalculator = new StatsCalculator(sequence);
    // act
    const result = statsCalculator.max();
    // assert
    expect(result).toEqual(undefined);
  });

  it("should return 6 as number of element from sequence [2, 4, 21, -8, 53, 40]", () => {
    // arrange
    const sequence: Sequence = [2, 4, 21, -8, 53, 40];
    const statsCalculator = new StatsCalculator(sequence);
    // act
    const result = statsCalculator.countElement();
    // assert
    expect(result).toEqual(6);
  });

  it("should return 0 as number of element from sequence []", () => {
    // arrange
    const sequence: Sequence = [];
    const statsCalculator = new StatsCalculator(sequence);
    // act
    const result = statsCalculator.countElement();
    // assert
    expect(result).toEqual(0);
  });

  it("should return 18.666666666667 as average value from sequence [2, 4, 21, -8, 53, 40]", () => {
    // arrange
    const sequence: Sequence = [2, 4, 21, -8, 53, 40];
    const statsCalculator = new StatsCalculator(sequence);
    // act
    const result = statsCalculator.average();
    // assert
    expect(result).toEqual(18.666666666667);
  });

  it("should return NaN as average value from sequence []", () => {
    // arrange
    const sequence: Sequence = [];
    const statsCalculator = new StatsCalculator(sequence);
    // act
    const result = statsCalculator.average();
    // assert
    expect(result).toBeNaN();
  });
});
