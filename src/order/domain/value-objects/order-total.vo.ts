import { ValueObject } from 'src/common/domain/value.object';

export class OrderTotal extends ValueObject<number> {
    constructor(value: number) {
        super(value);
    }

    protected validate(value: number): void {
        if (value < 0) {
            throw new Error('Total must be a positive number');
        }
    }

    getValue(): number {
        return this.value;
    }
}
