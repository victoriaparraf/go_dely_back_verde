import { unvalidStockComboException } from "../exceptions/unvalid-stock-combo";

export class ComboStock {

    protected readonly value: number;

    constructor(value: number) {

        if (value < 0) {
            throw new unvalidStockComboException(`Stock '${value}' must be a non-negative number`);
        }
        this.value = value;
        
    }

    public getValue(): number {
        return this.value;
    }
}