import { DomainException } from "src/common/domain/domain-exception";

export class unvalidPriceComboException extends DomainException {

    constructor(message: string) {

    super(message);
    
    }

}