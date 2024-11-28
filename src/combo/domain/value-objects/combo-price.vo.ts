export class ComboPrice {
  
    protected readonly value: number;
  
    constructor(value: number) {
      if (value < 0) {
        throw new Error(`Price must be a positive number: ${value}`);
      }
      this.value = value;
    }
  
    public getValue(): number {
      return this.value;
    }
  }