import { AggregateRoot } from "src/common/domain/aggregate.root";
import { ComboID } from "./value-objects/combo-id.vo";
import { ComboName } from "./value-objects/combo-name.vo";
import { ComboPrice } from "./value-objects/combo-price.vo";
import { ComboDescription } from "./value-objects/combo-description.vo";
import { ComboStock } from "./value-objects/combo-stock.vo";
import { ComboCurrency } from "./value-objects/combo-currency.vo";
import { CategoryID } from "src/category/domain/value-objects/category-id.vo";
import { DiscountID } from "src/discount/domain/value-objects/discount-id.vo";
import { ProductID } from "src/product/domain/value-objects/product-id.vo";
import { ComboCreatedEvent } from "./events/combo-created.event";
import { unvalidComboException } from "./exceptions/unvalid-combo";

export class Combo extends AggregateRoot<ComboID> {
    
    private name: ComboName;
    private description: ComboDescription;
    private price: ComboPrice;
    private currency: ComboCurrency;
    private stock: ComboStock;
    private category: CategoryID;
    private discount?: DiscountID;
    private products: ProductID[];

    get Name(): ComboName {
        return this.name;
    }

    get Description(): ComboDescription {
        return this.description;
    }

    get Price(): ComboPrice {
        return this.price;
    }

    get Currency(): ComboCurrency {
        return this.currency;
    }

    get Stock(): ComboStock {     
        return this.stock;
    }

    get Category(): CategoryID {
        return this.category;
    }

    get Discount(): DiscountID {
        return this.discount;
    }

    get Products(): ProductID[] {
        return this.products;
    }

    constructor(

        id: ComboID, 
        name: ComboName, 
        description: ComboDescription, 
        price: ComboPrice, 
        currency: ComboCurrency, 
        stock: ComboStock,
        category: CategoryID,
        discount?: DiscountID,
        products: ProductID[]=[]

    ) {
        const createdCombo = ComboCreatedEvent.create(id, name, description, price, currency, stock, category, products, discount);
        super(id);
        super.addDomainEvent(createdCombo);
    }

    protected isValidCombo(): void{
        if(!this.name || !this.description || !this.price || !this.currency || !this.stock || !this.category){
            throw new unvalidComboException('Not valid Combo');
        }
    }

}