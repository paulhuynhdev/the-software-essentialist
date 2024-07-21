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
    return this.isValidTimeFormat(this.startTime);
  }

  private isValidEndTime(): boolean {
    return this.isValidTimeFormat(this.endTime);
  }

  private isValidTimeFormat(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  }

  private isEndTimeAfterStartTime() {
    return this.endTime > this.startTime;
  }

  get endTime(): string {
    const times = this.timeRange.split(" - ");
    return times[1];
  }

  get startTime(): string {
    const times = this.timeRange.split(" - ");
    return times[0];
  }
}

export default MilitaryTimeValidator;
