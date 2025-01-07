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
import { ComboWeight } from '../value-objects/combo-weight.vo';
import { ComboMeasurement } from '../value-objects/combo-measurement.vo';
import { ComboCaducityDate } from '../value-objects/combo-caducity-date.vo';

export class ComboCreatedEvent extends DomainEventBase {

    constructor(
        public readonly comboId: ComboID,
        public readonly name: ComboName,
        public readonly description: ComboDescription,
        public readonly price: ComboPrice,
        private readonly weight: ComboWeight,
        private readonly measurement: ComboMeasurement,
        public readonly currency: ComboCurrency,
        public readonly stock: ComboStock,
        public readonly categories: Category[],
        public readonly images: ComboImage[],
        public readonly products: Product[],
        public readonly caducity_date?: ComboCaducityDate,
        //public readonly discount?: Discount
    ) {
        super();
    }

    static create(

        comboId: ComboID,
        name: ComboName,
        description: ComboDescription,
        price: ComboPrice,
        weight: ComboWeight,
        measurement: ComboMeasurement,
        currency: ComboCurrency,
        stock: ComboStock,
        categories: Category[],
        images: ComboImage[],
        products: Product[],
        caducity_date?: ComboCaducityDate,
        //discount?: Discount

    ): ComboCreatedEvent{
        return new ComboCreatedEvent(comboId, name, description, price, weight, measurement, currency, stock, categories, images, products, caducity_date);
    }

    eventName(): string {
        return 'ComboCreatedEvent';
    }
}