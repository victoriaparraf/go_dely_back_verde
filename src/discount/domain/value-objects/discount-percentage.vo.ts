import { unvalidPercentageDiscountException } from "../exceptions/unvalid-percentage-discount";

export class DiscountPercentage {
    
    protected readonly value: number;

    constructor(value: number) {

        if (value < 0 || value > 1) {
            throw new unvalidPercentageDiscountException('Discount percentage must be between 0 and 1');
        }
        this.value = value;
        
    }

    public getValue(): number {
        return this.value;
    }
}