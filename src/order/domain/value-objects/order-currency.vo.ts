import { ValueObject } from 'src/common/domain/value.object';

export class OrderCurrency extends ValueObject<string> {
    
    constructor(value: string) {
        super(value);
    }

    protected validate(value: string): void {
        const validCurrencies = ['USD', 'EUR', 'MXN']; // Puedes agregar más según sea necesario.
        if (!value || value.length < 3) {
            throw new Error('Invalid currency');
        }
    }

    getValue(): string {
        return this.value;
    }
}
