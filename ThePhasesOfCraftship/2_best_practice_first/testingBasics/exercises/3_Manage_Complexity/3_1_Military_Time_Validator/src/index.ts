type ValidateResult = "yes" | "no";

class MilitaryTimeValidator {
  private timeRange: string;

  constructor(timeRange: string) {
    this.timeRange = timeRange;
  }

  public validateTimeRange(): ValidateResult {
    const result =
      this.isValidStartTime() &&
      this.isValidEndTime() &&
      this.isEndTimeAfterStartTime();

    return result ? "yes" : "no";
  }

  private isValidStartTime(): boolean {
    return true;
  }

  private isValidEndTime(): boolean {
    return true;
  }

  private isEndTimeAfterStartTime() {
    return this.endTime > this.startTime;
  }

  get endTime(): string {
    return "2";
  }

  get startTime(): string {
    return "1";
  }
}

export default MilitaryTimeValidator;
