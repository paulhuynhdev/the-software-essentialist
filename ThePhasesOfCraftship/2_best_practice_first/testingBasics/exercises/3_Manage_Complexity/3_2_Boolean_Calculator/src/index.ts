class BooleanCalculator {
  private readonly OPERATORS = {
    NOT: "NOT ",
    AND: " AND ",
    OR: " OR ",
  };

  private readonly PATTERNS = {
    PAREN: /\((TRUE|FALSE|[^()]+)\)/,
    NOT: /NOT (TRUE|FALSE)/,
    AND: /(TRUE|FALSE) AND (TRUE|FALSE)/,
    OR: /(TRUE|FALSE) OR (TRUE|FALSE)/,
  };

  constructor() {}

  private evaluateParentheses(expression: string): string {
    let result = expression;
    while (result.includes("(")) {
      const match = result.match(this.PATTERNS.PAREN);
      if (!match) break;

      const innerExpression = match[1];
      const evaluated = this.evaluate(innerExpression);
      result = result.replace(match[0], evaluated ? "TRUE" : "FALSE");
    }
    return result;
  }

  evaluate(expression: string): boolean {
    let evaluatedExpression = expression;

    evaluatedExpression = this.evaluateParentheses(evaluatedExpression);
    evaluatedExpression = this.evaluateOperator(evaluatedExpression, "NOT");
    evaluatedExpression = this.evaluateOperator(evaluatedExpression, "AND");
    evaluatedExpression = this.evaluateOperator(evaluatedExpression, "OR");

    return this.evaluateSingleValue(evaluatedExpression);
  }

  private evaluateOperator(expression: string, operator: keyof typeof this.OPERATORS): string {
    let result = expression;
    while (result.includes(this.OPERATORS[operator])) {
      const match = result.match(this.PATTERNS[operator]);
      if (!match) break;

      const evaluated = this.evaluateExpression(match, operator);
      result = result.replace(match[0], evaluated ? "TRUE" : "FALSE");
    }
    return result;
  }

  private evaluateExpression(
    match: RegExpMatchArray,
    operator: keyof typeof this.OPERATORS
  ): boolean {
    switch (operator) {
      case "NOT":
        return this.evaluateNot(`NOT ${match[1]}`);
      case "AND":
        return this.evaluateAnd(`${match[1]}${this.OPERATORS.AND}${match[2]}`);
      case "OR":
        return this.evaluateOr(`${match[1]}${this.OPERATORS.OR}${match[2]}`);
    }
  }

  private evaluateNot(expression: string): boolean {
    const operand = expression.substring(4);
    return !this.evaluate(operand);
  }

  private evaluateAnd(expression: string): boolean {
    const [left, right] = expression.split(this.OPERATORS.AND);
    return this.evaluate(left) && this.evaluate(right);
  }

  private evaluateOr(expression: string): boolean {
    const [left, right] = expression.split(this.OPERATORS.OR);
    return this.evaluate(left) || this.evaluate(right);
  }

  private evaluateSingleValue(expression: string): boolean {
    return expression === "TRUE";
  }
}

export { BooleanCalculator };
