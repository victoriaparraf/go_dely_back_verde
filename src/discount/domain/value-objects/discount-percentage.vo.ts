import { ValueObject } from "src/common/domain/value.object";
import { unvalidPercentageDiscountException } from "../exceptions/unvalid-percentage-discount";

export class DiscountPercentage extends ValueObject<number> {
    
    public readonly value: number;

    constructor(value: number) {
        super(value);
        this.validate(value);
    }

    protected validate(value: number): void {
        if (value < 0 || value > 1) {
            throw new unvalidPercentageDiscountException('Discount percentage must be between 0 and 1');
        }
    }

    public getValue(): number {
        return this.value;
    }
}