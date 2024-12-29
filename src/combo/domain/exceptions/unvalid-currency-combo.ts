import { DomainException } from "src/common/domain/domain-exception";

export class unvalidCurrencyComboException extends DomainException {

    constructor(message: string) {

        super(message);
        
    }
}