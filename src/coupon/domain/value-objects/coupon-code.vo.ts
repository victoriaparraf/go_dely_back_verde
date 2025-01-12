import { ValueObject } from "src/common/domain/value.object";


export class CouponCode extends ValueObject<string>{

    constructor(value: string) {
        super(value);
    }

    getValue(): string {
        return this.value;
    }

    protected validate(value: string): void {
        const minLength = 5;
        const maxLength = 20;

        if (!value || value.trim().length === 0) {
            throw new Error('Coupon code cannot be empty');
        }

        if (value.length < minLength || value.length > maxLength) {
            throw new Error(`The coupon code must be between ${minLength} and ${maxLength} characters.`);
        }

    }
}