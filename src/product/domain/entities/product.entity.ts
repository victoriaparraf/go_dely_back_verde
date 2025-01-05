import { Combo } from "src/combo/domain/entities/combo.entity";
import { Category } from "src/category/domain/category.entity";
import { Discount } from "src/discount/infraestructure/typeorm/discount.entity";
import { ImageEntity } from "./image.entity"; 
import { ProductCurrency } from "../value-objects/poduct-currency.vo";
import { ProductMeasurement } from "../value-objects/product-measurement.vo";
import { ProductPrice } from "../value-objects/product-price.vo";
import { ProductWeight } from "../value-objects/product-weight.vo";
import { ProductDescription } from "../value-objects/product-description.vo";
import { ProductName } from "../value-objects/product-name.vo";

export class Product {
  
  product_id: string;
  product_name: ProductName;
  product_description: ProductDescription;
  product_price: ProductPrice;
  product_currency: ProductCurrency;
  product_measurement: ProductMeasurement;
  product_weight: ProductWeight;
  product_stock: number;
  images: ImageEntity[];
  product_category: Category;
  combos: Combo[];
  discount?: Discount;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    currency: string,
    measurement: string,
    weight: string,
    stock: number,
    category: Category,
    images: ImageEntity[],
    combos: Combo[] = [],
    discount?: Discount
  ) {
    this.product_id = id;
    this.product_name = new ProductName(name);
    this.product_description = new ProductDescription(description);
    this.product_price = new ProductPrice(price);
    this.product_currency = new ProductCurrency(currency);
    this.product_measurement = new ProductMeasurement(measurement);
    this.product_weight = new ProductWeight(weight);
    this.product_stock = stock;
    this.product_category = category;
    this.images = images;
    this.combos = combos;
    this.discount = discount;
  }
}
