export class ProductCurrency {
    constructor(public readonly value: string) {
      if (!value || value.length !== 3) {
        throw new Error('Product currency must be a valid 3-letter currency code.');
      }
    }
  }