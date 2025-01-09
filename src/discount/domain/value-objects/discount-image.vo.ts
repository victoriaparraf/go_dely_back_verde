import { ValueObject } from "src/common/domain/value.object";
import { unvalidImageDiscountException } from "../exceptions/unvalid-image-discount";

export class DiscountImage extends ValueObject<string> {
    constructor(value: string | null) {
        super(value);
        this.validate(value);
    }

    protected validate(value: string | null): void {
        if (value) {
            if (!this.isValidImage(value)) {
                throw new unvalidImageDiscountException('The image URL is not valid');
            }
        }
    }

    private isValidImage(value: string): boolean {
        const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/;
        return urlPattern.test(value);
    }

    public getValue(): string | null {
        return this.value;
    }
}