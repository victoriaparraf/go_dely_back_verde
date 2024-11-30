export class DiscountEndDate {
    protected readonly value: Date;

    constructor(value: Date | string) {        
        if(value){
            const dateValue = new Date(value);
            dateValue.setHours(0, 0, 0, 0); // Elimina la hora, dejando solo la fecha
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
}
