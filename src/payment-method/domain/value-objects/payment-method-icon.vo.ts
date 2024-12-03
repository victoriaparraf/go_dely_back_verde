import { ValueObject } from "src/common/domain/value.object";

export class PaymentMethodIcon extends ValueObject<string> {
    protected validate(value: string): void {
        if (!value.startsWith('http')) {
            throw new Error('Invalid icon URL.');
        }
    }
}
