import { ValueObject } from 'src/common/domain/value.object';
import { unvalidCaducityDateComboException } from '../exceptions/unvalid-caducity-date-combo';

export class ComboCaducityDate extends ValueObject<Date | null> {
    constructor(value: Date | string | null | undefined) {
        const dateValue = value ? new Date(value) : null;
        super(dateValue);
        this.validate(dateValue);
    }

    protected validate(value: Date | null): void {
        if (value !== null && !this.isValidDate(value)) {
            throw new unvalidCaducityDateComboException('Invalid Combo caducity date.');
        }
    }

    private isValidDate(value: Date): boolean {
        return value instanceof Date && !isNaN(value.getTime());
    }

    public getValue(): Date | null {
        return this.value;
    }
}
