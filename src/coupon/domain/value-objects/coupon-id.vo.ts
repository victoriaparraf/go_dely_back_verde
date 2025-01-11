import { ValueObject } from 'src/common/domain/value.object';
import { v4 as uuidv4 } from 'uuid';

export class CouponID extends ValueObject<string>  {
    
    static create(): CouponID {
        return new CouponID(uuidv4());
    }

    constructor(value?: string) {
        super(value ?? uuidv4());
    }

    getValue(): string {
        return this.value;
    }

    protected validate(value: string): string {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!regex.test(value)) {
            throw new Error('The coupon ID must be a valid UUID.');
        }

        return value;
    }

    toString(): string {
        return this.value;
    }
}

