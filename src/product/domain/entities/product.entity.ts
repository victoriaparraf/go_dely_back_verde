import { Combo } from "src/combo/domain/entities/combo.entity";
import { Image } from "./image.entity"; 
import { ProductCurrency } from "../value-objects/poduct-currency.vo";
import { ProductMeasurement } from "../value-objects/product-measurement.vo";
import { ProductPrice } from "../value-objects/product-price.vo";
import { ProductWeight } from "../value-objects/product-weight.vo";

export class Product {
  product_id: string;
  product_name: string;
  product_description: string;
  product_price: ProductPrice;
  product_currency: ProductCurrency;
  product_measurement: ProductMeasurement;
  product_weight: ProductWeight;
  product_stock: number;
  images: Image[];
  product_category: string;
  combos: Combo[];

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    currency: string,
    measurement: string,
    weight: string,
    stock: number,
    category: string,
    images: Image[],
    combos: Combo[] = []
  ) {
    this.product_id = id;
    this.product_name = name;
    this.product_description = description;
    this.product_price = new ProductPrice(price);
    this.product_currency = new ProductCurrency(currency);
    this.product_measurement = new ProductMeasurement(measurement);
    this.product_weight = new ProductWeight(weight);
    this.product_stock = stock;
    this.product_category = category;
    this.images = images;
    this.combos = combos;
  }
}
