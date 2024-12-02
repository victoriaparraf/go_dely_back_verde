import { ValueObject } from 'src/common/domain/value.object';

export class CategoryDescription extends ValueObject<string> {
    constructor(value: string) {
        super(value ?? '');
    }

    validate(value: string): void {
        if (!value || value.length === 0) {
            throw new Error('Category description cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }
}
