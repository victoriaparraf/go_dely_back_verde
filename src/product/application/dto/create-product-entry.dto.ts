export class CreateProductServiceEntryDto {
    product_name: string;
    product_description: string;
    product_price: number;
    product_currency: string;
    product_weight: number;
    product_measurement: string;
    product_stock: number;
    product_category: string;
    images: string[];
  }