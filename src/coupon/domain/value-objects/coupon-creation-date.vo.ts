import { ValueObject } from "src/common/domain/value.object";

export class CouponCreationDate extends ValueObject<Date>{


    constructor(value: Date) {
        super(value);
    }


    public getValue(): Date {
        return this.value;
    }

    protected validate(value: Date): void {
        if (!(value instanceof Date) || isNaN(value.getTime())) {
            throw new Error('The Coupon creation date must be a valid date.');
        }
    }
}



