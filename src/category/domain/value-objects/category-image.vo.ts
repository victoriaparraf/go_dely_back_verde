import { ValueObject } from 'src/common/domain/value.object';

export class CategoryImage extends ValueObject<string> {
    constructor(value: string) {
        super(value ?? '');
    }

    validate(value: string): void {
        if (!value || value.length === 0) {
            throw new Error('Category image cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }
}
