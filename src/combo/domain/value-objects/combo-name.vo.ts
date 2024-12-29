import { ValueObject } from "src/common/domain/value.object";
import { unvalidNameComboException } from "../exceptions/unvalid-name-combo";

export class ComboName extends ValueObject<string> {
    constructor(value: string) {
        super(value);
        this.validate(value);
    }

    protected validate(value: string): void {
        if (!value || value.trim().length === 0) {
            throw new unvalidNameComboException(`The name is not valid`);
        }
    }

    public getValue(): string {
        return this.value;
    }
}