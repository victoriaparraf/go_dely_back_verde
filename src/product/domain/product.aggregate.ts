import { AggregateRoot } from "../../common/domain/aggregate.root";
import { ProductMeasurement } from "./value-objects/product-measurement.vo";
import { ProductPrice } from "./value-objects/product-price.vo";
import { ProductWeight } from "./value-objects/product-weight.vo";
import { ProductDescription } from "./value-objects/product-description.vo";
import { ProductName } from "./value-objects/product-name.vo";
import { ProductID } from "./value-objects/product-id.vo";
import { Combo } from "src/combo/domain/entities/combo.entity";
import { Category } from "src/category/domain/category.entity";
import { Discount } from "src/discount/infraestructure/typeorm/discount.entity";
import { Image } from "../domain/entities/image.entity"; 
import { ProductStock } from "./value-objects/product-stock.vo";
import { ProductCurrency } from "./value-objects/poduct-currency.vo";

export class Product extends AggregateRoot<ProductID> {
    private product_name: ProductName;
    private product_description: ProductDescription;
    private product_price: ProductPrice;
    private product_currency: ProductCurrency;
    private product_measurement: ProductMeasurement;
    private product_weight: ProductWeight;
    private product_stock: ProductStock;
    private images: Image[];
    private product_category: Category;
    private combos: Combo[];
    private discount?: Discount;

    constructor(
        id: ProductID,
        name: ProductName,
        description: ProductDescription,
        price: ProductPrice,
        currency: ProductCurrency,
        measurement: ProductMeasurement,
        weight: ProductWeight,
        stock: ProductStock,
        category: Category,
        images: Image[],
        combos: Combo[] = [],
        discount?: Discount
    ) {
        super(id);
        this.product_name = name;
        this.product_description = description;
        this.product_price = price;
        this.product_currency = currency;
        this.product_measurement = measurement;
        this.product_weight = weight;
        this.product_stock = stock;
        this.product_category = category;
        this.images = images;
        this.combos = combos;
        this.discount = discount;
    }

    get productName(): ProductName {
        return this.product_name;
    }

    get productDescription(): ProductDescription {
        return this.product_description;
    }

    get imagesList(): Image[] {
        return this.images;
    }

    get combosList(): Combo[] {
        return this.combos;
    }

    get productPrice(): ProductPrice {
        return this.product_price;
    }

    get productCurrency(): ProductCurrency {
        return this.product_currency;
    }

    get productWeight(): ProductWeight {
        return this.product_weight;
    }

    get productMeasurement(): ProductMeasurement {
        return this.product_measurement;
    }

    get productStock(): ProductStock {
        return this.product_stock;
    }

    get productDiscount(): Discount | undefined {
        return this.discount;
    }

    get productCategory(): Category {
        return this.product_category;
    }
}