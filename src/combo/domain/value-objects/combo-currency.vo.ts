import { unvalidCurrencyComboException } from "../exceptions/unvalid-currency-combo";

export class ComboCurrency {

    protected readonly value: string;
  
    constructor( value: string ) {

      if ( !this.isValidCurrency(value) ) {
        throw new unvalidCurrencyComboException(`The currency '${value}' is not valid`);
      }
      this.value = value;

    }
  
    private isValidCurrency(value: string): boolean {
      return /^[A-Za-z]{3}$/.test(value);
    }
  
    public getValue(): string {
      return this.value;
    }
}