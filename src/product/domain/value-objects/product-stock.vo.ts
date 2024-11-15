export class ProductStock {
    constructor(public readonly value: number) {
      if (value < 0) {
        throw new Error('Product stock cannot be negative.');
      }
    }
  }