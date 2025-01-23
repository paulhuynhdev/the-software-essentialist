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
    VALID_EXPR: /^[() ]*(TRUE|FALSE|NOT|AND|OR)[() TRUE|FALSE|NOT|AND|OR]*$/,
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

  private validateExpression(expr: string): void {
    if (!expr) throw new Error("Empty expression");

    const parenCount = (expr.match(/\(/g) || []).length;
    if (parenCount !== (expr.match(/\)/g) || []).length) {
      throw new Error("Unmatched parentheses");
    }

    const validateOperators = (expr: string): void => {
      if (expr.endsWith("AND") || expr.endsWith("OR")) {
        throw new Error("Invalid expression");
      }

      if (expr.startsWith("AND") || expr.startsWith("OR")) {
        throw new Error("Invalid expression");
      }

      if (expr === "NOT") {
        throw new Error("Invalid expression");
      }
    };

    const validateBooleans = (expr: string): void => {
      const values = expr.match(/TRUE|FALSE/g) || [];
      const invalidValues = expr.match(/[A-Z]+/g) || [];

      if (
        invalidValues.some(
          (v) => v !== "TRUE" && v !== "FALSE" && v !== "AND" && v !== "OR" && v !== "NOT"
        )
      ) {
        throw new Error("Invalid expression");
      }
    };

    validateOperators(expr);
    validateBooleans(expr);
  }

  evaluate(expression: string): boolean {
    this.validateExpression(expression);

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
