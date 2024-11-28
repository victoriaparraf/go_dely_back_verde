export class ProductMeasurement {
    protected readonly value: string;
  
    constructor(value: string) {
      if (!this.isValidMeasurement(value)) {
        throw new Error(`Invalid measurement format: ${value}`);
      }
      this.value = value;
    }
  
    private isValidMeasurement(value: string): boolean {
      return /^[a-z]{2}$/.test(value);
    }
  
    public getValue(): string {
      return this.value;
    }
  }
  