import { describe, expect, it } from "@jest/globals";
import StatsCalculator from "./index";
describe("stats calculator", () => {
  describe("min method", () => {
    it.each([
      [[2, 4, 21, -8, 53, 40], -8],
      [[], undefined],
    ])(
      "knows that it sequence %s will return %j as minimum value",
      (sequence, expected) => {
        const statsCalculator = new StatsCalculator(sequence);
        expect(statsCalculator.min()).toEqual(expected);
      }
    );
  });

  describe("max method", () => {
    it.each([
      [[2, 4, 21, -8, 53, 40], 53],
      [[], undefined],
    ])(
      "knows that it sequence %s will return %j as maximum value",
      (sequence, expected) => {
        const statsCalculator = new StatsCalculator(sequence);
        expect(statsCalculator.max()).toEqual(expected);
      }
    );
  });

  describe("countElement method", () => {
    it.each([
      [[2, 4, 21, -8, 53, 40], 6],
      [[], 0],
    ])(
      "knows that it sequence %s will return %j as number of element",
      (sequence, expected) => {
        const statsCalculator = new StatsCalculator(sequence);
        expect(statsCalculator.countElement()).toEqual(expected);
      }
    );
  });

  describe("average method", () => {
    it.each([
      [[2, 4, 21, -8, 53, 40], 18.666666666667],
      [[], NaN],
    ])(
      "knows that it sequence %s will return %j as number of element",
      (sequence, expected) => {
        const statsCalculator = new StatsCalculator(sequence);
        expect(statsCalculator.average()).toEqual(expected);
      }
    );
  });
});
