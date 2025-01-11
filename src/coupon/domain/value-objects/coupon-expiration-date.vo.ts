import { ValueObject } from "src/common/domain/value.object";

export class CouponExpirationDate extends ValueObject<Date>{

    constructor(value: Date) {
        super(value);
    }

    getValue(): Date {
        return this.value;
    }

    protected validate(value: Date): void {
        if (!(value instanceof Date) || isNaN(value.getTime())) {
            throw new Error('The Coupon expiration date must be a valid date.');
        }
    }

    // public isExpired(): boolean {
    //     return this.value < new Date();
    // }
}
