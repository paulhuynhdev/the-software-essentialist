class BooleanCalculator {
  private readonly OPERATORS = {
    NOT: "NOT ",
    AND: " AND ",
  };
  constructor() {}

  private evaluateNot(expression: string): boolean {
    const operand = expression.substring(4);
    return !this.evaluate(operand);
  }

  private evaluateAnd(expression: string): boolean {
    const [left, right] = expression.split(this.OPERATORS.AND);
    return this.evaluate(left) && this.evaluate(right);
  }

  private evaluateSingleValue(expression: string): boolean {
    return expression === "TRUE";
  }

  evaluate(expression: string): boolean {
    if (expression.startsWith(this.OPERATORS.NOT)) {
      return this.evaluateNot(expression);
    }

    if (expression.includes(this.OPERATORS.AND)) {
      return this.evaluateAnd(expression);
    }

    return this.evaluateSingleValue(expression);
  }
}

export { BooleanCalculator };
