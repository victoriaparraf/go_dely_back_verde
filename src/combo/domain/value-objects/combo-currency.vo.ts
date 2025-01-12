import { ValueObject } from "src/common/domain/value.object";
import { unvalidCurrencyComboException } from "../exceptions/unvalid-currency-combo";
import { Currency } from "src/common/domain/enums/currency.enum";

export class ComboCurrency extends ValueObject<Currency> { 

    public readonly value: Currency;
  
    constructor( value: Currency ) {
      super(value);
      this.validate(value);
    }

    protected validate(value: Currency): void {
      if ( !this.isValidCurrency(value) ) {
        throw new unvalidCurrencyComboException(`The currency '${value}' is not valid`);
      }
    }
  
    private isValidCurrency(value: Currency): boolean {
      return Object.values(Currency).includes(value);
    }
  
    public getValue(): Currency {
      return this.value;
    }
}