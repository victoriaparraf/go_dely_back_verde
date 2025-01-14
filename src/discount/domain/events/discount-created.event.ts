import { DomainEventBase } from "src/common/domain/event";
import { DiscountID } from "../value-objects/discount-id.vo";
import { DiscountName } from "../value-objects/discount-name.vo";
import { DiscountDescription } from "../value-objects/discount-description.vo";
import { DiscountStartDate } from "../value-objects/discount-start-date.vo";
import { DiscountEndDate } from "../value-objects/discount-end-date.vo";
import { DiscountImage } from "../value-objects/discount-image.vo";
import { DiscountPercentage } from "../value-objects/discount-percentage.vo";

export class DiscountCreatedEvent extends DomainEventBase{

    constructor(
        private readonly id: DiscountID,
        private readonly name: DiscountName,
        private readonly description: DiscountDescription,
        private readonly percentage: DiscountPercentage,
        private readonly start_date: DiscountStartDate,
        private readonly end_date: DiscountEndDate,
        private readonly image?: DiscountImage
    ){
        super();
    }

    static create(
        id: DiscountID,
        name: DiscountName,
        description: DiscountDescription,
        percentage: DiscountPercentage,
        start_date: DiscountStartDate,
        end_date: DiscountEndDate,
        image?: DiscountImage
    ): DiscountCreatedEvent{
        return new DiscountCreatedEvent(id, name, description, percentage, start_date, end_date, image);
    }

    eventName(): string {
        return 'DiscountCreatedEvent';
    }

}