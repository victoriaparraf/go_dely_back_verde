import { ProductCategory } from "../value-objects/product-category.vo";
import { ProductCurrency } from "../value-objects/product-currency.vo";
import { ProductDescription } from "../value-objects/product-description.vo";
import { ProductName } from "../value-objects/product-name.vo";
import { ProductPrice } from "../value-objects/product-price.vo";
import { ProductStock } from "../value-objects/product-stock.vo";
import { ProductWeight } from "../value-objects/product-weight.vo";

export class Product {
  id: string;

  constructor(

    public product_id: string,

    public product_name: ProductName,

    public product_description: ProductDescription,

    public product_price: ProductPrice,

    public product_currency: ProductCurrency,

    public product_weight: ProductWeight,

    public product_stock: ProductStock,

    public images: string[],

    public product_category: ProductCategory,

  ) {}

}
