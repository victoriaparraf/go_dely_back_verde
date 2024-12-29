import { ValueObject } from "src/common/domain/value.object";
import { unvalidStockComboException } from "../exceptions/unvalid-stock-combo";

export class ComboStock extends ValueObject<number> {

    public readonly value: number;

    constructor(value: number) {
        super(value);
        this.validate(value);        
    }

    protected validate(value: number): void {
        if (value < 0) {
            throw new unvalidStockComboException(`Stock '${value}' must be a non-negative number`);
        }
    }

    public getValue(): number {
        return this.value;
    }
}