export type Sequence = number[];

class StatsCalculator {
  sequence: Sequence;

  constructor(sequence: Sequence) {
    this.sequence = sequence;
  }

  public min() {
    let result;

    for (const n of this.sequence) {
      if (result === undefined) {
        result = n;
      }
      if (n < result) {
        result = n;
      }
    }

    return result;
  }
}

export default StatsCalculator;
