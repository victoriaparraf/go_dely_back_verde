import { ValueObject } from 'src/common/domain/value.object';
import { v4 as uuidv4 } from 'uuid';

export class DiscountID extends ValueObject<string> {
    static create(): DiscountID {
        return new DiscountID(uuidv4());
    }
    
    protected validate(value: string): void {
        if (!value || !this.isValidUUID(value)) {
            throw new Error('Invalid UUID');
        }
    }

    constructor(value?: string) {
        super(value ?? uuidv4());
        this.validate(this.value);
    }

    getValue(): string {
        return this.value;
    }

    private isValidUUID(value: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }
}