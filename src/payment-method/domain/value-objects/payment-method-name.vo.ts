import { ValueObject } from "src/common/domain/value.object";

export class PaymentMethodName extends ValueObject<string> {
    protected validate(value: string): void {
        if (value.trim().length === 0) {
            throw new Error('Name cannot be empty.');
        }
    }
}
