import { describe, expect, it } from "@jest/globals";
import { FizzBuzz } from "./fizzbuzz";

describe("fizzbuzz", () => {
  it.each([3, 9, 42])(
    'should return "Fizz" for multiples of 3',
    (n: number) => {
      const fizzBuzz = new FizzBuzz(n);
      const result = fizzBuzz.generate();
      expect(typeof result).toBe("string");
      expect(result).toEqual("Fizz");
    }
  );

  it.each([15, 45])(
    'should return "Fizz" for multiples of 3 and 5',
    (n: number) => {
      const fizzBuzz = new FizzBuzz(n);
      const result = fizzBuzz.generate();
      expect(typeof result).toBe("string");
      expect(result).toEqual("FizzBuzz");
    }
  );

  it('should return "Buzz" when input is 5', () => {
    const fizzBuzz = new FizzBuzz(5);
    const result = fizzBuzz.generate();
    expect(typeof result).toBe("string");
    expect(result).toEqual("Buzz");
  });

  it('should return "43" when input is 43', () => {
    const fizzBuzz = new FizzBuzz(43);
    const result = fizzBuzz.generate();
    expect(typeof result).toBe("string");
    expect(result).toEqual("43");
  });

  it("should throw error when input is 102", () => {
    const fizzBuzz = new FizzBuzz(102);
    expect(() => fizzBuzz.generate()).toThrow(`Unexpected number: 102`);
  });

  it("should throw error when input is -12", () => {
    const fizzBuzz = new FizzBuzz(-12);
    expect(() => fizzBuzz.generate()).toThrow(`Unexpected number: -12`);
  });

  it("should throw error when input is not a valid number", () => {
    // @ts-ignore
    const fizzBuzz = new FizzBuzz("invalid");
    expect(() => fizzBuzz.generate()).toThrow("Invalid input number");
  });
});
