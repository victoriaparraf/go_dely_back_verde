import { DomainException } from "src/common/domain/domain-exception";

export class unvalidStockComboException extends DomainException {

    constructor(message: string) {

    super(message);
    
    }

}