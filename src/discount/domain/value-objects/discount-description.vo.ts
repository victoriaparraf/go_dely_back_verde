import { ValueObject } from "src/common/domain/value.object";
import { unvalidDescriptionDiscountException } from "../exceptions/unvalid-descripttion-discount";


export class DiscountDescription extends ValueObject<string>{

    public readonly value: string;
    
    constructor(value: string) {
        super(value);
        this.validate(value);
    }

    protected validate(value: string): void {
        if (!value || value.length < 10) {
            throw new unvalidDescriptionDiscountException(`The description is not valid`);
        }
    }
    
    public getValue(): string {
        return this.value;
    }
}