import { DomainException } from "src/common/domain/domain-exception";

export class unvalidStartDateDiscountException extends DomainException {

    constructor(message: string) {

        super(message);

    }

}