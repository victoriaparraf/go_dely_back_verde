export class DiscountPercentage {
    
    protected readonly value: number;

    constructor(value: number) {
        if (value < 0 || value > 100) {
            throw new Error('Discount percentage must be between 0 and 100.');
        }
        this.value = value;
    }

    public getValue(): number {
        return this.value;
    }
}