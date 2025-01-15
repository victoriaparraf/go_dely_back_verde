import { ValueObject } from "src/common/domain/value.object";
import { unvalidImageDiscountException } from "../exceptions/unvalid-image-discount";

export class DiscountImage extends ValueObject<string> {
        constructor(value: string) {
            super(value);
            this.validate(value);
        }
    
        protected validate(value: string): void {
            if (!value) {
                throw new unvalidImageDiscountException(`The image is not valid`);
            }
        }
    
        public getValue(): string {
            return this.value;
        }
}