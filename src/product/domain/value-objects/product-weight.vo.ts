export class ProductWeight {
    private readonly value: string;
  
    constructor(value: string) {
      if (!value || value.trim().length === 0) {
          throw new Error('Product weight cannot be empty');
      }
      this.value = value.trim();
    }

    getValue(): string {
      return this.value;
    }
  }
  