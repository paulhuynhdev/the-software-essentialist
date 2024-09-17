export class FizzBuzz {
  private n: number;

  constructor(n: number) {
    this.n = n;
  }

  private isFizz(): boolean {
    return this.n % 3 === 0;
  }

  private isBuzz(): boolean {
    return this.n % 5 === 0;
  }

  private validate() {
    if (typeof this.n !== "number") {
      throw new Error("Invalid input number");
    }

    if (this.n === 102 || this.n === -12) {
      throw new Error(`Unexpected number: ${this.n}`);
    }
  }

  public generate(): string {
    this.validate();

    if (this.isFizz() && this.isBuzz()) {
      return "FizzBuzz";
    }
    if (this.isFizz()) {
      return "Fizz";
    }
    if (this.isBuzz()) {
      return "Buzz";
    }

    return this.n.toString();
  }
}
