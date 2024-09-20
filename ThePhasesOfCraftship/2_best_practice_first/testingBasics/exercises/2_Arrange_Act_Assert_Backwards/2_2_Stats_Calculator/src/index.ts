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

  public max() {
    let maxNumber;

    for (const number of this.sequence) {
      if (maxNumber === undefined || number > maxNumber) {
        maxNumber = number;
      }
    }

    return maxNumber;
  }

  public countElement() {
    let count = 0;

    for (const _ of this.sequence) {
      count++;
    }

    return count;
  }

  public average() {
    let sum = 0;

    for (const number of this.sequence) {
      sum += number;
    }

    const average = sum / this.sequence.length;
    return parseFloat(average.toFixed(12));
  }
}

export default StatsCalculator;
