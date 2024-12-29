import { ValueObject } from 'src/common/domain/value.object';
import { unvalidStartDateDiscountException } from "../exceptions/unvalid-start-date-discount";

export class DiscountStartDate extends ValueObject<Date> {
    constructor(value: Date | string) {
        const dateValue = new Date(value);
        super(dateValue);
        this.validate(dateValue);
    }

    protected validate(value: Date): void {
        if (!this.isValidDate(value)) {
            throw new unvalidStartDateDiscountException('Invalid discount start date.');
        }
    }

    private isValidDate(value: Date): boolean {
        return value instanceof Date && !isNaN(value.getTime());
    }

    public getValue(): Date {
        return this.value;
    }
}