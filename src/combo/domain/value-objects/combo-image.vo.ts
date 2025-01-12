import { ValueObject } from "src/common/domain/value.object";
import { unvalidImageComboException } from "../exceptions/unvalid-image";


export class ComboImage extends ValueObject<string> {
    constructor(value: string) {
        super(value);
        this.validate(value);
    }

    protected validate(value: string): void {
        if (!value) {
            throw new unvalidImageComboException(`The image is not valid`);
        }
    }

    public getValue(): string {
        return this.value;
    }
}