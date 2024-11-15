export class ProductName {
  constructor(public readonly value: string) {
    if (!value || value.length < 1) {
      throw new Error('Product name must be at least 1 character.');
    }
  }
}
