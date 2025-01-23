class BooleanCalculator {
  constructor() {}

  evaluate(expression: string): boolean {
    if (expression.startsWith("NOT ")) {
      const operand = expression.substring(4);
      return !this.evaluate(operand);
    }

    return expression === "TRUE";
  }
}

export { BooleanCalculator };
