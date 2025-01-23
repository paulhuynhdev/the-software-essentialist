class BooleanCalculator {
  private readonly OPERATORS = {
    NOT: "NOT ",
    AND: " AND ",
    OR: " OR ",
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

  private evaluateOr(expression: string): boolean {
    const [left, right] = expression.split(" OR ");
    return this.evaluate(left) || this.evaluate(right);
  }

  evaluate(expression: string): boolean {
    let evaluatedExpression = expression;

    while (evaluatedExpression.includes(this.OPERATORS.NOT)) {
      const notPattern = /NOT (TRUE|FALSE)/;
      const match = evaluatedExpression.match(notPattern);
      if (match) {
        const [fullMatch, operand] = match;
        const evaluated = this.evaluateNot(`NOT ${operand}`);
        evaluatedExpression = evaluatedExpression.replace(fullMatch, evaluated ? "TRUE" : "FALSE");
      } else {
        break;
      }
    }

    while (evaluatedExpression.includes(this.OPERATORS.AND)) {
      const andPattern = /(TRUE|FALSE) AND (TRUE|FALSE)/;
      const match = evaluatedExpression.match(andPattern);
      if (match) {
        const [fullMatch, left, right] = match;
        const evaluated = this.evaluateAnd(`${left}${this.OPERATORS.AND}${right}`);
        evaluatedExpression = evaluatedExpression.replace(fullMatch, evaluated ? "TRUE" : "FALSE");
      } else {
        break;
      }
    }

    while (evaluatedExpression.includes(this.OPERATORS.OR)) {
      const orPattern = /(TRUE|FALSE) OR (TRUE|FALSE)/;
      const match = evaluatedExpression.match(orPattern);
      if (match) {
        const [fullMatch, left, right] = match;
        const evaluated = this.evaluateOr(`${left}${this.OPERATORS.OR}${right}`);
        evaluatedExpression = evaluatedExpression.replace(fullMatch, evaluated ? "TRUE" : "FALSE");
      } else {
        break;
      }
    }

    return this.evaluateSingleValue(evaluatedExpression);
  }
}

export { BooleanCalculator };
