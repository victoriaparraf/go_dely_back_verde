import { DomainEventBase } from 'src/common/domain/event';
import { ComboID } from '../value-objects/combo-id.vo';
import { ComboName } from '../value-objects/combo-name.vo';
import { ComboDescription } from '../value-objects/combo-description.vo';
import { ComboPrice } from '../value-objects/combo-price.vo';
import { ComboCurrency } from '../value-objects/combo-currency.vo';
import { ComboStock } from '../value-objects/combo-stock.vo';
import { CategoryID } from 'src/category/domain/value-objects/category-id.vo';
import { DiscountID } from 'src/discount/domain/value-objects/discount-id.vo';
import { ProductID } from 'src/product/domain/value-objects/product-id.vo';

export class ComboCreatedEvent extends DomainEventBase {

    constructor(
        public readonly comboId: ComboID,
        public readonly name: ComboName,
        public readonly description: ComboDescription,
        public readonly price: ComboPrice,
        public readonly currency: ComboCurrency,
        public readonly stock: ComboStock,
        public readonly category: CategoryID,
        public readonly products: ProductID[],
        public readonly discount?: DiscountID
    ) {
        super();
    }

    static create(

        comboId: ComboID,
        name: ComboName,
        description: ComboDescription,
        price: ComboPrice,
        currency: ComboCurrency,
        stock: ComboStock,
        category: CategoryID,
        products: ProductID[],
        discount?: DiscountID

    ): ComboCreatedEvent{
        return new ComboCreatedEvent(comboId, name, description, price, currency, stock, category, products, discount);
    }

    eventName(): string {
        return 'ComboCreatedEvent';
    }
}