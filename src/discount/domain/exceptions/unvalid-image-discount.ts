import { DomainException } from "src/common/domain/domain-exception";

export class unvalidImageDiscountException extends DomainException {

    constructor(message: string) {

    super(message);
    
    }

}