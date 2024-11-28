export class ProductCurrency {
    protected readonly value: string;
  
    constructor(value: string) {
      if (!this.isValidCurrency(value)) {
        throw new Error(`Invalid currency format: ${value}`);
      }
      this.value = value;
    }
  
    private isValidCurrency(value: string): boolean {
      return /^[A-Za-z]{3}$/.test(value);
    }
  
    public getValue(): string {
      return this.value;
    }
  }
  