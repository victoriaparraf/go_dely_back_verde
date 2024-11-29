export class DiscountStartDate {
    protected readonly value: Date;

    constructor(value: Date | string) {
        if(value){
            const dateValue = typeof value === 'string' ? new Date(value) : value;
            if (!this.isValidDate(dateValue)) {
                throw new Error('Invalid discount start date.');
            }
            this.value = dateValue;
        }
        return null;
    }

    private isValidDate(value: Date): boolean {
        return value instanceof Date && !isNaN(value.getTime());
    }

    public getValue(): Date {
        return this.value;
    }

    public static from(value: any): DiscountStartDate {
        if (!value) {
            return null;
        }
        return new DiscountStartDate(value);
    }
}
