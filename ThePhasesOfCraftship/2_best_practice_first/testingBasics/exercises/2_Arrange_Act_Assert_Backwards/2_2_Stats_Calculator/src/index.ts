export type Sequence = number[];

class StatsCalculator {
  sequence: Sequence;

  constructor(sequence: Sequence) {
    this.sequence = sequence;
  }

  public min() {
    let minNumber;

    for (const number of this.sequence) {
      if (minNumber === undefined || number < minNumber) {
        minNumber = number;
      }
    }

    return minNumber;
  }
}

export default StatsCalculator;
