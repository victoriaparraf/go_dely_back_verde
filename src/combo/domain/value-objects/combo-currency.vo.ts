import { ValueObject } from "src/common/domain/value.object";
import { unvalidCurrencyComboException } from "../exceptions/unvalid-currency-combo";

export class ComboCurrency extends ValueObject<string> { 

    public readonly value: string;
  
    constructor( value: string ) {
      super(value);
      this.validate(value);
    }

    protected validate(value: string): void {
      if ( !this.isValidCurrency(value) ) {
        throw new unvalidCurrencyComboException(`The currency '${value}' is not valid`);
      }
    }
  
    private isValidCurrency(value: string): boolean {
      return /^[A-Za-z]{3}$/.test(value);
    }
  
    public getValue(): string {
      return this.value;
    }
}