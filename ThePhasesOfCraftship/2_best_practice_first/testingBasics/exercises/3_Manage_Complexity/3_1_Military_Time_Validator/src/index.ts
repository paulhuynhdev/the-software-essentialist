class MilitaryTimeValidator {
  private timeRange: string;

  constructor(timeRange: string) {
    this.timeRange = timeRange;
  }

  get validate(): string {
    return "yes";
  }
}

export default MilitaryTimeValidator;
