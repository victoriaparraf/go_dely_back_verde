import { Product } from "src/product/domain/entities/product.entity";
import { ComboName } from "../value-objects/combo-name.vo";
import { ComboPrice } from "../value-objects/combo-price.vo";
import { ComboDescription } from "../value-objects/combo-description.vo";
import { ComboCurrency } from "../value-objects/combo-currency.vo";
import { ComboStock } from "../value-objects/combo-stock.vo";
import { Category } from "src/category/domain/category-aggregate";
import { Currency } from "src/common/domain/enums/currency.enum";
import { ComboWeight } from "../value-objects/combo-weight.vo";
import { ComboMeasurement } from "../value-objects/combo-measurement.vo";
import { ComboCaducityDate } from "../value-objects/combo-caducity-date.vo";
import { ComboImage } from "../value-objects/combo-image.vo";
import { Discount } from "src/discount/domain/discount-aggregate";
import { ComboID } from "../value-objects/combo-id.vo";

export class Combo {

    combo_id: ComboID;
    combo_name: ComboName;
    combo_price: ComboPrice;
    combo_description: ComboDescription;
    combo_weight: ComboWeight;
    combo_measurement: ComboMeasurement;
    combo_currency: ComboCurrency;
    combo_stock: ComboStock;
    combo_caducity_date: ComboCaducityDate;
    combo_categories: Category[];
    combo_images: ComboImage[];
    products: Product[];
    combo_discount: Discount;

    constructor(
        
        id: string,
        name: string,
        description: string,
        price: number,
        weight: number,
        measurement: string,
        currency: Currency,
        stock: number,
        caducity_date: Date,
        categories: Category[] = [],
        image: ComboImage[] = [],
        products: Product[] = [],
        discount: Discount
    ) {
        this.combo_id = new ComboID(id);
        this.combo_name = new ComboName(name);
        this.combo_description = new ComboDescription(description);
        this.combo_price = new ComboPrice(price);
        this.combo_weight = new ComboWeight(weight);
        this.combo_measurement = new ComboMeasurement(measurement);
        this.combo_currency = new ComboCurrency(currency);
        this.combo_stock = new ComboStock(stock);
        this.combo_caducity_date = new ComboCaducityDate(caducity_date);
        this.combo_categories = categories;
        this.combo_images = image;
        this.products = products;
        this.combo_discount = discount;
    }

}
