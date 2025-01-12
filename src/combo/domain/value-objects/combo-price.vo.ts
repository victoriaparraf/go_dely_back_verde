import { ValueObject } from "src/common/domain/value.object";
import { unvalidPriceComboException } from "../exceptions/unvalid-price-combo";

export class ComboPrice extends ValueObject<number> {
  
    public readonly value: number;
  
    constructor(value: number) {
      super(value);
      this.validate(value);      
    }

    protected validate(value: number): void {
      if (value < 0) {
        throw new unvalidPriceComboException(`Price '${value}' must be a positive number`);
      }
    }
  
    public getValue(): number {
      return this.value;
    }
  }