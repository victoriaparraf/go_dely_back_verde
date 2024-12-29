import { unvalidEndDateDiscountException } from "../exceptions/unvalid-end-date-discount";

export class DiscountEndDate {
    protected readonly value: Date;

    constructor(value: Date | string) {

        if(value){
            const dateValue = new Date(value);
            if (!this.isValidDate(dateValue)) {
                throw new unvalidEndDateDiscountException('Invalid discount start date.');
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
