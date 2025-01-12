import { ValueObject } from "src/common/domain/value.object";


export class CouponAmount extends ValueObject<number>{

    constructor(value: number) {
        super(value);
    }

    getValue(): number {
        return this.value;
    }

    protected validate(value: number): void {
        if (value <= 0) {
            throw new Error('The coupon amount must be a positive number.');
        }
    }
}

