import { DomainEventBase } from 'src/common/domain/event';
import { ComboID } from '../value-objects/combo-id.vo';
import { ComboName } from '../value-objects/combo-name.vo';
import { ComboDescription } from '../value-objects/combo-description.vo';
import { ComboPrice } from '../value-objects/combo-price.vo';
import { ComboCurrency } from '../value-objects/combo-currency.vo';
import { ComboStock } from '../value-objects/combo-stock.vo';
import { ComboImage } from '../value-objects/combo-image.vo';
import { Category } from 'src/category/domain/category.entity';
import { Product } from 'src/product/domain/entities/product.entity';
import { Discount } from 'src/discount/domain/entities/discount.entity';

export class ComboCreatedEvent extends DomainEventBase {

    constructor(
        public readonly comboId: ComboID,
        public readonly name: ComboName,
        public readonly description: ComboDescription,
        public readonly price: ComboPrice,
        public readonly currency: ComboCurrency,
        public readonly stock: ComboStock,
        public readonly categories: Category[],
        public readonly image: ComboImage,
        public readonly products: Product[],
        //public readonly discount?: Discount
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
        categories: Category[],
        image: ComboImage,
        products: Product[],
        //discount?: Discount

    ): ComboCreatedEvent{
        return new ComboCreatedEvent(comboId, name, description, price, currency, stock, categories, image, products);
    }

    eventName(): string {
        return 'ComboCreatedEvent';
    }
}