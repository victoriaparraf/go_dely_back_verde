import { DomainException } from "src/common/domain/domain-exception";

export class unvalidDiscountException extends DomainException {

    constructor(message: string) {

        super(message);
        
    }
}