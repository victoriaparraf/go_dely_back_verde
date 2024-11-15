import { Product } from "src/product/domain/entities/product.entity";

export class Combo {
    constructor(
      public readonly id: string,
      public name: string,
      public description: string,
      public price: number,
      public products: Product[] = []
    ) {}
  
    addProduct(product: Product) {
      this.products.push(product);
    }
  }
  