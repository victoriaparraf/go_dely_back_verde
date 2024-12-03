import { ValueObject } from 'src/common/domain/value.object';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';

export class PaymentMethodId extends ValueObject<string> {
    constructor(value: string) {
        super(value);
    }

    protected validate(value: string): void {
        if (!validateUuid(value)) {
            throw new Error(`Invalid UUID: ${value}`);
        }
    }

    static generate(): PaymentMethodId {
        return new PaymentMethodId(uuidv4());
    }

    getValue(): string {
        return this.value;
    }
}
