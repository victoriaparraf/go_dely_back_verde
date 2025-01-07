import { ValueObject } from "src/common/domain/value.object";
import { unvalidWeightComboException } from "../exceptions/unvalid-weight-combo";

export class ComboWeight extends ValueObject<number> {
    
        public readonly value: number;
    
        constructor(value: number) {
            super(value);
            this.validate(value);      
        }

        protected validate(value: number): void {
            if (value <= 0) {
                throw new unvalidWeightComboException(`Weight '${value}' must be greater than 0`);
            }
        }
    
        public getValue(): number {
            return this.value;
        }
    }