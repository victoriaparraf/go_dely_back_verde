import { Currency } from 'src/common/domain/enums/currency.enum';
import { ValueObject } from 'src/common/domain/value.object';

export class OrderCurrency extends ValueObject<string> {
    
    constructor(value: string) {
        super(value);
    }

    protected validate(value: string): void {
        const validCurrencies = Object.values(Currency);
        if (!value || value.length < 3 || !validCurrencies.includes(value as Currency)) {
            throw new Error('Invalid currency');
        }
    }

    getValue(): string {
        return this.value;
    }
}
