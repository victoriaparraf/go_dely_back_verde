import { AggregateRoot } from "src/common/domain/aggregate.root";
import { ComboID } from "./value-objects/combo-id.vo";
import { ComboName } from "./value-objects/combo-name.vo";
import { ComboPrice } from "./value-objects/combo-price.vo";
import { ComboDescription } from "./value-objects/combo-description.vo";
import { ComboStock } from "./value-objects/combo-stock.vo";
import { ComboCurrency } from "./value-objects/combo-currency.vo";
import { ComboCreatedEvent } from "./events/combo-created.event";
import { unvalidComboException } from "./exceptions/unvalid-combo";
import { ComboImage } from "./value-objects/combo-image.vo";
import { Product } from "src/product/domain/entities/product.entity";
import { Category } from "src/category/domain/category.entity";
import { Discount } from "src/discount/domain/entities/discount.entity";
import { ComboWeight } from "./value-objects/combo-weight.vo";
import { ComboMeasurement } from "./value-objects/combo-measurement.vo";
import { ComboCaducityDate } from "./value-objects/combo-caducity-date.vo";

export class Combo extends AggregateRoot<ComboID> {
    
    private name: ComboName;
    private description: ComboDescription;
    private price: ComboPrice;
    private weight: ComboWeight;
    private measurement: ComboMeasurement;
    private currency: ComboCurrency;
    private stock: ComboStock;
    private products: Product[];
    private images: ComboImage[];
    private categories: Category[];
    private caducity_date?: ComboCaducityDate;
    private discount?: Discount;

    get Name(): ComboName {
        return this.name;
    }

    get Description(): ComboDescription {
        return this.description;
    }

    get Price(): ComboPrice {
        return this.price;
    }

    get Weight(): ComboWeight {
        return this.weight;
    }

    get Measurement(): ComboMeasurement {
        return this.measurement;
    }

    get Currency(): ComboCurrency {
        return this.currency;
    }

    get Stock(): ComboStock {     
        return this.stock;
    }

    get CaducityDate(): ComboCaducityDate {
        return this.caducity_date;
    }

    get Categories(): Category[] {
        return this.categories;
    }

    get Discount(): Discount {
        return this.discount;
    }

    get Products(): Product[] {
        return this.products;
    }

    get Images(): ComboImage[] {
        return this.images;
    }

    constructor(

        id: ComboID, 
        name: ComboName, 
        description: ComboDescription, 
        price: ComboPrice, 
        currency: ComboCurrency, 
        stock: ComboStock,
        weight: ComboWeight,
        measurement: ComboMeasurement,
        caducity_date: ComboCaducityDate,
        categories: Category[] = [],
        products: Product[]=[],
        images: ComboImage[] = [],
        discount?: Discount

    ) {
        const createdCombo = ComboCreatedEvent.create(id, name, description, price, weight, measurement, currency, stock, categories, images, products, caducity_date, discount);
        super(id);
        this.isValidCombo();
        super.addDomainEvent(createdCombo);
    }

    protected isValidCombo(): void{
        if( !this.name || !this.description || !this.price || !this.weight || !this.measurement || !this.currency || !this.stock || !this.categories || !this.images || !this.products ){
            throw new unvalidComboException('Not valid Combo');
        }
    }

}