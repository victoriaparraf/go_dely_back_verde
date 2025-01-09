import { DomainException } from "src/common/domain/domain-exception";

export class unvalidNameDiscountException extends DomainException {

    constructor(message: string) {

    super(message);
    
    }

}