import { DomainException } from "src/common/domain/domain-exception";

export class unvalidDescriptionDiscountException extends DomainException {

    constructor(message: string) {

    super(message);
    
    }

}