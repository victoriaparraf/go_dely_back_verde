import { ValueObject } from "src/common/domain/value.object";
import { unvalidNameDiscountException } from "../exceptions/unvalid-name-discount";


export class DiscountName extends ValueObject<string> {
    constructor(value: string) {
        super(value);
        this.validate(value);
    }

    protected validate(value: string): void {
        if (!value || value.trim().length === 0) {
            throw new unvalidNameDiscountException(`The name is not valid`);
        }
    }

    public getValue(): string {
        return this.value;
    }
}