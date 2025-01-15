import { ValueObject } from 'src/common/domain/value.object';
import { unvalidEndDateDiscountException } from "../exceptions/unvalid-end-date-discount";

export class DiscountEndDate extends ValueObject<Date> {
    constructor(value: Date | string) {
        const dateValue = new Date(value);
        super(dateValue);
        this.validate(dateValue);
    }

    protected validate(value: Date): void {
        if (!this.isValidDate(value)) {
            throw new unvalidEndDateDiscountException('Invalid discount deadline.');
        }
    }

    private isValidDate(value: Date): boolean {
        return value instanceof Date && !isNaN(value.getTime());
    }

    public getValue(): Date {
        return this.value;
    }
}