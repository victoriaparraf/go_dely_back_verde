export class ProductDTO {
    constructor(
      public readonly product_id: string,
      public readonly product_name: string,
      public readonly product_description: string,
      public readonly product_price: number,
      public readonly product_currency: string,
      public readonly product_weight: string,
      public readonly product_stock: number,
      public readonly product_category: string,
    ) {}
  }
  