import { ValueObject } from "src/common/domain/value.object";
import { unvalidImageDiscountException } from "../exceptions/unvalid-image-discount";

export class DiscountImage extends ValueObject<string> {
    constructor(value: string) {
        super(value ?? '');
    }

    validate(value: string): void {
        if (!value || value.length === 0) {
            throw new Error('Discount image cannot be empty');
        }
    }

    getValue(): string {
        return this.value;
    }
}