import { ValueObject } from 'src/common/domain/value.object';

export class OrderAddress extends ValueObject<string> {
    constructor(value: string) {
        super(value);
    }

    protected validate(value: string): void {
        if (!value || value.length < 6) {
            throw new Error('Address must be at least 6 characters long');
        }
    }
    getValue(): string {
        return this.value;
    }
}
