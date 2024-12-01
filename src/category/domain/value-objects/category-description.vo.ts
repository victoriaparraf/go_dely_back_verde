export class CategoryDescription {
    private readonly value: string;
  
    constructor(value: string) {
      if (!value || value.trim().length === 0) {
        throw new Error('Category description must not be empty');
      }
      this.value = value.trim();
    }
  
    getValue(): string {
      return this.value;
    }
  }
  