export class CategoryName {
    private readonly value: string;
  
    constructor(value: string) {
      if (!value || value.trim().length === 0) {
        throw new Error('Category name must not be empty');
      }
      this.value = value.trim();
    }
  
    getValue(): string {
      return this.value;
    }
  }
  