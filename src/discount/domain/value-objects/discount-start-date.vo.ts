export class DiscountStartDate {
    protected readonly value: Date;

    constructor(value: Date) {
        if (!this.isValidDate(value)) {
            throw new Error('Invalid discount start date.');
        } 
        this.value = value;
    }

    private isValidDate(value: Date): boolean {
        return value instanceof Date && !isNaN(value.getTime());
    }

    public getValue(): Date {
        return this.value;
    }
}
