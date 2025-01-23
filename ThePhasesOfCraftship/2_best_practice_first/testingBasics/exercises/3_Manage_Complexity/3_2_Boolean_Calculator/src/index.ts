class BooleanCalculator {
  constructor() {}

  evaluate(expression: string): boolean {
    if (expression.startsWith("NOT ")) {
      const operand = expression.substring(4);
      return !this.evaluate(operand);
    }

    if (expression.includes(" AND ")) {
      const [left, right] = expression.split(" AND ");
      return this.evaluate(left) && this.evaluate(right);
    }

    return expression === "TRUE";
  }
}

export { BooleanCalculator };
