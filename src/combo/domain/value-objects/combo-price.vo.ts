import { unvalidPriceComboException } from "../exceptions/unvalid-price-combo";

export class ComboPrice {
  
    protected readonly value: number;
  
    constructor(value: number) {

      if (value < 0) {
        throw new unvalidPriceComboException(`Price '${value}' must be a positive number`);
      }
      this.value = value;
      
    }
  
    public getValue(): number {
      return this.value;
    }
  }