export class ProductPrice {
    constructor(public readonly value: number) {
      if (value <= 0) {
        throw new Error('Product price must be a positive number.');
      }
    }
  }