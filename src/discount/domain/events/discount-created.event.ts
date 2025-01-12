import { DomainEventBase } from "src/common/domain/event";
import { DiscountID } from "../value-objects/discount-id.vo";
import { DiscountName } from "../value-objects/discount-name.vo";
import { DiscountDescription } from "../value-objects/discount-description.vo";
import { DiscountStartDate } from "../value-objects/discount-start-date.vo";
import { DiscountEndDate } from "../value-objects/discount-end-date.vo";
import { Product } from "src/product/domain/entities/product.entity";
import { Combo } from "src/combo/domain/entities/combo.entity";
import { DiscountImage } from "../value-objects/discount-image.vo";


export class DiscountCreatedEvent extends DomainEventBase{

    constructor(
        private readonly id: DiscountID,
        private readonly name: DiscountName,
        private readonly description: DiscountDescription,
        private readonly start_date: DiscountStartDate,
        private readonly end_date: DiscountEndDate,
        private readonly products?: Product[],
        private readonly combos?: Combo[],
        private readonly image?: DiscountImage
    ){
        super();
    }

    static create(
        id: DiscountID,
        name: DiscountName,
        description: DiscountDescription,
        start_date: DiscountStartDate,
        end_date: DiscountEndDate,
        products?: Product[],
        combos?: Combo[],
        image?: DiscountImage
    ): DiscountCreatedEvent{
        return new DiscountCreatedEvent(id, name, description, start_date, end_date, products, combos, image);
    }

    eventName(): string {
        return 'DiscountCreatedEvent';
    }

}