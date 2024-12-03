import { ValueObject } from 'src/common/domain/value.object';

export class PaymentMethodIcon extends ValueObject<string> {
    constructor(value: string) {
        super(value);
        this.validate(value);
    }

    protected validate(value: string): void {
        if (!value || value.length < 1) {
            throw new Error('Invalid payment method icon');
        }
    }

    getValue(): string {
        return this.value;
    }
}